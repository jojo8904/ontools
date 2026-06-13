'use client'

import { useState } from 'react'

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('') // 만원
  const [monthly, setMonthly] = useState('') // 만원, 선택
  const [rate, setRate] = useState('') // 연 %
  const [years, setYears] = useState('') // 년

  const p = (parseFloat(principal) || 0) * 10000
  const m = (parseFloat(monthly) || 0) * 10000
  const r = parseFloat(rate)
  const y = parseFloat(years)
  const valid = !isNaN(r) && r >= 0 && !isNaN(y) && y > 0 && (p > 0 || m > 0)

  let future = 0
  let contributed = 0
  if (valid) {
    const i = r / 100 / 12
    const n = y * 12
    const fvPrincipal = p * Math.pow(1 + i, n)
    const fvMonthly = i === 0 ? m * n : m * ((Math.pow(1 + i, n) - 1) / i)
    future = Math.round(fvPrincipal + fvMonthly)
    contributed = p + m * n
  }
  const interest = future - contributed

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">초기 원금 (만원)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="예: 1000" className={field} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">매월 추가 (만원)</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="예: 50" className={field} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">연이율 (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="예: 5" className={field} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">기간 (년)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="예: 10" className={field} />
          </div>
        </div>
        <p className="text-xs text-[#aaa]">월복리 기준으로 계산합니다.</p>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#eef4ff] rounded-xl p-6">
            <p className="text-sm text-[#5a6aa8] mb-1">{years}년 후 예상 금액</p>
            <p className="text-4xl font-bold text-[#2563eb]">{future.toLocaleString()}원</p>
          </div>
          <div className="space-y-1.5 text-sm px-2">
            <div className="flex justify-between"><span className="text-[#999]">총 납입 원금</span><span className="font-medium text-[#241a33]">{contributed.toLocaleString()}원</span></div>
            <div className="flex justify-between"><span className="text-[#999]">이자 수익 (세전)</span><span className="font-bold text-emerald-600">+{interest.toLocaleString()}원</span></div>
          </div>
          <p className="text-xs text-[#aaa]">세전 기준입니다. 실제 이자에는 이자소득세 15.4%가 부과될 수 있습니다.</p>
        </div>
      )}
    </div>
  )
}
