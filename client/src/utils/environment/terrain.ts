import {CellColumn, CHUNK_HEIGHT, CHUNK_WIDTH, chunkCoordsToKey, GridChunk} from '../../../../shared/src/environment'

const chunks: {
  [key: string]: GridChunk
} = {}

/**
 * Returns the nearest surface height (going down or up) from coords
 * Will return null if no chunk was found
 * Will return the same coord if already inside terrain
 */
export function getSurfaceHeight(
  x: number,
  y: number,
  z: number,
  goingUp?: boolean,
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

export function getChunk(x: number, y: number, z: number): GridChunk {
  const baseX = Math.floor(x / CHUNK_WIDTH) * CHUNK_WIDTH
  const baseY = Math.floor(y / CHUNK_HEIGHT) * CHUNK_HEIGHT
  const baseZ = Math.floor(z / CHUNK_WIDTH) * CHUNK_WIDTH
  return chunks[chunkCoordsToKey(baseX, baseY, baseZ)]
}
