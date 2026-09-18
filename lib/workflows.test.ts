import { describe, it, expect, vi } from 'vitest'
import { checkImageFile, encodeUnderLimit, validateImageDimensions } from './image-workflows'
import { exportTable } from './spreadsheet'
import { addDays, daysBetween, parseDate, shiftMonth } from './civil-date'
import { wordsToTable } from '@/features/table-ocr/utils'
import { TOOLS, searchTools } from './tools'

describe('workflow boundaries', () => {
  it('validates image inputs and allocation bounds', () => {
    expect(() => checkImageFile(new File(['a'], 'x.svg', { type: 'image/svg+xml' }))).toThrow()
    expect(() => checkImageFile(new File([], 'x.png', { type: 'image/png' }))).toThrow()
    expect(() => checkImageFile(new File(['a'], 'x.png', { type: 'image/png' }))).not.toThrow()
    expect(() => validateImageDimensions(4096, 4096)).toThrow()
    expect(() => validateImageDimensions(NaN, 100)).toThrow()
    expect(() => validateImageDimensions(0, 100)).toThrow()
    expect(() => validateImageDimensions(4096, 100)).not.toThrow()
  })
  it('exports BOM, quoted CSV and inert spreadsheet values', () => {
    expect(exportTable([['a,b', '"hello"', '=1+1', ' @SUM(A1)', 'a\nb', -10]])).toBe(
      '\uFEFF"a,b","""hello""","\'=1+1","\' @SUM(A1)","a b","-10"'
    )
    expect(exportTable([['x\ty', '+cmd', '-1']], '\t')).toBe("\uFEFFx y\t'+cmd\t'-1")
  })
  it('calculates civil dates', () => {
    expect(shiftMonth('2024-03-31', -1)).toBe('2024-02-29')
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2)
    expect(() => parseDate('2023-02-29')).toThrow()
  })
  it('registers unique discoverable routes', () => {
    expect(new Set(TOOLS.map((t) => t.href)).size).toBe(TOOLS.length)
    expect(searchTools('판매가').some((t) => t.href === '/selling-price')).toBe(true)
    expect(searchTools('OCR').some((t) => t.href === '/table-to-excel')).toBe(true)
  })
})

describe('byte-limited encoding', () => {
  function canvas(type = 'image/jpeg', fixed?: number) {
    return {
      toBlob: vi.fn((callback: (blob: Blob) => void, _type: string, quality: number) =>
        callback(new Blob([new Uint8Array(fixed ?? Math.ceil(quality * 10000))], { type }))
      ),
    } as unknown as HTMLCanvasElement
  }
  it('returns actual bytes below the requested limit', async () => {
    const result = await encodeUnderLimit(canvas(), 'image/jpeg', 2)
    expect(result.size).toBeLessThanOrEqual(2048)
    expect(result.size).toBeGreaterThan(1900)
  })
  it('rejects impossible sizes and PNG limits', async () => {
    await expect(encodeUnderLimit(canvas('image/png', 10000), 'image/png', 1)).rejects.toThrow('PNG')
    await expect(encodeUnderLimit(canvas('image/jpeg', 10000), 'image/jpeg', 1)).rejects.toThrow('용량')
  })
  it('detects unsupported format fallback and cancellation', async () => {
    await expect(encodeUnderLimit(canvas('image/png'), 'image/webp', 10)).rejects.toThrow('지원')
    const controller = new AbortController()
    controller.abort()
    await expect(encodeUnderLimit(canvas(), 'image/jpeg', 10, controller.signal)).rejects.toThrow()
  })
})

describe('OCR table structure', () => {
  it('groups words using coordinates and keeps empty cells', () => {
    const word = (text: string, x: number, y: number) => ({
      text,
      bbox: { x0: x, y0: y, x1: x + 20, y1: y + 15 },
    })
    expect(
      wordsToTable(
        [
          word('Name', 10, 0),
          word('Cost', 120, 1),
          word('Red', 10, 30),
          word('Apple', 40, 31),
          word('100', 220, 30),
        ],
        300,
        [33, 66]
      )
    ).toEqual([
      ['Name', 'Cost', ''],
      ['Red Apple', '', '100'],
    ])
  })
  it('rejects invalid boundaries', () => {
    expect(() => wordsToTable([], 100, [60, 30])).toThrow()
    expect(() => wordsToTable([], 100, [NaN])).toThrow()
  })
})
