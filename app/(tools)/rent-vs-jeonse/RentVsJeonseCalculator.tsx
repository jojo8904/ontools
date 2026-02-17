'use client'

import { useState } from 'react'

export function RentVsJeonseCalculator() {
  const [jeonseDeposit, setJeonseDeposit] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [rentDeposit, setRentDeposit] = useState('')
  const [investRate, setInvestRate] = useState('3.5')
  const [years, setYears] = useState('2')
  const [result, setResult] = useState<{
    jeonseTotalCost: number
    rentTotalCost: number
    difference: number
    betterOption: string
  } | null>(null)

  const calculate = () => {
    const jd = parseFloat(jeonseDeposit.replace(/,/g, ''))
    const mr = parseFloat(monthlyRent.replace(/,/g, ''))
    const rd = parseFloat(rentDeposit.replace(/,/g, '')) || 0
    const rate = parseFloat(investRate) / 100
    const y = parseFloat(years)
    if (isNaN(jd) || isNaN(mr) || isNaN(y)) return

    // 전세: 기회비용 = 보증금 × 투자수익률 × 기간
    const jeonseOpportunityCost = Math.floor(jd * rate * y)
    const jeonseTotalCost = jeonseOpportunityCost

    // 월세: 총 월세 + (보증금 기회비용)
    const totalRent = Math.floor(mr * 12 * y)
    const rentOpportunityCost = Math.floor(rd * rate * y)
    const rentTotalCost = totalRent + rentOpportunityCost

    const difference = Math.abs(jeonseTotalCost - rentTotalCost)
    const betterOption = jeonseTotalCost <= rentTotalCost ? '전세' : '월세'

    setResult({ jeonseTotalCost, rentTotalCost, difference, betterOption })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 pb-2 border-b">전세 조건</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">전세 보증금 (원)</label>
          <input type="text" value={jeonseDeposit} onChange={(e) => setJeonseDeposit(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="예: 300,000,000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <h3 className="font-semibold text-gray-900 pb-2 border-b pt-2">월세 조건</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월세 보증금 (원)</label>
            <input type="text" value={rentDeposit} onChange={(e) => setRentDeposit(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="예: 30,000,000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월세 (원)</label>
            <input type="text" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="예: 800,000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 pb-2 border-b pt-2">비교 조건</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예상 투자수익률 (%)</label>
            <input type="number" step="0.1" value={investRate} onChange={(e) => setInvestRate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">거주 기간 (년)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">비교하기</button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">유리한 선택</p>
              <p className="text-3xl font-bold text-blue-700">{result.betterOption}</p>
              <p className="text-sm text-blue-500 mt-1">{fmt(result.difference)}원 절약</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">전세 총비용 (기회비용)</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.jeonseTotalCost)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">월세 총비용</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.rentTotalCost)}원</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
