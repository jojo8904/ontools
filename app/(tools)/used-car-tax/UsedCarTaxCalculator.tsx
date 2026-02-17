'use client'

import { useState } from 'react'

export function UsedCarTaxCalculator() {
  const [price, setPrice] = useState('')
  const [carType, setCarType] = useState<'passenger' | 'commercial'>('passenger')
  const [isDisabled, setIsDisabled] = useState(false)
  const [result, setResult] = useState<{
    acquisitionTax: number
    registrationTax: number
    totalTax: number
  } | null>(null)

  const calculate = () => {
    const p = parseFloat(price.replace(/,/g, ''))
    if (isNaN(p) || p <= 0) return

    // 승용차: 취득세 7%, 상용차: 취득세 5%, 경차: 취득세 4%
    let taxRate = carType === 'passenger' ? 0.07 : 0.05
    if (isDisabled) taxRate = 0 // 장애인 감면

    const acquisitionTax = Math.floor(p * taxRate)
    // 공채 매입비 (지역별 상이, 서울 기준 약 매매가의 ~0.1% 수준으로 간이 적용)
    const registrationTax = Math.floor(p * 0.001)
    const totalTax = acquisitionTax + registrationTax

    setResult({ acquisitionTax, registrationTax, totalTax })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">차량 매매가격 (원)</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="예: 15,000,000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">차량 종류</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={carType === 'passenger'} onChange={() => setCarType('passenger')} className="accent-blue-600" />
              <span className="text-sm">승용차 (7%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={carType === 'commercial'} onChange={() => setCarType('commercial')} className="accent-blue-600" />
              <span className="text-sm">승합/화물 (5%)</span>
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} className="accent-blue-600" />
          <span className="text-sm text-gray-700">장애인 감면 적용</span>
        </label>

        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">계산하기</button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">총 취등록세</p>
              <p className="text-3xl font-bold text-blue-700">{fmt(result.totalTax)}원</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">취득세</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.acquisitionTax)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">공채 매입비 (추정)</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.registrationTax)}원</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
