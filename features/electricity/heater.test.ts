import { describe, it, expect } from 'vitest'
import { calculateHeater } from './heater'
import { calculateFromUsage, calculateFromAmount } from './utils'
const base = { baseline: 300, watts: 2000, hours: 4, days: 30, duty: 100, budget: 30000 }
describe('heater billing', () => {
  it('charges the household bill difference rather than a flat appliance rate', () => {
    const r = calculateHeater(base)
    expect(r.added).toBe(240)
    expect(r.incremental).toBe(calculateFromUsage(540).total - calculateFromUsage(300).total)
    const kwh = 2 * r.budgetMinutes / 60
    expect(calculateFromUsage(300 + kwh).total - r.before.total).toBeLessThanOrEqual(30000)
    expect(calculateFromUsage(300 + kwh + 2 / 60).total - r.before.total).toBeGreaterThan(30000)
  })
  it('applies duty and allows zero hours', () => {
    expect(calculateHeater({ ...base, duty: 50 }).added).toBe(120)
    expect(calculateHeater({ ...base, hours: 0 }).incremental).toBe(0)
  })
  it('handles tariff boundaries and inverse engine', () => {
    for (const baseline of [0, 199.99, 200, 200.01, 399.99, 400, 400.01, 999, 1000]) {
      const r = calculateHeater({ ...base, baseline, hours: 0, budget: 0 })
      expect(r.incremental).toBe(0)
      expect(calculateFromUsage(baseline + 2 * r.budgetMinutes / 60).total).toBeLessThanOrEqual(r.before.total)
    }
    for (const kwh of [0, 200, 400, 1000]) expect(calculateFromAmount(calculateFromUsage(kwh).total).usage).toBe(kwh)
  })
  it('rejects unsupported input and caps the budget at the supported usage', () => {
    for (const delta of [{ baseline: 1001 }, { watts: 0 }, { hours: 25 }, { days: 0 }, { duty: 0 }, { budget: -1 }, { days: 1.5 }, { baseline: NaN }]) expect(() => calculateHeater({ ...base, ...delta })).toThrow()
    expect(() => calculateHeater({ ...base, baseline: 900 })).toThrow(/1,000/)
    const r = calculateHeater({ ...base, baseline: 1000, hours: 0, budget: 1e6 })
    expect(r.budgetMinutes).toBe(0)
    expect(r.capped).toBe(true)
  })
})
