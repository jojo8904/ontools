import { SalaryInput, SalaryResult } from '@/types/tools'
import { calculateEmployeeInsurance } from '@/lib/korea-policy'

/**
 * 연봉 실수령액 계산기
 * 2026년 세율 및 4대보험료율 기준
 */

// 2026년 소득세율 (과세표준 기준)
const TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
]

// 근로소득공제
function getEmploymentDeduction(salary: number): number {
  if (salary <= 5_000_000) return salary * 0.7
  if (salary <= 15_000_000) return 3_500_000 + (salary - 5_000_000) * 0.4
  if (salary <= 45_000_000) return 7_500_000 + (salary - 15_000_000) * 0.15
  if (salary <= 100_000_000) return 12_000_000 + (salary - 45_000_000) * 0.05
  return Math.min(20_000_000, 14_750_000 + (salary - 100_000_000) * 0.02)
}

// 기본공제 (본인 + 부양가족)
function getBasicDeduction(dependents: number): number {
  return (1 + dependents) * 1_500_000
}

// 장애인공제
function getDisabilityDeduction(hasDisability: boolean): number {
  return hasDisability ? 2_000_000 : 0
}

// 소득세 계산
function calculateIncomeTax(
  taxableIncome: number,
  dependents: number,
  hasDisability: boolean,
  insuranceDeduction: number
): number {
  // 과세표준 = 총급여 - 근로소득공제 - 인적공제
  const employmentDeduction = getEmploymentDeduction(taxableIncome)
  const basicDeduction = getBasicDeduction(dependents)
  const disabilityDeduction = getDisabilityDeduction(hasDisability)

  const taxBase = Math.max(
    0,
    taxableIncome - employmentDeduction - basicDeduction - disabilityDeduction - insuranceDeduction
  )

  // 누진세율 적용
  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.limit)!
  const tax = Math.max(0, taxBase * bracket.rate - bracket.deduction)

  const credit = tax <= 1_300_000 ? tax * 0.55 : 715_000 + (tax - 1_300_000) * 0.3
  const creditCap = taxableIncome <= 33_000_000 ? 740_000
    : taxableIncome <= 70_000_000 ? Math.max(660_000, 740_000 - (taxableIncome - 33_000_000) * 0.008)
    : taxableIncome <= 120_000_000 ? Math.max(500_000, 660_000 - (taxableIncome - 70_000_000) * 0.5)
    : Math.max(200_000, 500_000 - (taxableIncome - 120_000_000) * 0.5)
  return Math.floor(Math.max(0, tax - Math.min(credit, creditCap)))
}

// 주민세 (소득세의 10%)
function calculateResidentTax(incomeTax: number): number {
  return Math.floor(incomeTax * 0.1)
}


/**
 * 연봉 실수령액 계산 (메인 함수)
 */
export function calculateSalaryTakeHome(input: SalaryInput): SalaryResult {
  const { annualSalary, dependents, hasDisability } = input

  // 월급 (세전)
  const monthlySalary = Math.floor(annualSalary / 12)
  const insurance = calculateEmployeeInsurance(monthlySalary, input.policyDate)
  const { nationalPension, healthInsurance, longTermCare, employmentInsurance } = insurance
  const annualInsurance = Object.values(insurance).reduce((sum, n) => sum + n, 0) * 12

  // 소득세 (연간)
  const annualIncomeTax = calculateIncomeTax(
    annualSalary,
    dependents,
    hasDisability,
    annualInsurance
  )
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12)

  // 주민세 (연간)
  const annualResidentTax = calculateResidentTax(annualIncomeTax)
  const monthlyResidentTax = Math.floor(annualResidentTax / 12)

  // 총 공제액 (월간)
  const totalMonthlyDeduction =
    monthlyIncomeTax +
    monthlyResidentTax +
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance

  // 실수령액 (월간)
  const monthlyTakeHome = monthlySalary - totalMonthlyDeduction

  // 실수령액 (연간)
  const yearlyTakeHome = monthlyTakeHome * 12

  return {
    annualSalary,
    monthlySalary,
    monthlyTakeHome,
    yearlyTakeHome,
    incomeTax: monthlyIncomeTax,
    residentTax: monthlyResidentTax,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
  }
}

/**
 * 실수령액 비율 계산
 */
export function calculateTakeHomeRate(result: SalaryResult): number {
  return result.monthlySalary === 0 ? 0 : (result.monthlyTakeHome / result.monthlySalary) * 100
}
