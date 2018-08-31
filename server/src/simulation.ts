import Environment from './environment'
import { getTime } from '../../shared/src/utility'
import { sendMessage } from './network'
import {
  compareExtents,
  capExtent,
  ViewExtent
} from '../../shared/src/view-extent'

// in cells count
const MAX_EXTENT_SIZE = 1000

// the simulation object handles sending environment chunks to the clients,
// dispatching client actions, updating the environment by cycles

class Simulation {
  time: number
  lastUpdate: number
  environment: Environment
  players: any // TEMP

  constructor() {
    // a value in ms; will be incremented by cycles
    this.time = 0
    this.lastUpdate = getTime()

    // the simulation environment (grid, entities…)
    this.environment = new Environment()

    // players must be notified whenever there's a change in the part of the
    // environment they are watching
    this.players = {}
  }

  getEnvironment() {
    return this.environment
  }

  start() {
    console.log('Simulation started')
  }

  update() {
    const t = getTime()
    this.time = t - this.lastUpdate
    this.lastUpdate = t

    // do stuff here
  }

  registerViewer(id: string) {
    if (this.players[id]) {
      console.error(
        'A viewer with the id ' + id + ' has already been registered: ',
        this.players[id]
      )
      return
    }
    this.players[id] = {
      viewExtent: { minX: 0, maxX: -1, minY: 0, maxY: -1 }
    }
  }

  getPlayer(id: string) {
    if (!this.players[id]) {
      throw new Error('No viewer found with the id ' + id)
    }
    return this.players[id]
  }

  // once set here, an extent is always assumed to be valid
  setViewExtent(playerId: string, extent: ViewExtent) {
    const v = this.getPlayer(playerId)
    const newExtent = capExtent(extent, MAX_EXTENT_SIZE)
    if (compareExtents(newExtent, v.viewExtent)) {
      sendMessage(
        playerId,
        'environmentState',
        this.environment.getPartialState(newExtent, v.viewExtent)
      )
      v.viewExtent = newExtent
    }
    return v.viewExtent
  }
}

// unique instance
const sim = new Simulation()

export function startSimulation() {
  sim.start()
}

export function registerViewer(id: string) {
  sim.registerViewer(id)
}

// might return something
export function handleMessage(senderId: string, message: string, args: any) {
  switch (message) {
    case 'moveView':
      const extent = sim.setViewExtent(senderId, args)
    case 'alterGridCell':
    // TODO
  }
}
