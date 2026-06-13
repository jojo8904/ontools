'use client'

import { useState } from 'react'

const CYCLE = 90 // 분
const FALL_ASLEEP = 14 // 잠드는 데 걸리는 평균 시간(분)

function fmt(totalMin: number): string {
  const m = ((totalMin % 1440) + 1440) % 1440
  const hh = Math.floor(m / 60)
  const mm = m % 60
  const ampm = hh < 12 ? '오전' : '오후'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${ampm} ${h12}:${String(mm).padStart(2, '0')}`
}

export function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'now'>('wake')
  const [wakeTime, setWakeTime] = useState('07:00')

  // 추천: 5~6주기(7.5~9시간) 우선, 4주기(6시간)까지
  const cycles = [6, 5, 4]

  let results: { label: string; time: string; sub: string }[] = []

  if (mode === 'wake') {
    const [hh, mm] = wakeTime.split(':').map(Number)
    if (!isNaN(hh) && !isNaN(mm)) {
      const wakeMin = hh * 60 + mm
      results = cycles.map((c) => ({
        label: fmt(wakeMin - FALL_ASLEEP - c * CYCLE),
        time: `${(c * CYCLE) / 60}시간 수면`,
        sub: `${c}주기`,
      }))
    }
  } else {
    const now = new Date()
    const startMin = now.getHours() * 60 + now.getMinutes() + FALL_ASLEEP
    results = cycles
      .slice()
      .reverse()
      .map((c) => ({
        label: fmt(startMin + c * CYCLE),
        time: `${(c * CYCLE) / 60}시간 수면`,
        sub: `${c}주기`,
      }))
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="flex gap-2">
          {([['wake', '기상 시각 기준'], ['now', '지금 자면?']] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                mode === m ? 'bg-[#e3577f] text-white' : 'bg-[#fff1f4] text-[#a85a6e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'wake' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">일어날 시각</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#e3a5b8] focus:ring-2 focus:ring-[#fde7ee] transition-all"
            />
          </div>
        )}
        {mode === 'now' && (
          <p className="text-sm text-[#888]">지금 잠자리에 들면 아래 시각에 일어나는 것이 개운합니다 (잠드는 시간 약 14분 반영).</p>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm">
          <p className="text-sm text-[#6b6276] mb-3">
            {mode === 'wake' ? '이 시각에 잠들면 개운해요 👇' : '추천 기상 시각 👇'}
          </p>
          <div className="space-y-2.5">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === 0 ? 'bg-[#fff1f4] border border-[#f8d3de]' : 'bg-[#faf8fc]'}`}
              >
                <span className={`text-xl font-bold ${i === 0 ? 'text-[#e3577f]' : 'text-[#241a33]'}`}>{r.label}</span>
                <span className="text-sm text-[#999]">{r.time} · {r.sub}{i === 0 ? ' ⭐' : ''}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#aaa] mt-3">수면은 약 90분 주기로 이루어집니다. 주기가 끝날 때 일어나면 덜 피곤합니다. 개인차가 있으니 참고용으로 활용하세요.</p>
        </div>
      )}
    </div>
  )
}
