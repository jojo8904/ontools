export interface PriceInput {
  cost: number
  packaging: number
  shipping: number
  advertising: number
  fee: number
  margin: number
  rounding: number
}

export function calculateSellingPrice(input: PriceInput) {
  if (
    Object.values(input).some((n) => !Number.isFinite(n) || n < 0) ||
    input.rounding < 1 ||
    input.rounding > 10000
  )
    throw new Error('비용은 0 이상, 올림 단위는 1~10,000원을 입력해 주세요.')
  if (input.fee + input.margin >= 100)
    throw new Error('수수료율과 목표 마진율의 합계는 100% 미만이어야 해요.')
  const costs = input.cost + input.packaging + input.shipping + input.advertising
  if (costs <= 0 || costs > 1e12) throw new Error('합계 비용은 0원 초과, 1조원 이하로 입력해 주세요.')
  const price =
    Math.ceil(costs / (1 - (input.fee + input.margin) / 100) / input.rounding - 1e-9) * input.rounding
  const fees = (price * input.fee) / 100
  const profit = price - fees - costs
  return {
    costs,
    price,
    fees,
    profit,
    actualMargin: (profit / price) * 100,
    breakEven: Math.ceil(costs / (1 - input.fee / 100) - 1e-9),
  }
}
