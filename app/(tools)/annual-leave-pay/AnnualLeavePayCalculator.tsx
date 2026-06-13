'use client'

import { useState } from 'react'

export function AnnualLeavePayCalculator() {
  const [dailyWage, setDailyWage] = useState('')
  const [unusedDays, setUnusedDays] = useState('')
  const [result, setResult] = useState<{
    dailyWage: number
    unusedDays: number
    totalPay: number
  } | null>(null)

  const calculate = () => {
    const wage = parseFloat(dailyWage.replace(/,/g, ''))
    const days = parseFloat(unusedDays)
    if (isNaN(wage) || isNaN(days) || wage <= 0 || days <= 0) return

    const totalPay = Math.floor(wage * days)
    setResult({ dailyWage: wage, unusedDays: days, totalPay })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">1일 통상임금 (원)</label>
          <input
            type="text"
            value={dailyWage}
            onChange={(e) => setDailyWage(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="예: 100,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-400 mt-1">월 통상임금 ÷ 209시간 × 8시간 = 1일 통상임금</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">미사용 연차 일수</label>
          <input
            type="number"
            value={unusedDays}
            onChange={(e) => setUnusedDays(e.target.value)}
            placeholder="예: 5"
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
              <p className="text-sm text-emerald-600 mb-1">연차 수당 (세전)</p>
              <p className="text-3xl font-bold text-emerald-700">{fmt(result.totalPay)}원</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">1일 통상임금</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.dailyWage)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">미사용 일수</p>
                <p className="text-lg font-semibold text-gray-900">{result.unusedDays}일</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              연차수당은 <b>근로소득</b>으로 급여에 합산되어 근로소득세가 부과됩니다.
              실제 공제액은 총급여·부양가족 수에 따라 달라지므로(근로소득 간이세액표 적용),
              세후 금액은 연봉 계산기로 전체 급여 기준 확인을 권장합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
