import { CurrencyInput, CurrencyResult, CurrencyCode } from '@/types/tools'
export interface RateQuote {
  rate: number
  asOf: string | null
  source: string
  status: 'live' | 'stale' | 'fallback'
}
export type RateQuotes = Record<CurrencyCode, RateQuote>

// 폴백 환율 (1단위 기준, JPY도 1엔 기준)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1380, // 1 USD = 1380 KRW
  JPY: 9.2, // 1 JPY = 9.2 KRW
  EUR: 1490, // 1 EUR = 1490 KRW
  CNY: 190, // 1 CNY = 190 KRW
}

export const CURRENCY_NAMES: Record<CurrencyCode | 'KRW', string> = {
  KRW: '대한민국 원',
  USD: '미국 달러',
  JPY: '일본 엔',
  EUR: '유로',
  CNY: '중국 위안',
}

/**
 * 주말 여부 확인 (토요일 또는 일요일)
 */
export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = 일요일, 6 = 토요일
}

/**
 * 최종 업데이트 시간 포맷 (한국 시간 기준)
 */
export function getLastUpdatedTime(asOf: string | null = null): string {
  return asOf ? `${new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date(asOf))} 기준 (한국 시간)` : '기준일 미확인 · 참고용 고정 환율'
}

/**
 * 환율 변환 계산
 * 모든 환율은 1단위 기준 (JPY도 1엔 = X원)
 *
 * KRW → 외화: amount / rate
 * 외화 → KRW: amount * rate
 * 외화 → 외화: (amount * fromRate) / toRate
 */
export function convertCurrency(
  input: CurrencyInput,
  rates: Record<CurrencyCode, number> = EXCHANGE_RATES,
  quotes?: RateQuotes
): CurrencyResult {
  const { amount, fromCurrency, toCurrency } = input
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError('금액은 0 이상의 숫자여야 합니다.')
  const relevant = [fromCurrency, toCurrency].filter((c): c is CurrencyCode => c !== 'KRW')
  if (relevant.some((c) => !Number.isFinite(rates[c]) || rates[c] <= 0)) throw new RangeError('유효하지 않은 환율입니다.')
  const metadata = relevant.map((code) => quotes?.[code])
  const status = !quotes || metadata.some((q) => !q || q.status === 'fallback') ? 'fallback'
    : metadata.some((q) => q?.status === 'stale') ? 'stale' : 'live'
  const dates = metadata.map((q) => q?.asOf).filter((d): d is string => Boolean(d)).sort()
  const lastUpdated = status === 'fallback' ? getLastUpdatedTime() : getLastUpdatedTime(dates[0] ?? null)
  const source = [...new Set(metadata.map((q) => q?.source || '참고용 고정 환율'))].join(' / ')

  if (fromCurrency === toCurrency) {
    return {
      amount,
      fromCurrency,
      toCurrency,
      convertedAmount: amount,
      rate: 1,
      lastUpdated,
      status, source,
      isWeekend: isWeekend(),
    }
  }

  let convertedAmount: number
  let rate: number

  if (fromCurrency === 'KRW') {
    const targetRate = rates[toCurrency as CurrencyCode]
    rate = 1 / targetRate
    convertedAmount = amount / targetRate
  } else if (toCurrency === 'KRW') {
    const sourceRate = rates[fromCurrency as CurrencyCode]
    rate = sourceRate
    convertedAmount = amount * sourceRate
  } else {
    const sourceRate = rates[fromCurrency as CurrencyCode]
    const targetRate = rates[toCurrency as CurrencyCode]
    convertedAmount = (amount * sourceRate) / targetRate
    rate = sourceRate / targetRate
  }

  convertedAmount = Math.round(convertedAmount * 100) / 100

  return {
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
    rate,
    lastUpdated,
    status, source,
    isWeekend: isWeekend(),
  }
}

/**
 * 통화 심볼 반환
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    KRW: '₩',
    USD: '$',
    JPY: '¥',
    EUR: '€',
    CNY: '¥',
  }
  return symbols[currency] || ''
}
