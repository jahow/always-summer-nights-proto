/**
 * A set of coordinates in the world
 * X is forward, Z is right, Y is up
 */
export type Coords = [number, number, number]

// a chunk cell is approx. 0.5 meters
// this means a human char will take up 1 cell on the ground
// and 4 cells upwards
export const METERS_PER_UNIT = 0.5

export const CHUNK_WIDTH = 32
export const CHUNK_HEIGHT = 128

export interface EnvironmentState {
  chunks: GridChunkBatch
  entities?: any[]
}

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
