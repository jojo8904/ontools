import { SeveranceInput, SeveranceResult } from '@/types/tools'

/**
 * 퇴직금 계산기
 * 근로기준법 제34조 기준
 * 퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 / 365)
 */

// 두 날짜 사이의 일수 계산
function daysBetween(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function calculateSeverancePay(input: SeveranceInput): SeveranceResult {
  const { startDate, endDate, monthlyAvgWage } = input

  const totalDays = daysBetween(startDate, endDate)
  const totalYears = totalDays / 365

  // 1일 평균임금 = 퇴직 전 3개월 임금총액 / 퇴직 전 3개월 총 일수(보통 90일)
  const dailyAvgWage = Math.floor((monthlyAvgWage * 3) / 90)

  // 퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 / 365)
  const severancePay = Math.floor(dailyAvgWage * 30 * (totalDays / 365))

  return {
    severancePay,
    totalDays,
    totalYears: Math.round(totalYears * 100) / 100,
    dailyAvgWage,
    monthlyAvgWage,
    startDate,
    endDate,
  }
}
