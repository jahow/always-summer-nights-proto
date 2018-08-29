import Grid, { GridChunk, GridChunkBatch } from './grid'
import { ViewExtent } from '../../shared/src/view-extent'
import { Coords } from '../../shared/src/definitions'
import {
  getChunksInExtent,
  getChunksBySubtractingExtents
} from '../../shared/src/view-extent'
import NoiseGenerator from '../../shared/src/noise.js'

NoiseGenerator.seed(Math.random())

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
    this.grid = new Grid(this.cellGenerationCallback.bind(this))
  }

  // this callback simply returns true if a cell is not empty
  cellGenerationCallback(coords: Coords): boolean {
    let groundHeight =
      120 *
      NoiseGenerator.perlin(0.002 * coords[0] + 0.002 * coords[2] + 100.1567, {
        octaveCount: 2,
        persistence: 0.6
      })

    if (coords[1] > groundHeight) {
      return false
    } else {
      return true
    }
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
