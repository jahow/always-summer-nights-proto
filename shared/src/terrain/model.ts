/**
 * A set of coordinates in the world
 * X is right, Z is forward, Y is up
 */
export type Coords = [number, number, number]

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
// a column can also be -1 (empty) or a material id (full column)
export type GridChunk = Array<CellColumn | number>
export type Terrain = { [index: string]: GridChunk }

export type CellColumnEncoded = Array<number>
export type GridChunkEncoded = Array<CellColumnEncoded | number>
export type TerrainEncoded = {
  [index: string]: GridChunkEncoded
}