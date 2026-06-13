'use client'

import { useState } from 'react'

export function IdealWeightCalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const h = parseFloat(height)
  const valid = !isNaN(h) && h >= 100 && h <= 250

  let standard = 0
  let low = 0
  let high = 0
  let bmi: number | null = null
  let diff = 0

  if (valid) {
    const m = h / 100
    standard = Math.round(m * m * 22 * 10) / 10 // BMI 22 표준체중
    low = Math.round(m * m * 18.5 * 10) / 10
    high = Math.round(m * m * 22.9 * 10) / 10
    const w = parseFloat(weight)
    if (!isNaN(w) && w > 0) {
      bmi = Math.round((w / (m * m)) * 10) / 10
      diff = Math.round((w - standard) * 10) / 10
    }
  }

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">키 (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="예: 170" className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">현재 체중 (kg, 선택)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 68" className={field} />
        </div>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#fff1f4] rounded-xl p-6">
            <p className="text-sm text-[#a85a6e] mb-1">표준 체중 (BMI 22)</p>
            <p className="text-4xl font-bold text-[#e3577f]">{standard}kg</p>
          </div>
          <div className="flex justify-between text-sm px-2">
            <span className="text-[#999]">정상 체중 범위</span>
            <span className="font-bold text-[#241a33]">{low}kg ~ {high}kg</span>
          </div>
          {bmi !== null && (
            <div className="bg-[#faf8fc] rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-[#999]">현재 BMI</span><span className="font-bold text-[#241a33]">{bmi}</span></div>
              <div className="flex justify-between">
                <span className="text-[#999]">표준 체중 대비</span>
                <span className={`font-bold ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-blue-500' : 'text-emerald-600'}`}>
                  {diff > 0 ? `+${diff}kg` : diff < 0 ? `${diff}kg` : '딱 표준'}
                </span>
              </div>
            </div>
          )}
          <p className="text-xs text-[#aaa] text-center">대한비만학회 기준(정상 BMI 18.5~22.9)으로 계산한 참고치입니다.</p>
        </div>
      )}
    </div>
  )
}
