'use client'

import { useState } from 'react'
import { removeDuplicateLines } from '@/features/duplicate-lines/utils'

export function DuplicateLines() {
  const [source, setSource] = useState('')
  const [trim, setTrim] = useState(false)
  const [omitBlank, setOmitBlank] = useState(false)
  const [message, setMessage] = useState('')
  const result = removeDuplicateLines(source, { trim, omitBlank })

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.text)
      setMessage('결과를 복사했습니다.')
    } catch {
      setMessage('복사하지 못했습니다. 결과 칸을 선택해 직접 복사해 주세요.')
    }
  }

  return (
    <section className="rounded-2xl border border-[#ece6f2] bg-white p-5 space-y-5">
      <p className="text-sm text-[#6b6276]">입력한 내용은 이 브라우저 안에서만 처리됩니다. 원본 순서와 대소문자를 유지합니다.</p>
      <div>
        <label htmlFor="line-source" className="block font-medium mb-2">원본 텍스트</label>
        <textarea id="line-source" rows={8} value={source} onChange={(event) => { setSource(event.target.value); setMessage('') }}
          placeholder={'사과\n바나나\n사과'} spellCheck={false}
          className="w-full rounded-xl border border-[#d8cce8] p-3 text-base focus:outline-purple-500" />
      </div>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="font-medium mb-2">정리 옵션</legend>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(event) => { setTrim(event.target.checked); setMessage('') }} />줄 앞뒤 공백 제거</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={omitBlank} onChange={(event) => { setOmitBlank(event.target.checked); setMessage('') }} />빈 줄 제거</label>
      </fieldset>
      <p role="status" className="text-sm text-[#6b6276]">
        입력 {result.inputLines}줄 → 결과 {result.outputLines}줄 · 중복 {result.duplicates}줄 · 빈 줄 {result.blanks}줄 제거
      </p>
      <div>
        <label htmlFor="line-result" className="block font-medium mb-2">정리 결과</label>
        <textarea id="line-result" rows={8} value={result.text} readOnly spellCheck={false}
          className="w-full rounded-xl border border-[#d8cce8] bg-[#faf8fc] p-3 text-base focus:outline-purple-500" />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} disabled={result.outputLines === 0}
          className="rounded-xl bg-[#7c3aed] px-5 py-3 text-white disabled:opacity-40">결과 복사</button>
        <button type="button" onClick={() => { setSource(''); setMessage(''); setTrim(false); setOmitBlank(false) }}
          className="rounded-xl border border-[#d8cce8] px-5 py-3">초기화</button>
      </div>
      <p role="status" className="text-sm text-[#6b6276]">{message}</p>
    </section>
  )
}
