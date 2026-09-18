import { daysBetween, parseDate, shiftMonth } from '@/lib/civil-date'

export interface ExitScenario {
  end: string
  wages: number
  bonus: number
  priorLeavePay: number
  ordinaryDaily: number
  remainingLeave: number
}

export function compareExit(start: string, input: ExitScenario, eligibleHours: boolean) {
  const tenure = daysBetween(start, input.end)
  if (tenure <= 0) throw new Error('퇴직일은 입사일 이후여야 해요.')
  const amounts = [input.wages, input.bonus, input.priorLeavePay, input.ordinaryDaily, input.remainingLeave]
  if (amounts.some((n) => !Number.isFinite(n) || n < 0 || n > 1e12) || input.remainingLeave > 366)
    throw new Error('임금과 연차는 유효한 0 이상의 수를 입력해 주세요. 연차는 366일 이하여야 해요.')
  const periodStart = shiftMonth(input.end, -3)
  const periodDays = daysBetween(periodStart, input.end)
  const daily = (input.wages + (input.bonus + input.priorLeavePay) / 4) / periodDays
  const anniversary = parseDate(start)
  anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1)
  const eligible = eligibleHours && parseDate(input.end) >= anniversary
  const severance = eligible ? Math.floor((Math.max(daily, input.ordinaryDaily) * 30 * tenure) / 365) : 0
  const leavePay = Math.floor(input.remainingLeave * input.ordinaryDaily)
  return {
    tenure,
    periodStart,
    periodDays,
    daily,
    eligible,
    severance,
    leavePay,
    total: severance + leavePay,
  }
}
