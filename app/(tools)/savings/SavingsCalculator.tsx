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

type ProductType = 'installment' | 'deposit'
type InterestType = 'simple' | 'compound'

const TAX_RATE = 0.154 // 이자소득세 15.4%

interface SavingsResult {
  totalPrincipal: number
  grossInterest: number
  tax: number
  netInterest: number
  grossTotal: number
  netTotal: number
}

function calculateInstallment(
  monthly: number,
  months: number,
  annualRate: number,
  interestType: InterestType
): SavingsResult {
  const totalPrincipal = monthly * months

  let grossInterest = 0

  if (interestType === 'simple') {
    // 단리: 각 회차 납입금에 대해 잔여 개월수만큼 이자
    for (let i = 1; i <= months; i++) {
      const remainMonths = months - i
      grossInterest += monthly * (annualRate / 100) * (remainMonths / 12)
    }
  } else {
    // 복리: 월복리
    const monthlyRate = annualRate / 100 / 12
    let balance = 0
    for (let i = 0; i < months; i++) {
      balance += monthly
      balance += balance * monthlyRate
    }
    grossInterest = balance - totalPrincipal
  }

  const tax = grossInterest * TAX_RATE
  const netInterest = grossInterest - tax

  return {
    totalPrincipal,
    grossInterest,
    tax,
    netInterest,
    grossTotal: totalPrincipal + grossInterest,
    netTotal: totalPrincipal + netInterest,
  }
}

function calculateDeposit(
  principal: number,
  months: number,
  annualRate: number,
  interestType: InterestType
): SavingsResult {
  let grossInterest = 0

  if (interestType === 'simple') {
    grossInterest = principal * (annualRate / 100) * (months / 12)
  } else {
    // 월복리
    const monthlyRate = annualRate / 100 / 12
    grossInterest = principal * (Math.pow(1 + monthlyRate, months) - 1)
  }

  const tax = grossInterest * TAX_RATE
  const netInterest = grossInterest - tax

  return {
    totalPrincipal: principal,
    grossInterest,
    tax,
    netInterest,
    grossTotal: principal + grossInterest,
    netTotal: principal + netInterest,
  }
}

export function SavingsCalculator() {
  const [productType, setProductType] = useState<ProductType>('installment')
  const [interestType, setInterestType] = useState<InterestType>('simple')
  const [amount, setAmount] = useState('')
  const [months, setMonths] = useState('')
  const [rate, setRate] = useState('')
  const [result, setResult] = useState<SavingsResult | null>(null)

  const handleCalculate = () => {
    const a = parseFloat(amount) * 10000 // 만원 → 원
    const m = parseInt(months)
    const r = parseFloat(rate)
    if (!a || a <= 0 || !m || m <= 0 || isNaN(r) || r < 0) return

    if (productType === 'installment') {
      setResult(calculateInstallment(a, m, r, interestType))
    } else {
      setResult(calculateDeposit(a, m, r, interestType))
    }
  }

  const handleReset = () => {
    setAmount('')
    setMonths('')
    setRate('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {productType === 'installment' ? '적금' : '예금'} 정보 입력
          </CardTitle>
          <CardDescription>
            금액, 기간, 이자율을 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 적금/예금 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setProductType('installment')
                setResult(null)
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                productType === 'installment'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              적금
            </button>
            <button
              onClick={() => {
                setProductType('deposit')
                setResult(null)
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                productType === 'deposit'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              예금
            </button>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              {productType === 'installment'
                ? '월 납입액 (만원)'
                : '예치금액 (만원)'}
            </label>
            <Input
              type="number"
              placeholder={
                productType === 'installment' ? '예: 50' : '예: 1000'
              }
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {productType === 'installment'
                ? '예: 50만원 = 월 50만원 납입'
                : '예: 1000만원 = 1천만원 예치'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              저축기간 (개월)
            </label>
            <Input
              type="number"
              placeholder="예: 12"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
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

          {/* 단리/복리 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              이자 계산 방식
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setInterestType('simple')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  interestType === 'simple'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                단리
              </button>
              <button
                onClick={() => setInterestType('compound')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  interestType === 'compound'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                복리 (월복리)
              </button>
            </div>
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
              {productType === 'installment' ? '적금' : '예금'} /{' '}
              {interestType === 'simple' ? '단리' : '월복리'} / 연 {rate}% /{' '}
              {months}개월
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  세전 수령액
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(Math.round(result.grossTotal))}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">
                  세후 수령액
                </p>
                <p className="text-xl font-bold text-emerald-900">
                  {formatCurrency(Math.round(result.netTotal))}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">
                  {productType === 'installment' ? '총 납입원금' : '예치원금'}
                </span>
                <span className="font-medium">
                  {formatCurrency(result.totalPrincipal)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">세전 이자</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(Math.round(result.grossInterest))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">이자소득세 (15.4%)</span>
                <span className="font-medium text-rose-600">
                  -{formatCurrency(Math.round(result.tax))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">세후 이자</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrency(Math.round(result.netInterest))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300 font-bold">
                <span>세전 수령액</span>
                <span>{formatCurrency(Math.round(result.grossTotal))}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-emerald-700">
                <span>세후 수령액</span>
                <span>{formatCurrency(Math.round(result.netTotal))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
