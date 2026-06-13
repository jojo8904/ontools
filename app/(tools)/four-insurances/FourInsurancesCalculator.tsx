'use client'

import { useState } from 'react'

const PENSION_CAP = 6_170_000 // 국민연금 기준소득월액 상한(2025~)

export function FourInsurancesCalculator() {
  const [salary, setSalary] = useState('') // 월급여(원)

  const s = parseFloat(salary)
  const valid = !isNaN(s) && s > 0

  const pension = valid ? Math.floor(Math.min(s, PENSION_CAP) * 0.045) : 0
  const health = valid ? Math.floor(s * 0.03545) : 0
  const care = Math.floor(health * 0.1295)
  const employment = valid ? Math.floor(s * 0.009) : 0
  const total = pension + health + care + employment

  const rows = [
    { label: '국민연금', sub: '4.5%', val: pension },
    { label: '건강보험', sub: '3.545%', val: health },
    { label: '장기요양보험', sub: '건강보험료의 12.95%', val: care },
    { label: '고용보험', sub: '0.9%', val: employment },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2 text-[#333]">월 급여 (세전, 원)</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="예: 3000000"
          className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
        />
        <p className="text-xs text-[#aaa] mt-1">근로자 부담분 기준(2026년 요율). 사업주도 거의 동일하게 부담합니다.</p>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#eef4ff] rounded-xl p-6">
            <p className="text-sm text-[#5a6aa8] mb-1">근로자 부담 합계 (월)</p>
            <p className="text-4xl font-bold text-[#2563eb]">{total.toLocaleString()}원</p>
          </div>
          <div className="space-y-2 text-sm">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-[#666]">{r.label} <span className="text-[#bbb] text-xs">({r.sub})</span></span>
                <span className="font-medium text-[#241a33]">{r.val.toLocaleString()}원</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#aaa]">국민연금은 기준소득월액 상한({PENSION_CAP.toLocaleString()}원)이 적용됩니다. 실제 보험료는 보수월액·정산에 따라 달라질 수 있습니다.</p>
        </div>
      )}
    </div>
  )
}
