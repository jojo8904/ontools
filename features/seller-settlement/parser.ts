import JSZip from 'jszip'
import { LIMITS, parseCsv, type Cell, type Row, type Sheet } from './utils'

function xml(s: string): Document {
  if (/<!DOCTYPE|<!ENTITY/i.test(s)) throw new Error('DTD가 포함된 XML은 지원하지 않아요.')
  const doc = new DOMParser().parseFromString(s, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error('XLSX XML을 읽을 수 없어요.')
  return doc
}
const elements = (node: Document | Element, name: string) => Array.from(node.getElementsByTagNameNS('*', name))
const content = (node: Element) => elements(node, 't').map(t => t.textContent || '').join('')

export async function parseFile(file: File): Promise<Sheet[]> {
  if (file.size > LIMITS.bytes) throw new Error('파일당 최대 5MB예요. 필요한 기간만 내보내 주세요.')
  if (/\.csv$/i.test(file.name)) {
    const bytes = await file.arrayBuffer()
    try { return parseCsv(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) }
    catch (e) { if (e instanceof TypeError) throw new Error('CSV를 UTF-8 형식으로 다시 저장해 주세요.'); throw e }
  }
  if (!/\.xlsx$/i.test(file.name)) throw new Error('XLSX 또는 UTF-8 CSV만 지원해요. XLS·XLSM·암호화 파일은 제외해요.')
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const entries = Object.values(zip.files)
  // JSZip exposes central-directory sizes before inflation; reject ZIP bombs first.
  let total = 0
  for (const entry of entries) {
    const size = (entry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize
    if (!entry.dir && (typeof size !== 'number' || size > 8 * 1024 * 1024)) throw new Error('압축 해제 크기가 너무 커요 (항목당 8MB).')
    total += size || 0
  }
  if (entries.length > 500 || total > 24 * 1024 * 1024) throw new Error('압축 해제 합계는 최대 24MB, ZIP 항목은 최대 500개예요.')
  if (entries.some(e => /vbaProject\.bin$/i.test(e.name))) throw new Error('매크로가 포함된 파일은 지원하지 않아요.')
  let inflatedBytes = 0
  const read = async (path: string) => {
    const entry = zip.file(path)
    if (!entry) throw new Error('필수 XLSX 구성이 없어요. Excel에서 XLSX로 다시 저장해 주세요.')
    // Enforce actual streamed bytes too; ZIP metadata alone is untrusted.
    const bytes = await new Promise<Uint8Array>((resolve, reject) => {
      const chunks: Uint8Array[] = []; let size = 0; let failed = false
      const stream = (entry as typeof entry & { internalStream(type: 'uint8array'): JSZip.JSZipStreamHelper<Uint8Array> }).internalStream('uint8array')
      stream.on('data', chunk => {
        if (failed) return
        size += chunk.length; inflatedBytes += chunk.length
        if (size > 8 * 1024 * 1024 || inflatedBytes > 24 * 1024 * 1024) {
          failed = true; stream.pause(); reject(new Error('실제 압축 해제 크기 제한을 초과했어요.')); return
        }
        chunks.push(chunk)
      }).on('error', reject).on('end', () => {
        if (failed) return
        const joined = new Uint8Array(size); let offset = 0
        for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length }
        resolve(joined)
      }).resume()
    })
    return xml(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  }
  const workbook = await read('xl/workbook.xml'), rels = await read('xl/_rels/workbook.xml.rels')
  const sheets = elements(workbook, 'sheet')
  if (!sheets.length || sheets.length > LIMITS.sheets) throw new Error('시트는 1~5개인 파일만 지원해요. 필요한 시트만 남겨 주세요.')
  const strings = zip.file('xl/sharedStrings.xml') ? elements(await read('xl/sharedStrings.xml'), 'si').map(content) : []
  const output: Sheet[] = []
  for (const sheet of sheets) {
    const id = sheet.getAttribute('r:id') || sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')
    const rel = elements(rels, 'Relationship').find(r => r.getAttribute('Id') === id)
    const target = rel?.getAttribute('Target') || ''
    if (!target || rel?.getAttribute('TargetMode') === 'External' || /(^|\/)\.\.(\/|$)|[\\?#:]/.test(target)) throw new Error('지원하지 않는 시트 경로예요.')
    const path = target.startsWith('/xl/') ? target.slice(1) : `xl/${target}`
    const doc = await read(path), rows: Row[] = []
    const sourceRows = elements(doc, 'row')
    if (sourceRows.length > LIMITS.rows + 1) throw new Error('데이터는 시트당 최대 10,000행이에요.')
    let lastRow = 0
    for (const row of sourceRows) {
      const number = Number(row.getAttribute('r'))
      if (!Number.isSafeInteger(number) || number <= lastRow || number > 1048576) throw new Error('잘못된 XLSX 행 번호예요.')
      lastRow = number
      const cells: Cell[] = []
      for (const c of elements(row, 'c')) {
        const ref = c.getAttribute('r') || '', match = /^([A-Z]+)(\d+)$/.exec(ref)
        if (!match || Number(match[2]) !== number) throw new Error('잘못된 XLSX 셀 주소예요.')
        let col = 0
        for (const ch of match[1]) col = col * 26 + ch.charCodeAt(0) - 64
        if (col > LIMITS.columns) throw new Error('열은 최대 100개예요.')
        while (cells.length < col) cells.push({ value: '', kind: 'text' })
        const t = c.getAttribute('t'), v = elements(c, 'v')[0]?.textContent || ''
        let cell: Cell
        if (elements(c, 'f').length) cell = { value: '[수식]', kind: 'formula' }
        else if (t === 's') cell = /^\d+$/.test(v) && strings[Number(v)] !== undefined ? { value: strings[Number(v)], kind: 'text' } : { value: '[문자열 오류]', kind: 'invalid' }
        else if (t === 'inlineStr') cell = { value: content(c), kind: 'text' }
        else if (t === 'str') cell = { value: v, kind: 'text' }
        else if (!t || t === 'n') cell = v ? { value: v, kind: 'number' } : { value: '', kind: 'text' }
        else cell = { value: v || '[지원하지 않는 셀]', kind: 'invalid' }
        cells[col - 1] = cell
      }
      rows.push({ row: number, cells })
    }
    if (!rows.length) throw new Error('빈 시트가 있어요. 빈 시트를 삭제하고 다시 선택해 주세요.')
    output.push({ name: sheet.getAttribute('name') || `시트 ${output.length + 1}`, rows })
  }
  return output
}
