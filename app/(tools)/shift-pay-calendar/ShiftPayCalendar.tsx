'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  NumberField,
  ErrorMessage,
  IconButton,
  panelClass,
  fieldClass,
} from '@/components/tools/WorkflowFields'
import { calculateShift, validateShiftOverlap, type Shift } from '@/features/shift-pay/utils'
import { localToday, parseDate, addDays, shiftMonth } from '@/lib/civil-date'
import { KOREA_POLICY } from '@/lib/korea-policy'
import { exportTable } from '@/lib/spreadsheet'
import { downloadBlob } from '@/lib/useObjectUrls'
import { trackToolEvent } from '@/lib/analytics'

const blank = (date: string): Shift => ({
  date,
  start: '09:00',
  end: '18:00',
  breakStart: '12:00',
  breakMinutes: 60,
  holiday: false,
})

export function ShiftPayCalendar() {
  const [month, setMonth] = useState(() => localToday().slice(0, 7))
  const [draft, setDraft] = useState(() => blank(localToday()))
  const [shifts, setShifts] = useState<Shift[]>([])
  const [wage, setWage] = useState<number>(KOREA_POLICY.minimumWage)
  const [premiums, setPremiums] = useState(true)
  const [extras, setExtras] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const first = `${month}-01`
  const nextMonth = shiftMonth(first, 1)
  const offset = (parseDate(first).getUTCDay() + 6) % 7
  const count = Math.round((parseDate(nextMonth).getTime() - parseDate(first).getTime()) / 86400000)
  const current = shifts.filter((s) => s.date.startsWith(month)).sort((a, b) => a.date.localeCompare(b.date))
  const extra = extras[month] ?? 0
  let calculationError = ''
  let rows: { shift: Shift; pay: ReturnType<typeof calculateShift> }[] = []
  try {
    if (!Number.isFinite(extra) || extra < 0 || extra > 744)
      throw new Error('별도 주 연장시간은 0~744시간이어야 해요.')
    rows = current.map((shift) => ({ shift, pay: calculateShift(shift, wage, premiums) }))
  } catch (e) {
    calculationError = (e as Error).message
  }
  const weeklyExtra = premiums && !calculationError ? extra * wage * 0.5 : 0
  const total = rows.reduce((sum, r) => sum + r.pay.total, weeklyExtra)
  function selectDate(date: string) {
    setDraft(shifts.find((s) => s.date === date) ?? blank(date))
    setError('')
  }
  function changeMonth(delta: number) {
    const date = shiftMonth(first, delta)
    setMonth(date.slice(0, 7))
    selectDate(date)
  }
  return (
    <div className="space-y-5">
      <div className={panelClass}>
        <NumberField label="통상 시급 (원)" value={wage} min={1} max={1e7} onChange={setWage} />
        <label className="flex gap-2 items-start text-sm">
          <input
            type="checkbox"
            checked={premiums}
            onChange={(e) => setPremiums(e.target.checked)}
            className="mt-1"
          />
          상시 5인 이상 사업장 (연장·야간·휴일 가산 적용)
        </label>
      </div>
      <section aria-label="근무 달력" className="space-y-3">
        <div className="flex items-center justify-between">
          <IconButton label="이전 달" onClick={() => changeMonth(-1)}>
            <ChevronLeft size={18} />
          </IconButton>
          <h2 className="text-lg font-bold">{month.replace('-', '년 ')}월</h2>
          <IconButton label="다음 달" onClick={() => changeMonth(1)}>
            <ChevronRight size={18} />
          </IconButton>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
          {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }, (_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const date = addDays(first, i)
            const shift = shifts.find((s) => s.date === date)
            return (
              <button
                type="button"
                key={date}
                aria-label={`${date}${shift ? ' 근무 있음' : ''}`}
                aria-pressed={draft.date === date}
                onClick={() => selectDate(date)}
                className={`flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-md border text-sm ${draft.date === date ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white'} ${shift?.holiday ? 'text-red-600' : ''}`}
              >
                <span>{i + 1}</span>
                <span className="h-4 text-[10px] leading-4">{shift ? shift.start : ''}</span>
              </button>
            )
          })}
        </div>
      </section>
      <form
        className={panelClass}
        onSubmit={(event) => {
          event.preventDefault()
          try {
            calculateShift(draft, wage, premiums)
            const next = [...shifts.filter((s) => s.date !== draft.date), { ...draft }]
            validateShiftOverlap(next)
            setShifts(next)
            setError('')
            trackToolEvent('calculation_complete', '/shift-pay-calendar')
          } catch (e) {
            setError((e as Error).message)
          }
        }}
      >
        <h2 className="text-base font-bold">{draft.date} 근무</h2>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ['start', '출근'],
              ['end', '퇴근'],
              ['breakStart', '휴게 시작'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="min-w-0 text-sm font-medium">
              {label}
              <input
                className={`${fieldClass} mt-1.5`}
                type="time"
                required
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              />
            </label>
          ))}
          <NumberField
            label="무급 휴게 (분)"
            value={draft.breakMinutes}
            step={1}
            max={1439}
            onChange={(value) => setDraft({ ...draft, breakMinutes: value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.holiday}
            onChange={(e) => setDraft({ ...draft, holiday: e.target.checked })}
          />
          이 근무는 휴일근로
        </label>
        <ErrorMessage error={error} />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 gap-2">
            <Save size={18} />
            근무 저장
          </Button>
          <IconButton
            label="선택일 근무 삭제"
            disabled={!shifts.some((s) => s.date === draft.date)}
            onClick={() => {
              setShifts(shifts.filter((s) => s.date !== draft.date))
              setDraft(blank(draft.date))
              setError('')
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </div>
      </form>
      <div className="space-y-3">
        <NumberField
          label="별도 주 40시간 초과분 (시간)"
          value={extra}
          max={744}
          onChange={(value) => setExtras({ ...extras, [month]: value })}
        />
        <p className="text-xs text-gray-500 leading-relaxed">
          일 8시간 초과분·휴일 가산과 겹치지 않는 주 연장시간만 입력합니다. 주 40시간 초과 여부와 주휴수당은
          자동 계산하지 않습니다. 야간은 22~06시, 휴게 1구간을 제외하며 자정을 넘긴 근무는 출근일에 전액
          집계합니다. 탄력·선택근로제, 단시간근로 특례, 휴일 경계가 바뀌는 근무는 별도 확인이 필요합니다.
        </p>
      </div>
      <ErrorMessage error={calculationError} />
      {rows.length > 0 && !calculationError && (
        <section className={panelClass} aria-label="월 급여 예상">
          <h2 className="text-lg font-bold">저장된 근무 기준 · 세전 예상액</h2>
          <p className="text-3xl font-bold text-blue-600 break-all">
            {Math.round(total).toLocaleString('ko-KR')}원
          </p>
          <dl className="space-y-2 text-sm">
            {[
              ['근무일', `${rows.length}일`],
              ['실근로', `${(rows.reduce((sum, r) => sum + r.pay.worked, 0) / 60).toFixed(2)}시간`],
              ['기본급', rows.reduce((sum, r) => sum + r.pay.basic, 0)],
              ['일 연장 가산', rows.reduce((sum, r) => sum + r.pay.dailyExtra, 0)],
              ['야간 가산', rows.reduce((sum, r) => sum + r.pay.nightExtra, 0)],
              ['휴일 가산', rows.reduce((sum, r) => sum + r.pay.holidayExtra, 0)],
              ['별도 주 연장 가산', weeklyExtra],
            ].map(([label, value]) => (
              <div className="flex justify-between gap-3" key={label}>
                <dt className="text-gray-500">{label}</dt>
                <dd>{typeof value === 'number' ? `${Math.round(value).toLocaleString()}원` : value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-gray-500">
            주휴·유급휴일 자체 임금, 세금·보험료 제외. 새로고침하면 기록이 사라집니다.
          </p>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              downloadBlob(
                new Blob(
                  [
                    exportTable([
                      [
                        '출근일',
                        '출근',
                        '퇴근',
                        '휴게시작',
                        '휴게분',
                        '휴일',
                        '실근로분',
                        '야간분',
                        '예상급여',
                      ],
                      ...rows.map(({ shift: s, pay: p }) => [
                        s.date,
                        s.start,
                        s.end,
                        s.breakStart,
                        s.breakMinutes,
                        s.holiday ? '휴일' : '평일',
                        p.worked,
                        p.night,
                        Math.round(p.total),
                      ]),
                      ['별도 주 연장 가산', '', '', '', '', '', '', '', Math.round(weeklyExtra)],
                      ['세전 합계', '', '', '', '', '', '', '', Math.round(total)],
                    ]),
                  ],
                  { type: 'text/csv;charset=utf-8' }
                ),
                `ontools-shifts-${month}.csv`
              )
            }
          >
            <Download size={18} />
            CSV 다운로드
          </Button>
        </section>
      )}
    </div>
  )
}
