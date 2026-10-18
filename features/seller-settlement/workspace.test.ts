// @vitest-environment jsdom
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { expect, it } from 'vitest'

it('boots the isolated browser bundle, compares demo, invalidates changed mapping and resets', async () => {
  document.body.innerHTML = '<div id="workspace"></div>'
  execFileSync(process.execPath, ['scripts/build-settlement-workspace.mjs'])
  // Execute our own production bundle to catch runtime failures hidden by typecheck.
  window.eval(readFileSync('public/settlement-workspace.js', 'utf8'))
  await waitFor(() => expect(screen.getByRole('button', { name: '합성 예제로 시작' })).toBeTruthy())
  fireEvent.click(screen.getByRole('button', { name: '합성 예제로 시작' }))
  await waitFor(() => expect(screen.getByLabelText('주문 금액 열')).toBeTruthy())
  fireEvent.click(screen.getByRole('button', { name: '선택한 열 비교하기' }))
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('7개 비교 항목 · 2개 일치'))
  expect(screen.getByRole('cell', { name: '-300.00' })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('상태 필터'), { target: { value: '중복 키' } })
  await waitFor(() => expect(within(screen.getByRole('region', { name: '비교 결과' })).getByRole('cell', { name: 'DUP' })).toBeTruthy())
  fireEvent.change(screen.getByLabelText('주문 금액 열'), { target: { value: '0' } })
  await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
  fireEvent.click(screen.getByRole('button', { name: '선택한 열 비교하기' }))
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('서로 다른'))
  fireEvent.click(screen.getByRole('button', { name: '초기화' }))
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  expect((screen.getByRole('button', { name: '선택한 열 비교하기' }) as HTMLButtonElement).disabled).toBe(true)
})
