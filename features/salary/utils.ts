import { SalaryInput, SalaryResult } from '@/types/tools'

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
  return 14_750_000 + (salary - 100_000_000) * 0.02
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
  hasDisability: boolean
): number {
  // 과세표준 = 총급여 - 근로소득공제 - 인적공제
  const employmentDeduction = getEmploymentDeduction(taxableIncome)
  const basicDeduction = getBasicDeduction(dependents)
  const disabilityDeduction = getDisabilityDeduction(hasDisability)

  const taxBase = Math.max(
    0,
    taxableIncome - employmentDeduction - basicDeduction - disabilityDeduction
  )

  // 누진세율 적용
  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.limit)!
  const tax = Math.max(0, taxBase * bracket.rate - bracket.deduction)

  return Math.floor(tax)
}

// 주민세 (소득세의 10%)
function calculateResidentTax(incomeTax: number): number {
  return Math.floor(incomeTax * 0.1)
}

// 국민연금 (4.5%, 상한 559만원)
function calculateNationalPension(monthlySalary: number): number {
  const maxBase = 5_590_000
  const base = Math.min(monthlySalary, maxBase)
  return Math.floor(base * 0.045)
}

// 건강보험 (3.545%)
function calculateHealthInsurance(monthlySalary: number): number {
  return Math.floor(monthlySalary * 0.03545)
}

// 장기요양보험 (건강보험료의 12.95%)
function calculateLongTermCare(healthInsurance: number): number {
  return Math.floor(healthInsurance * 0.1295)
}

// 고용보험 (0.9%)
function calculateEmploymentInsurance(monthlySalary: number): number {
  return Math.floor(monthlySalary * 0.009)
}

/**
 * 연봉 실수령액 계산 (메인 함수)
 */
export function calculateSalaryTakeHome(input: SalaryInput): SalaryResult {
  const { annualSalary, dependents, hasDisability } = input

  // 월급 (세전)
  const monthlySalary = Math.floor(annualSalary / 12)

  // 소득세 (연간)
  const annualIncomeTax = calculateIncomeTax(
    annualSalary,
    dependents,
    hasDisability
  )
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12)

  // 주민세 (연간)
  const annualResidentTax = calculateResidentTax(annualIncomeTax)
  const monthlyResidentTax = Math.floor(annualResidentTax / 12)

  // 4대보험 (월간)
  const nationalPension = calculateNationalPension(monthlySalary)
  const healthInsurance = calculateHealthInsurance(monthlySalary)
  const longTermCare = calculateLongTermCare(healthInsurance)
  const employmentInsurance = calculateEmploymentInsurance(monthlySalary)

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
  return (result.monthlyTakeHome / result.monthlySalary) * 100
}
