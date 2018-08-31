import Grid, { GridChunk, GridChunkBatch } from './grid'
import { ViewExtent } from '../../shared/src/view-extent'
import { Coords } from '../../shared/src/definitions'
import {
  getChunksInExtent,
  getChunksBySubtractingExtents
} from '../../shared/src/view-extent'

/**
 * This represents the environment state
 */
export interface EnvironmentState {
  chunks: GridChunkBatch
  entities: any[] // TEMP
}

// the environment is made of a grid and entities
// it holds a grid of material that can be altered, and a list of entities

class Environment {
  entities: any[] // TEMP: use an entity manager instead
  grid: Grid

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
