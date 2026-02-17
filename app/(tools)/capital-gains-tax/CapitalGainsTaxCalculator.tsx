'use client'

import { useState } from 'react'

export function CapitalGainsTaxCalculator() {
  const [salePrice, setSalePrice] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [expenses, setExpenses] = useState('')
  const [holdingYears, setHoldingYears] = useState('')
  const [isMultiHome, setIsMultiHome] = useState(false)
  const [result, setResult] = useState<{
    gain: number
    longTermDeduction: number
    taxableGain: number
    tax: number
    localTax: number
    totalTax: number
  } | null>(null)

  const calculate = () => {
    const sale = parseFloat(salePrice.replace(/,/g, ''))
    const purchase = parseFloat(purchasePrice.replace(/,/g, ''))
    const exp = parseFloat(expenses.replace(/,/g, '')) || 0
    const years = parseFloat(holdingYears) || 0
    if (isNaN(sale) || isNaN(purchase)) return

    const gain = sale - purchase - exp
    if (gain <= 0) {
      setResult({ gain, longTermDeduction: 0, taxableGain: 0, tax: 0, localTax: 0, totalTax: 0 })
      return
    }

    // 장기보유특별공제 (1세대 1주택, 2년 이상 보유)
    let deductionRate = 0
    if (!isMultiHome && years >= 3) {
      deductionRate = Math.min(years * 0.04, 0.40) // 연 4%, 최대 40%  (보유 3년부터)
    }
    const longTermDeduction = Math.floor(gain * deductionRate)
    const taxableGain = gain - longTermDeduction - 2500000 // 기본공제 250만원

    if (taxableGain <= 0) {
      setResult({ gain, longTermDeduction, taxableGain: 0, tax: 0, localTax: 0, totalTax: 0 })
      return
    }

    // 기본세율 적용 (종합소득세율과 동일)
    const brackets = [
      { limit: 14000000, rate: 0.06, ded: 0 },
      { limit: 50000000, rate: 0.15, ded: 1260000 },
      { limit: 88000000, rate: 0.24, ded: 5760000 },
      { limit: 150000000, rate: 0.35, ded: 15440000 },
      { limit: 300000000, rate: 0.38, ded: 19940000 },
      { limit: 500000000, rate: 0.40, ded: 25940000 },
      { limit: 1000000000, rate: 0.42, ded: 35940000 },
      { limit: Infinity, rate: 0.45, ded: 65940000 },
    ]

    let tax = 0
    for (const b of brackets) {
      if (taxableGain <= b.limit) {
        tax = Math.floor(taxableGain * b.rate - b.ded)
        break
      }
    }

    // 다주택 중과세 (2주택 이상 조정대상지역)
    if (isMultiHome) {
      tax = Math.floor(tax * 1.2) // 기본세율 + 20%p 중과 간이 적용
    }

    const localTax = Math.floor(tax * 0.1)
    const totalTax = tax + localTax

    setResult({ gain, longTermDeduction, taxableGain, tax, localTax, totalTax })
  }

  const fmt = (n: number) => n.toLocaleString('ko-KR')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">양도가액 (원)</label>
            <input type="text" value={salePrice} onChange={(e) => setSalePrice(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="매도 가격" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">취득가액 (원)</label>
            <input type="text" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="매수 가격" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">필요경비 (원)</label>
            <input type="text" value={expenses} onChange={(e) => setExpenses(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="중개수수료 등" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보유 기간 (년)</label>
            <input type="number" value={holdingYears} onChange={(e) => setHoldingYears(e.target.value)} placeholder="예: 5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isMultiHome} onChange={(e) => setIsMultiHome(e.target.checked)} className="accent-blue-600" />
          <span className="text-sm text-gray-700">다주택자 (2주택 이상)</span>
        </label>

        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">계산하기</button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">예상 양도소득세 + 지방소득세</p>
              <p className="text-3xl font-bold text-blue-700">{fmt(result.totalTax)}원</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">양도차익</p>
                <p className="text-lg font-semibold text-gray-900">{fmt(result.gain)}원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">장기보유특별공제</p>
                <p className="text-lg font-semibold text-emerald-600">-{fmt(result.longTermDeduction)}원</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
