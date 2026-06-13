'use client'

import { useState } from 'react'

function parseDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function fmt(d: Date): string {
  const wd = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${wd})`
}

export function DateCalcCalculator() {
  const [mode, setMode] = useState<'between' | 'add'>('between')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [baseDate, setBaseDate] = useState('')
  const [days, setDays] = useState('')

  const field =
    'w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all'

  let result: { main: string; sub?: string } | null = null
  if (mode === 'between') {
    const s = parseDate(start)
    const e = parseDate(end)
    if (s && e) {
      const diff = Math.round((e.getTime() - s.getTime()) / 86400000)
      result = { main: `${Math.abs(diff).toLocaleString()}일`, sub: `양 끝 포함 시 ${(Math.abs(diff) + 1).toLocaleString()}일` }
    }
  } else {
    const b = parseDate(baseDate)
    const n = parseInt(days, 10)
    if (b && !isNaN(n)) {
      const target = new Date(b.getTime() + n * 86400000)
      result = { main: fmt(target), sub: `${b.getMonth() + 1}/${b.getDate()} 기준 ${n >= 0 ? `${n}일 후` : `${-n}일 전`}` }
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          {([['between', '날짜 사이 일수'], ['add', '며칠 후/전']] as const).map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${mode === m ? 'bg-[#2563eb] text-white' : 'bg-[#f4effa] text-[#666]'}`}>
              {label}
            </button>
          ))}
        </div>
        {mode === 'between' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">시작일</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">종료일</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={field} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">기준일</label>
              <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#333]">일수 (음수=이전)</label>
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="예: 100 또는 -30" className={field} />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-[#2563eb]">{result.main}</p>
          {result.sub && <p className="text-sm text-[#999] mt-2">{result.sub}</p>}
        </div>
      )}
    </div>
  )
}
