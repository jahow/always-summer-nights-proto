export function getTime() {
  const t = process.hrtime()
  return t[0] * 1000000 + t[1] / 1000
}

export function cap(val: number, min: number, max: number) {
  return Math.max(Math.min(val, max), min)
}
