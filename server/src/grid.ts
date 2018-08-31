import { Coords } from '../../shared/src/definitions'
import { CHUNK_HEIGHT, CHUNK_WIDTH } from '../../shared/src/definitions'
import NoiseGenerator from '../../shared/src/noise.js'

NoiseGenerator.seed(Math.random())

enum SurfaceShape {
  FLAT = 0,
  UP_TOPLEFT = 1,
  UP_TOPRIGHT = 2,
  UP_BOTTOMRIGHT = 3,
  UP_BOTTOMLEFT = 4,
  UP_TOP = 5,
  UP_RIGHT = 6,
  UP_BOTTOM = 7,
  UP_LEFT = 8,
  DOWN_TOPLEFT = 9,
  DOWN_TOPRIGHT = 10,
  DOWN_BOTTOMRIGHT = 11,
  DOWN_BOTTOMLEFT = 12,
  DIAGONAL_FROMTOPLEFT = 13,
  DIAGONAL_FROMBOTTOMLEFT = 14
}

interface CellColumnRange {
  topShape?: SurfaceShape
  bottomShape?: SurfaceShape
  bottomStart: number
  rangeSize: number
  materialId: number
}
interface CellColumn {
  ranges: CellColumnRange[]
}

// last element of a chunk is the revision number
// a column can also be -1 (empty) or a material id
export type GridChunk = Array<CellColumn | number>
export type GridChunkBatch = { [index: string]: GridChunk }

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
