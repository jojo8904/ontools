import { afterEach, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useObjectUrls } from './useObjectUrls'

afterEach(() => vi.unstubAllGlobals())

it('revokes replaced, reset, and unmounted object URLs without creating after unmount', () => {
  let sequence = 0
  const revoke = vi.fn()
  vi.stubGlobal('URL', { createObjectURL: () => `blob:${++sequence}`, revokeObjectURL: revoke })
  const { result, unmount } = renderHook(() => useObjectUrls())
  act(() => {
    result.current.createObjectUrl(new Blob(), 'preview')
    result.current.createObjectUrl(new Blob(), 'preview')
  })
  expect(revoke).toHaveBeenCalledWith('blob:1')
  act(() => result.current.clearObjectUrls())
  expect(revoke).toHaveBeenCalledWith('blob:2')
  act(() => result.current.createObjectUrl(new Blob()))
  const create = result.current.createObjectUrl
  unmount()
  expect(revoke).toHaveBeenCalledWith('blob:3')
  expect(create(new Blob())).toBe('')
})
