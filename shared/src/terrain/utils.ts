import {Coords, GridChunk, SurfaceShape} from './model'
import {CHUNK_WIDTH} from './constants'

export function chunkCoordsToKey(x: number, y: number, z: number): string {
  return `${x} ${y} ${z}`
}

export function chunkKeyToCoords(key: string): Coords {
  return key.split(' ').map(c => parseInt(c)) as Coords
}

export function getChunkRevision(chunk: GridChunk) {
  return chunk[CHUNK_WIDTH * CHUNK_WIDTH] as number
}

export function computeSmoothShapeFromNeighbours(
  topleft: boolean,
  top: boolean,
  topright: boolean,
  right: boolean,
  bottomright: boolean,
  bottom: boolean,
  bottomleft: boolean,
  left: boolean
): SurfaceShape {
  if (
    !topleft &&
    !top &&
    !topright &&
    !right &&
    !bottomright &&
    !bottom &&
    !bottomleft &&
    !left
  ) {
    return SurfaceShape.FLAT
  } else if (
    topleft &&
    !top &&
    !topright &&
    !right &&
    !bottomright &&
    !bottom &&
    !bottomleft &&
    !left
  ) {
    return SurfaceShape.UP_TOPLEFT
  } else if (
    !topleft &&
    !top &&
    topright &&
    !right &&
    !bottomright &&
    !bottom &&
    !bottomleft &&
    !left
  ) {
    return SurfaceShape.UP_TOPRIGHT
  } else if (
    !topleft &&
    !top &&
    !topright &&
    !right &&
    bottomright &&
    !bottom &&
    !bottomleft &&
    !left
  ) {
    return SurfaceShape.UP_BOTTOMRIGHT
  } else if (
    !topleft &&
    !top &&
    !topright &&
    !right &&
    !bottomright &&
    !bottom &&
    bottomleft &&
    !left
  ) {
    return SurfaceShape.UP_BOTTOMLEFT
  } else if (top && !right && !bottomright && !bottom && !bottomleft && !left) {
    return SurfaceShape.UP_TOP
  } else if (!topleft && !top && right && !bottom && !bottomleft && !left) {
    return SurfaceShape.UP_RIGHT
  } else if (!topleft && !top && !topright && !right && bottom && !left) {
    return SurfaceShape.UP_BOTTOM
  } else if (!top && !topright && !right && !bottomright && !bottom && left) {
    return SurfaceShape.UP_LEFT
  } else if (!topleft && right && bottomright && bottom) {
    return SurfaceShape.DOWN_TOPLEFT
  } else if (!topright && bottom && bottomleft && left) {
    return SurfaceShape.DOWN_TOPRIGHT
  } else if (topleft && top && !bottomright && left) {
    return SurfaceShape.DOWN_BOTTOMRIGHT
  } else if (top && topright && right && !bottomleft) {
    return SurfaceShape.DOWN_BOTTOMLEFT
  } else if (
    topleft &&
    !top &&
    !topright &&
    !right &&
    bottomright &&
    !bottom &&
    !bottomleft &&
    !left
  ) {
    return SurfaceShape.DIAGONAL_FROMTOPLEFT
  } else if (
    !topleft &&
    !top &&
    topright &&
    !right &&
    !bottomright &&
    !bottom &&
    bottomleft &&
    !left
  ) {
    return SurfaceShape.DIAGONAL_FROMBOTTOMLEFT
  } else {
    console.log('unhandled shape case: ', arguments)
    return SurfaceShape.FLAT
  }
}
