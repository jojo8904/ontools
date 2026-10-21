import { it, expect } from 'vitest'
import { calculateCalorie, ACTIVITIES } from './utils'
it('retains unrounded Mifflin intermediates and both sex constants', () => {
  expect(calculateCalorie('male', 30, 175, 75, 'light')).toEqual({ bmr: 1699, tdee: 2336 })
  expect(calculateCalorie('female', 30, 175, 75, 'light')).toEqual({ bmr: 1533, tdee: 2108 })
  for (const activity of Object.keys(ACTIVITIES) as (keyof typeof ACTIVITIES)[]) expect(calculateCalorie('male', 30, 175, 75, activity).tdee).toBe(Math.round(1698.75 * ACTIVITIES[activity].factor))
})
it('rejects incomplete, nonfinite, child and out-of-range values', () => {
  for (const age of [0, 17, 30.5, 121, NaN, Infinity]) expect(() => calculateCalorie('male', age, 175, 75, 'light')).toThrow()
  expect(() => calculateCalorie('female', 30, 0, 75, 'light')).toThrow()
  expect(() => calculateCalorie('female', 30, 175, -1, 'light')).toThrow()
  expect(calculateCalorie('female', 18, 100, 25, 'sedentary').tdee).toBeGreaterThan(0)
})
