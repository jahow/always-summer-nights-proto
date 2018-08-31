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
