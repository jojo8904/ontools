import { calculateFromUsage } from './utils'

export interface HeaterInput { baseline: number; watts: number; hours: number; days: number; duty: number; budget: number }
export function calculateHeater(input: HeaterInput) {
  const { baseline, watts, hours, days, duty, budget } = input
  if (!Object.values(input).every(Number.isFinite) || baseline < 0 || baseline > 1000 || watts < 1 || watts > 10000 || hours < 0 || hours > 24 || days < 1 || days > 31 || !Number.isInteger(days) || duty < 1 || duty > 100 || budget < 0) throw new RangeError('입력 범위를 확인해주세요. 소비전력 1~10,000W, 하루 0~24시간, 1~31일, 가동률 1~100%를 지원합니다.')
  const before = calculateFromUsage(baseline)
  const dailyKwh = watts / 1000 * duty / 100
  const added = dailyKwh * hours * days
  if (baseline + added > 1000) throw new RangeError('난방기 포함 합계가 1,000kWh를 초과합니다. 지원 범위 밖의 요금은 계산하지 않습니다.')
  const after = calculateFromUsage(baseline + added)
  // Fractional kWh and tariff jumps require checking the actual bill at every step.
  // Search whole minutes, rounding down so displayed hours never exceed the budget.
  let low = 0, high = Math.floor(Math.min(24 * days, (1000 - baseline) / dailyKwh) * 60)
  const maxMinutes = high
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (calculateFromUsage(baseline + dailyKwh * mid / 60).total - before.total <= budget) low = mid
    else high = mid - 1
  }
  return { before, after, added, incremental: after.total - before.total, budgetMinutes: low, capped: low === maxMinutes }
}
