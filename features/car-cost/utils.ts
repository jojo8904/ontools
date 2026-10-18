export type Quote = {
  months: number; annualKm: number; upfront: number; prepaid: number; deposit: number;
  monthly: number; paymentTotal: number | null; insuranceIncluded: boolean; annualInsurance: number;
  taxIncluded: boolean; annualTax: number; monthlyRunning: number;
  returnCost: number; buyout: number; acquisitionCost: number; residual: number; finalDebt: number;
}
export const EMPTY_QUOTE: Quote = {
  months: 36, annualKm: 15000, upfront: 0, prepaid: 0, deposit: 0, monthly: 0, paymentTotal: null,
  insuranceIncluded: false, annualInsurance: 0, taxIncluded: false, annualTax: 0,
  monthlyRunning: 0, returnCost: 0, buyout: 0, acquisitionCost: 0, residual: 0, finalDebt: 0,
}
export function validateQuote(q: Quote): boolean {
  return Object.entries(q).every(([key, value]) => value === null && key === 'paymentTotal' || typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= (key === 'months' ? 120 : 1_000_000_000))) && q.months >= 1
}
export function calculateCost(q: Quote, scenario: 'purchase' | 'return' | 'buyout') {
  if (!validateQuote(q)) throw new Error('기간은 1~120개월, 금액·주행거리는 0 이상의 정수로 입력하세요.')
  const recurring = q.paymentTotal ?? q.monthly * q.months
  const operating = q.monthlyRunning * q.months +
    ((q.insuranceIncluded ? 0 : q.annualInsurance) + (q.taxIncluded ? 0 : q.annualTax)) * q.months / 12
  // Deposit is a cash requirement, not an expense: refunded or credited at settlement.
  const initial = q.upfront + (scenario === 'purchase' ? 0 : q.prepaid)
  const ending = scenario === 'purchase' ? q.finalDebt : scenario === 'return' ? q.returnCost : q.buyout + q.acquisitionCost
  const asset = scenario === 'return' ? 0 : q.residual
  const outflow = initial + q.deposit + recurring + operating + ending
  const net = outflow - q.deposit - asset
  return { cashCost: outflow - q.deposit, initialCash: initial + q.deposit, recurring, operating, ending, asset, depositReturned: q.deposit, outflow, net, monthlyEquivalent: net / q.months }
}
export function comparisonWarnings(quotes: Quote[]) {
  const warnings: string[] = []
  if (new Set(quotes.map(q => q.months)).size > 1) warnings.push('견적 기간이 다릅니다. 동일 기간으로 맞춰야 총비용을 비교할 수 있습니다.')
  if (new Set(quotes.map(q => q.annualKm)).size > 1) warnings.push('연간 주행조건이 다릅니다. 약정거리와 초과 주행 비용을 확인하세요.')
  return warnings
}
