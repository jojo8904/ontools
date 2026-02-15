import { CurrencyInput, CurrencyResult, CurrencyCode } from '@/types/tools'

// Phase 1: 하드코딩된 기본 환율 (2026-02-15 기준 가상 데이터)
// Phase 2: bkend.ai API 연동 (n8n이 한국수출입은행 API에서 매일 11시 업데이트)
// API 호출 실패 시에도 이 기본값을 폴백으로 사용
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1380, // 미국 달러
  JPY: 9.2, // 일본 엔 (100엔 기준)
  EUR: 1490, // 유로
  CNY: 190, // 중국 위안
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
 *
 * Phase 1: 하드코딩된 EXCHANGE_RATES 사용
 * Phase 2: getAllExchangeRates() API 호출로 대체 (실시간 환율)
 *
 * KRW → 외화: amount / rate
 * 외화 → KRW: amount * rate
 * 외화 → 외화: (amount * fromRate) / toRate
 */
export function convertCurrency(input: CurrencyInput): CurrencyResult {
  const { amount, fromCurrency, toCurrency } = input

  // Phase 1: 하드코딩된 환율 사용
  // Phase 2: const rates = await getAllExchangeRates()로 대체

  // 같은 통화 간 변환
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

  // KRW → 외화
  if (fromCurrency === 'KRW') {
    const targetRate = EXCHANGE_RATES[toCurrency as CurrencyCode]
    rate = targetRate
    // JPY는 100엔 단위이므로 특별 처리
    if (toCurrency === 'JPY') {
      convertedAmount = (amount / targetRate) * 100
    } else {
      convertedAmount = amount / targetRate
    }
  }
  // 외화 → KRW
  else if (toCurrency === 'KRW') {
    const sourceRate = EXCHANGE_RATES[fromCurrency as CurrencyCode]
    rate = sourceRate
    // JPY는 100엔 단위이므로 특별 처리
    if (fromCurrency === 'JPY') {
      convertedAmount = (amount / 100) * sourceRate
    } else {
      convertedAmount = amount * sourceRate
    }
  }
  // 외화 → 외화
  else {
    const sourceRate = EXCHANGE_RATES[fromCurrency as CurrencyCode]
    const targetRate = EXCHANGE_RATES[toCurrency as CurrencyCode]

    // 먼저 KRW로 변환 후 목표 통화로 변환
    let amountInKRW: number
    if (fromCurrency === 'JPY') {
      amountInKRW = (amount / 100) * sourceRate
    } else {
      amountInKRW = amount * sourceRate
    }

    if (toCurrency === 'JPY') {
      convertedAmount = (amountInKRW / targetRate) * 100
    } else {
      convertedAmount = amountInKRW / targetRate
    }

    rate = sourceRate / targetRate
  }

  // 소수점 2자리까지 반올림
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
