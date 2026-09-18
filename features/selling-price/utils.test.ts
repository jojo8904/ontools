import { describe, it, expect } from 'vitest'
import { calculateSellingPrice, type PriceInput } from './utils'

const input: PriceInput = {
  cost: 10000,
  packaging: 0,
  shipping: 0,
  advertising: 0,
  fee: 0,
  margin: 20,
  rounding: 1,
}
describe('selling price', () => {
  it('uses revenue margin, not markup', () => {
    expect(calculateSellingPrice(input)).toMatchObject({
      price: 12500,
      profit: 2500,
      actualMargin: 20,
      breakEven: 10000,
    })
  })
  it('includes every cost and rounds up', () => {
    const result = calculateSellingPrice({
      ...input,
      packaging: 500,
      shipping: 3000,
      advertising: 1000,
      fee: 6,
      margin: 25,
      rounding: 100,
    })
    expect(result.costs).toBe(14500)
    expect(result.price).toBe(21100)
    expect(result.actualMargin).toBeGreaterThanOrEqual(25)
    expect(result.profit).toBe(5334)
  })
  it.each([
    { fee: 80, margin: 20 },
    { cost: -1 },
    { cost: NaN },
    { margin: Infinity },
    { rounding: 0 },
    { cost: 0 },
  ])('rejects invalid values %j', (patch) => {
    expect(() => calculateSellingPrice({ ...input, ...patch })).toThrow()
  })
})
