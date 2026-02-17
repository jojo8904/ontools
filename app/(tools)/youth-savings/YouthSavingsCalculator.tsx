'use client'

import { useState } from 'react'

export function YouthSavingsCalculator() {
  const [monthlyPay, setMonthlyPay] = useState('')
  const [months, setMonths] = useState('24')
  const [type, setType] = useState<'2year' | '3year'>('2year')
  const [result, setResult] = useState<{
    myTotal: number
    companySupport: number
    govSupport: number
    totalReceive: number
    profit: number
  } | null>(null)

  const calculate = () => {
    const mp = parseFloat(monthlyPay.replace(/,/g, ''))
    if (isNaN(mp) || mp <= 0) return

    const m = type === '2year' ? 24 : 36
    const myTotal = mp * m

    // 2년형: 기업 800만, 정부 800만 (본인 300만 납입 시)
    // 3년형: 기업 1,800만, 정부 600만 (본인 600만 납입 시)
    let companySupport: number
    let govSupport: number

    if (type === '2year') {
      companySupport = 8000000
      govSupport = 8000000
    } else {
      companySupport = 18000000
      govSupport = 6000000
    }

    const totalReceive = myTotal + companySupport + govSupport
    const profit = companySupport + govSupport

    setResult({ myTotal, companySupport, govSupport, totalReceive, profit })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">유형 선택</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={type === '2year'} onChange={() => setType('2year')} className="accent-blue-600" />
              <span className="text-sm">2년형 (본인 300만)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={type === '3year'} onChange={() => setType('3year')} className="accent-blue-600" />
              <span className="text-sm">3년형 (본인 600만)</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">월 납입금 (원)</label>
          <input type="text" value={monthlyPay} onChange={(e) => setMonthlyPay(e.target.value.replace(/[^0-9,]/g, ''))} placeholder={type === '2year' ? '예: 125,000' : '예: 165,000'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <p className="text-xs text-gray-400 mt-1">{type === '2year' ? '2년형: 월 12.5만원씩 24개월 = 300만원' : '3년형: 월 16.5만원씩 36개월 ≈ 600만원'}</p>
        </div>

        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">계산하기</button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">만기 시 총 수령액</p>
              <p className="text-3xl font-bold text-blue-700">{fmt(result.totalReceive)}원</p>
              <p className="text-sm text-blue-500 mt-1">수익 +{fmt(result.profit)}원</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">본인 납입</p>
                <p className="text-base font-semibold text-gray-900">{fmt(result.myTotal)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">기업 지원</p>
                <p className="text-base font-semibold text-emerald-600">{fmt(result.companySupport)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">정부 지원</p>
                <p className="text-base font-semibold text-blue-600">{fmt(result.govSupport)}원</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
