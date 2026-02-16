import { ToolId } from './news'

export interface ToolMetadata {
  id: ToolId
  name: string
  description: string
  icon: string
  path: string
  category: 'finance' | 'health' | 'utility'
}

export interface SalaryInput {
  annualSalary: number // 연봉 (원)
  dependents: number // 부양가족 수
  hasDisability: boolean // 장애인 여부
}

export interface SalaryResult {
  annualSalary: number // 연봉
  monthlySalary: number // 월급 (세전)
  monthlyTakeHome: number // 실수령액
  yearlyTakeHome: number // 연 실수령액
  incomeTax: number // 소득세
  residentTax: number // 주민세
  nationalPension: number // 국민연금
  healthInsurance: number // 건강보험
  longTermCare: number // 장기요양
  employmentInsurance: number // 고용보험
}

export interface ExchangeRate {
  id: string
  currency_code: string
  rate: number
  date: string
  is_weekend: boolean
  created_at: string
}

export interface ExchangeRateDisplay {
  rate: number
  displayDate: string // "2026-02-14(금)" 형식
  updateTime: string // "11:00" 또는 "최종 업데이트: 02-14(금) 11시"
  isWeekend: boolean // 주말/공휴일 여부
}

export type CurrencyCode = 'USD' | 'JPY' | 'EUR' | 'CNY'

export interface CurrencyInput {
  amount: number
  fromCurrency: 'KRW' | CurrencyCode
  toCurrency: 'KRW' | CurrencyCode
}

export interface CurrencyResult {
  amount: number
  fromCurrency: string
  toCurrency: string
  convertedAmount: number
  rate: number
  lastUpdated: string
  isWeekend: boolean
}

export type BmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'
  | 'severe_obese'

export interface BmiInput {
  height: number // 신장 (cm)
  weight: number // 체중 (kg)
}

export interface BmiResult {
  height: number // 신장 (cm)
  weight: number // 체중 (kg)
  bmi: number // BMI 지수
  category: BmiCategory // 체중 분류 (한국 기준)
  categoryLabel: string // 분류 라벨 (한국어)
  categoryWho: BmiCategory // WHO 국제 기준 분류
  categoryWhoLabel: string // WHO 기준 라벨
  healthStatus: string // 건강 상태 설명
  recommendation: string // 권장사항
}
