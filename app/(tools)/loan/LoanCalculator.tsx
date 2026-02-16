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

type RepaymentType = 'equal-payment' | 'equal-principal' | 'bullet'

interface LoanResult {
  type: RepaymentType
  label: string
  monthlyPayments: number[] // 월별 상환금
  totalInterest: number
  totalPayment: number
  firstMonthPayment: number
  lastMonthPayment: number
}

function calculateLoan(
  principal: number,
  annualRate: number,
  months: number
): LoanResult[] {
  const monthlyRate = annualRate / 100 / 12
  const results: LoanResult[] = []

  // 1. 원리금균등
  if (monthlyRate === 0) {
    const monthly = principal / months
    results.push({
      type: 'equal-payment',
      label: '원리금균등',
      monthlyPayments: Array(months).fill(monthly),
      totalInterest: 0,
      totalPayment: principal,
      firstMonthPayment: monthly,
      lastMonthPayment: monthly,
    })
  } else {
    const mp =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    const payments: number[] = []
    let remaining = principal
    let totalInterest = 0
    for (let i = 0; i < months; i++) {
      const interest = remaining * monthlyRate
      totalInterest += interest
      const principalPart = mp - interest
      remaining -= principalPart
      payments.push(mp)
    }
    results.push({
      type: 'equal-payment',
      label: '원리금균등',
      monthlyPayments: payments,
      totalInterest,
      totalPayment: principal + totalInterest,
      firstMonthPayment: mp,
      lastMonthPayment: mp,
    })
  }

  // 2. 원금균등
  {
    const monthlyPrincipal = principal / months
    const payments: number[] = []
    let remaining = principal
    let totalInterest = 0
    for (let i = 0; i < months; i++) {
      const interest = remaining * monthlyRate
      totalInterest += interest
      payments.push(monthlyPrincipal + interest)
      remaining -= monthlyPrincipal
    }
    results.push({
      type: 'equal-principal',
      label: '원금균등',
      monthlyPayments: payments,
      totalInterest,
      totalPayment: principal + totalInterest,
      firstMonthPayment: payments[0],
      lastMonthPayment: payments[payments.length - 1],
    })
  }

  // 3. 만기일시
  {
    const monthlyInterest = principal * monthlyRate
    const totalInterest = monthlyInterest * months
    const payments = Array(months - 1)
      .fill(monthlyInterest)
      .concat([monthlyInterest + principal])
    results.push({
      type: 'bullet',
      label: '만기일시',
      monthlyPayments: payments,
      totalInterest,
      totalPayment: principal + totalInterest,
      firstMonthPayment: monthlyInterest,
      lastMonthPayment: monthlyInterest + principal,
    })
  }

  return results
}

export function LoanCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [results, setResults] = useState<LoanResult[] | null>(null)
  const [activeTab, setActiveTab] = useState<RepaymentType>('equal-payment')

  const handleCalculate = () => {
    const p = parseFloat(principal) * 10000 // 만원 → 원
    const r = parseFloat(rate)
    const m = parseInt(years) * 12
    if (!p || p <= 0 || isNaN(r) || r < 0 || !m || m <= 0) return
    setResults(calculateLoan(p, r, m))
  }

  const handleReset = () => {
    setPrincipal('')
    setRate('')
    setYears('')
    setResults(null)
  }

  const activeResult = results?.find((r) => r.type === activeTab)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>대출 정보 입력</CardTitle>
          <CardDescription>대출금액, 이자율, 기간을 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              대출금액 (만원)
            </label>
            <Input
              type="number"
              placeholder="예: 30000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              예: 30000만원 = 3억원
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              연 이자율 (%)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="예: 3.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              대출기간 (년)
            </label>
            <Input
              type="number"
              placeholder="예: 30"
              value={years}
              onChange={(e) => setYears(e.target.value)}
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

      {results && activeResult && (
        <Card>
          <CardHeader>
            <CardTitle>상환 계획</CardTitle>
            <CardDescription>
              {formatCurrency(parseFloat(principal) * 10000)} / 연 {rate}% /{' '}
              {years}년
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
              {results.map((r) => (
                <button
                  key={r.type}
                  onClick={() => setActiveTab(r.type)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === r.type
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  월 상환금{activeResult.type !== 'equal-payment' ? ' (첫 달)' : ''}
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(Math.round(activeResult.firstMonthPayment))}
                </p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 text-center">
                <p className="text-xs text-rose-600 font-semibold mb-1">
                  총 이자
                </p>
                <p className="text-xl font-bold text-rose-900">
                  {formatCurrency(Math.round(activeResult.totalInterest))}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">대출원금</span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(principal) * 10000)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">총 상환금</span>
                <span className="font-medium">
                  {formatCurrency(Math.round(activeResult.totalPayment))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">총 이자</span>
                <span className="font-medium text-rose-600">
                  {formatCurrency(Math.round(activeResult.totalInterest))}
                </span>
              </div>
              {activeResult.type !== 'equal-payment' && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">첫 달 상환금</span>
                    <span className="font-medium">
                      {formatCurrency(Math.round(activeResult.firstMonthPayment))}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">마지막 달 상환금</span>
                    <span className="font-medium">
                      {formatCurrency(Math.round(activeResult.lastMonthPayment))}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Comparison */}
            <div>
              <h4 className="text-sm font-semibold mb-3">상환방식 비교</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-3 font-semibold">방식</th>
                      <th className="text-right py-2 pr-3 font-semibold">월 상환금</th>
                      <th className="text-right py-2 font-semibold">총 이자</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((r) => (
                      <tr
                        key={r.type}
                        className={activeTab === r.type ? 'bg-blue-50/50' : ''}
                      >
                        <td className="py-2 pr-3">{r.label}</td>
                        <td className="py-2 pr-3 text-right font-medium">
                          {r.type === 'equal-payment'
                            ? formatCurrency(Math.round(r.firstMonthPayment))
                            : `${formatCurrency(Math.round(r.firstMonthPayment))} ~ ${formatCurrency(Math.round(r.lastMonthPayment))}`}
                        </td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(Math.round(r.totalInterest))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
