import { describe, it, expect } from 'vitest'
import { calculateSalaryTakeHome, calculateTakeHomeRate } from './utils'
import { SalaryInput } from '@/types/tools'

describe('calculateSalaryTakeHome', () => {
  it('should calculate take-home pay for 30M annual salary', () => {
    const input: SalaryInput = {
      annualSalary: 30_000_000,
      dependents: 0,
      hasDisability: false,
    }

    const result = calculateSalaryTakeHome(input)

    expect(result.annualSalary).toBe(30_000_000)
    expect(result.monthlySalary).toBe(2_500_000)
    expect(result.monthlyTakeHome).toBeGreaterThan(0)
    expect(result.monthlyTakeHome).toBeLessThan(result.monthlySalary)
  })

  it('should apply dependent deduction', () => {
    const input1: SalaryInput = {
      annualSalary: 50_000_000,
      dependents: 0,
      hasDisability: false,
    }

    const input2: SalaryInput = {
      annualSalary: 50_000_000,
      dependents: 2,
      hasDisability: false,
    }

    const result1 = calculateSalaryTakeHome(input1)
    const result2 = calculateSalaryTakeHome(input2)

    // 부양가족이 많을수록 실수령액이 많아야 함 (세금 감소)
    expect(result2.monthlyTakeHome).toBeGreaterThan(result1.monthlyTakeHome)
  })

  it('should apply disability deduction', () => {
    const input1: SalaryInput = {
      annualSalary: 40_000_000,
      dependents: 0,
      hasDisability: false,
    }

    const input2: SalaryInput = {
      annualSalary: 40_000_000,
      dependents: 0,
      hasDisability: true,
    }

    const result1 = calculateSalaryTakeHome(input1)
    const result2 = calculateSalaryTakeHome(input2)

    // 장애인 공제 적용 시 실수령액이 많아야 함
    expect(result2.monthlyTakeHome).toBeGreaterThan(result1.monthlyTakeHome)
  })

  it('should return zero take-home for zero salary', () => {
    const input: SalaryInput = {
      annualSalary: 0,
      dependents: 0,
      hasDisability: false,
    }

    const result = calculateSalaryTakeHome(input)

    expect(result.monthlyTakeHome).toBe(0)
    expect(result.incomeTax).toBe(0)
  })

  it('should calculate correct tax for high salary (1억)', () => {
    const input: SalaryInput = {
      annualSalary: 100_000_000,
      dependents: 0,
      hasDisability: false,
    }

    const result = calculateSalaryTakeHome(input)

    expect(result.monthlySalary).toBe(8_333_333)
    expect(result.incomeTax).toBeGreaterThan(0)
    expect(result.nationalPension).toBe(313_025) // 2026-07 upper bound
  })

  it('applies the 2026-01 pension cap when that policy period is selected', () => {
    const result = calculateSalaryTakeHome({
      annualSalary: 100_000_000,
      dependents: 0,
      hasDisability: false,
      policyDate: '2026-01-01',
    })
    expect(result.nationalPension).toBe(302_575) // 6,370,000 × 4.75%
  })

  it('applies pension and health minimums for a very low salary', () => {
    const result = calculateSalaryTakeHome({ annualSalary: 3_600_000, dependents: 0, hasDisability: false })
    expect(result.monthlySalary).toBe(300_000)
    expect(result.nationalPension).toBe(19_475) // 하한 410,000 × 4.75%
    expect(result.healthInsurance).toBe(10_780) // 300,000 × 3.595%, 10원 절사, 하한 10,080 이상
    expect(result.incomeTax).toBe(0)
    expect(result.monthlyTakeHome).toBeGreaterThan(0)
  })

  it('excludes monthly non-taxable pay from tax and insurance', () => {
    const base = calculateSalaryTakeHome({ annualSalary: 36_000_000, dependents: 0, hasDisability: false })
    const withMeal = calculateSalaryTakeHome({
      annualSalary: 36_000_000,
      dependents: 0,
      hasDisability: false,
      monthlyNonTaxable: 200_000,
    })
    expect(withMeal.monthlySalary).toBe(base.monthlySalary) // 세전 월급은 동일
    expect(withMeal.nationalPension).toBe(133_000) // 2,800,000 × 4.75%
    expect(base.nationalPension).toBe(142_500) // 3,000,000 × 4.75%
    expect(withMeal.incomeTax).toBeLessThan(base.incomeTax)
    expect(withMeal.monthlyTakeHome).toBeGreaterThan(base.monthlyTakeHome)
  })

  it('keeps pension and health minimums when non-taxable pay consumes the whole salary', () => {
    // 코덱스 리뷰 지적: 과세급여 0원이어도 재직자는 보험료 하한 적용
    const result = calculateSalaryTakeHome({
      annualSalary: 2_400_000,
      dependents: 0,
      hasDisability: false,
      monthlyNonTaxable: 200_000,
    })
    expect(result.monthlySalary).toBe(200_000)
    expect(result.nationalPension).toBe(19_475) // 하한 410,000 × 4.75%
    expect(result.healthInsurance).toBe(10_080) // 근로자 부담 하한
    expect(result.longTermCare).toBeGreaterThan(0)
    expect(result.employmentInsurance).toBe(0)
    expect(result.incomeTax).toBe(0)
  })

  it('treats a missing or invalid non-taxable amount as zero', () => {
    const base = calculateSalaryTakeHome({ annualSalary: 36_000_000, dependents: 0, hasDisability: false })
    const nan = calculateSalaryTakeHome({ annualSalary: 36_000_000, dependents: 0, hasDisability: false, monthlyNonTaxable: NaN })
    const negative = calculateSalaryTakeHome({ annualSalary: 36_000_000, dependents: 0, hasDisability: false, monthlyNonTaxable: -50_000 })
    expect(nan).toEqual(base)
    expect(negative).toEqual(base)
  })

  it('truncates withheld income and resident tax to 10 won', () => {
    for (const annualSalary of [25_000_000, 41_230_000, 63_333_333, 99_999_999, 250_000_000]) {
      const result = calculateSalaryTakeHome({ annualSalary, dependents: 1, hasDisability: false })
      expect(result.incomeTax % 10).toBe(0)
      expect(result.residentTax % 10).toBe(0)
    }
  })

  it('keeps take-home pay non-decreasing as salary rises across all brackets', () => {
    let previous = -1
    for (let annualSalary = 0; annualSalary <= 300_000_000; annualSalary += 1_000_000) {
      const result = calculateSalaryTakeHome({ annualSalary, dependents: 0, hasDisability: false })
      expect(result.monthlyTakeHome).toBeGreaterThanOrEqual(previous)
      previous = result.monthlyTakeHome
    }
  })

  it('stays finite and capped at the schema maximum salary', () => {
    const result = calculateSalaryTakeHome({ annualSalary: 100_000_000_000, dependents: 0, hasDisability: false })
    expect(Number.isFinite(result.monthlyTakeHome)).toBe(true)
    expect(result.healthInsurance).toBe(4_591_740) // 근로자 부담 상한
    expect(result.monthlyTakeHome).toBeLessThan(result.monthlySalary)
    expect(result.monthlyTakeHome).toBeGreaterThan(0)
  })

  it('rejects negative or non-finite salaries', () => {
    expect(() => calculateSalaryTakeHome({ annualSalary: -1, dependents: 0, hasDisability: false })).toThrow(RangeError)
    expect(() => calculateSalaryTakeHome({ annualSalary: NaN, dependents: 0, hasDisability: false })).toThrow(RangeError)
  })
})

describe('calculateTakeHomeRate', () => {
  it('returns 0 instead of NaN for a zero salary', () => {
    const result = calculateSalaryTakeHome({ annualSalary: 0, dependents: 0, hasDisability: false })
    expect(calculateTakeHomeRate(result)).toBe(0)
  })

  it('returns a percentage between 0 and 100 for a normal salary', () => {
    const result = calculateSalaryTakeHome({ annualSalary: 50_000_000, dependents: 0, hasDisability: false })
    const rate = calculateTakeHomeRate(result)
    expect(rate).toBeGreaterThan(70)
    expect(rate).toBeLessThan(100)
  })
})
