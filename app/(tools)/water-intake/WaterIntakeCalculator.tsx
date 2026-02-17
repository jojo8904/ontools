'use client'

import { useState } from 'react'

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate')
  const [result, setResult] = useState<{
    baseIntake: number
    recommended: number
    cups: number
  } | null>(null)

  const calculate = () => {
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) return

    // 기본: 체중(kg) × 30ml
    const baseIntake = Math.round(w * 30)

    const multiplier = activity === 'low' ? 1.0 : activity === 'moderate' ? 1.2 : 1.5
    const recommended = Math.round(baseIntake * multiplier)
    const cups = Math.round(recommended / 250) // 1컵 = 250ml

    setResult({ baseIntake, recommended, cups })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 70" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">활동량</label>
          <div className="flex gap-3">
            {[
              { value: 'low' as const, label: '낮음 (좌식)' },
              { value: 'moderate' as const, label: '보통 (주 3~4회 운동)' },
              { value: 'high' as const, label: '높음 (매일 운동)' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={activity === opt.value} onChange={() => setActivity(opt.value)} className="accent-rose-500" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={calculate} className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors">계산하기</button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-rose-50 rounded-lg p-4">
              <p className="text-sm text-rose-600 mb-1">하루 권장 물 섭취량</p>
              <p className="text-3xl font-bold text-rose-700">{result.recommended.toLocaleString()}ml</p>
              <p className="text-sm text-rose-500 mt-1">약 {result.cups}컵 (250ml 기준)</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">기본 섭취량 (체중 × 30ml)</p>
              <p className="text-lg font-semibold text-gray-900">{result.baseIntake.toLocaleString()}ml</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
