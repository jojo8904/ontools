'use client'

import { useState } from 'react'

function fmt(d: Date): string {
  const wd = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${wd})`
}

export function DueDateCalculator() {
  const [lmp, setLmp] = useState('') // 마지막 생리 시작일

  const start = lmp ? new Date(lmp + 'T00:00:00') : null
  const valid = start && !isNaN(start.getTime())

  let due: Date | null = null
  let weeks = 0
  let days = 0
  let dday = 0
  if (valid) {
    due = new Date(start.getTime() + 280 * 86400000) // 네겔레 법칙: LMP + 280일
    const today = new Date()
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const elapsed = Math.floor((t0.getTime() - start.getTime()) / 86400000)
    if (elapsed >= 0) {
      weeks = Math.floor(elapsed / 7)
      days = elapsed % 7
    }
    dday = Math.round((due.getTime() - t0.getTime()) / 86400000)
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2 text-[#333]">마지막 생리 시작일 (LMP)</label>
        <input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#e3a5b8] focus:ring-2 focus:ring-[#fde7ee] transition-all"
        />
        <p className="text-xs text-[#aaa] mt-1">출산예정일은 마지막 생리 시작일 + 280일(40주)로 계산합니다(네겔레 법칙).</p>
      </div>

      {valid && due && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#fff1f4] rounded-xl p-6">
            <p className="text-sm text-[#a85a6e] mb-1">출산 예정일</p>
            <p className="text-3xl font-bold text-[#e3577f]">{fmt(due)}</p>
            {dday >= 0 ? (
              <p className="text-sm text-[#a85a6e] mt-2">D-{dday}</p>
            ) : (
              <p className="text-sm text-[#a85a6e] mt-2">예정일이 지났어요 (D+{-dday})</p>
            )}
          </div>
          <div className="bg-[#faf8fc] rounded-xl p-4 text-center">
            <p className="text-sm text-[#999] mb-1">현재 임신 주수</p>
            <p className="text-xl font-bold text-[#241a33]">임신 {weeks}주 {days}일</p>
          </div>
          <p className="text-xs text-[#aaa]">평균 주기(28일) 기준 추정치입니다. 실제 예정일은 초음파 검사 등 의료진 진단을 따르세요.</p>
        </div>
      )}
    </div>
  )
}
