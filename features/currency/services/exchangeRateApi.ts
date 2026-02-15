import { bkend } from '@/lib/bkend'
import { EXCHANGE_RATES } from '../utils'
import { CurrencyCode } from '@/types/tools'

/**
 * Phase 1: 하드코딩된 환율 반환
 * Phase 2: bkend.ai ExchangeRate 컬렉션에서 최신 환율 조회
 *
 * @param currencyCode 통화 코드 (USD, JPY, EUR, CNY)
 * @returns 환율 (원화 기준)
 */
export async function getExchangeRate(
  currencyCode: CurrencyCode
): Promise<number> {
  try {
    // Phase 2: bkend.ai API 호출 (현재는 주석 처리)
    /*
    const result = await bkend.data.list('exchange_rates', {
      currency_code: currencyCode,
      sort: '-date', // 최신 날짜 순
      limit: '1',
    })

    if (result.data && result.data.length > 0) {
      return result.data[0].rate
    }
    */

    // Phase 1: 하드코딩된 환율 반환
    // API 호출 실패 시에도 이 폴백 데이터 사용
    return EXCHANGE_RATES[currencyCode]
  } catch (error) {
    console.warn(
      `Failed to fetch exchange rate for ${currencyCode}, using fallback`,
      error
    )
    // API 호출 실패 시 폴백: 하드코딩된 기본 환율
    return EXCHANGE_RATES[currencyCode]
  }
}

/**
 * Phase 2: 전체 환율 목록 조회
 * Phase 1: 하드코딩된 전체 환율 반환
 *
 * @returns 모든 통화의 환율 맵
 */
export async function getAllExchangeRates(): Promise<
  Record<CurrencyCode, number>
> {
  try {
    // Phase 2: bkend.ai API 호출 (현재는 주석 처리)
    /*
    const result = await bkend.data.list('exchange_rates', {
      sort: '-date',
    })

    if (result.data && result.data.length > 0) {
      // 통화별로 최신 환율만 추출
      const rates: Record<string, number> = {}
      const currencies = ['USD', 'JPY', 'EUR', 'CNY']

      for (const currency of currencies) {
        const latestRate = result.data.find((r: any) => r.currency_code === currency)
        if (latestRate) {
          rates[currency] = latestRate.rate
        }
      }

      return rates as Record<CurrencyCode, number>
    }
    */

    // Phase 1: 하드코딩된 환율 반환
    return EXCHANGE_RATES
  } catch (error) {
    console.warn('Failed to fetch all exchange rates, using fallback', error)
    // API 호출 실패 시 폴백
    return EXCHANGE_RATES
  }
}

/**
 * Phase 2: 주말/공휴일 처리 로직
 *
 * 환율 데이터가 주말/공휴일 것인지 확인하고,
 * 최근 영업일 환율을 반환
 */
export async function getLatestBusinessDayRate(
  currencyCode: CurrencyCode
): Promise<{
  rate: number
  date: Date
  isWeekend: boolean
}> {
  try {
    // Phase 2: bkend.ai에서 최근 영업일 환율 조회
    /*
    const today = new Date()
    const result = await bkend.data.list('exchange_rates', {
      currency_code: currencyCode,
      'date[lte]': today.toISOString(),
      sort: '-date',
      limit: '1',
    })

    if (result.data && result.data.length > 0) {
      const latestRate = result.data[0]
      const rateDate = new Date(latestRate.date)
      const isWeekend = today.getDay() === 0 || today.getDay() === 6

      return {
        rate: latestRate.rate,
        date: rateDate,
        isWeekend,
      }
    }
    */

    // Phase 1: 하드코딩된 환율 + 주말 체크
    const today = new Date()
    const isWeekend = today.getDay() === 0 || today.getDay() === 6

    return {
      rate: EXCHANGE_RATES[currencyCode],
      date: today,
      isWeekend,
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
