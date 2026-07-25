'use client'

import { useState, useMemo } from 'react'

function fullMonthsBetween(a: Date, b: Date): number {
  let m = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  if (b.getDate() < a.getDate()) m -= 1
  return Math.max(0, m)
}

function fmt(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

/** 근속 만 N년차의 연간 연차일수 (근로기준법: 15일 + 2년마다 1일, 최대 25일) */
function annualDays(years: number): number {
  return Math.min(25, 15 + Math.floor((years - 1) / 2))
}

export function AnnualLeaveDaysCalculator() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [joinDate, setJoinDate] = useState('')
  const [baseDate, setBaseDate] = useState(todayStr)

  const result = useMemo(() => {
    if (!joinDate || !baseDate) return null
    const join = new Date(joinDate)
    const base = new Date(baseDate)
    if (isNaN(join.getTime()) || isNaN(base.getTime()) || base < join) return null

    const months = fullMonthsBetween(join, base)
    const years = Math.floor(months / 12)

    if (years < 1) {
      // 1년 미만: 1개월 개근마다 1일 (최대 11일)
      const leave = Math.min(11, months)
      const nextMonthly = new Date(join)
      nextMonthly.setMonth(nextMonthly.getMonth() + months + 1)
      const firstAnniv = new Date(join)
      firstAnniv.setFullYear(firstAnniv.getFullYear() + 1)
      return {
        years,
        months,
        leave,
        detail: `입사 후 ${months}개월 개근 기준, 매월 1일씩 발생`,
        next: months < 11 ? `다음 발생: ${fmt(nextMonthly)} (+1일)` : null,
        anniv: `1년 되는 날(${fmt(firstAnniv)})부터 연 15일 발생`,
      }
    }

    const leave = annualDays(years)
    const lastAnniv = new Date(join)
    lastAnniv.setFullYear(lastAnniv.getFullYear() + years)
    const nextAnniv = new Date(join)
    nextAnniv.setFullYear(nextAnniv.getFullYear() + years + 1)
    return {
      years,
      months,
      leave,
      detail: `근속 만 ${years}년 (${fmt(lastAnniv)} 기준 발생분)`,
      next: `다음 발생: ${fmt(nextAnniv)}에 ${annualDays(years + 1)}일`,
      anniv: null,
    }
  }, [joinDate, baseDate])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">입사일</label>
          <input
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">기준일 (오늘)</label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-gray-600">
            근속 <strong>{result.years}년 {result.months % 12}개월</strong> · {result.detail}
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            연차 {result.leave}일
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            {result.next && <p>· {result.next}</p>}
            {result.anniv && <p>· {result.anniv}</p>}
          </div>
        </div>
      )}

      {!result && joinDate && <p className="text-sm text-red-500">기준일이 입사일보다 빠를 수 없어요.</p>}

      <p className="text-xs text-gray-400">
        근로기준법 기준(1년 미만 월 1일·최대 11일, 1년 이상 15일+2년마다 1일·최대 25일). 개근·주 15시간 이상 근무를 가정하며,
        회계연도 기준으로 운영하는 회사는 실제 부여일이 다를 수 있어요.
      </p>
    </div>
  )
}
