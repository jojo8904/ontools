/**
 * 단위 변환 계산기
 */

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'time'

export interface UnitOption {
  code: string
  label: string
}

export const UNIT_CATEGORIES: Record<UnitCategory, { label: string; units: UnitOption[] }> = {
  length: {
    label: '길이',
    units: [
      { code: 'cm', label: 'cm (센티미터)' },
      { code: 'm', label: 'm (미터)' },
      { code: 'km', label: 'km (킬로미터)' },
      { code: 'inch', label: 'inch (인치)' },
      { code: 'ft', label: 'ft (피트)' },
      { code: 'mile', label: 'mile (마일)' },
    ],
  },
  weight: {
    label: '무게',
    units: [
      { code: 'g', label: 'g (그램)' },
      { code: 'kg', label: 'kg (킬로그램)' },
      { code: 'lb', label: 'lb (파운드)' },
      { code: 'oz', label: 'oz (온스)' },
    ],
  },
  temperature: {
    label: '온도',
    units: [
      { code: 'C', label: '°C (섭씨)' },
      { code: 'F', label: '°F (화씨)' },
    ],
  },
  time: {
    label: '시간',
    units: [
      { code: 'sec', label: '초' },
      { code: 'min', label: '분' },
      { code: 'hr', label: '시간' },
      { code: 'day', label: '일' },
    ],
  },
}

// 기준 단위(m, g, 초)로의 변환 계수
const LENGTH_TO_M: Record<string, number> = {
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  ft: 0.3048,
  mile: 1609.344,
}

const WEIGHT_TO_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  lb: 453.592,
  oz: 28.3495,
}

const TIME_TO_SEC: Record<string, number> = {
  sec: 1,
  min: 60,
  hr: 3600,
  day: 86400,
}

export interface ConversionResult {
  value: number
  fromUnit: string
  toUnit: string
  result: number
  timeBreakdown?: TimeBreakdown
}

export interface TimeBreakdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  label: string
}

function convertViaBase(
  value: number,
  from: string,
  to: string,
  toBase: Record<string, number>
): number {
  return (value * toBase[from]) / toBase[to]
}

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value
  if (from === 'C') return value * 9 / 5 + 32 // C → F
  return (value - 32) * 5 / 9 // F → C
}

export function breakdownSeconds(totalSeconds: number): TimeBreakdown {
  const abs = Math.abs(totalSeconds)
  const days = Math.floor(abs / 86400)
  const hours = Math.floor((abs % 86400) / 3600)
  const minutes = Math.floor((abs % 3600) / 60)
  const seconds = Math.round(abs % 60)

  const parts: string[] = []
  if (days > 0) parts.push(`${days}일`)
  if (hours > 0 || days > 0) parts.push(`${hours}시간`)
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}분`)
  parts.push(`${seconds}초`)

  return {
    days,
    hours,
    minutes,
    seconds,
    label: (totalSeconds < 0 ? '-' : '') + parts.join(' '),
  }
}

export function convertUnit(
  value: number,
  category: UnitCategory,
  from: string,
  to: string
): ConversionResult {
  let result: number

  switch (category) {
    case 'length':
      result = convertViaBase(value, from, to, LENGTH_TO_M)
      break
    case 'weight':
      result = convertViaBase(value, from, to, WEIGHT_TO_G)
      break
    case 'temperature':
      result = convertTemperature(value, from, to)
      break
    case 'time':
      result = convertViaBase(value, from, to, TIME_TO_SEC)
      break
  }

  // 시간 카테고리: 결과를 초로 환산한 breakdown 제공
  let timeBreakdown: TimeBreakdown | undefined
  if (category === 'time') {
    const totalSeconds = value * TIME_TO_SEC[from]
    timeBreakdown = breakdownSeconds(totalSeconds)
  }

  return {
    value,
    fromUnit: from,
    toUnit: to,
    result: Math.round(result * 1_000_000) / 1_000_000,
    timeBreakdown,
  }
}
