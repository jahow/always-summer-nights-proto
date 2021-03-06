import NoiseGenerator from '../../shared/src/noise.js'
import {Coords, GridChunk, SurfaceShape, Terrain} from '../../shared/src/terrain/model'
import {chunkCoordsToKey, computeSmoothShapeFromNeighbours} from '../../shared/src/terrain/utils'
import {CHUNK_HEIGHT, CHUNK_WIDTH} from '../../shared/src/terrain/constants'

NoiseGenerator.seed(Math.random())

/**
 * A terrain manager is a terrain chunk manager
 * Chunks are stored using a key like so: 'x y z'
 */
class TerrainManager {
  savedChunks: Terrain

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
  getChunks(coordsList: Coords[]): Terrain {
    return coordsList.reduce((prev: Terrain, coords: Coords) => {
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

      // neighbours
      const topleft =
        Math.floor(this.getTerrainHeight(x - 1, z + 1)) > Math.floor(height)
      const top =
        Math.floor(this.getTerrainHeight(x, z + 1)) > Math.floor(height)
      const topright =
        Math.floor(this.getTerrainHeight(x + 1, z + 1)) > Math.floor(height)
      const right =
        Math.floor(this.getTerrainHeight(x + 1, z)) > Math.floor(height)
      const bottomright =
        Math.floor(this.getTerrainHeight(x + 1, z - 1)) > Math.floor(height)
      const bottom =
        Math.floor(this.getTerrainHeight(x, z - 1)) > Math.floor(height)
      const bottomleft =
        Math.floor(this.getTerrainHeight(x - 1, z - 1)) > Math.floor(height)
      const left =
        Math.floor(this.getTerrainHeight(x - 1, z)) > Math.floor(height)

      chunk[i] = {
        ranges: [
          {
            bottomStart: 0,
            rangeSize: Math.min(CHUNK_HEIGHT - 1, Math.floor(height - baseY)),
            materialId: 0,
            topShape:
              Math.floor(height - baseY) > CHUNK_HEIGHT - 1
                ? SurfaceShape.FLAT
                : computeSmoothShapeFromNeighbours(
                    topleft,
                    top,
                    topright,
                    right,
                    bottomright,
                    bottom,
                    bottomleft,
                    left
                  )
          }
        ]
      }
    }
    chunk[CHUNK_WIDTH * CHUNK_WIDTH] = 0 // revision
    return chunk
  }
}

export default TerrainManager
