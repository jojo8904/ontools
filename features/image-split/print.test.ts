import { it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { printPlacement, createPrintPdf } from './print'
it('fits portrait and landscape pieces inside actual A4 margins', () => {
  for (const [w,h] of [[100,900],[900,100],[1,1]]) for (const margin of [0,10,30]) {
    const b = printPlacement(w,h,margin)
    expect(b.x).toBeGreaterThanOrEqual(margin - 1e-9)
    expect(b.y).toBeGreaterThanOrEqual(margin - 1e-9)
    expect(b.x+b.width).toBeLessThanOrEqual(210-margin+1e-9)
    expect(b.y+b.height).toBeLessThanOrEqual(297-margin+1e-9)
    expect(b.width/b.height).toBeCloseTo(w/h)
  }
  expect(() => printPlacement(0,10,10)).toThrow()
})
it('exports parseable PDFs with exact A4 pages and one image per piece', async () => {
  const png = new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' })
  const doc = await PDFDocument.load(await createPrintPdf([png,png,png],10))
  expect(doc.getPageCount()).toBe(3)
  for (const p of doc.getPages()) {
    expect(p.getWidth()).toBeCloseTo(210 / 25.4 * 72,6)
    expect(p.getHeight()).toBeCloseTo(297 / 25.4 * 72,6)
  }
})
