import {CellColumn, Coords, GridChunk, SurfaceShape, Terrain} from './model'
import {CHUNK_HEIGHT, CHUNK_WIDTH} from './constants'
import {chunkCoordsToKey} from './utils'

export function getChunk(
  terrain: Terrain, x: number, y: number, z: number): GridChunk {
  const baseX = Math.floor(x / CHUNK_WIDTH) * CHUNK_WIDTH
  const baseY = Math.floor(y / CHUNK_HEIGHT) * CHUNK_HEIGHT
  const baseZ = Math.floor(z / CHUNK_WIDTH) * CHUNK_WIDTH
  return terrain[chunkCoordsToKey(baseX, baseY, baseZ)]
}

function modifyChunkCell(chunk: GridChunk, localCoords: Coords, newMaterial: number | null, newShape: SurfaceShape): GridChunk {
  const x = localCoords[0]
  const y = localCoords[1]
  const z = localCoords[2]
  const newChunk = chunk.slice()
  const col = newChunk[x + z * CHUNK_WIDTH] as CellColumn
  const removing = !!newMaterial

  // empty
  if (col as any === -1) return null

  // loop on cell ranges
  const ranges = col.ranges.slice()
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]
    const deltaY = y - range.bottomStart
    const isUnderRange = deltaY < 0
    const isInsideRange = deltaY > 0 && deltaY < range.rangeSize - 1
    const isAtRangeBottom = deltaY === 0
    const isAtRangeTop = deltaY === range.rangeSize - 1
    const isRangeOnlyCell = isAtRangeBottom && isAtRangeTop

    if (!removing) {
      // changing inside range: ignore
      if (isInsideRange) break

      // changing material at range bottom or top
      if (isAtRangeBottom || isAtRangeTop) {
        ranges[i] = {
          ...range,
          materialId: newMaterial
        }
        break
      }

      // next range is above us: create a new one
      if (isUnderRange) {
        ranges.splice(i, 0, {
          rangeSize: 1,
          bottomStart: y,
          materialId: newMaterial,
          bottomShape: SurfaceShape.FLAT,
          topShape: SurfaceShape.FLAT
        })
        break;
      }
    } else {
      // removing inside range: split
      if (isInsideRange) {
        ranges.splice(i, 1, {
          ...range,
          rangeSize: deltaY - 1
        }, {
          ...range,
          bottomStart: deltaY + 1,
          rangeSize: range.rangeSize - deltaY
        })
        break
      }

      // removing whole range
      if (isRangeOnlyCell) {
        ranges.splice(i, 1)
        break
      }

      // removing range bottom
      if (isAtRangeBottom) {
        ranges[i] = {
          ...range,
          bottomStart: range.bottomStart + 1,
          rangeSize: range.rangeSize - 1
        }
        break
      }

      // removing range top
      if (isAtRangeTop) {
        ranges[i] = {
          ...range,
          rangeSize: range.rangeSize - 1
        }
        break
      }
    }
   }

  // replace column
  newChunk[x+ z* CHUNK_WIDTH] = {
    ...col,
    ranges
  }
  return newChunk
}

/**
 * Returns the nearest surface height (going down or up) from coords
 * Will return null if no chunk was found
 * Will return the same coord if already inside terrain
 */
export function getSurfaceHeight(
  terrain: Terrain,
  x: number,
  y: number,
  z: number,
  goingUp?: boolean
): number | null {
  let currentY = y
  let chunk = getChunk(terrain, x, currentY, z)
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
    chunk = getChunk(terrain, x, currentY, z)
  }

  return null
}

/**
 * @param {Terrain} terrain
 * @param {number} amount Positive adds material, negative removes
 * @param {number} radius
 * @param {Coords} coords
 */
export function extrudeSurface(terrain: Terrain,
                               amount: number,
                               radius: number,
                               coords: Coords): Terrain {
  const newTerrain = {
    ...terrain
  }
  const chunk = getChunk(terrain, ...coords)
  const localCoords = [
    coords[0] - Math.floor(coords[0] / CHUNK_WIDTH) * CHUNK_WIDTH,
    coords[1] - Math.floor(coords[1] / CHUNK_HEIGHT) * CHUNK_HEIGHT,
    coords[2] - Math.floor(coords[2] / CHUNK_WIDTH) * CHUNK_WIDTH
  ] as Coords

  newTerrain[chunkCoordsToKey(...coords)] = modifyChunkCell(
    chunk,
    localCoords,
    1,
    SurfaceShape.FLAT
  );

  return newTerrain
}