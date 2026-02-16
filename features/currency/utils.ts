import { CurrencyInput, CurrencyResult, CurrencyCode } from '@/types/tools'

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
export function getLastUpdatedTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[now.getDay()]

  return `${year}-${month}-${day}(${weekday}) 11:00 기준`
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
  rates: Record<CurrencyCode, number> = EXCHANGE_RATES
): CurrencyResult {
  const { amount, fromCurrency, toCurrency } = input

  if (fromCurrency === toCurrency) {
    return {
      amount,
      fromCurrency,
      toCurrency,
      convertedAmount: amount,
      rate: 1,
      lastUpdated: getLastUpdatedTime(),
      isWeekend: isWeekend(),
    }
  }

  let convertedAmount: number
  let rate: number

  if (fromCurrency === 'KRW') {
    const targetRate = rates[toCurrency as CurrencyCode]
    rate = targetRate
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
    lastUpdated: getLastUpdatedTime(),
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
