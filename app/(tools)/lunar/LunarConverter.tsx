'use client'

import { useState, useMemo } from 'react'
import KoreanLunarCalendar from 'korean-lunar-calendar'

type Dir = 'toLunar' | 'toSolar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function LunarConverter() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [dir, setDir] = useState<Dir>('toLunar')
  const [date, setDate] = useState(todayStr)
  const [intercalation, setIntercalation] = useState(false)

  const result = useMemo(() => {
    if (!date) return null
    const [y, m, d] = date.split('-').map((v) => parseInt(v, 10))
    if (!y || !m || !d) return null
    const cal = new KoreanLunarCalendar()
    if (dir === 'toLunar') {
      if (!cal.setSolarDate(y, m, d)) return { error: '지원 범위(1000~2050년)를 벗어난 날짜예요.' }
      const lunar = cal.getLunarCalendar()
      const gapja = cal.getKoreanGapja()
      const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()]
      return {
        title: `양력 ${y}년 ${m}월 ${d}일 (${weekday})`,
        main: `음력 ${lunar.year}년 ${lunar.month}월 ${lunar.day}일${lunar.intercalation ? ' (윤달)' : ''}`,
        gapja: `${gapja.year} ${gapja.month} ${gapja.day}`,
      }
    }
    if (!cal.setLunarDate(y, m, d, intercalation)) return { error: '해당 음력 날짜가 없어요. (윤달 여부나 날짜를 확인해 주세요)' }
    const solar = cal.getSolarCalendar()
    const gapja = cal.getKoreanGapja()
    const weekday = WEEKDAYS[new Date(solar.year, solar.month - 1, solar.day).getDay()]
    return {
      title: `음력 ${y}년 ${m}월 ${d}일${intercalation ? ' (윤달)' : ''}`,
      main: `양력 ${solar.year}년 ${solar.month}월 ${solar.day}일 (${weekday})`,
      gapja: `${gapja.year} ${gapja.month} ${gapja.day}`,
    }
  }, [date, dir, intercalation])

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {([['toLunar', '양력 → 음력'], ['toSolar', '음력 → 양력']] as [Dir, string][]).map(([v, l]) => (
          <button
            key={v}
            onClick={() => setDir(v)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${dir === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {dir === 'toLunar' ? '양력 날짜' : '음력 날짜'}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
        {dir === 'toSolar' && (
          <label className="flex cursor-pointer items-center gap-2 pb-3 text-sm text-gray-600">
            <input type="checkbox" checked={intercalation} onChange={(e) => setIntercalation(e.target.checked)} />
            윤달
          </label>
        )}
      </div>

      {result && 'error' in result && <p className="text-sm text-red-500">{result.error}</p>}

      {result && !('error' in result) && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-gray-600">{result.title}</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{result.main}</p>
          <p className="mt-2 text-sm text-gray-600">간지(육십갑자): {result.gapja}</p>
        </div>
      )}

      <p className="text-xs text-gray-400">
        한국 음력(한국천문연구원 기준 데이터) 1000년~2050년 지원. 어르신 생신·제사·명절 날짜 확인에 활용하세요.
      </p>
    </div>
  )
}
