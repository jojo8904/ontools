import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSupabaseClient } from '@/lib/supabase'
import { fallbackQuotes, getAllExchangeRates } from './exchangeRateApi'
import { convertCurrency, EXCHANGE_RATES } from '../utils'

vi.mock('@/lib/supabase', () => ({ getSupabaseClient: vi.fn() }))
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

describe('rate provenance', () => {
  it('never labels fallback data as current', async () => {
    vi.mocked(getSupabaseClient).mockReturnValue(null)
    const quotes = await getAllExchangeRates()
    expect(quotes.USD.asOf).toBeNull()
    const result = convertCurrency({ amount: 1380, fromCurrency: 'KRW', toCurrency: 'USD' }, EXCHANGE_RATES, quotes)
    expect(result.convertedAmount).toBe(1)
    expect(result.rate).toBeCloseTo(1 / 1380)
    expect(result.status).toBe('fallback')
    expect(result.lastUpdated).toContain('기준일 미확인')
  })
  it('normalizes JPY units and preserves actual stale timestamps', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-18T00:00:00Z'))
    const chain = {
      select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockResolvedValue({ data: [{ rate: 920, date: '2026-09-01T00:00:00Z', source: 'Test provider' }], error: null }),
    }
    vi.mocked(getSupabaseClient).mockReturnValue({ from: () => chain } as unknown as NonNullable<ReturnType<typeof getSupabaseClient>>)
    const quotes = await getAllExchangeRates()
    expect(quotes.JPY.rate).toBe(9.2)
    expect(quotes.JPY.status).toBe('stale')
    expect(quotes.JPY.asOf).toBe('2026-09-01T00:00:00.000Z')
  })
  it('marks mixed live/fallback conversions as fallback', () => {
    const quotes = fallbackQuotes()
    quotes.USD = { rate: 1380, asOf: '2026-09-18T00:00:00Z', status: 'live', source: 'Test' }
    expect(convertCurrency({ amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }, EXCHANGE_RATES, quotes).status).toBe('fallback')
  })
})
