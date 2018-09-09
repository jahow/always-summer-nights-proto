import {
  GridChunk,
  GridChunkBatch,
  Coords,
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  chunkCoordsToKey
} from '../../shared/src/environment'
import NoiseGenerator from '../../shared/src/noise.js'

NoiseGenerator.seed(Math.random())

/**
 * A terrain manager is a terrain chunk manager
 * Chunks are stored using a key like so: 'x y z'
 */
class TerrainManager {
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
    const saved = this.savedChunks[chunkCoordsToKey(baseX, baseY, baseZ)]
    return saved || this.generateChunk(baseX, baseY, baseZ)
  }

  // return a batch of chunks from a list of coords
  getChunks(coordsList: Coords[]): GridChunkBatch {
    return coordsList.reduce((prev: GridChunkBatch, coords: Coords) => {
      const chunk = this.getChunk(coords)
      prev[chunkCoordsToKey(coords[0], coords[1], coords[2])] = chunk
      return prev
    }, {})
  }

  private getTerrainHeight(x: number, z: number): number {
    let groundHeight =
      40 *
      NoiseGenerator.perlin(0.003 * x + 100.1567, 0.003 * z + 88.8783, {
        octaveCount: 4,
        persistence: 0.6
      })

    return groundHeight
  }

  private generateChunk(
    baseX: number,
    baseY: number,
    baseZ: number
  ): GridChunk {
    const chunk: GridChunk = new Array(CHUNK_WIDTH * CHUNK_WIDTH + 1)
    let x, z, height
    for (let i = 0; i < chunk.length; i++) {
      x = i % CHUNK_WIDTH + baseX
      z = Math.floor(i / CHUNK_WIDTH) + baseZ
      height = this.getTerrainHeight(x, z)
      if (height < baseY) {
        chunk[i] = -1
        continue
      }

      chunk[i] = {
        ranges: [
          {
            bottomStart: 0,
            rangeSize: Math.min(CHUNK_HEIGHT - 1, Math.floor(height - baseY)),
            materialId: 0
          }
        ]
      }
    }
    chunk[CHUNK_WIDTH * CHUNK_WIDTH] = 0 // revision
    return chunk
  }
}

export default TerrainManager
