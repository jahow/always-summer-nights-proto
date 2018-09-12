/**
 * Returns an array of values from a range
 */
import Timer = NodeJS.Timer

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

export function debounce(func: () => any, wait: number, immediate?: boolean) {
  let timeout: number
  return function() {
    let context = this,
      args = arguments
    let later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = <number>setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
