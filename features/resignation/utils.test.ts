import { describe, it, expect } from 'vitest'
import { compareExit, type ExitScenario } from './utils'

const input: ExitScenario = {
  end: '2017-09-16',
  wages: 7080000,
  bonus: 4000000,
  priorLeavePay: 300000,
  ordinaryDaily: 0,
  remainingLeave: 0,
}
describe('resignation comparison', () => {
  it('matches the MOEL reference calculation before rounding', () => {
    const r = compareExit('2014-10-02', input, true)
    expect(r.tenure).toBe(1080)
    expect(r.periodDays).toBe(92)
    expect(r.daily).toBeCloseTo(88641.304347826)
    expect(r.severance).toBe(Math.floor((88641.304347826 * 30 * 1080) / 365))
  })
  it('uses ordinary wage floor and explicit leave amount', () => {
    const r = compareExit('2014-10-02', { ...input, ordinaryDaily: 100000, remainingLeave: 5.5 }, true)
    expect(r.leavePay).toBe(550000)
    expect(r.total).toBe(r.severance + 550000)
    expect(r.severance).toBe(Math.floor((100000 * 30 * 1080) / 365))
  })
  it('excludes retirement date and applies service/hours eligibility', () => {
    expect(compareExit('2025-01-01', { ...input, end: '2026-01-01' }, true).tenure).toBe(365)
    expect(compareExit('2025-01-01', { ...input, end: '2025-12-31' }, true).severance).toBe(0)
    expect(compareExit('2025-01-01', { ...input, end: '2026-01-01' }, false).severance).toBe(0)
  })
  it('handles month ends and leap months without timezone dependence', () => {
    expect(compareExit('2020-01-01', { ...input, end: '2024-05-31' }, true)).toMatchObject({
      periodStart: '2024-02-29',
      periodDays: 92,
    })
  })
  it.each([{ end: '2026-02-30' }, { wages: NaN }, { remainingLeave: -1 }, { remainingLeave: 367 }])(
    'rejects invalid inputs %j',
    (patch) => {
      expect(() => compareExit('2020-01-01', { ...input, ...patch }, true)).toThrow()
    }
  )
})
