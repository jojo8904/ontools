export interface OcrWord {
  text: string
  bbox: { x0: number; y0: number; x1: number; y1: number }
}

export function wordsToTable(words: OcrWord[], imageWidth: number, boundaries: number[]): string[][] {
  if (
    imageWidth <= 0 ||
    !Number.isFinite(imageWidth) ||
    boundaries.some((n, i) => !Number.isFinite(n) || n <= 0 || n >= 100 || (i > 0 && n <= boundaries[i - 1]))
  )
    throw new Error('열 경계는 0~100% 사이의 오름차순 값이어야 해요.')
  const rows: { center: number; height: number; words: OcrWord[] }[] = []
  for (const word of words
    .filter((w) => w.text.trim())
    .sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0)) {
    const center = (word.bbox.y0 + word.bbox.y1) / 2
    const height = Math.max(1, word.bbox.y1 - word.bbox.y0)
    const row = rows.find((r) => Math.abs(r.center - center) <= Math.max(r.height, height) * 0.5)
    if (row) {
      row.words.push(word)
      row.height = Math.max(row.height, height)
    } else rows.push({ center, height, words: [word] })
  }
  if (rows.length > 200) throw new Error('한 번에 200행 이하의 표 영역을 선택해 주세요.')
  return rows.map((row) => {
    const cells = Array.from({ length: boundaries.length + 1 }, () => '')
    for (const word of row.words.sort((a, b) => a.bbox.x0 - b.bbox.x0)) {
      const center = ((word.bbox.x0 + word.bbox.x1) / 2 / imageWidth) * 100
      const found = boundaries.findIndex((edge) => center < edge)
      const column = found === -1 ? boundaries.length : found
      cells[column] += `${cells[column] ? ' ' : ''}${word.text.trim()}`
    }
    return cells
  })
}
