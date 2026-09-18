'use client'

import { useObjectUrls } from '@/lib/useObjectUrls'

import { useState, useRef, useCallback } from 'react'
import { parseRanges } from '@/lib/pdf-ranges'
import { Button } from '@/components/ui/Button'

type Mode = 'merge' | 'split'

interface Item {
  id: string
  name: string
  pages: number
  bytes: ArrayBuffer
}

let _seq = 0

/** "1-3,5,7-8" → [0,2,4,6,7] (0-based, 중복 제거·정렬) */


export function PdfMerge() {
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()

  const [mode, setMode] = useState<Mode>('merge')
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [rangeText, setRangeText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const pdfs = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    )
    if (pdfs.length === 0) {
      alert('PDF 파일만 올릴 수 있어요.')
      return
    }
    setBusy(true)
    setProgress('PDF 읽는 중…')
    try {
      const { PDFDocument } = await import('pdf-lib')
      for (const f of pdfs) {
        const bytes = await f.arrayBuffer()
        try {
          const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
          _seq += 1
          setItems((prev) => [...prev, { id: `f${_seq}`, name: f.name, pages: doc.getPageCount(), bytes }])
        } catch {
          alert(`"${f.name}" 파일을 읽지 못했어요. (손상되었거나 암호가 걸린 PDF일 수 있어요)`)
        }
      }
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [])

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const t = i + dir
      if (t < 0 || t >= next.length) return prev
      ;[next[i], next[t]] = [next[t], next[i]]
      return next
    })
  }
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id))
  const reset = () => {
    clearObjectUrls()
    setItems([])
    setRangeText('')
  }

  const download = useCallback((bytes: Uint8Array, name: string) => {
    const a = document.createElement('a')
    a.download = name
    a.href = createObjectUrl(new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' }))
    a.click()
  }, [createObjectUrl])

  const handleMerge = useCallback(async () => {
    if (items.length < 2) return
    setBusy(true)
    setProgress('합치는 중…')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const out = await PDFDocument.create()
      for (let i = 0; i < items.length; i++) {
        setProgress(`합치는 중… ${i + 1} / ${items.length}`)
        const src = await PDFDocument.load(items[i].bytes, { ignoreEncryption: true })
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      download(await out.save(), `ontools_합침_${items.length}개.pdf`)
    } catch (e) {
      console.error('merge failed', e)
      alert('합치는 중 오류가 발생했어요.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [download, items])

  const handleSplitAll = useCallback(async () => {
    const item = items[0]
    if (!item) return
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const JSZip = (await import('jszip')).default
      const src = await PDFDocument.load(item.bytes, { ignoreEncryption: true })
      const zip = new JSZip()
      const base = item.name.replace(/\.pdf$/i, '')
      for (let i = 0; i < src.getPageCount(); i++) {
        setProgress(`분할 중… ${i + 1} / ${src.getPageCount()}`)
        const doc = await PDFDocument.create()
        const [page] = await doc.copyPages(src, [i])
        doc.addPage(page)
        zip.file(`${base}_${String(i + 1).padStart(2, '0')}.pdf`, await doc.save())
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.download = `${base}_분할.zip`
      a.href = createObjectUrl(blob)
      a.click()
    } catch (e) {
      console.error('split failed', e)
      alert('분할 중 오류가 발생했어요.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [createObjectUrl, items])

  const handleExtract = useCallback(async () => {
    const item = items[0]
    if (!item) return
    let indices: number[]
    try { indices = parseRanges(rangeText, item.pages) }
    catch (error) { alert(error instanceof Error ? error.message : '페이지 범위를 확인해주세요.'); return }
    if (indices.length === 0) {
      alert('추출할 페이지를 입력하세요. 예: 1-3, 5')
      return
    }
    setBusy(true)
    setProgress('추출 중…')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(item.bytes, { ignoreEncryption: true })
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      pages.forEach((p) => out.addPage(p))
      const base = item.name.replace(/\.pdf$/i, '')
      download(await out.save(), `${base}_추출.pdf`)
    } catch (e) {
      console.error('extract failed', e)
      alert('추출 중 오류가 발생했어요.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [download, items, rangeText])

  const single = mode === 'split'

  return (
    <div className="space-y-5">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        {([['merge', '여러 PDF 합치기'], ['split', '한 PDF 분할·추출']] as [Mode, string][]).map(([v, l]) => (
          <button
            key={v}
            onClick={() => {
              setMode(v)
              reset()
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {(single ? items.length === 0 : true) && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.length) addFiles(single ? [e.dataTransfer.files[0]] : e.dataTransfer.files)
          }}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <p className="font-medium text-gray-700">
            {single ? '분할할 PDF 한 개를 올려주세요' : 'PDF를 끌어다 놓거나 클릭해서 여러 개 선택'}
          </p>
          <p className="mt-1 text-sm text-gray-400">계약서·서류도 안심 — 서버로 전송되지 않아요</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple={!single}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-700">
              {single ? `${items[0].name} · ${items[0].pages}페이지` : `${items.length}개 · 위에서부터 합쳐지는 순서`}
            </p>
            <button onClick={reset} className="ml-auto text-sm text-gray-400 hover:text-gray-700">
              다시 선택
            </button>
          </div>
          {!single &&
            items.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
                <span className="w-6 shrink-0 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{it.name}</span>
                <span className="shrink-0 text-xs text-gray-400">{it.pages}p</span>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">↓</button>
                  <button onClick={() => remove(it.id)} className="rounded px-2 py-1 text-red-400 hover:bg-red-50">✕</button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 실행 */}
      {!single && items.length >= 2 && (
        <Button onClick={handleMerge} size="lg" className="w-full" disabled={busy}>
          {busy ? progress || '처리 중…' : `${items.length}개 PDF 하나로 합치기`}
        </Button>
      )}
      {!single && items.length === 1 && (
        <p className="text-center text-sm text-gray-400">합치려면 PDF를 2개 이상 올려주세요.</p>
      )}

      {single && items.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              페이지 추출 — 원하는 페이지만 뽑아 새 PDF로
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder={`예: 1-3, 5 (전체 ${items[0].pages}페이지)`}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <Button onClick={handleExtract} disabled={busy}>
                추출
              </Button>
            </div>
          </div>
          <Button onClick={handleSplitAll} size="lg" variant="outline" className="w-full" disabled={busy}>
            {busy ? progress || '처리 중…' : '모든 페이지 낱개로 분할 (ZIP)'}
          </Button>
        </div>
      )}
    </div>
  )
}
