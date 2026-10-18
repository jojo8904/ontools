import { exportTable } from '@/lib/spreadsheet'

export type Cell = { value: string; kind: 'text' | 'number' | 'formula' | 'invalid' }
export type Row = { row: number; cells: Cell[] }
export type Sheet = { name: string; rows: Row[] }
export type Mapping = { key: number; amount: number }
export type Result = { status: string; key: string; orderRows: number[]; settlementRows: number[]; order: string; settlement: string; difference: string; reason: string }
export const LIMITS = { bytes: 5 * 1024 * 1024, rows: 10000, columns: 100, sheets: 5 }
export const textCell = (value: string): Cell => ({ value, kind: 'text' })

// Exact decimal cents; never floating-point arithmetic. No implicit rounding.
export function amount(value: string): bigint | null {
  const s = value.trim()
  if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(s)) return null
  const [whole, fraction = ''] = s.replace(/,/g, '').replace('-', '').split('.')
  if (whole.length > 12) return null
  const n = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  return s.startsWith('-') ? -n : n
}
export function money(n: bigint): string {
  const a = n < 0n ? -n : n
  return `${n < 0n ? '-' : ''}${a / 100n}.${String(a % 100n).padStart(2, '0')}`
}

export function parseCsv(source: string): Sheet[] {
  const input = source.replace(/^\uFEFF/, '')
  const rows: Row[] = []
  let fields: Cell[] = [], field = '', quoted = false, closed = false
  const pushField = () => { fields.push(textCell(field)); field = ''; closed = false; if (fields.length > LIMITS.columns) throw new Error('열은 최대 100개예요.') }
  const pushRow = () => { pushField(); rows.push({ row: rows.length + 1, cells: fields }); fields = []; if (rows.length > LIMITS.rows + 1) throw new Error('데이터는 시트당 최대 10,000행이에요.') }
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    if (quoted) {
      if (c === '"') { if (input[i + 1] === '"') { field += '"'; i++ } else { quoted = false; closed = true } }
      else field += c
    } else if (c === '"' && field === '' && !closed) quoted = true
    else if (c === ',') pushField()
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && input[i + 1] === '\n') i++
      pushRow()
    } else { if (closed || c === '"') throw new Error('CSV 따옴표 형식을 확인해 주세요.'); field += c }
  }
  if (quoted) throw new Error('CSV 따옴표가 닫히지 않았어요.')
  if (field || fields.length || closed) pushRow()
  if (!rows.length) throw new Error('빈 파일이에요.')
  return [{ name: 'CSV', rows }]
}

export function reconcile(a: Sheet, am: Mapping, b: Sheet, bm: Mapping): Result[] {
  for (const m of [am, bm]) if (m.key === m.amount || !Number.isInteger(m.key) || !Number.isInteger(m.amount) || m.key < 0 || m.amount < 0) throw new Error('서로 다른 키 열과 금액 열을 선택해 주세요.')
  type Entry = { row: number; n: bigint | null; error: string }
  const index = (sheet: Sheet, m: Mapping) => {
    const map = new Map<string, Entry[]>(); const invalid: Result[] = []
    for (const row of sheet.rows.slice(1)) {
      if (row.cells.every(c => !c.value && c.kind === 'text')) continue
      const key = row.cells[m.key], val = row.cells[m.amount]
      // Numeric XLSX keys cannot recover leading zeros or already rounded IDs.
      const error = !key?.value ? '빈 키' : key.kind !== 'text' ? '키는 텍스트 셀로 저장해 주세요 (숫자·수식 키 제외).' : !val || !['number', 'text'].includes(val.kind) || amount(val.value) === null ? '금액 형식 오류 (빈칸·수식·통화기호·소수 3자리 이상 제외)' : ''
      const entry = { row: row.row, n: val && ['text', 'number'].includes(val.kind) ? amount(val.value) : null, error }
      if (!key?.value || key.kind !== 'text') invalid.push({ status: '입력 오류', key: key?.value || '', orderRows: [row.row], settlementRows: [], order: '', settlement: '', difference: '', reason: error })
      else { const bucket = map.get(key.value) || []; bucket.push(entry); map.set(key.value, bucket) }
    }
    return { map, invalid }
  }
  const left = index(a, am), right = index(b, bm)
  const results: Result[] = [...left.invalid, ...right.invalid.map(r => ({ ...r, orderRows: [], settlementRows: r.orderRows }))]
  for (const key of new Set([...left.map.keys(), ...right.map.keys()])) {
    const l = left.map.get(key) || [], r = right.map.get(key) || []
    const errors = [...l, ...r].map(e => e.error).filter(Boolean)
    const duplicate = l.length > 1 || r.length > 1
    const valid = !duplicate && !errors.length
    const both = l.length === 1 && r.length === 1 && valid
    const diff = both ? r[0].n! - l[0].n! : null
    results.push({ key, status: errors.length ? '입력 오류' : duplicate ? '중복 키' : !l.length ? '정산에만 있음' : !r.length ? '주문에만 있음' : diff === 0n ? '일치' : '금액 차이', orderRows: l.map(e => e.row), settlementRows: r.map(e => e.row), order: valid && l.length ? money(l[0].n!) : '', settlement: valid && r.length ? money(r[0].n!) : '', difference: diff === null ? '' : money(diff), reason: errors.length ? [...new Set(errors)].join(' / ') : duplicate ? '자동 합산하지 않음. 상품별 행·분할 정산·환불 내역 확인' : both && diff !== 0n ? '정산 − 주문. 수수료·부분 환불·정산 시점 확인 (원인 미확정)' : !both ? '선택 기간·키 단위·정산 시점 확인 (미지급 확정 아님)' : '선택한 두 금액이 같음' })
  }
  return results
}
export function resultCsv(results: Result[], a: Sheet, b: Sheet): string {
  return exportTable([['상태', '키', '주문 시트', '주문 원본 행', '정산 시트', '정산 원본 행', '주문 금액', '정산 금액', '정산-주문', '확인 안내'], ...results.map(r => [r.status, /^\s*\d+\s*$/.test(r.key) ? `'${r.key}` : r.key, a.name, r.orderRows.join(' / '), b.name, r.settlementRows.join(' / '), r.order, r.settlement, r.difference, r.reason])])
}
export const DEMO_ORDER = '주문번호,비교금액\n00123,10000\n12345678901234567890,20000\nREFUND,-3000\nDUP,100\nDUP,200\nONLY-ORDER,5000\nBAD,금액없음\n'
export const DEMO_SETTLEMENT = '주문번호,비교금액\n00123,9700\n12345678901234567890,20000\nREFUND,-3000\nDUP,300\nONLY-SETTLEMENT,700\nBAD,100\n'
