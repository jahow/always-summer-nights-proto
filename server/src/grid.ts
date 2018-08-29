import { Coords } from '../../shared/src/definitions'
import { CHUNK_HEIGHT, CHUNK_WIDTH } from '../../shared/src/view-extent'

export type CellGenerationCallback = (coords: Coords) => boolean

interface CellColumn {}
export type GridChunk = Array<CellColumn>
export type GridChunkBatch = { [index: string]: GridChunk }

/**
 * A grid is a terrain chunk manager
 * Chunks are stored using a key like so: 'x y z'
 */
class Grid {
  cellCallback: CellGenerationCallback
  savedChunks: GridChunkBatch

  constructor(cellCallback: CellGenerationCallback) {
    // modified chunks are stored in a dict
    // keys are like so: 'baseX|baseY' where baseX and baseY are 0, 32, 64...
    this.savedChunks = {}
    this.cellCallback = cellCallback
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

  private generateChunk(coords: Coords): GridChunk {
    const chunk: GridChunk = new Array(CHUNK_WIDTH * CHUNK_WIDTH + 1)
    let x, z
    for (let i = 0; i < chunk.length; i++) {
      x = i % CHUNK_WIDTH + coords[0]
      z = Math.floor(i / CHUNK_WIDTH) + coords[2]
      chunk[i] = this.cellCallback(coords)
    }
    chunk[CHUNK_WIDTH * CHUNK_WIDTH] = 0 // revision
    return chunk
  }
}

export default Grid
