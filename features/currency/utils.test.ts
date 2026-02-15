import { describe, it, expect } from 'vitest'
import { convertCurrency, isWeekend, getCurrencySymbol } from './utils'
import { CurrencyInput } from '@/types/tools'

describe('convertCurrency', () => {
  it('should convert KRW to USD', () => {
    const input: CurrencyInput = {
      amount: 1320500,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
    }

    const result = convertCurrency(input)

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

    expect(result.convertedAmount).toBeCloseTo(1320500, 1)
  })

  it('should convert JPY to KRW (100 yen basis)', () => {
    const input: CurrencyInput = {
      amount: 10000, // 1만 엔
      fromCurrency: 'JPY',
      toCurrency: 'KRW',
    }

    const result = convertCurrency(input)

    // 10,000엔 / 100 * 8.85 = 885
    expect(result.convertedAmount).toBeCloseTo(885, 1)
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
