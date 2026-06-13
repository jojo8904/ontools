'use client'

import { useState } from 'react'

// 주휴수당 포함 월 환산 근로시간 = (주근로시간 + 주휴시간) × (365/12/7)
function monthlyHours(weeklyHours: number): number {
  const weeklyPaid =
    weeklyHours + (weeklyHours >= 15 ? (Math.min(weeklyHours, 40) / 40) * 8 : 0)
  return weeklyPaid * (365 / 12 / 7)
}

export function HourlyWageCalculator() {
  const [mode, setMode] = useState<'h2m' | 'm2h'>('h2m')
  const [value, setValue] = useState('')
  const [weekly, setWeekly] = useState('40')

  const v = parseFloat(value)
  const wh = parseFloat(weekly)
  const valid = !isNaN(v) && v >= 0 && !isNaN(wh) && wh > 0 && wh <= 68
  const mh = valid ? monthlyHours(wh) : 0

  let hourly = 0
  let monthly = 0
  if (valid) {
    if (mode === 'h2m') {
      hourly = v
      monthly = v * mh
    } else {
      monthly = v
      hourly = v / mh
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          {([['h2m', '시급 → 월급'], ['m2h', '월급 → 시급']] as const).map(([m, label]) => (
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
            {mode === 'h2m' ? '시급 (원)' : '월급 (세전, 원)'}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === 'h2m' ? '예: 10030' : '예: 2096270'}
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">주당 근로시간</label>
          <input
            type="number"
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          />
          <p className="text-xs text-[#aaa] mt-1">주 15시간 이상이면 주휴수당이 포함됩니다 (40시간 → 월 약 209시간).</p>
        </div>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#f4effa] rounded-xl p-5">
              <p className="text-sm text-[#6b6276] mb-1">시급</p>
              <p className="text-2xl font-bold text-[#2563eb]">{Math.round(hourly).toLocaleString()}원</p>
            </div>
            <div className="bg-[#f4effa] rounded-xl p-5">
              <p className="text-sm text-[#6b6276] mb-1">월급 (세전)</p>
              <p className="text-2xl font-bold text-[#2563eb]">{Math.round(monthly).toLocaleString()}원</p>
            </div>
          </div>
          <div className="flex justify-between text-sm px-2">
            <span className="text-[#999]">연봉 환산 (세전)</span>
            <span className="font-bold text-[#241a33]">{Math.round(monthly * 12).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm px-2">
            <span className="text-[#999]">월 환산 근로시간</span>
            <span className="font-medium text-[#555]">{mh.toFixed(1)}시간</span>
          </div>
          <p className="text-xs text-[#aaa]">세전 기준이며, 실수령액은 4대보험·세금 공제 후 달라집니다. 정확한 실수령액은 연봉 계산기를 이용하세요.</p>
        </div>
      )}
    </div>
  )
}
