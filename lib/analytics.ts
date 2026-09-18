type ToolEvent = 'tool_view' | 'calculation_complete' | 'conversion_complete' | 'tool_error' | 'download'

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JMXBEHHQ4K'

// Never include salaries, filenames, passwords or image data in analytics.
export function trackToolEvent(event: ToolEvent, tool: string) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return
  const target = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
  target.dataLayer ??= []
  const gtag = target.gtag ?? function () { target.dataLayer!.push(arguments) }
  gtag('event', event, { tool_path: tool })
}
