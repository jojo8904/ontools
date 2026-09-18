'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocalTask() {
  const controller = useRef<AbortController | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(
    () => () => {
      controller.current?.abort()
    },
    []
  )
  const cancel = useCallback(() => {
    controller.current?.abort()
    controller.current = null
    setBusy(false)
  }, [])
  const run = useCallback(async (work: (signal: AbortSignal) => Promise<void>) => {
    controller.current?.abort()
    const next = new AbortController()
    controller.current = next
    setBusy(true)
    setError('')
    try {
      await work(next.signal)
    } catch (error) {
      if (!next.signal.aborted)
        setError(error instanceof Error ? error.message : '처리에 실패했어요. 다시 시도해 주세요.')
    } finally {
      if (!next.signal.aborted) {
        setBusy(false)
        controller.current = null
      }
    }
  }, [])
  return { busy, error, setError, run, cancel }
}
