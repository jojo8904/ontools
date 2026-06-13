'use client'

import { useState } from 'react'

export function DiscountCalculator() {
  const [price, setPrice] = useState('')
  const [rate, setRate] = useState('')

  const p = parseFloat(price)
  const r = parseFloat(rate)
  const valid = !isNaN(p) && p >= 0 && !isNaN(r) && r >= 0 && r <= 100
  const saved = valid ? Math.round((p * r) / 100) : null
  const finalPrice = valid && saved !== null ? p - saved : null

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">원가 (원)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="예: 50000"
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">할인율 (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="예: 30"
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          />
        </div>
      </div>

      {finalPrice !== null && saved !== null && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#f4effa] rounded-xl p-6">
            <p className="text-sm text-[#6b6276] mb-1">할인 적용가</p>
            <p className="text-4xl font-bold text-[#2563eb]">{finalPrice.toLocaleString()}원</p>
          </div>
          <div className="flex justify-between text-sm px-2">
            <span className="text-[#999]">할인 금액</span>
            <span className="font-bold text-red-500">-{saved.toLocaleString()}원</span>
          </div>
        </div>
      )}
    </div>
  )
}
