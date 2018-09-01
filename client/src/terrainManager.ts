import { GridChunkBatch, Coords } from '../../shared/src/environment'
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
  updateChunks(encodedChunks: GridChunkBatch) {
    Object.keys(encodedChunks).forEach(key => {
      this.getChunkByKey(key).updateChunk(encodedChunks[key])
    })
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
