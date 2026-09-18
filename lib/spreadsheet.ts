// Treat user/OCR content as text, never as spreadsheet formulas.
export function spreadsheetText(value: string | number): string {
  const text = String(value).replace(/[\t\r\n]+/g, ' ')
  return /^[\s\uFEFF]*[=+@-]/.test(text) ? `'${text}` : text
}

export function exportTable(rows: (string | number)[][], separator: ',' | '\t' = ','): string {
  return (
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map((value) => {
            const text =
              typeof value === 'number' && Number.isFinite(value) ? String(value) : spreadsheetText(value)
            return separator === ',' ? `"${text.replace(/"/g, '""')}"` : text
          })
          .join(separator)
      )
      .join('\r\n')
  )
}
