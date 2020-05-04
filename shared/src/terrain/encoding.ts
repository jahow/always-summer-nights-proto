import {CellColumn, CellColumnEncoded, CellColumnRange, GridChunk, GridChunkEncoded, SurfaceShape} from './model'
import {CHUNK_WIDTH} from './constants'

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