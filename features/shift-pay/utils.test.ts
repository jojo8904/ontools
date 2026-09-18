import { describe, it, expect } from 'vitest'
import { calculateShift, validateShiftOverlap, type Shift } from './utils'

const shift: Shift = {
  date: '2026-09-01',
  start: '09:00',
  end: '18:00',
  breakStart: '12:00',
  breakMinutes: 60,
  holiday: false,
}
describe('shift pay', () => {
  it('subtracts unpaid break', () => {
    expect(calculateShift(shift, 10000, true)).toMatchObject({ worked: 480, night: 0, total: 80000 })
  })
  it('subtracts the actual night break and stacks night with daily overtime', () => {
    expect(
      calculateShift({ ...shift, start: '21:00', end: '07:00', breakStart: '02:00' }, 10000, true)
    ).toMatchObject({ worked: 540, night: 420, dailyExtra: 5000, nightExtra: 35000, total: 130000 })
  })
  it('does not double-count daily overtime for holiday work', () => {
    expect(calculateShift({ ...shift, end: '20:00', holiday: true }, 10000, true)).toMatchObject({
      worked: 600,
      dailyExtra: 0,
      holidayExtra: 60000,
      total: 160000,
    })
  })
  it('adds holiday and night premiums together', () => {
    expect(
      calculateShift({ ...shift, start: '22:00', end: '06:00', breakMinutes: 0, holiday: true }, 10000, true)
        .total
    ).toBe(160000)
  })
  it('disables statutory premiums for small workplaces', () => {
    expect(
      calculateShift(
        { ...shift, start: '21:00', end: '07:00', breakStart: '02:00', holiday: true },
        10000,
        false
      ).total
    ).toBe(90000)
  })
  it.each([
    { date: '2026-02-30' },
    { start: '24:00' },
    { end: '09:00' },
    { breakStart: '08:00' },
    { breakMinutes: 540 },
    { breakMinutes: -1 },
    { breakMinutes: NaN },
  ])('rejects invalid shifts %j', (patch) => {
    expect(() => calculateShift({ ...shift, ...patch }, 10000, true)).toThrow()
  })
  it('rejects consecutive-day overlaps but allows touching shifts', () => {
    const overnight = { ...shift, start: '22:00', end: '10:00', breakStart: '02:00' }
    expect(() => validateShiftOverlap([overnight, { ...shift, date: '2026-09-02' }])).toThrow()
    expect(() =>
      validateShiftOverlap([overnight, { ...shift, date: '2026-09-02', start: '10:00' }])
    ).not.toThrow()
  })
})
