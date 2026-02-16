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

type CalcMode = 'supply' | 'total'
type TaxRate = 10 | 0

interface VatResult {
  supplyAmount: number
  vatAmount: number
  totalAmount: number
  taxRate: number
}

export function VatCalculator() {
  const [mode, setMode] = useState<CalcMode>('supply')
  const [taxRate, setTaxRate] = useState<TaxRate>(10)
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState<VatResult | null>(null)

  const handleCalculate = () => {
    const a = parseFloat(amount)
    if (!a || a <= 0) return

    const rate = taxRate / 100

    if (mode === 'supply') {
      const vatAmount = Math.round(a * rate)
      setResult({
        supplyAmount: a,
        vatAmount,
        totalAmount: a + vatAmount,
        taxRate,
      })
    } else {
      const supplyAmount = Math.round(a / (1 + rate))
      const vatAmount = a - supplyAmount
      setResult({
        supplyAmount,
        vatAmount,
        totalAmount: a,
        taxRate,
      })
    }
  }

  const handleReset = () => {
    setAmount('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>부가세 계산</CardTitle>
          <CardDescription>
            공급가액 또는 합계금액을 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 계산 모드 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">계산 방식</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('supply')
                  setResult(null)
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  mode === 'supply'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                공급가액 → 합계
              </button>
              <button
                onClick={() => {
                  setMode('total')
                  setResult(null)
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  mode === 'total'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                합계 → 공급가액 역산
              </button>
            </div>
          </div>

          {/* 세율 */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">세율</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTaxRate(10)
                  setResult(null)
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  taxRate === 10
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                10% (일반)
              </button>
              <button
                onClick={() => {
                  setTaxRate(0)
                  setResult(null)
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  taxRate === 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                0% (영세율)
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              {mode === 'supply' ? '공급가액 (원)' : '합계금액 (원)'}
            </label>
            <Input
              type="number"
              placeholder="예: 1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {mode === 'supply'
                ? '부가세 별도 금액을 입력하세요'
                : '부가세 포함된 총 금액을 입력하세요'}
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
              {mode === 'supply' ? '공급가액 → 합계' : '합계 → 역산'} / 세율 {result.taxRate}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  공급가액
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(result.supplyAmount)}
                </p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 text-center">
                <p className="text-xs text-rose-600 font-semibold mb-1">
                  부가세 ({result.taxRate}%)
                </p>
                <p className="text-lg font-bold text-rose-900">
                  {formatCurrency(result.vatAmount)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">
                  합계
                </p>
                <p className="text-lg font-bold text-emerald-900">
                  {formatCurrency(result.totalAmount)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">공급가액</span>
                <span className="font-medium">
                  {formatCurrency(result.supplyAmount)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">부가가치세 ({result.taxRate}%)</span>
                <span className="font-medium text-rose-600">
                  +{formatCurrency(result.vatAmount)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-emerald-700">
                <span>합계금액 (공급대가)</span>
                <span>{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
