const DAY = 86_400_000

export function parseDate(value: string): Date {
  const date = new Date(`${value}T00:00:00Z`)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error('올바른 날짜를 입력해 주세요.')
  }
  return date
}

export function dateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}
export function daysBetween(start: string, end: string): number {
  return (parseDate(end).getTime() - parseDate(start).getTime()) / DAY
}
export function addDays(value: string, days: number): string {
  return dateString(new Date(parseDate(value).getTime() + days * DAY))
}
export function shiftMonth(value: string, months: number): string {
  const date = parseDate(value)
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1))
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(date.getUTCDate(), last))
  return dateString(target)
}

export function localToday(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
