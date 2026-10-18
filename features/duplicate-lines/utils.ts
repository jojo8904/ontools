export interface CleanupOptions {
  trim: boolean
  omitBlank: boolean
}

/** One final line ending terminates the last line; it does not create an extra row. */
export function removeDuplicateLines(source: string, options: CleanupOptions) {
  const lines = source === '' ? [] : source.split(/\r\n|\r|\n/)
  if (lines.length && /[\r\n]$/.test(source)) lines.pop()
  const seen = new Set<string>()
  const result: string[] = []
  let duplicates = 0
  let blanks = 0
  for (const original of lines) {
    const line = options.trim ? original.trim() : original
    if (options.omitBlank && line.trim() === '') {
      blanks++
    } else if (seen.has(line)) {
      duplicates++
    } else {
      seen.add(line)
      result.push(line)
    }
  }
  return { text: result.join('\n') + (result[result.length - 1] === '' ? '\n' : ''), inputLines: lines.length, outputLines: result.length, duplicates, blanks }
}
