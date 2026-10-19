export type Plan = {
  mode: 'package' | 'daily'
  price: number
  billedDays: number
  validity: number
  units: number
  capacity: number
  perUnitExtra: number
  sharedExtra: number
  data: string
  dataBasis: 'daily' | 'total' | 'unknown'
  sharing: 'yes' | 'no' | 'unknown'
}
export const EMPTY_PLAN: Plan = { mode: 'package', price: NaN, billedDays: 5, validity: 5, units: 1, capacity: 1, perUnitExtra: 0, sharedExtra: 0, data: '', dataBasis: 'unknown', sharing: 'unknown' }
export const integer = (value: number, min: number, max: number) => Number.isSafeInteger(value) && value >= min && value <= max
export function validatePlan(p: Plan, people: number, days: number) {
  return integer(people, 1, 100) && integer(days, 1, 365) &&
    ['package', 'daily'].includes(p.mode) && integer(p.price, 0, 100000000) &&
    integer(p.billedDays, 1, 365) && integer(p.validity, 1, 365) && integer(p.units, 1, 100) &&
    integer(p.capacity, 1, 100) && integer(p.perUnitExtra, 0, 100000000) && integer(p.sharedExtra, 0, 100000000) &&
    ['daily', 'total', 'unknown'].includes(p.dataBasis) && ['yes', 'no', 'unknown'].includes(p.sharing)
}
export function calculatePlan(p: Plan, people: number, days: number, shared: boolean) {
  if (!validatePlan(p, people, days)) throw new Error('입력값을 확인하세요.')
  const units = shared ? p.units : people
  // Packages are manually selected; never assume repeat purchases or validity extension.
  const multiplier = p.mode === 'daily' ? p.billedDays : 1
  const service = p.price * multiplier * units
  const extras = p.perUnitExtra * units + p.sharedExtra
  return { units, multiplier, service, extras, total: service + extras, perPerson: (service + extras) / people }
}
export function warnings(p: Plan, people: number, days: number, shared: boolean) {
  const result: string[] = []
  if (p.mode === 'package' && p.validity < days) result.push('패키지 유효기간이 여행보다 짧습니다. 추가 구매 비용은 자동 합산하지 않습니다. 여행 전체를 커버하는 견적을 확인하세요.')
  if (p.mode === 'daily' && p.billedDays !== days) result.push('과금 일수와 여행 일수가 다릅니다. 출국·귀국일, 대여·반납일과 현지 시각 기준을 확인하세요.')
  if (shared && p.units * p.capacity < people) result.push('기기 수 × 기기당 사용 인원이 여행 인원보다 적습니다. 모두 이용할 수 있는 구성인지 확인하세요.')
  if (shared && p.sharing !== 'yes') result.push('포켓와이파이 공유 가능 여부를 확인하세요.')
  if (p.dataBasis === 'unknown' || !p.data.trim()) result.push('데이터 용량·적용 기준이 미확인입니다.')
  return result
}
