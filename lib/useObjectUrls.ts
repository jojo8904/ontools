'use client'

import { useCallback, useEffect, useRef } from 'react'
import { trackToolEvent } from './analytics'

export function useObjectUrls() {
  const urls = useRef(new Set<string>())
  const keys = useRef(new Map<string, string>())
  const mounted = useRef(true)
  const clearObjectUrls = useCallback(() => {
    for (const url of urls.current) URL.revokeObjectURL(url)
    urls.current.clear()
    keys.current.clear()
  }, [])
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearObjectUrls() }
  }, [clearObjectUrls])
  const createObjectUrl = useCallback((blob: Blob, key?: string) => {
    if (!mounted.current) return ''
    if (key) {
      const previous = keys.current.get(key)
      if (previous) { URL.revokeObjectURL(previous); urls.current.delete(previous) }
    }
    const url = URL.createObjectURL(blob)
    urls.current.add(url)
    if (key) keys.current.set(key, url)
    return url
  }, [])
  return { createObjectUrl, clearObjectUrls }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
  trackToolEvent('download', window.location.pathname)
}
