import * as io from 'socket.io-client'
import { getEnvironment } from './environment'
import { EnvironmentState } from '../../shared/src/environment'
import { getViewExtent } from './utils.view'

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

export function handleViewMove() {
  console.log('network event: view move')
  socket.emit('message', {
    name: 'moveView',
    args: getViewExtent()
  })
}

// DOWNSTREAM EVENTS

export function handleEnvironmentUpdate(state: EnvironmentState) {
  console.log('network event: environment state')
  getEnvironment().applyState(state)
}
