import TerrainManager from './terrainManager'
import { ViewExtent } from '../../shared/src/view'
import { EnvironmentState } from '../../shared/src/environment'
import {
  getChunksInExtent,
  getChunksBySubtractingExtents
} from '../../shared/src/view'

// the environment is made of a terrain and entities
// it holds a terrain of material that can be altered, and a list of entities

class Environment {
  entities: any[] // TEMP: use an entity manager instead
  terrain: TerrainManager

  constructor() {
    this.entities = []
    this.terrain = new TerrainManager()
  }

  getFullState(extent: ViewExtent): EnvironmentState {
    return {
      terrain: this.terrain.getChunks(getChunksInExtent(extent)),
      entities: []
    }
  }

  getPartialState(
    newExtent: ViewExtent,
    oldExtent: ViewExtent
  ): EnvironmentState {
    return {
      terrain: this.terrain.getChunks(
        getChunksBySubtractingExtents(oldExtent, newExtent)
      ),
      entities: []
    }
  }
}

export default Environment
