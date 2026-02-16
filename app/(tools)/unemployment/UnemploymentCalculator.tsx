'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type AgeGroup = 'under50' | '50orAbove'

// 2026년 기준
const DAILY_UPPER_LIMIT = 66000
const MIN_WAGE_2026 = 10030
const DAILY_LOWER_LIMIT = Math.floor(MIN_WAGE_2026 * 0.8 * 8) // 64,192원

// 소정급여일수 테이블
const BENEFIT_DAYS: Record<AgeGroup, number[]> = {
  // [1년미만, 1~3년, 3~5년, 5~10년, 10년이상]
  under50: [120, 150, 180, 210, 240],
  '50orAbove': [120, 180, 210, 240, 270],
}

function getInsurancePeriodIndex(years: number): number {
  if (years < 1) return 0
  if (years < 3) return 1
  if (years < 5) return 2
  if (years < 10) return 3
  return 4
}

interface UnemploymentResult {
  dailyWage: number
  dailyBenefit: number
  benefitDays: number
  totalBenefit: number
  appliedLimit: 'upper' | 'lower' | 'none'
}

function calculateUnemployment(
  ageGroup: AgeGroup,
  insuranceYears: number,
  monthlySalary: number
): UnemploymentResult {
  // 퇴직 전 3개월 평균 일급
  const dailyWage = Math.round(monthlySalary / 30)

  // 1일 구직급여 = 일급 x 60%
  let dailyBenefit = Math.round(dailyWage * 0.6)

  let appliedLimit: 'upper' | 'lower' | 'none' = 'none'
  if (dailyBenefit > DAILY_UPPER_LIMIT) {
    dailyBenefit = DAILY_UPPER_LIMIT
    appliedLimit = 'upper'
  } else if (dailyBenefit < DAILY_LOWER_LIMIT) {
    dailyBenefit = DAILY_LOWER_LIMIT
    appliedLimit = 'lower'
  }

  const periodIndex = getInsurancePeriodIndex(insuranceYears)
  const benefitDays = BENEFIT_DAYS[ageGroup][periodIndex]
  const totalBenefit = dailyBenefit * benefitDays

  return {
    dailyWage,
    dailyBenefit,
    benefitDays,
    totalBenefit,
    appliedLimit,
  }
}

export function UnemploymentCalculator() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('under50')
  const [insuranceYears, setInsuranceYears] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [result, setResult] = useState<UnemploymentResult | null>(null)

  const handleCalculate = () => {
    const years = parseFloat(insuranceYears)
    const salary = parseFloat(monthlySalary) * 10000 // 만원 → 원
    if (isNaN(years) || years < 0 || !salary || salary <= 0) return

    setResult(calculateUnemployment(ageGroup, years, salary))
  }

  const handleReset = () => {
    setInsuranceYears('')
    setMonthlySalary('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>실업급여 정보 입력</CardTitle>
          <CardDescription>
            나이, 고용보험 가입기간, 퇴직 전 월 평균임금을 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 나이 구분 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">나이 구분</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAgeGroup('under50')
                  setResult(null)
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  ageGroup === 'under50'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                50세 미만
              </button>
              <button
                onClick={() => {
                  setAgeGroup('50orAbove')
                  setResult(null)
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  ageGroup === '50orAbove'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                50세 이상 / 장애인
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              고용보험 가입기간 (년)
            </label>
            <Input
              type="number"
              step="0.5"
              placeholder="예: 3"
              value={insuranceYears}
              onChange={(e) => setInsuranceYears(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              고용보험 피보험 단위기간 (180일 이상 필요)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              퇴직 전 3개월 월 평균임금 (만원)
            </label>
            <Input
              type="number"
              placeholder="예: 300"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              세전 기준. 기본급 + 고정수당 + 상여금(1/12) 포함
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleCalculate} className="flex-1" size="lg">
              계산하기
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>계산 결과</CardTitle>
            <CardDescription>
              {ageGroup === 'under50' ? '50세 미만' : '50세 이상/장애인'} / 가입기간 {insuranceYears}년 / 월 평균임금 {monthlySalary}만원
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  1일 구직급여
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(result.dailyBenefit)}
                </p>
              </div>
              <div className="bg-violet-50 rounded-lg p-4 text-center">
                <p className="text-xs text-violet-600 font-semibold mb-1">
                  소정급여일수
                </p>
                <p className="text-lg font-bold text-violet-900">
                  {result.benefitDays}일
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">
                  총 예상 수급액
                </p>
                <p className="text-lg font-bold text-emerald-900">
                  {formatCurrency(result.totalBenefit)}
                </p>
              </div>
            </div>

            {result.appliedLimit !== 'none' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                {result.appliedLimit === 'upper'
                  ? `상한액 적용: 1일 구직급여가 상한액(${formatCurrency(DAILY_UPPER_LIMIT)})으로 제한되었습니다.`
                  : `하한액 적용: 1일 구직급여가 하한액(${formatCurrency(DAILY_LOWER_LIMIT)})으로 상향 조정되었습니다.`}
              </div>
            )}

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">퇴직 전 1일 평균임금</span>
                <span className="font-medium">
                  {formatCurrency(result.dailyWage)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">구직급여 산정액 (60%)</span>
                <span className="font-medium">
                  {formatCurrency(Math.round(result.dailyWage * 0.6))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">1일 상한액 / 하한액</span>
                <span className="font-medium">
                  {formatCurrency(DAILY_UPPER_LIMIT)} / {formatCurrency(DAILY_LOWER_LIMIT)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300 font-bold">
                <span>1일 구직급여 (적용 후)</span>
                <span className="text-blue-600">{formatCurrency(result.dailyBenefit)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">소정급여일수</span>
                <span className="font-medium">{result.benefitDays}일</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">월 예상 수급액 (30일 기준)</span>
                <span className="font-medium">
                  {formatCurrency(result.dailyBenefit * 30)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-emerald-700">
                <span>총 예상 수급액</span>
                <span>{formatCurrency(result.totalBenefit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
