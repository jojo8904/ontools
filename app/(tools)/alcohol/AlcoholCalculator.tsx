'use client'

import { useState } from 'react'

const DENSITY = 0.7894 // 알코올 밀도 g/ml
const ELIM_PER_HOUR = 0.015 // 시간당 혈중알코올농도 감소(%)

// 술 종류 프리셋 (1잔/1병 기준 순수 알코올 g)
const PRESETS: { label: string; grams: number }[] = [
  { label: '소주 1잔', grams: 50 * 0.17 * DENSITY },
  { label: '소주 1병', grams: 360 * 0.17 * DENSITY },
  { label: '맥주 1잔', grams: 200 * 0.045 * DENSITY },
  { label: '맥주 1캔(500)', grams: 500 * 0.045 * DENSITY },
  { label: '와인 1잔', grams: 150 * 0.12 * DENSITY },
  { label: '위스키 1잔', grams: 40 * 0.4 * DENSITY },
]

function fmtDuration(hours: number): string {
  if (hours <= 0) return '0분'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h > 0 ? `${h}시간 ` : ''}${m}분`
}

export function AlcoholCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [grams, setGrams] = useState(0)

  const w = parseFloat(weight)
  const r = gender === 'male' ? 0.68 : 0.55
  const valid = !isNaN(w) && w > 0 && grams > 0

  let bac = 0
  if (valid) bac = (grams / (w * 1000 * r)) * 100

  const toZero = bac / ELIM_PER_HOUR
  const toLegal = Math.max(0, (bac - 0.03) / ELIM_PER_HOUR) // 면허정지 기준 0.03%

  const btn =
    'px-3 py-2 rounded-xl text-sm font-medium bg-[#fff1f4] text-[#a85a6e] hover:bg-[#fde2e9] transition-colors'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">성별</label>
            <div className="flex gap-2">
              {([['male', '남성'], ['female', '여성']] as const).map(([g, label]) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${gender === g ? 'bg-[#e3577f] text-white' : 'bg-[#fff1f4] text-[#a85a6e]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#333]">체중 (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#e3a5b8] focus:ring-2 focus:ring-[#fde7ee] transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#333]">마신 술 추가</label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setGrams((g) => g + p.grams)} className={btn}>
                + {p.label}
              </button>
            ))}
          </div>
          {grams > 0 && (
            <button onClick={() => setGrams(0)} className="mt-2 text-xs text-[#999] underline">초기화</button>
          )}
        </div>
      </div>

      {valid && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#fff1f4] rounded-xl p-6">
            <p className="text-sm text-[#a85a6e] mb-1">예상 혈중알코올농도</p>
            <p className="text-4xl font-bold text-[#e3577f]">{bac.toFixed(3)}%</p>
            <p className="text-sm mt-2 font-medium">
              {bac >= 0.08 ? '🚫 면허취소 수준' : bac >= 0.03 ? '🚫 면허정지 수준' : '운전 가능 기준 이하(그래도 음주운전 금지)'}
            </p>
          </div>
          <div className="space-y-1.5 text-sm px-2">
            <div className="flex justify-between"><span className="text-[#999]">완전 분해까지(0%)</span><span className="font-bold text-[#241a33]">약 {fmtDuration(toZero)}</span></div>
            <div className="flex justify-between"><span className="text-[#999]">면허정지 기준(0.03%) 이하까지</span><span className="font-bold text-[#241a33]">약 {fmtDuration(toLegal)}</span></div>
          </div>
          <p className="text-xs text-red-500 leading-relaxed">
            ⚠️ 위드마크 공식 기반 <b>추정치</b>입니다. 실제 수치는 체질·공복 여부·간 기능·약물 등에 따라 크게 달라집니다.
            <b> 분해 시간이 지났더라도 절대 음주운전을 하지 마세요.</b> 본 결과는 어떤 경우에도 운전 가능 여부의 판단 근거가 될 수 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
