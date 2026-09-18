import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalTask } from './useLocalTask'

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => { resolve = done })
  return { promise, resolve }
}

describe('local task lifecycle', () => {
  it('reports errors and clears them on the next run', async () => {
    const { result } = renderHook(() => useLocalTask())
    await act(() => result.current.run(async () => { throw new Error('bad image') }))
    expect(result.current.error).toBe('bad image')
    expect(result.current.busy).toBe(false)
    await act(() => result.current.run(async () => {}))
    expect(result.current.error).toBe('')
  })

  it('does not let an older job finish a newer one', async () => {
    const { result } = renderHook(() => useLocalTask())
    const first = deferred(); const second = deferred()
    let firstSignal!: AbortSignal
    let old!: Promise<void>; let current!: Promise<void>
    act(() => { old = result.current.run(async (signal) => { firstSignal = signal; await first.promise }) })
    act(() => { current = result.current.run(async () => second.promise) })
    expect(firstSignal.aborted).toBe(true)
    await act(async () => { first.resolve(); await old })
    expect(result.current.busy).toBe(true)
    await act(async () => { second.resolve(); await current })
    expect(result.current.busy).toBe(false)
  })

  it('aborts on explicit cancel and unmount', async () => {
    const { result, unmount } = renderHook(() => useLocalTask())
    const pending = deferred()
    let signal!: AbortSignal
    let job!: Promise<void>
    act(() => { job = result.current.run(async (next) => { signal = next; await pending.promise; throw new Error('late') }) })
    act(() => result.current.cancel())
    expect(signal.aborted).toBe(true)
    await act(async () => { pending.resolve(); await job })
    expect(result.current.error).toBe('')
    const next = deferred()
    act(() => { job = result.current.run(async (value) => { signal = value; await next.promise }) })
    unmount()
    expect(signal.aborted).toBe(true)
    next.resolve(); await job
  })
})
