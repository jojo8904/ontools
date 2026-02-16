import { supabase } from '@/lib/supabase'
import { EXCHANGE_RATES } from '../utils'
import { CurrencyCode } from '@/types/tools'

/**
 * Fetch single currency rate from Supabase
 * Falls back to hardcoded rates on error
 */
export async function getExchangeRate(
  currencyCode: CurrencyCode
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('currency_code', currencyCode)
      .order('date', { ascending: false })
      .limit(1)

    if (error) throw error
    if (data && data.length > 0) {
      // JPY는 DB에 100엔 기준 저장 → 1엔 기준으로 변환
      return currencyCode === 'JPY' ? data[0].rate / 100 : data[0].rate
    }

    return EXCHANGE_RATES[currencyCode]
  } catch (error) {
    console.warn(
      `Failed to fetch exchange rate for ${currencyCode}, using fallback`,
      error
    )
    return EXCHANGE_RATES[currencyCode]
  }
}

/**
 * Fetch all exchange rates from Supabase
 * Returns latest rate for each currency
 * Falls back to hardcoded rates on error
 */
export async function getAllExchangeRates(): Promise<
  Record<CurrencyCode, number>
> {
  try {
    const currencies: CurrencyCode[] = ['USD', 'JPY', 'EUR', 'CNY']
    const rates = { ...EXCHANGE_RATES }

    for (const code of currencies) {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('rate')
        .eq('currency_code', code)
        .order('date', { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0) {
        // JPY는 DB에 100엔 기준 저장 → 1엔 기준으로 변환
        rates[code] = code === 'JPY' ? data[0].rate / 100 : data[0].rate
      }
    }

    return rates
  } catch (error) {
    console.warn('Failed to fetch all exchange rates, using fallback', error)
    return EXCHANGE_RATES
  }
}

/**
 * Fetch latest business day rate with metadata
 */
export async function getLatestBusinessDayRate(
  currencyCode: CurrencyCode
): Promise<{
  rate: number
  date: Date
  isWeekend: boolean
}> {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('rate, date, is_weekend')
      .eq('currency_code', currencyCode)
      .order('date', { ascending: false })
      .limit(1)

    if (!error && data && data.length > 0) {
      const rate = currencyCode === 'JPY' ? data[0].rate / 100 : data[0].rate
      return {
        rate,
        date: new Date(data[0].date),
        isWeekend: data[0].is_weekend,
      }
    }

    const today = new Date()
    return {
      rate: EXCHANGE_RATES[currencyCode],
      date: today,
      isWeekend: today.getDay() === 0 || today.getDay() === 6,
    }
  } catch (error) {
    console.warn('Failed to fetch latest business day rate, using fallback', error)
    const today = new Date()
    return {
      rate: EXCHANGE_RATES[currencyCode],
      date: today,
      isWeekend: today.getDay() === 0 || today.getDay() === 6,
    }
  }
}
