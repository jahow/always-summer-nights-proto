import {
  GridChunk,
  GridChunkBatch,
  Coords,
  CHUNK_HEIGHT,
  CHUNK_WIDTH
} from '../../shared/src/environment'
import NoiseGenerator from '../../shared/src/noise.js'

NoiseGenerator.seed(Math.random())

/**
 * A grid is a terrain chunk manager
 * Chunks are stored using a key like so: 'x y z'
 */
class Grid {
  savedChunks: GridChunkBatch

  constructor() {
    // modified chunks are stored in a dict
    // keys are like so: 'baseX|baseY' where baseX and baseY are 0, 32, 64...
    this.savedChunks = {}
  }

  getChunk(coords: Coords): GridChunk {
    const baseX = Math.floor(coords[0] / CHUNK_WIDTH) * CHUNK_WIDTH
    const baseY = Math.floor(coords[1] / CHUNK_HEIGHT) * CHUNK_HEIGHT
    const baseZ = Math.floor(coords[2] / CHUNK_WIDTH) * CHUNK_WIDTH
    const saved = this.savedChunks[`${baseX} ${baseY} ${baseZ}`]
    return saved || this.generateChunk(coords)
  }

  // return a batch of chunks from a list of coords
  getChunks(coordsList: Coords[]): GridChunkBatch {
    return coordsList.reduce((prev: GridChunkBatch, coords: Coords) => {
      const chunk = this.getChunk(coords)
      prev[`${coords[0]} ${coords[1]} ${coords[2]}`] = chunk
      return prev
    }, {})
  }

  private getTerrainHeight(x: number, z: number): number {
    let groundHeight =
      120 *
      NoiseGenerator.perlin(0.002 * x + 0.002 * z + 100.1567, {
        octaveCount: 2,
        persistence: 0.6
      })

    return groundHeight
  }

  private generateChunk(coords: Coords): GridChunk {
    const chunk: GridChunk = new Array(CHUNK_WIDTH * CHUNK_WIDTH + 1)
    let x, z, height
    for (let i = 0; i < chunk.length; i++) {
      x = i % CHUNK_WIDTH + coords[0]
      z = Math.floor(i / CHUNK_WIDTH) + coords[2]
      height = this.getTerrainHeight(x, z)
      if (height < coords[1]) {
        chunk[i] = -1
        continue
      }

      chunk[i] = {
        ranges: [
          {
            bottomStart: 0,
            rangeSize: Math.min(CHUNK_HEIGHT, Math.floor(height - coords[1])),
            materialId: 0
          }
        ]
      }
    }
    chunk[CHUNK_WIDTH * CHUNK_WIDTH] = 0 // revision
    return chunk
  }
}

export default Grid
