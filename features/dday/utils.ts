/**
 * D-day 계산기
 */

export type DdayMode = 'countdown' | 'between'

export interface CountdownInput {
  targetDate: string
  title: string
}

export interface BetweenInput {
  startDate: string
  endDate: string
}

export interface CountdownResult {
  title: string
  targetDate: string
  dday: number // 양수: D-N (미래), 0: D-Day, 음수: D+N (과거)
  label: string // "D-30", "D-Day", "D+5"
  isPast: boolean
  breakdown: DateBreakdown
}

export interface BetweenResult {
  startDate: string
  endDate: string
  totalDays: number
  breakdown: DateBreakdown
}

export interface DateBreakdown {
  years: number
  months: number
  weeks: number
  days: number
  label: string
}

function daysBetween(a: string, b: string): number {
  const dateA = new Date(a + 'T00:00:00')
  const dateB = new Date(b + 'T00:00:00')
  return Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24))
}

function breakdownDays(totalDays: number): DateBreakdown {
  const abs = Math.abs(totalDays)
  const years = Math.floor(abs / 365)
  const months = Math.floor((abs % 365) / 30)
  const weeks = Math.floor(((abs % 365) % 30) / 7)
  const days = ((abs % 365) % 30) % 7

  const parts: string[] = []
  if (years > 0) parts.push(`${years}년`)
  if (months > 0) parts.push(`${months}개월`)
  if (weeks > 0) parts.push(`${weeks}주`)
  if (days > 0) parts.push(`${days}일`)
  if (parts.length === 0) parts.push('0일')

  return { years, months, weeks, days, label: parts.join(' ') }
}

export function calculateCountdown(input: CountdownInput): CountdownResult {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const diff = daysBetween(todayStr, input.targetDate)

  let label: string
  if (diff > 0) label = `D-${diff}`
  else if (diff === 0) label = 'D-Day'
  else label = `D+${Math.abs(diff)}`

  return {
    title: input.title || '목표일',
    targetDate: input.targetDate,
    dday: diff,
    label,
    isPast: diff < 0,
    breakdown: breakdownDays(diff),
  }
}

export function calculateBetween(input: BetweenInput): BetweenResult {
  const totalDays = daysBetween(input.startDate, input.endDate)

  return {
    startDate: input.startDate,
    endDate: input.endDate,
    totalDays,
    breakdown: breakdownDays(totalDays),
  }
}
