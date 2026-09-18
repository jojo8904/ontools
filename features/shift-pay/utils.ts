import { parseDate } from '@/lib/civil-date'

export interface Shift {
  date: string
  start: string
  end: string
  breakStart: string
  breakMinutes: number
  holiday: boolean
}

function minutes(value: string): number {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error('올바른 출퇴근 시간을 입력해 주세요.')
  return Number(value.slice(0, 2)) * 60 + Number(value.slice(3))
}

export function calculateShift(shift: Shift, wage: number, premiums: boolean) {
  parseDate(shift.date)
  if (!Number.isFinite(wage) || wage <= 0 || wage > 1e7)
    throw new Error('시급은 0원 초과, 1천만원 이하로 입력해 주세요.')
  const start = minutes(shift.start)
  let end = minutes(shift.end)
  if (end === start) throw new Error('출근과 퇴근 시간이 같아요. 24시간 미만 근무만 지원해요.')
  if (end < start) end += 1440
  if (!Number.isInteger(shift.breakMinutes) || shift.breakMinutes < 0 || shift.breakMinutes >= end - start)
    throw new Error('휴게시간은 근무 구간보다 짧은 0 이상의 정수여야 해요.')
  let rest = start
  if (shift.breakMinutes) {
    rest = minutes(shift.breakStart)
    if (rest < start) rest += 1440
    if (rest < start || rest + shift.breakMinutes > end)
      throw new Error('휴게 시작과 종료가 근무 구간 안에 있어야 해요.')
  }
  let night = 0
  for (let m = start; m < end; m++) {
    if (m >= rest && m < rest + shift.breakMinutes) continue
    if (m % 1440 >= 1320 || m % 1440 < 360) night++
  }
  const worked = end - start - shift.breakMinutes
  const overtime = Math.max(0, worked - 480)
  const basic = (worked / 60) * wage
  const dailyExtra = premiums && !shift.holiday ? (overtime / 60) * wage * 0.5 : 0
  const holidayExtra = premiums && shift.holiday ? ((Math.min(worked, 480) * 0.5 + overtime) / 60) * wage : 0
  const nightExtra = premiums ? (night / 60) * wage * 0.5 : 0
  return {
    worked,
    night,
    overtime,
    basic,
    dailyExtra,
    holidayExtra,
    nightExtra,
    total: basic + dailyExtra + holidayExtra + nightExtra,
  }
}

export function validateShiftOverlap(shifts: Shift[]) {
  const intervals = shifts
    .map((shift) => {
      const start = parseDate(shift.date).getTime() / 60000 + minutes(shift.start)
      const length = (minutes(shift.end) - minutes(shift.start) + 1440) % 1440
      return { start, end: start + length }
    })
    .sort((a, b) => a.start - b.start)
  if (intervals.some((item, i) => i > 0 && item.start < intervals[i - 1].end))
    throw new Error('이전 날짜의 야간근무와 시간이 겹쳐요.')
}
