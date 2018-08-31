import { Coords, CHUNK_HEIGHT, CHUNK_WIDTH } from './environment'
import { cap } from './utility'

/**
 * This represents a portion of the world seen by a player
 * X is forward, Z is right, Y is up
 */
export interface ViewExtent {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
}

/**
 * Compare two extents; returns true if different
 */
export function compareExtents(
  extent1: ViewExtent,
  extent2: ViewExtent
): boolean {
  return (
    extent1.minX !== extent2.minX ||
    extent1.minY !== extent2.minY ||
    extent1.maxX !== extent2.maxX ||
    extent1.maxY !== extent2.maxY ||
    extent1.minZ !== extent2.minZ ||
    extent1.maxZ !== extent2.maxZ
  )
}

export function isCoordInExtent(coords: Coords, extent: ViewExtent): boolean {
  return (
    coords[0] >= extent.minX &&
    coords[0] <= extent.maxX &&
    coords[1] >= extent.minY &&
    coords[1] <= extent.maxY &&
    coords[2] >= extent.minZ &&
    coords[2] <= extent.maxZ
  )
}

/**
 * Returns an array of chunks as [x, y, z] arrays, based on
 * an extent (min/max X, min/max Y, min/max Z)
 */
export function getChunksInExtent(extent: ViewExtent): Coords[] {
  const coords: Coords[] = []
  const baseX = Math.floor(extent.minX / CHUNK_WIDTH) * CHUNK_WIDTH
  const baseY = Math.floor(extent.minY / CHUNK_HEIGHT) * CHUNK_HEIGHT
  const baseZ = Math.floor(extent.minZ / CHUNK_WIDTH) * CHUNK_WIDTH
  let x, y, z
  for (x = baseX; x <= extent.maxX; x += CHUNK_WIDTH) {
    for (z = baseZ; z <= extent.maxZ; z += CHUNK_WIDTH) {
      for (y = baseY; y <= extent.maxY; y += CHUNK_HEIGHT) {
        coords.push([x, y, z])
      }
    }
  }
  return coords
}

/**
 * Returns an array of chunks that are contained in extent2
 * but not in extent1; useful for sending only new chunks
 * when panning view
 */
export function getChunksBySubtractingExtents(
  extent1: ViewExtent,
  extent2: ViewExtent
): Coords[] {
  const coords: Coords[] = []
  const baseX = Math.floor(extent2.minX / CHUNK_WIDTH) * CHUNK_WIDTH
  const baseY = Math.floor(extent2.minY / CHUNK_HEIGHT) * CHUNK_HEIGHT
  const baseZ = Math.floor(extent2.minZ / CHUNK_WIDTH) * CHUNK_WIDTH
  let x, y, z, coord: Coords
  for (x = baseX; x <= extent2.maxX; x += CHUNK_WIDTH) {
    for (z = baseZ; z <= extent2.maxZ; z += CHUNK_WIDTH) {
      for (y = baseY; y <= extent2.maxY; y += CHUNK_HEIGHT) {
        coord = [x, y, z]
        if (isCoordInExtent(coord, extent1)) continue
        coords.push([x, y, z])
      }
    }
  }
  return coords
}

/**
 * Adds a buffer on an extent, i.e. expand it on all directions
 */
export function addBufferToExtent(
  extent: ViewExtent,
  buffer: number
): ViewExtent {
  extent.minX -= buffer
  extent.maxX += buffer
  extent.minY -= buffer
  extent.maxY += buffer
  extent.minZ -= buffer
  extent.maxZ += buffer
  return extent
}

/**
 * Copy extent1 into extent2; can initialize an object
 */
export function copyExtent(
  extent1: ViewExtent,
  extent2?: ViewExtent
): ViewExtent {
  if (!extent2) {
    extent2 = { ...extent1 }
  } else {
    extent2.minX = extent1.minX
    extent2.maxX = extent1.maxX
    extent2.minY = extent1.minY
    extent2.maxY = extent1.maxY
  }
  return extent2
}

/**
 * Restrain an extent in width and height
 */
export function capExtent(
  extent: ViewExtent,
  maxWidth: number,
  maxHeight?: number
): ViewExtent {
  const centerX = (extent.maxX + extent.minX) / 2
  const centerY = (extent.maxY + extent.minY) / 2
  const centerZ = (extent.maxZ + extent.minZ) / 2
  const sizeX = cap(extent.maxX - extent.minX, 1, maxWidth)
  const sizeZ = cap(extent.maxZ - extent.minZ, 1, maxWidth)
  const sizeY =
    maxHeight !== undefined
      ? cap(extent.maxY - extent.minY, 1, maxHeight)
      : extent.maxY - extent.minY

  return {
    minX: Math.floor(centerX - sizeX / 2),
    maxX: Math.floor(centerX + sizeX / 2),
    minY: Math.floor(centerY - sizeY / 2),
    maxY: Math.floor(centerY + sizeY / 2),
    minZ: Math.floor(centerZ - sizeZ / 2),
    maxZ: Math.floor(centerZ + sizeZ / 2)
  }
}
