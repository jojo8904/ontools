import { describe, it, expect } from 'vitest'
import { convertCurrency, isWeekend, getCurrencySymbol } from './utils'
import { CurrencyInput } from '@/types/tools'

describe('convertCurrency', () => {
  // 폴백 환율 기준 (1단위 기준): USD 1380, JPY 9.2(1엔), EUR 1490, CNY 190
  it('should convert KRW to USD', () => {
    const input: CurrencyInput = {
      amount: 1380000,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
    }

    const result = convertCurrency(input)

    // 1,380,000원 / 1380 = 1000 USD
    expect(result.convertedAmount).toBeCloseTo(1000, 1)
    expect(result.fromCurrency).toBe('KRW')
    expect(result.toCurrency).toBe('USD')
  })

  it('should convert USD to KRW', () => {
    const input: CurrencyInput = {
      amount: 1000,
      fromCurrency: 'USD',
      toCurrency: 'KRW',
    }

    const result = convertCurrency(input)

    // 1000 USD * 1380 = 1,380,000원
    expect(result.convertedAmount).toBeCloseTo(1380000, 1)
  })

  it('should convert JPY to KRW (1 yen basis)', () => {
    const input: CurrencyInput = {
      amount: 10000, // 1만 엔
      fromCurrency: 'JPY',
      toCurrency: 'KRW',
    }

    const result = convertCurrency(input)

    // 10,000엔 * 9.2 = 92,000원 (1엔 기준 환율)
    expect(result.convertedAmount).toBeCloseTo(92000, 1)
  })

  it('should convert EUR to USD', () => {
    const input: CurrencyInput = {
      amount: 1000,
      fromCurrency: 'EUR',
      toCurrency: 'USD',
    }

    const result = convertCurrency(input)

    // 1000 EUR * 1425.3 / 1320.5 = ~1079.4 USD
    expect(result.convertedAmount).toBeGreaterThan(0)
  })

  it('should return same amount for same currency conversion', () => {
    const input: CurrencyInput = {
      amount: 5000,
      fromCurrency: 'USD',
      toCurrency: 'USD',
    }

    const result = convertCurrency(input)

    expect(result.convertedAmount).toBe(5000)
    expect(result.rate).toBe(1)
  })

  it('should handle zero amount', () => {
    const input: CurrencyInput = {
      amount: 0,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
    }

    const result = convertCurrency(input)

    expect(result.convertedAmount).toBe(0)
  })

  it('should include weekend flag', () => {
    const input: CurrencyInput = {
      amount: 1000,
      fromCurrency: 'USD',
      toCurrency: 'KRW',
    }

    const result = convertCurrency(input)

    expect(typeof result.isWeekend).toBe('boolean')
  })
})

describe('isWeekend', () => {
  it('should detect Saturday', () => {
    const saturday = new Date('2026-02-14') // 토요일
    expect(isWeekend(saturday)).toBe(true)
  })

  it('should detect Sunday', () => {
    const sunday = new Date('2026-02-15') // 일요일
    expect(isWeekend(sunday)).toBe(true)
  })

  it('should detect weekday', () => {
    const monday = new Date('2026-02-16') // 월요일
    expect(isWeekend(monday)).toBe(false)
  })
})

describe('getCurrencySymbol', () => {
  it('should return correct symbols', () => {
    expect(getCurrencySymbol('KRW')).toBe('₩')
    expect(getCurrencySymbol('USD')).toBe('$')
    expect(getCurrencySymbol('JPY')).toBe('¥')
    expect(getCurrencySymbol('EUR')).toBe('€')
    expect(getCurrencySymbol('CNY')).toBe('¥')
  })

  it('should return empty string for unknown currency', () => {
    expect(getCurrencySymbol('XXX')).toBe('')
  })
})
