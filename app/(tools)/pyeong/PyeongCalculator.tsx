'use client'

import { useState } from 'react'

const PYEONG_TO_M2 = 3.3057851

export function PyeongCalculator() {
  const [mode, setMode] = useState<'p2m' | 'm2p'>('p2m')
  const [value, setValue] = useState('')

  const num = parseFloat(value)
  const valid = !isNaN(num) && num >= 0
  const converted = !valid
    ? null
    : mode === 'p2m'
    ? num * PYEONG_TO_M2
    : num / PYEONG_TO_M2

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          {([['p2m', '평 → ㎡'], ['m2p', '㎡ → 평']] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                mode === m ? 'bg-[#2563eb] text-white' : 'bg-[#f4effa] text-[#666]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">
            {mode === 'p2m' ? '평수' : '제곱미터(㎡)'}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === 'p2m' ? '예: 34' : '예: 112.4'}
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          />
        </div>
      </div>

      {converted !== null && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm text-center">
          <p className="text-sm text-[#6b6276] mb-1">
            {mode === 'p2m' ? `${num}평` : `${num}㎡`} =
          </p>
          <p className="text-4xl font-bold text-[#2563eb]">
            {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-xl ml-1">{mode === 'p2m' ? '㎡' : '평'}</span>
          </p>
          <p className="text-xs text-[#aaa] mt-3">1평 = 3.3058㎡ 기준</p>
        </div>
      )}
    </div>
  )
}
