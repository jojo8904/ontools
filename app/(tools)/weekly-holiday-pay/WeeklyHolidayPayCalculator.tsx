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

const MIN_WAGE_2026 = 10030 // 2026년 최저시급

interface PayResult {
  hourlyWage: number
  weeklyWorkHours: number
  weeklyWorkDays: number
  weeklyHolidayHours: number
  weeklyHolidayPay: number
  weeklyBasePay: number
  weeklyTotalPay: number
  monthlyEstimate: number
  isEligible: boolean
}

function calculateWeeklyHolidayPay(
  hourlyWage: number,
  weeklyWorkHours: number,
  weeklyWorkDays: number
): PayResult {
  const isEligible = weeklyWorkHours >= 15

  // 주휴시간 = 1주 소정근로시간 / 40 × 8 (최대 8시간)
  const weeklyHolidayHours = isEligible
    ? Math.min((weeklyWorkHours / 40) * 8, 8)
    : 0
  const weeklyHolidayPay = hourlyWage * weeklyHolidayHours
  const weeklyBasePay = hourlyWage * weeklyWorkHours
  const weeklyTotalPay = weeklyBasePay + weeklyHolidayPay
  // 월 예상 = 주급 × (365 / 7 / 12)
  const monthlyEstimate = weeklyTotalPay * (365 / 7 / 12)

  return {
    hourlyWage,
    weeklyWorkHours,
    weeklyWorkDays,
    weeklyHolidayHours: Math.round(weeklyHolidayHours * 100) / 100,
    weeklyHolidayPay: Math.round(weeklyHolidayPay),
    weeklyBasePay: Math.round(weeklyBasePay),
    weeklyTotalPay: Math.round(weeklyTotalPay),
    monthlyEstimate: Math.round(monthlyEstimate),
    isEligible,
  }
}

export function WeeklyHolidayPayCalculator() {
  const [wage, setWage] = useState('')
  const [hours, setHours] = useState('')
  const [days, setDays] = useState('')
  const [result, setResult] = useState<PayResult | null>(null)

  const handleCalculate = () => {
    const w = parseFloat(wage)
    const h = parseFloat(hours)
    const d = parseInt(days)
    if (!w || w <= 0 || !h || h <= 0 || !d || d <= 0 || d > 7) return

    setResult(calculateWeeklyHolidayPay(w, h, d))
  }

  const handleReset = () => {
    setWage('')
    setHours('')
    setDays('')
    setResult(null)
  }

  const handleMinWage = () => {
    setWage(String(MIN_WAGE_2026))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>근로 정보 입력</CardTitle>
          <CardDescription>
            시급, 주 근무시간, 주 근무일수를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">시급 (원)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="예: 10030"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={handleMinWage}
                className="px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                2026 최저시급
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2026년 최저시급: {MIN_WAGE_2026.toLocaleString()}원
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">주 근무시간</label>
            <Input
              type="number"
              step="0.5"
              placeholder="예: 40"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              주 15시간 이상 근무 시 주휴수당 지급 대상
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">주 근무일수</label>
            <Input
              type="number"
              placeholder="예: 5"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              max="7"
            />
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
              시급 {result.hourlyWage.toLocaleString()}원 / 주 {result.weeklyWorkHours}시간 / {result.weeklyWorkDays}일
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result.isEligible && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                주 15시간 미만 근무로 주휴수당 지급 대상이 아닙니다.
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  주휴수당
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(result.weeklyHolidayPay)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">
                  월 예상 급여
                </p>
                <p className="text-xl font-bold text-emerald-900">
                  {formatCurrency(result.monthlyEstimate)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">시급</span>
                <span className="font-medium">
                  {formatCurrency(result.hourlyWage)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">주 기본급 ({result.weeklyWorkHours}시간)</span>
                <span className="font-medium">
                  {formatCurrency(result.weeklyBasePay)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">주휴시간</span>
                <span className="font-medium">
                  {result.weeklyHolidayHours}시간
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">주휴수당</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(result.weeklyHolidayPay)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300 font-bold">
                <span>주급 (기본급 + 주휴수당)</span>
                <span>{formatCurrency(result.weeklyTotalPay)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-emerald-700">
                <span>월 예상 급여 (주급 x 4.345)</span>
                <span>{formatCurrency(result.monthlyEstimate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
