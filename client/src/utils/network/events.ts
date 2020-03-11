import * as io from 'socket.io-client'
import {decodeEnvironmentState, EnvironmentStateEncoded} from '../../../../shared/src/environment'
import {getViewExtent} from '../view'

// socket init
const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)
})

type EventPayload = any
type EventMessage = { name: string, args: EventPayload }
type EventHandler = (payload: any) => void

const handlers: {[key: string]: EventHandler[]} = {}

// downstream events handler
export function addEventHandler(downEventName: string, handler: EventHandler) {
  const existing = handlers[downEventName] || []
  handlers[downEventName] = [...existing, handler]
}

// upstream events
export function sendEvent(upEventName: string, payload: EventPayload) {
  socket.emit('message', {
    name: upEventName,
    args: payload
  })
}

socket.on('message', (message: EventMessage) => {
  const myHandlers = handlers[message.name]
  if (!myHandlers || !myHandlers.length) return
  for (let i = 0; i < myHandlers.length; i++) {
    myHandlers[i](message.args)
  }
})

// DOWNSTREAM EVENTS

export function handleEnvironmentUpdate(state: EnvironmentStateEncoded) {
  console.log('network event: environment state')
  // console.log(state)

  // todo: emit new state!
  decodeEnvironmentState(state)
}
