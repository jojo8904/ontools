import { PDFDocument } from 'pdf-lib'

export const A4 = { width: 210, height: 297 }
export function printPlacement(width: number, height: number, margin: number) {
  if (![width, height, margin].every(Number.isFinite) || width <= 0 || height <= 0 || margin < 0 || margin > 30) throw new RangeError('여백은 0~30mm로 입력해주세요.')
  const scale = Math.min((210 - margin * 2) / width, (297 - margin * 2) / height)
  const w = width * scale, h = height * scale
  return { x: (210 - w) / 2, y: (297 - h) / 2, width: w, height: h }
}
export async function createPrintPdf(pieces: Blob[], margin: number) {
  const pdf = await PDFDocument.create()
  const pt = 72 / 25.4
  for (const piece of pieces) {
    const bytes = await piece.arrayBuffer()
    const image = piece.type === 'image/jpeg' ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes)
    const box = printPlacement(image.width, image.height, margin)
    const page = pdf.addPage([210 * pt, 297 * pt])
    page.drawImage(image, { x: box.x * pt, y: box.y * pt, width: box.width * pt, height: box.height * pt })
  }
  return pdf.save()
}
