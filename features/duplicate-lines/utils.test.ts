import { describe, expect, it } from 'vitest'
import { removeDuplicateLines } from './utils'

const exact = { trim: false, omitBlank: false }
describe('removeDuplicateLines', () => {
  it('preserves first occurrence, case, Unicode and literal markup', () => {
    expect(removeDuplicateLines('한글\n😀\n한글\nA\na\n<script>\n😀', exact)).toEqual({
      text: '한글\n😀\nA\na\n<script>', inputLines: 7, outputLines: 5, duplicates: 2, blanks: 0,
    })
  })
  it('handles empty input and line ending conventions', () => {
    expect(removeDuplicateLines('', exact).inputLines).toBe(0)
    for (const separator of ['\n', '\r\n', '\r']) {
      expect(removeDuplicateLines(['a', 'b', 'a', ''].join(separator), exact)).toEqual({
        text: 'a\nb', inputLines: 3, outputLines: 2, duplicates: 1, blanks: 0,
      })
    }
    expect(removeDuplicateLines('\n', exact)).toMatchObject({ inputLines: 1, outputLines: 1, text: '\n' })
  })
  it('makes whitespace changes opt in and reports removals separately', () => {
    const source = ' a \na\n \n\na'
    expect(removeDuplicateLines(source, exact).text).toBe(' a \na\n \n\n')
    expect(removeDuplicateLines(source, { trim: true, omitBlank: true })).toEqual({
      text: 'a', inputLines: 5, outputLines: 1, duplicates: 2, blanks: 2,
    })
  })
  it('is idempotent and handles 10000 lines', () => {
    expect(removeDuplicateLines(removeDuplicateLines('a\n\n', exact).text, exact).text).toBe('a\n\n')
    const first = removeDuplicateLines(Array.from({ length: 10000 }, (_, i) => String(i % 100)).join('\n'), exact)
    expect(first.duplicates).toBe(9900)
    expect(removeDuplicateLines(first.text, exact).text).toBe(first.text)
  })
})
