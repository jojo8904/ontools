import { describe, expect, it } from 'vitest'
import { jsPDF } from 'jspdf'
import { PDFDocument, degrees } from 'pdf-lib'
import { loadEditablePdf, saveEditedPdf } from './pdf-editor'

describe('PDF page editing', () => {
  it('preserves source and saves reordered pages with additive rotations and deletion', async () => {
    const doc = await PDFDocument.create()
    doc.addPage([100, 200]).setRotation(degrees(90))
    doc.addPage([200, 300])
    doc.addPage([300, 400])
    const bytes = (await doc.save()).buffer as ArrayBuffer
    const original = new Uint8Array(bytes).slice()
    const result = await PDFDocument.load(await saveEditedPdf(bytes, [{ index: 2, rotation: 90 }, { index: 0, rotation: 270 }]))
    expect(result.getPages().map(p => [p.getWidth(), p.getRotation().angle])).toEqual([[300, 90], [100, 0]])
    expect(new Uint8Array(bytes)).toEqual(original)
    await expect(saveEditedPdf(bytes, [])).rejects.toThrow()
    await expect(saveEditedPdf(bytes, [{ index: 4, rotation: 0 }])).rejects.toThrow()
  })
  it('rejects encrypted PDFs without bypassing encryption', async () => {
    const doc = await PDFDocument.create(); doc.addPage()
    doc.context.trailerInfo.Encrypt = doc.context.register(doc.context.obj({ Filter: 'Standard' }))
    await expect(loadEditablePdf((await doc.save()).buffer as ArrayBuffer)).rejects.toThrow('encrypted')
  })
  it('rejects a real password encrypted synthetic PDF', async () => {
    const doc = new jsPDF({ encryption: { userPassword: 'synthetic-only', ownerPassword: 'owner-only', userPermissions: ['print'] } })
    doc.text('SYNTHETIC ENCRYPTED', 10, 10)
    await expect(loadEditablePdf(doc.output('arraybuffer'))).rejects.toThrow('encrypted')
  })
  it('rejects damaged and excessive documents', async () => {
    await expect(loadEditablePdf(new ArrayBuffer(10))).rejects.toThrow()
    const doc = await PDFDocument.create()
    for (let i = 0; i < 201; i++) doc.addPage()
    await expect(loadEditablePdf((await doc.save()).buffer as ArrayBuffer)).rejects.toThrow('200')
  })
})
