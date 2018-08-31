/**
 * Returns an array of values from a range
 */
export function arrayFromRange(min: number, max: number) {
  let min_ = Math.floor(min)
  let max_ = Math.floor(max)
  const result = new Array(max_ - min_)
  for (let i = 0; i < max_ - min_; i++) {
    result[i] = min_ + i
  }
  return result
}

let debugMode = false

/**
 * Debug mode
 */
export function toggleDebugMode() {
  debugMode = !debugMode
}
export function getDebugMode(): boolean {
  return debugMode
}
