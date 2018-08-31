import TerrainManager from './terrainManager'
import { ViewExtent } from '../../shared/src/view'
import { EnvironmentState } from '../../shared/src/environment'
import {
  getChunksInExtent,
  getChunksBySubtractingExtents
} from '../../shared/src/view'

// the environment is made of a grid and entities
// it holds a grid of material that can be altered, and a list of entities

class Environment {
  entities: any[] // TEMP: use an entity manager instead
  grid: TerrainManager

  constructor() {
    this.entities = []
  }

  getFullState(extent: ViewExtent): EnvironmentState {
    return {
      chunks: this.grid.getChunks(getChunksInExtent(extent)),
      entities: []
    }
  }

  getPartialState(
    newExtent: ViewExtent,
    oldExtent: ViewExtent
  ): EnvironmentState {
    return {
      chunks: this.grid.getChunks(
        getChunksBySubtractingExtents(oldExtent, newExtent)
      ),
      entities: []
    }
  }
}

export default Environment
