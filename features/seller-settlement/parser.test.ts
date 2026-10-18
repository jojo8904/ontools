// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { parseFile } from './parser'
const file = (name: string, bytes: Uint8Array | string) => {
  const data = typeof bytes === 'string' ? new TextEncoder().encode(bytes) : bytes
  return { name, size: data.byteLength, arrayBuffer: async () => data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) } as File
}
async function fixture(options: { formula?: boolean; sheets?: number; macro?: boolean; target?: string; row?: string } = {}) {
  const z = new JSZip(), count = options.sheets || 2
  z.file('xl/workbook.xml', `<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${Array.from({ length: count }, (_, i) => `<sheet name="예제${i + 1}" r:id="r${i}"/>`).join('')}</sheets></workbook>`)
  z.file('xl/_rels/workbook.xml.rels', `<Relationships>${Array.from({ length: count }, (_, i) => `<Relationship Id="r${i}" Target="${options.target || `worksheets/sheet${i + 1}.xml`}"/>`).join('')}</Relationships>`)
  z.file('xl/sharedStrings.xml', '<sst><si><t>00123</t></si></sst>')
  for (let i = 1; i <= count; i++) z.file(`xl/worksheets/sheet${i}.xml`, `<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>주문번호</t></is></c><c r="B1" t="inlineStr"><is><t>금액</t></is></c></row>${options.row || `<row r="3"><c r="A3" t="s"><v>0</v></c><c r="B3">${options.formula ? '<f>1+1</f>' : ''}<v>-10.25</v></c></row>`}</sheetData></worksheet>`)
  if (options.macro) z.file('xl/vbaProject.bin', 'fake')
  return file('synthetic.xlsx', await z.generateAsync({ type: 'uint8array' }))
}
describe('XLSX/CSV file reader', () => {
  it('reads multiple sheets, shared text IDs, exact decimals and sparse source rows', async () => {
    const s = await parseFile(await fixture())
    expect(s.map(x => x.name)).toEqual(['예제1', '예제2'])
    expect(s[0].rows[1]).toMatchObject({ row: 3, cells: [{ value: '00123', kind: 'text' }, { value: '-10.25', kind: 'number' }] })
  })
  it('never evaluates formulas or trusts cached results', async () => expect((await parseFile(await fixture({ formula: true })))[0].rows[1].cells[1].kind).toBe('formula'))
  it('retains large numeric key raw text for rejection by comparator', async () => {
    const s = await parseFile(await fixture({ row: '<row r="2"><c r="A2"><v>12345678901234567890</v></c></row>' }))
    expect(s[0].rows[1].cells[0]).toEqual({ kind: 'number', value: '12345678901234567890' })
  })
  it('rejects unsupported formats and oversized files', async () => {
    await expect(parseFile(file('a.xls', 'x'))).rejects.toThrow('XLSX')
    await expect(parseFile({ name: 'a.csv', size: 6 * 1024 * 1024 } as File)).rejects.toThrow('5MB')
    await expect(parseFile(file('a.csv', new Uint8Array([0xff])))).rejects.toThrow('UTF-8')
  })
  it('reads UTF-8 CSV', async () => expect((await parseFile(file('a.csv', 'id,n\n001,1')))[0].rows[1].cells[0].value).toBe('001'))
  it('rejects macro, excess sheets and unsafe paths', async () => {
    await expect(parseFile(await fixture({ macro: true }))).rejects.toThrow('매크로')
    await expect(parseFile(await fixture({ sheets: 6 }))).rejects.toThrow('1~5')
    await expect(parseFile(await fixture({ target: '../outside.xml' }))).rejects.toThrow('경로')
  })
  it('rejects duplicate/out-of-order rows, excessive columns and DTD', async () => {
    await expect(parseFile(await fixture({ row: '<row r="1"/>' }))).rejects.toThrow('행 번호')
    await expect(parseFile(await fixture({ row: '<row r="2"><c r="CW2"><v>1</v></c></row>' }))).rejects.toThrow('100개')
  })
  it('rejects excessive ZIP expansion before parsing XML', async () => {
    const z = new JSZip(); z.file('huge', '0'.repeat(8 * 1024 * 1024 + 1))
    await expect(parseFile(file('bomb.xlsx', await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })))).rejects.toThrow('8MB')
  })
  it('caps actual inflation when ZIP central-directory sizes lie', async () => {
    const z = new JSZip(); z.file('xl/workbook.xml', '0'.repeat(8 * 1024 * 1024 + 1))
    const bytes = await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    for (let i = 0; i < bytes.length - 46; i++) {
      if (view.getUint32(i, true) === 0x02014b50) view.setUint32(i + 24, 1, true)
    }
    await expect(parseFile(file('forged.xlsx', bytes))).rejects.toThrow('실제 압축 해제')
  })

})
