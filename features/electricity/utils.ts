/**
 * 전기요금 계산기
 * 한국전력 주택용 전기요금 누진제 기준 (2024년)
 */

export type ElectricityMode = 'usage' | 'amount'

// 누진 구간
const TIERS = [
  { limit: 200, basicCharge: 910, rate: 120.0 },
  { limit: 400, basicCharge: 1600, rate: 214.6 },
  { limit: Infinity, basicCharge: 7300, rate: 307.3 },
]

// 기후환경요금 (원/kWh)
const CLIMATE_RATE = 9.0
// 연료비조정요금 (원/kWh)
const FUEL_RATE = 5.0
// 부가가치세율
const VAT_RATE = 0.1
// 전력산업기반기금율
const FUND_RATE = 0.037

export interface ElectricityResult {
  usage: number // kWh
  basicCharge: number // 기본료
  usageCharge: number // 전력량요금
  climateCharge: number // 기후환경요금
  fuelCharge: number // 연료비조정요금
  subtotal: number // 소계 (기본료+전력량+기후+연료)
  vat: number // 부가세
  fund: number // 전력산업기반기금
  total: number // 총 요금
  tier: number // 적용 구간 (1, 2, 3)
  tierBreakdown: TierBreakdown[]
}

export interface TierBreakdown {
  tier: number
  kwh: number
  rate: number
  charge: number
}

// kWh → 요금 계산
export function calculateFromUsage(kwh: number): ElectricityResult {
  // 구간 결정
  let tier = 1
  if (kwh > 400) tier = 3
  else if (kwh > 200) tier = 2

  const basicCharge = TIERS[tier - 1].basicCharge

  // 전력량요금 (누진제 적용)
  const tierBreakdown: TierBreakdown[] = []
  let remaining = kwh
  let usageCharge = 0

  for (let i = 0; i < TIERS.length && remaining > 0; i++) {
    const prevLimit = i === 0 ? 0 : TIERS[i - 1].limit
    const tierKwh = Math.min(remaining, TIERS[i].limit - prevLimit)
    const charge = Math.floor(tierKwh * TIERS[i].rate)

    tierBreakdown.push({
      tier: i + 1,
      kwh: tierKwh,
      rate: TIERS[i].rate,
      charge,
    })

    usageCharge += charge
    remaining -= tierKwh
  }

  const climateCharge = Math.floor(kwh * CLIMATE_RATE)
  const fuelCharge = Math.floor(kwh * FUEL_RATE)
  const subtotal = basicCharge + usageCharge + climateCharge + fuelCharge

  // 부가세 (10원 미만 절사)
  const vat = Math.floor(subtotal * VAT_RATE / 10) * 10
  // 전력산업기반기금 (10원 미만 절사)
  const fund = Math.floor(subtotal * FUND_RATE / 10) * 10

  const total = subtotal + vat + fund

  return {
    usage: kwh,
    basicCharge,
    usageCharge,
    climateCharge,
    fuelCharge,
    subtotal,
    vat,
    fund,
    total,
    tier,
    tierBreakdown,
  }
}

// 금액 → kWh 역계산 (이진 탐색)
export function calculateFromAmount(targetAmount: number): ElectricityResult {
  let low = 0
  let high = 5000
  let bestKwh = 0

  for (let i = 0; i < 50; i++) {
    const mid = Math.floor((low + high) / 2)
    const result = calculateFromUsage(mid)

    if (result.total <= targetAmount) {
      bestKwh = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return calculateFromUsage(bestKwh)
}
