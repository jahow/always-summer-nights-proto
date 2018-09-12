import * as io from 'socket.io-client'
import { getEnvironment } from './environment'
import {
  decodeEnvironmentState,
  EnvironmentStateEncoded
} from '../../shared/src/environment'
import { getViewExtent } from './utils.view'
import { debounce } from './utils.misc'

// socket init
const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)
})

socket.on('message', (message: any) => {
  switch (message.name) {
    case 'environmentState':
      handleEnvironmentUpdate(message.args)
      break
  }
})

// UPSTREAM EVENTS

export const handleViewMove = debounce(function() {
  console.log('network event: view move')
  socket.emit('message', {
    name: 'moveView',
    args: getViewExtent()
  })
}, 200)

// DOWNSTREAM EVENTS

export function handleEnvironmentUpdate(state: EnvironmentStateEncoded) {
  console.log('network event: environment state')
  // console.log(state)
  getEnvironment().applyState(decodeEnvironmentState(state))
}
