'use client'

import { useCallback, useSyncExternalStore } from 'react'

export function useStoredNumber(key: string): [number, (value: number) => void]
export function useStoredNumber(key: string, fallback: null): [number | null, (value: number) => void]
export function useStoredNumber(key: string, fallback: number | null = 0): [number | null, (value: number) => void] {
  const read = useCallback(() => {
    try {
      const stored = localStorage.getItem(key)
      const n = stored === null ? fallback : Number(stored)
      return n !== null && Number.isFinite(n) ? n : fallback
    } catch { return fallback }
  }, [key, fallback])
  const subscribe = useCallback((update: () => void) => {
    window.addEventListener('storage', update)
    window.addEventListener('ontools:score-changed', update)
    return () => { window.removeEventListener('storage', update); window.removeEventListener('ontools:score-changed', update) }
  }, [])
  const value = useSyncExternalStore(subscribe, read, () => fallback)
  const write = useCallback((next: number) => {
    try { localStorage.setItem(key, String(next)) } catch { /* Storage may be disabled. */ }
    window.dispatchEvent(new Event('ontools:score-changed'))
  }, [key])
  return [value, write]
}
