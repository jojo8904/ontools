import { PDFDocument, degrees } from 'pdf-lib'

export interface EditablePage { index: number; rotation: number }
export const MAX_PDF_BYTES = 50 * 1024 * 1024
export const MAX_EDIT_PAGES = 200

export class PdfPageLimitError extends Error {}

export async function loadEditablePdf(bytes: ArrayBuffer) {
  const doc = await PDFDocument.load(bytes)
  if (!doc.getPageCount() || doc.getPageCount() > MAX_EDIT_PAGES) throw new PdfPageLimitError('페이지 편집은 1~200페이지 PDF만 지원해요.')
  return doc
}

export async function saveEditedPdf(bytes: ArrayBuffer, pages: EditablePage[]) {
  const source = await loadEditablePdf(bytes)
  if (!pages.length || pages.some(p => !Number.isInteger(p.index) || p.index < 0 || p.index >= source.getPageCount() || !Number.isInteger(p.rotation) || p.rotation % 90 !== 0)) throw new Error('페이지 편집 정보를 확인해주세요.')
  const out = await PDFDocument.create()
  const copied = await out.copyPages(source, pages.map(p => p.index))
  copied.forEach((page, i) => {
    page.setRotation(degrees(((page.getRotation().angle + pages[i].rotation) % 360 + 360) % 360))
    out.addPage(page)
  })
  return out.save()
}
