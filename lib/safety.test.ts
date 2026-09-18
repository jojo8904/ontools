import { afterEach, describe, expect, it, vi } from 'vitest'
import { generatePassword, secureIndex } from './password'
import { parseRanges } from './pdf-ranges'
import { calculateEmployeeInsurance, getPolicyPeriod } from './korea-policy'
import { calculateFromAmount, calculateFromUsage } from '@/features/electricity/utils'

afterEach(() => vi.restoreAllMocks())

describe('secure passwords', () => {
  it('uses cryptographic randomness and guarantees enabled character groups', () => {
    vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Insecure RNG') })
    for (let i = 0; i < 100; i++) {
      const password = generatePassword(20, true, true, true)
      expect(password).toHaveLength(20)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[A-Z]/)
      expect(password).toMatch(/[0-9]/)
      expect(password).toMatch(/[^a-zA-Z0-9]/)
    }
  })
  it('rejects the biased tail of the random range', () => {
    const rng = vi.spyOn(crypto, 'getRandomValues')
    rng.mockImplementationOnce((a) => { (a as Uint32Array)[0] = 0xffffffff; return a })
    rng.mockImplementationOnce((a) => { (a as Uint32Array)[0] = 7; return a })
    expect(secureIndex(10)).toBe(7)
    expect(rng).toHaveBeenCalledTimes(2)
  })
  it('rejects invalid lengths and respects disabled groups', () => {
    expect(() => generatePassword(3, true, true, true)).toThrow()
    expect(() => generatePassword(65, true, true, true)).toThrow()
    expect(generatePassword(32, false, false, false)).toMatch(/^[a-z]{32}$/)
  })
})

describe('PDF page ranges', () => {
  it('normalizes reverse ranges, duplicates and order', () => {
    expect(parseRanges('5, 3-1, 2, 8-7', 8)).toEqual([0, 1, 2, 4, 6, 7])
  })
  it('bounds work to actual pages, even for enormous input ranges', () => {
    expect(parseRanges('1-999999999999', 3)).toEqual([0, 1, 2])
    expect(parseRanges('999999-9999999999', 3)).toEqual([])
  })
  it.each(['0', '-2', 'NaN', '1.5', '1-a', '1-9007199254740992'])('rejects malformed range %s', (range) => {
    expect(() => parseRanges(range, 3)).toThrow()
  })
})

describe('2026 employee insurance', () => {
  it('switches pension limits at July 1', () => {
    expect(calculateEmployeeInsurance(10_000_000, '2026-06-30').nationalPension).toBe(302575)
    expect(calculateEmployeeInsurance(10_000_000, '2026-07-01').nationalPension).toBe(313025)
    expect(calculateEmployeeInsurance(100_000, '2026-01-01').nationalPension).toBe(19000)
    expect(calculateEmployeeInsurance(100_000, '2026-07-01').nationalPension).toBe(19475)
  })
  it('applies shared employee rates and rounding', () => {
    expect(calculateEmployeeInsurance(3_000_000)).toEqual({
      nationalPension: 142500, healthInsurance: 107850, longTermCare: 14170, employmentInsurance: 27000,
    })
    expect(Object.values(calculateEmployeeInsurance(0))).toEqual([0, 0, 0, 0])
    expect(calculateEmployeeInsurance(100_000).healthInsurance).toBe(10080)
    expect(calculateEmployeeInsurance(1_000_000_000).healthInsurance).toBe(4591740)
  })
  it('does not silently reuse rates outside supported dates', () => {
    expect(() => getPolicyPeriod('2027-01-01')).toThrow()
    expect(() => getPolicyPeriod('2026-02-31')).toThrow()
    expect(() => calculateEmployeeInsurance(Infinity)).toThrow()
    expect(() => calculateEmployeeInsurance(-1)).toThrow()
  })
})

describe('electricity estimates', () => {
  it('applies the current fund and final rounding', () => {
    const result = calculateFromUsage(300)
    expect(result.subtotal).toBe(51260)
    expect(result.vat).toBe(5126)
    expect(result.fund).toBe(1380)
    expect(result.total).toBe(57760)
    expect(calculateFromAmount(result.total).usage).toBe(300)
  })
  it('rejects unsupported loads and nonfinite values', () => {
    for (const value of [-1, Infinity, NaN, 1001]) expect(() => calculateFromUsage(value)).toThrow()
    expect(() => calculateFromAmount(0)).toThrow()
  })
})
