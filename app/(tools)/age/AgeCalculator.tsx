'use client'

import { useState } from 'react'

function calcAge(birth: Date, today: Date) {
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  const yearAge = today.getFullYear() - birth.getFullYear() // 연 나이 (출생연도 기준)
  const daysLived = Math.floor((today.getTime() - birth.getTime()) / 86400000)

  // 다음 생일까지 D-day
  const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBday.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
    nextBday.setFullYear(today.getFullYear() + 1)
  }
  const dDay = Math.round(
    (nextBday.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000
  )
  return { age, yearAge, daysLived, dDay }
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<ReturnType<typeof calcAge> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    if (!birthDate) {
      setError('생년월일을 입력해주세요')
      setResult(null)
      return
    }
    const birth = new Date(birthDate + 'T00:00:00')
    const today = new Date()
    if (isNaN(birth.getTime()) || birth.getTime() > today.getTime()) {
      setError('올바른 생년월일을 입력해주세요 (미래 날짜 불가)')
      setResult(null)
      return
    }
    setError(null)
    setResult(calcAge(birth, today))
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2 text-[#333]">생년월일</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#e8e2f0] focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
        />
        {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
        <button
          onClick={calculate}
          className="mt-4 w-full py-3 rounded-xl bg-[#2563eb] text-white font-bold hover:bg-[#1d4ed8] transition-colors"
        >
          나이 계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 shadow-sm space-y-4">
          <div className="text-center bg-[#f4effa] rounded-xl p-6">
            <p className="text-sm text-[#6b6276] mb-1">만 나이</p>
            <p className="text-5xl font-bold text-[#2563eb]">{result.age}<span className="text-2xl ml-1">세</span></p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-[#faf8fc] rounded-xl p-3">
              <p className="text-[#999] mb-1">연 나이</p>
              <p className="font-bold text-[#241a33]">{result.yearAge}세</p>
            </div>
            <div className="bg-[#faf8fc] rounded-xl p-3">
              <p className="text-[#999] mb-1">살아온 날</p>
              <p className="font-bold text-[#241a33]">{result.daysLived.toLocaleString()}일</p>
            </div>
            <div className="bg-[#faf8fc] rounded-xl p-3">
              <p className="text-[#999] mb-1">다음 생일</p>
              <p className="font-bold text-[#241a33]">{result.dDay === 0 ? '오늘🎂' : `D-${result.dDay}`}</p>
            </div>
          </div>
          <p className="text-xs text-[#aaa] text-center">
            2023년 6월부터 법적·사회적 나이는 &lsquo;만 나이&rsquo;로 통일되었습니다.
          </p>
        </div>
      )}
    </div>
  )
}
