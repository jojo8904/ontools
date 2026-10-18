import { describe, expect, it } from 'vitest'
import { amount, money, parseCsv, reconcile, resultCsv, DEMO_ORDER, DEMO_SETTLEMENT, textCell } from './utils'
const mapping = { key: 0, amount: 1 }
const compare = (a: string, b: string) => reconcile(parseCsv(a)[0], mapping, parseCsv(b)[0], mapping)
describe('exact settlement comparison', () => {
  it.each([['1,234.56', 123456n], ['-0.01', -1n], ['0', 0n], ['999999999999.99', 99999999999999n]])('parses %s exactly', (s, expected) => expect(amount(s)).toBe(expected))
  it.each(['', ' ', '1,23', '1e3', '₩100', '(100)', '1.234', '1000000000000', '+1', 'NaN', '.5', '1.'])('rejects ambiguous amount %s', s => expect(amount(s)).toBeNull())
  it('formats negative cents', () => expect(money(-1n)).toBe('-0.01'))
  it('has realistic demo outcomes and exact arithmetic', () => {
    const r = compare(DEMO_ORDER, DEMO_SETTLEMENT)
    expect(r.map(x => x.status)).toEqual(['금액 차이', '일치', '일치', '중복 키', '주문에만 있음', '입력 오류', '정산에만 있음'])
    expect(r[0]).toMatchObject({ key: '00123', difference: '-300.00', orderRows: [2], settlementRows: [2] })
    expect(r[1].key).toBe('12345678901234567890')
    const exported = resultCsv(r, parseCsv(DEMO_ORDER)[0], parseCsv(DEMO_SETTLEMENT)[0])
    expect(exported).toContain("\"'00123\""); expect(exported).toContain("\"'12345678901234567890\"")
    expect(r[3]).toMatchObject({ orderRows: [5, 6], settlementRows: [5], difference: '' })
    expect(compare('id,n\na,0.30', 'id,n\na,0.10')[0].difference).toBe('-0.20')
  })
  it('does not trim IDs, merge case or replace blank amounts with zero', () => {
    expect(compare('id,n\n a,1\nA,2\na,', 'id,n\na,0').map(r => r.status)).toEqual(['주문에만 있음', '주문에만 있음', '입력 오류'])
  })
  it('excludes numeric and formula keys and invalidates formulas', () => {
    const a = parseCsv('id,n\n001,1\n002,1\n003,1')[0]
    a.rows[1].cells[0].kind = 'number'; a.rows[2].cells[0].kind = 'formula'; a.rows[3].cells[1].kind = 'formula'
    const r = reconcile(a, mapping, parseCsv('id,n\n003,1')[0], mapping)
    expect(r.every(x => x.status === '입력 오류')).toBe(true)
  })
  it('requires separate mapping columns', () => expect(() => reconcile(parseCsv('a,b')[0], { key: 0, amount: 0 }, parseCsv('a,b')[0], mapping)).toThrow())
  it('escapes exported formula injection and contains source references', () => {
    const a = parseCsv('id,n\n=CMD(),1')[0], b = parseCsv('id,n\n=CMD(),2')[0]
    const csv = resultCsv(reconcile(a, mapping, b, mapping), a, b)
    expect(csv).toContain('"\'=CMD()"'); expect(csv).toContain('"정산-주문"'); expect(csv).toContain('"2"'); expect(csv).toContain('"1.00"')
  })
  it('supports 10,000 rows without merging duplicates', () => {
    const a = { name: 'x', rows: [{ row: 1, cells: [textCell('id'), textCell('n')] }, ...Array.from({ length: 10000 }, (_, i) => ({ row: i + 2, cells: [textCell('same'), textCell('1')] }))] }
    expect(reconcile(a, mapping, parseCsv('id,n\nsame,10000')[0], mapping)[0].orderRows).toHaveLength(10000)
  })
})
describe('CSV structure and limits', () => {
  it('handles BOM, commas, escaped quotes, spreadsheet record rows and CRLF', () => {
    const s = parseCsv('\uFEFFid,n\r\n"a\nb","1,000"\r\n"a""b",1\r\n')[0]
    expect(s.rows[1].cells.map(c => c.value)).toEqual(['a\nb', '1,000'])
    expect(s.rows[2]).toMatchObject({ row: 3, cells: [textCell('a"b'), textCell('1')] })
  })
  it.each(['id,n\n"bad,1', 'id,n\n"bad"x,1', 'id,n\nba"d,1'])('rejects malformed quotes', s => expect(() => parseCsv(s)).toThrow())
  it('rejects empty and oversized tables', () => {
    expect(() => parseCsv('')).toThrow(); expect(() => parseCsv(Array(102).fill('a').join(','))).toThrow()
    expect(() => parseCsv('a,b\n' + 'x,1\n'.repeat(10001))).toThrow()
  })
})
