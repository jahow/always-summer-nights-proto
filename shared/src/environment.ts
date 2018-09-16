/**
 * A set of coordinates in the world
 * X is right, Z is forward, Y is up
 */
import { isNumber } from 'util'

export type Coords = [number, number, number]

// a chunk cell is approx. 0.5 meters
// this means a human char will take up 1 cell on the ground
// and 4 cells upwards
export const METERS_PER_UNIT = 0.5

export const CHUNK_WIDTH = 32
export const CHUNK_HEIGHT = 128

export enum SurfaceShape {
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

export function getShapeFromNeighbours(
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

export interface CellColumnRange {
  topShape?: SurfaceShape
  bottomShape?: SurfaceShape
  bottomStart: number
  rangeSize: number
  materialId: number
}

export interface CellColumn {
  ranges: CellColumnRange[]
}

// last element of a chunk is the revision number
// a column can also be -1 (empty) or a material id
export type GridChunk = Array<CellColumn | number>
export type GridChunkBatch = { [index: string]: GridChunk }

export interface EnvironmentState {
  chunks: GridChunkBatch
  entities?: any[]
}

export type CellColumnEncoded = Array<number>
export type GridChunkEncoded = Array<CellColumnEncoded | number>
export type GridChunkBatchEncoded = {
  [index: string]: GridChunkEncoded
}
export interface EnvironmentStateEncoded {
  c: GridChunkBatchEncoded
  e?: any[]
}

export function chunkCoordsToKey(x: number, y: number, z: number): string {
  return `${x} ${y} ${z}`
}

export function chunkKeyToCoords(key: string): Coords {
  return key.split(' ').map(c => parseInt(c)) as Coords
}

/**
 * Pushes data in the given array, representing the cell column; a column is
 * represented by 1 number
 * Structure is:
 *  * 1st number is         0x FFFF FF FF F F
 *                                          ^ top shape (0-14)
 *                                        ^ bottom shape (0-14)
 *                                     ^ bottom start (0-255)
 *                                  ^ range size (0-255)
 *                             ^ material id
 *
 * @param col
 * @param array
 */
export function encodeCellColumn(col: CellColumn, array: CellColumnEncoded) {
  for (let i = 0; i < col.ranges.length; i++) {
    debugger
    array.push(
      (col.ranges[i].topShape || SurfaceShape.FLAT) |
        ((col.ranges[i].bottomShape || SurfaceShape.FLAT) << (1 * 4)) |
        ((col.ranges[i].bottomStart & 0xff) << (2 * 4)) |
        ((col.ranges[i].rangeSize & 0xff) << (4 * 4)) |
        ((col.ranges[i].materialId & 0xffff) << (6 * 4))
    )
  }
}

/**
 * callback is called on every decoded range
 * @param encodedCol
 * @param callback
 */
export function decodeCellColumn(
  encodedCol: CellColumnEncoded,
  array: CellColumnRange[]
) {
  let info: CellColumnRange
  for (let i = 0; i < encodedCol.length; i++) {
    info = {
      topShape: encodedCol[i] & 0xf,
      bottomShape: (encodedCol[i] >> (1 * 4)) & 0xf,
      bottomStart: (encodedCol[i] >> (2 * 4)) & 0xff,
      rangeSize: (encodedCol[i] >> (4 * 4)) & 0xff,
      materialId: (encodedCol[i] >> (6 * 4)) & 0xffff
    }
    array.push(info)
  }
}

export function encodeGridChunk(chunk: GridChunk): GridChunkEncoded {
  const res = Array(CHUNK_WIDTH * CHUNK_WIDTH + 1)
  let arr: CellColumnEncoded = []
  for (let i = 0; i < CHUNK_WIDTH * CHUNK_WIDTH; i++) {
    if (typeof chunk[i] === 'number') {
      res[i] = chunk[i]
      continue
    }
    arr = []
    encodeCellColumn(chunk[i] as CellColumn, arr)
    res[i] = arr
  }
  res[CHUNK_WIDTH * CHUNK_WIDTH] = chunk[CHUNK_WIDTH * CHUNK_WIDTH]
  return res
}

export function decodeGridChunk(chunk: GridChunkEncoded): GridChunk {
  const res = Array(CHUNK_WIDTH * +1)
  let col: CellColumn
  for (let i = 0; i < CHUNK_WIDTH * CHUNK_WIDTH; i++) {
    if (typeof chunk[i] === 'number') {
      res[i] = chunk[i]
      continue
    }
    col = { ranges: [] }
    decodeCellColumn(chunk[i] as CellColumnEncoded, col.ranges)
    res[i] = col
  }
  res[CHUNK_WIDTH * CHUNK_WIDTH] = chunk[CHUNK_WIDTH * CHUNK_WIDTH]
  return res
}

export function encodeEnvironmentState(
  state: EnvironmentState
): EnvironmentStateEncoded {
  const c: GridChunkBatchEncoded = {}
  for (let key in state.chunks) {
    c[key] = encodeGridChunk(state.chunks[key])
  }
  return {
    c,
    e: state.entities
  }
}

export function decodeEnvironmentState(
  state: EnvironmentStateEncoded
): EnvironmentState {
  const chunks: GridChunkBatch = {}
  for (let key in state.c) {
    chunks[key] = decodeGridChunk(state.c[key])
  }
  return {
    chunks,
    entities: state.e
  }
}
