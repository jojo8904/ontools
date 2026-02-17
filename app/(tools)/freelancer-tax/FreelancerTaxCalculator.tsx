'use client'

import { useState } from 'react'

export function FreelancerTaxCalculator() {
  const [income, setIncome] = useState('')
  const [result, setResult] = useState<{
    grossIncome: number
    withholdingTax: number // 소득세 3%
    localTax: number // 지방소득세 0.3%
    totalTax: number
    netIncome: number
  } | null>(null)

  const calculate = () => {
    const gross = parseFloat(income.replace(/,/g, ''))
    if (isNaN(gross) || gross <= 0) return

    const withholdingTax = Math.floor(gross * 0.03)
    const localTax = Math.floor(withholdingTax * 0.1)
    const totalTax = withholdingTax + localTax
    const netIncome = gross - totalTax

    setResult({ grossIncome: gross, withholdingTax, localTax, totalTax, netIncome })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">계약 금액 (원)</label>
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="예: 3,000,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
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
              <p className="text-sm text-emerald-600 mb-1">실수령액</p>
              <p className="text-3xl font-bold text-emerald-700">{fmt(result.netIncome)}원</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">소득세 (3%)</p>
                <p className="text-lg font-semibold text-gray-900">-{fmt(result.withholdingTax)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">지방소득세 (0.3%)</p>
                <p className="text-lg font-semibold text-gray-900">-{fmt(result.localTax)}원</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">총 원천징수액 (3.3%)</p>
              <p className="text-lg font-semibold text-red-600">-{fmt(result.totalTax)}원</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
