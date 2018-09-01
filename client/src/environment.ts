import TerrainManager from './terrainManager'
import { EnvironmentState } from '../../shared/src/environment'

export default class Environment {
  terrain: TerrainManager

  constructor() {
    this.terrain = new TerrainManager()
  }

  update() {
    // TODO: use a delta time to update stuff
  }

  // this applies a full or partial state to the current state
  // this will not delete anything from the environment
  applyState(state: EnvironmentState) {
    this.terrain.updateChunks(state.chunks)
  }

  getGrid() {
    return this.terrain
  }
}

let environment: Environment

export function getEnvironment(): Environment {
  if (!environment) {
    environment = new Environment()
  }
  return environment
}
