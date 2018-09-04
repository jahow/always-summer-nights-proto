import {
  GridChunkBatch,
  Coords,
  decodeGridChunk,
  GridChunkBatchEncoded
} from '../../shared/src/environment'
import { GridChunkMesh } from './mesh.gridchunk'

export default class TerrainManager {
  chunks: {
    [key: string]: GridChunkMesh // key is "<x> <y> <z>"
  }

  constructor() {
    this.chunks = {}
  }

  /**
   * Copy the encoded chunks in the collection into the terrain
   */
  updateChunks(chunkBatch: GridChunkBatch) {
    const keys = Object.keys(chunkBatch)
    for (let i = 0; i < keys.length; i++) {
      this.getChunkByKey(keys[i]).updateChunk(chunkBatch[keys[i]])
    }
  }

  /**
   * Return a terrain chunk, create it if absent from a coord key (<x> <y>)
   */
  getChunkByKey(key: string): GridChunkMesh {
    if (!this.chunks[key]) {
      const coords = key.split(' ').map(c => parseInt(c)) as Coords
      this.chunks[key] = new GridChunkMesh(coords)
    }
    return this.chunks[key]
  }

  /**
   * Remove chunk with the given key (ie dispose mesh)
   */
  removeChunkByKey(key: string) {
    if (this.chunks[key]) {
      this.chunks[key].dispose()
      this.chunks[key] = undefined
    }
  }
}
