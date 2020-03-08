import {
  CellColumn,
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  chunkCoordsToKey,
  chunkKeyToCoords,
  GridChunk,
  GridChunkBatch,
} from '../../shared/src/environment'
import {GridChunkMesh} from './mesh.gridchunk'

export default class TerrainManager {
  chunks: {
    [key: string]: GridChunk
  }
  chunkMeshes: {
    [key: string]: GridChunkMesh
  }

  constructor() {
    this.chunks = {}
    this.chunkMeshes = {}
  }

  /**
   * Copy the encoded chunks in the collection into the terrain
   */
  updateChunks(chunkBatch: GridChunkBatch) {
    const keys = Object.keys(chunkBatch)

    // first update chunk data, then rebuild meshes
    for (let i = 0; i < keys.length; i++) {
      this.chunks[keys[i]] = chunkBatch[keys[i]]
      this.getChunkMeshByKey(keys[i]).updateChunk(chunkBatch[keys[i]])
    }
  }

  /**
   * Return a terrain chunk, create it if absent from a coord key (<x> <y>)
   */
  getChunkMeshByKey(key: string): GridChunkMesh {
    if (!this.chunkMeshes[key]) {
      const coords = chunkKeyToCoords(key)
      this.chunkMeshes[key] = new GridChunkMesh(coords, this)
    }
    return this.chunkMeshes[key]
  }

  /**
   * Remove chunk with the given key (ie dispose mesh)
   */
  removeChunkByKey(key: string) {
    if (this.chunkMeshes[key]) {
      this.chunkMeshes[key].dispose()
      this.chunkMeshes[key] = undefined
    }
  }

  /**
   * Returns the nearest surface height (going down or up) from coords
   * Will return null if no chunk was found
   * Will return the same coord if already inside terrain
   * @param coords
   */
  getSurfaceHeight(
    x: number,
    y: number,
    z: number,
    goingUp?: boolean
  ): number | null {
    let currentY = y
    let chunk = this.getChunk(x, currentY, z)
    let localX = x - Math.floor(x / CHUNK_WIDTH) * CHUNK_WIDTH
    let localY = currentY - Math.floor(currentY / CHUNK_HEIGHT) * CHUNK_HEIGHT
    let localZ = z - Math.floor(z / CHUNK_WIDTH) * CHUNK_WIDTH
    let col: CellColumn
    let i, range

    while (chunk) {
      localY = currentY - Math.floor(currentY / CHUNK_HEIGHT) * CHUNK_HEIGHT

      if ((chunk[localX + localZ * CHUNK_WIDTH] as number) !== -1) {
        col = chunk[localX + localZ * CHUNK_WIDTH] as CellColumn
        if (col.ranges.length) {
          for (
            goingUp ? (i = 0) : (i = col.ranges.length - 1);
            goingUp ? i < col.ranges.length : i >= 0;
            goingUp ? i++ : i--
          ) {
            range = col.ranges[i]

            // inside terrain
            if (
              range.bottomStart <= localY &&
              range.bottomStart + range.rangeSize > localY
            ) {
              return y
            }

            // outside
            if (!goingUp && range.bottomStart + range.rangeSize <= localY) {
              return range.bottomStart + range.rangeSize + (y - localY)
            }
            if (goingUp && range.bottomStart > localY) {
              return range.bottomStart + (y - localY)
            }
          }
        }
      }

      if (goingUp)
        currentY =
          Math.floor((currentY + CHUNK_HEIGHT) / CHUNK_HEIGHT) * CHUNK_HEIGHT
      else
        currentY =
          Math.ceil((currentY - CHUNK_HEIGHT) / CHUNK_HEIGHT) * CHUNK_HEIGHT
      chunk = this.getChunk(x, currentY, z)
    }

    return null
  }

  getChunk(x: number, y: number, z: number): GridChunk {
    const baseX = Math.floor(x / CHUNK_WIDTH) * CHUNK_WIDTH
    const baseY = Math.floor(y / CHUNK_HEIGHT) * CHUNK_HEIGHT
    const baseZ = Math.floor(z / CHUNK_WIDTH) * CHUNK_WIDTH
    return this.chunks[chunkCoordsToKey(baseX, baseY, baseZ)]
  }
}
