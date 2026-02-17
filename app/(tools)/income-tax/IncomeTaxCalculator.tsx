'use client'

import { useState } from 'react'

const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
]

export function IncomeTaxCalculator() {
  const [totalIncome, setTotalIncome] = useState('')
  const [deductions, setDeductions] = useState('')
  const [result, setResult] = useState<{
    taxableIncome: number
    incomeTax: number
    localTax: number
    totalTax: number
    effectiveRate: number
  } | null>(null)

  const calculate = () => {
    const income = parseFloat(totalIncome.replace(/,/g, ''))
    const ded = parseFloat(deductions.replace(/,/g, '')) || 0
    if (isNaN(income) || income <= 0) return

    const taxableIncome = Math.max(0, income - ded)
    let incomeTax = 0

    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= bracket.limit) {
        incomeTax = Math.floor(taxableIncome * bracket.rate - bracket.deduction)
        break
      }
    }

    incomeTax = Math.max(0, incomeTax)
    const localTax = Math.floor(incomeTax * 0.1)
    const totalTax = incomeTax + localTax
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0

    setResult({ taxableIncome, incomeTax, localTax, totalTax, effectiveRate })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">총 수입금액 (원)</label>
          <input
            type="text"
            value={totalIncome}
            onChange={(e) => setTotalIncome(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="예: 50,000,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">필요경비 + 소득공제 합계 (원)</label>
          <input
            type="text"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="예: 15,000,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-400 mt-1">필요경비 + 인적공제 + 연금공제 등 합산액</p>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          계산하기
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-600 mb-1">예상 종합소득세 + 지방소득세</p>
              <p className="text-3xl font-bold text-emerald-700">{fmt(result.totalTax)}원</p>
              <p className="text-sm text-emerald-500 mt-1">실효세율 {result.effectiveRate.toFixed(1)}%</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">과세표준</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.taxableIncome)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">소득세</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.incomeTax)}원</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">지방소득세 (소득세의 10%)</p>
              <p className="text-lg font-semibold text-gray-900">{fmt(result.localTax)}원</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
