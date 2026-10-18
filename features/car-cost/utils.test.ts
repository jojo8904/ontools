import { describe, expect, it } from 'vitest'
import { calculateCost, comparisonWarnings, EMPTY_QUOTE, validateQuote } from './utils'

describe('car quote total cost', () => {
  it('counts purchase down payment, financed payments and outstanding debt once', () => {
    const r = calculateCost({ ...EMPTY_QUOTE, upfront: 10000000, monthly: 500000, finalDebt: 8000000, residual: 20000000 }, 'purchase')
    expect(r.cashCost).toBe(36000000)
    expect(r.net).toBe(16000000)
    expect(r.initialCash).toBe(10000000)
  })
  it('handles cash purchase and retained asset separately from cash', () => {
    const r = calculateCost({ ...EMPTY_QUOTE, upfront: 30000000, residual: 18000000 }, 'purchase')
    expect(r.cashCost).toBe(30000000)
    expect(r.net).toBe(12000000)
  })
  it('refunds deposit once, consumes prepaid, includes return penalties and no asset', () => {
    const r = calculateCost({ ...EMPTY_QUOTE, upfront: 100000, prepaid: 3000000, deposit: 10000000, monthly: 400000, returnCost: 500000, residual: 20000000, buyout: 18000000 }, 'return')
    expect(r.initialCash).toBe(13100000)
    expect(r.cashCost).toBe(18000000)
    expect(r.net).toBe(18000000)
    expect(r.asset).toBe(0)
  })
  it('credits deposit once at buyout and separates acquisition costs and asset', () => {
    const r = calculateCost({ ...EMPTY_QUOTE, deposit: 5000000, monthly: 400000, buyout: 18000000, acquisitionCost: 1000000, residual: 17000000, returnCost: 999999 }, 'buyout')
    expect(r.outflow).toBe(38400000)
    expect(r.cashCost).toBe(33400000)
    expect(r.net).toBe(16400000)
  })
  it('excludes included charges even if hidden amounts remain and prorates annual separate costs', () => {
    const q = { ...EMPTY_QUOTE, months: 18, annualInsurance: 1200000, annualTax: 240000, monthlyRunning: 100000 }
    expect(calculateCost(q, 'return').operating).toBe(3960000)
    expect(calculateCost({ ...q, insuranceIncluded: true, taxIncluded: true }, 'return').operating).toBe(1800000)
  })
  it('uses variable payment total instead of adding monthly payments again', () => {
    expect(calculateCost({ ...EMPTY_QUOTE, monthly: 100000, paymentTotal: 1234567 }, 'return').recurring).toBe(1234567)
    expect(calculateCost({ ...EMPTY_QUOTE, monthly: 100000, paymentTotal: 0 }, 'return').recurring).toBe(0)
  })
  it('validates boundaries and rejects blank/nonfinite/negative/fractional/extreme inputs', () => {
    expect(validateQuote(EMPTY_QUOTE)).toBe(true)
    for (const months of [0, -1, 1.5, 121, NaN, Infinity]) expect(validateQuote({ ...EMPTY_QUOTE, months })).toBe(false)
    for (const monthly of [-1, NaN, Infinity, 1.2, 1000000001]) {
      expect(() => calculateCost({ ...EMPTY_QUOTE, monthly }, 'purchase')).toThrow()
    }
    expect(validateQuote({ ...EMPTY_QUOTE, months: 120, upfront: 1000000000 })).toBe(true)
  })
  it('warns about term and mileage differences', () => {
    expect(comparisonWarnings([EMPTY_QUOTE, { ...EMPTY_QUOTE }])).toEqual([])
    expect(comparisonWarnings([EMPTY_QUOTE, { ...EMPTY_QUOTE, months: 48, annualKm: 20000 }])).toHaveLength(2)
  })
  it('does not clamp legitimate negative asset-adjusted costs and scales monthly equivalent', () => {
    const r = calculateCost({ ...EMPTY_QUOTE, months: 12, upfront: 100, residual: 220 }, 'purchase')
    expect(r.net).toBe(-120)
    expect(r.monthlyEquivalent).toBe(-10)
  })
  it('keeps refundable deposits out of net cost but exposes the initial cash requirement', () => {
    for (const scenario of ['return', 'buyout'] as const) {
      const q = { ...EMPTY_QUOTE, upfront: 200000, prepaid: 1000000, monthly: 300000, buyout: 9000000, residual: 8000000 }
      const withoutDeposit = calculateCost(q, scenario)
      const withDeposit = calculateCost({ ...q, deposit: 5000000 }, scenario)
      expect(withDeposit.cashCost).toBe(withoutDeposit.cashCost)
      expect(withDeposit.net).toBe(withoutDeposit.net)
      expect(withDeposit.initialCash - withoutDeposit.initialCash).toBe(5000000)
      expect(withDeposit.outflow - withoutDeposit.outflow).toBe(5000000)
    }
  })
  it('accounts for partial deposit loss once through the separate settlement charge', () => {
    const q = { ...EMPTY_QUOTE, deposit: 5000000, monthly: 300000, returnCost: 700000 }
    const r = calculateCost(q, 'return')
    // Equivalent to refunding only 4.3m of a 5m deposit, with no separate loss charge.
    expect(r.cashCost).toBe(5000000 + 300000 * 36 - 4300000)
    expect(r.net).toBe(r.cashCost)
  })
  it('does not apply stale return penalties in buyout or stale purchase debt in return', () => {
    const q = { ...EMPTY_QUOTE, monthly: 100000, returnCost: 200000, buyout: 6000000, acquisitionCost: 300000, residual: 5000000, finalDebt: 9000000 }
    expect(calculateCost(q, 'return').ending).toBe(200000)
    expect(calculateCost(q, 'return').asset).toBe(0)
    expect(calculateCost(q, 'buyout').ending).toBe(6300000)
    expect(calculateCost(q, 'purchase').ending).toBe(9000000)
  })
  it('handles insurance and tax inclusion independently', () => {
    const q = { ...EMPTY_QUOTE, months: 12, annualInsurance: 1200000, annualTax: 240000 }
    expect(calculateCost({ ...q, insuranceIncluded: true }, 'return').operating).toBe(240000)
    expect(calculateCost({ ...q, taxIncluded: true }, 'return').operating).toBe(1200000)
  })
  it('rejects invalid variable totals rather than falling back silently to monthly payments', () => {
    for (const paymentTotal of [NaN, Infinity, -1, 1.5, 1000000001]) {
      expect(() => calculateCost({ ...EMPTY_QUOTE, paymentTotal }, 'return')).toThrow()
    }
  })

})
