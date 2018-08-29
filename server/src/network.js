import socketio from 'socket.io'
import { registerViewer, handleMessage } from './simulation'

let io

let sockets = {} // key is id

export function initNetwork(http) {
  io = socketio(http)

  // new connection
  io.on('connection', function(socket) {
    console.log('user ' + socket.id + ' connected')

    sockets[socket.id] = socket

    socket.on('disconnect', function() {
      console.log('user ' + socket.id + ' disconnected')
    })

    // register this viewer in the sim
    registerViewer(socket.id)

    // all messages are handled by the sim
    // expected message structure is:
    // {
    //   name: string,
    //   args: { object }
    // }
    // send the result if a confirmation callback was given
    socket.on('message', (msg, callback) => {
      console.log('handling message ' + msg.name + ' from ' + socket.id)
      const res = handleMessage(socket.id, msg.name, msg.args)
      callback && callback(res)
    })
  })
}

export function broadcastMessage(name, args) {
  console.log('broadcasting message ' + name)
  io.sockets.emit('message', {
    name,
    args
  })
}

export function sendMessage(id, name, args) {
  console.log('sending message ' + name + ' to ' + id)
  sockets[id].emit('message', {
    name,
    args
  })
}
