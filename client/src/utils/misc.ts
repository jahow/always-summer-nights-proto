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
    timeout = setTimeout(later, wait) as any
    if (callNow) func.apply(context, args)
  }
}

export function throttle(
  func: () => any,
  wait: number,
  leading?: boolean,
  trailing?: boolean
) {
  let context = this,
    args = arguments
  let timeout: number
  let previous = 0
  let later = function() {
    previous = Date.now()
    timeout = null
    func.apply(context, args)
  }
  return function() {
    let now = Date.now()
    if (!previous && !leading) previous = now
    let remaining = wait - (now - previous)
    args = arguments
    if (remaining <= 0) {
      clearTimeout(timeout)
      timeout = null
      previous = now
    } else if (!timeout && trailing) {
      timeout = setTimeout(later, remaining) as any
    }
  }
}
