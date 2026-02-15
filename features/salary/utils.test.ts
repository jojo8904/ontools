import { describe, it, expect } from 'vitest'
import { calculateSalaryTakeHome } from './utils'
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
    expect(result.nationalPension).toBe(251_550) // 상한 적용
  })
})
