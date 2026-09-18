import { getSupabaseClient } from '@/lib/supabase'
import { EXCHANGE_RATES, type RateQuotes } from '../utils'
import { CurrencyCode } from '@/types/tools'

export function fallbackQuotes(): RateQuotes {
  return Object.fromEntries(Object.entries(EXCHANGE_RATES).map(([code, rate]) => [code, {
    rate, asOf: null, source: '참고용 고정 환율', status: 'fallback',
  }])) as RateQuotes
}

export async function getAllExchangeRates(): Promise<RateQuotes> {
  const quotes = fallbackQuotes()
  const client = getSupabaseClient()
  if (!client) return quotes
  await Promise.all((Object.keys(quotes) as CurrencyCode[]).map(async (code) => {
    try {
      const { data, error } = await client.from('exchange_rates')
        .select('rate,date,source').eq('currency_code', code)
        .order('date', { ascending: false }).limit(1)
        .abortSignal(AbortSignal.timeout(10_000))
      const row = data?.[0]
      if (error || !row) return
      const rate = Number(row.rate) / (code === 'JPY' ? 100 : 1)
      const timestamp = Date.parse(row.date)
      if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(timestamp) || timestamp > Date.now() + 300_000) return
      quotes[code] = {
        rate, asOf: new Date(timestamp).toISOString(),
        source: row.source || '저장된 환율 (출처 미기록)',
        status: Date.now() - timestamp > 36 * 60 * 60 * 1000 ? 'stale' : 'live',
      }
    } catch {
      // Retain an explicitly labelled fallback for an unavailable currency.
    }
  }))
  return quotes
}
