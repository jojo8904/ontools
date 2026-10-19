import { describe, expect, it } from 'vitest'
import { calculatePlan, EMPTY_PLAN, validatePlan, warnings } from './utils'
const p = { ...EMPTY_PLAN, price: 12000 }
describe('travel internet input quotes', () => {
  it('multiplies personal packages once per person, not per day', () => {
    expect(calculatePlan({ ...p, perUnitExtra: 1000, sharedExtra: 3000 }, 3, 5, false)).toEqual({ units: 3, multiplier: 1, service: 36000, extras: 6000, total: 42000, perPerson: 14000 })
  })
  it('uses billed days independently and shared devices rather than people', () => {
    expect(calculatePlan({ ...p, mode: 'daily', price: 3000, billedDays: 6, units: 2, capacity: 3, perUnitExtra: 1000, sharedExtra: 5000 }, 5, 4, true)).toMatchObject({ service: 36000, extras: 7000, total: 43000, perPerson: 8600 })
  })
  it('warns without inventing package renewals or pooling individual data', () => {
    const short = { ...p, validity: 2 }
    expect(calculatePlan(short, 2, 5, false).total).toBe(24000)
    expect(warnings(short, 2, 5, false).join()).toContain('자동 합산하지')
    expect(warnings({ ...p, mode: 'daily', billedDays: 6 }, 2, 5, true).join()).toContain('과금 일수')
    expect(warnings(p, 3, 5, true).join()).toContain('기기 수')
  })
  it.each([NaN, Infinity, -1, 0.5, 100000001])('rejects invalid price %s', price => {
    expect(validatePlan({ ...p, price }, 2, 5)).toBe(false)
    expect(() => calculatePlan({ ...p, price }, 2, 5, false)).toThrow()
  })
  it('distinguishes empty from zero, guards count and period bounds', () => {
    expect(validatePlan(EMPTY_PLAN, 2, 5)).toBe(false)
    expect(validatePlan({ ...p, price: 0 }, 1, 1)).toBe(true)
    for (const [people, days] of [[0, 5], [101, 5], [1, 0], [1, 366], [1.5, 5]]) expect(validatePlan(p, people, days)).toBe(false)
    for (const key of ['units', 'capacity', 'validity'] as const) expect(validatePlan({ ...p, [key]: 0 }, 2, 5)).toBe(false)
  })
  it('validates only the active billing mode so hidden empty fields do not trap users', () => {
    expect(validatePlan({ ...p, billedDays: NaN }, 2, 5)).toBe(true)
    expect(validatePlan({ ...p, mode: 'daily', validity: NaN }, 2, 5)).toBe(true)
    expect(validatePlan({ ...p, mode: 'daily', billedDays: 0 }, 2, 5)).toBe(false)
  })
  it('keeps maximum sums safe and fractional equal shares precise', () => {
    const max = calculatePlan({ ...p, mode: 'daily', price: 100000000, billedDays: 365, units: 100, perUnitExtra: 100000000, sharedExtra: 100000000 }, 100, 365, true)
    expect(Number.isSafeInteger(max.total)).toBe(true)
    expect(calculatePlan({ ...p, price: 1 }, 3, 5, true).perPerson).toBe(1 / 3)
  })
})
