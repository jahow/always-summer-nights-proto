import { cap } from './utility'

test('cap', () => {
  expect(cap(1, 2, 3)).toBe(2)
  expect(cap(1, 0, 3)).toBe(1)
  expect(cap(1, -1, 0)).toBe(0)
})
