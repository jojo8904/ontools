export function parseRanges(text: string, max: number): number[] {
  if (!Number.isSafeInteger(max) || max < 1 || max > 10000 || text.length > 10000) throw new RangeError('페이지 범위가 너무 큽니다.')
  const out = new Set<number>()
  for (const part of text.split(',')) {
    if (!part.trim()) continue
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part.trim())
    if (!match) throw new RangeError('페이지 범위를 확인해주세요. 예: 1-3, 5')
    const a = Number(match[1]), b = Number(match[2] ?? match[1])
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 1 || b < 1) throw new RangeError('페이지 번호가 올바르지 않습니다.')
    const start = Math.max(1, Math.min(a, b)), end = Math.min(max, Math.max(a, b))
    for (let i = start; i <= end; i++) out.add(i - 1)
  }
  return [...out].sort((a, b) => a - b)
}
