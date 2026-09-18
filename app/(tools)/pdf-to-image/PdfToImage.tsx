'use client'

import { useObjectUrls, downloadBlob } from '@/lib/useObjectUrls'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist'
import { trackToolEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/Button'

type OutType = 'image/jpeg' | 'image/png'

interface Page {
  n: number
  url: string
  blob: Blob
}

export function PdfToImage() {
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()

  const [fileName, setFileName] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [fmt, setFmt] = useState<OutType>('image/jpeg')
  const [hq, setHq] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const taskRef = useRef<PDFDocumentLoadingTask | null>(null)
  const jobRef = useRef(0)
  useEffect(() => () => { jobRef.current++; void taskRef.current?.destroy() }, [])

  const handle = useCallback(
    async (file: File) => {
      if (busy) return
      if (file.size > 50 * 1024 * 1024) { alert('50MB 이하 PDF를 선택해주세요.'); return }
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('PDF 파일만 올릴 수 있어요.')
        return
      }
      setFileName(file.name)
      setPages([])
      setBusy(true)
      setProgress('PDF 읽는 중…')
      const job = ++jobRef.current
      clearObjectUrls()
      try {
        const pdfjs = await import('pdfjs-dist')
        if (job !== jobRef.current) return
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker-${pdfjs.version}.min.mjs`
        const buf = await file.arrayBuffer()
        if (job !== jobRef.current) return
        // PDF.js 6 removed eval support entirely; the worker is pinned to this package.
        const task = pdfjs.getDocument({ data: buf, useSystemFonts: true })
        taskRef.current = task
        const pdf = await task.promise
        if (pdf.numPages > 50) throw new Error('한 번에 50페이지까지 변환할 수 있어요. PDF 분할 도구로 나눠주세요.')
        const scale = hq ? 2.5 : 1.6
        const out: Page[] = []
        let pixels = 0
        for (let n = 1; n <= pdf.numPages; n++) {
          if (job !== jobRef.current) return
          setProgress(`${n} / ${pdf.numPages} 페이지 변환 중…`)
          const page = await pdf.getPage(n)
          const viewport = page.getViewport({ scale })
          pixels += viewport.width * viewport.height
          if (viewport.width * viewport.height > 16_000_000 || pixels > 40_000_000) throw new Error('이미지 해상도가 너무 큽니다. 일반 화질이나 더 적은 페이지로 시도해주세요.')
          const c = document.createElement('canvas')
          c.width = Math.floor(viewport.width)
          c.height = Math.floor(viewport.height)
          const ctx = c.getContext('2d')!
          if (fmt === 'image/jpeg') {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, c.width, c.height)
          }
          await page.render({ canvas: c, canvasContext: ctx, viewport }).promise
          const blob: Blob = await new Promise((res, reject) => c.toBlob((b) => b ? res(b) : reject(new Error('이미지 인코딩에 실패했어요.')), fmt, 0.92))
          if (job !== jobRef.current) return
          out.push({ n, url: createObjectUrl(blob), blob })
          page.cleanup()
          c.width = c.height = 0
        }
        setPages(out)
        trackToolEvent('conversion_complete', '/pdf-to-image')
      } catch (e) {
        if (job !== jobRef.current) return
        clearObjectUrls()
        console.error('pdf->image failed', e)
        trackToolEvent('tool_error', '/pdf-to-image')
        alert(e instanceof Error ? e.message : 'PDF 변환 중 오류가 발생했어요.')
      } finally {
        if (job === jobRef.current) {
          await taskRef.current?.destroy().catch(() => {})
          taskRef.current = null
          setBusy(false)
          setProgress('')
        }
      }
    },
    [fmt, hq, busy, clearObjectUrls, createObjectUrl],
  )

  const ext = fmt === 'image/jpeg' ? 'jpg' : 'png'
  const base = fileName.replace(/\.[^.]+$/, '') || 'pdf'

  const downloadOne = (p: Page) => {
    const a = document.createElement('a')
    a.download = `${base}_${p.n}.${ext}`
    a.href = p.url
    a.click()
  }

  const downloadZip = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    pages.forEach((p) => zip.file(`${base}_${String(p.n).padStart(2, '0')}.${ext}`, p.blob))
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, `${base}_이미지.zip`)
  }

  const reset = () => {
    jobRef.current++
    void taskRef.current?.destroy()
    taskRef.current = null
    setBusy(false)
    clearObjectUrls()
    setPages([])
    setFileName('')
  }

  if (pages.length === 0 && !busy) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm">
          <span className="font-medium text-gray-400">출력 형식</span>
          {([['JPG', 'image/jpeg'], ['PNG', 'image/png']] as [string, OutType][]).map(([l, t]) => (
            <button
              key={t}
              onClick={() => setFmt(t)}
              className={`rounded-lg px-3 py-1.5 font-medium ${fmt === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {l}
            </button>
          ))}
          <label className="ml-2 flex cursor-pointer items-center gap-2 text-gray-600">
            <input type="checkbox" checked={hq} onChange={(e) => setHq(e.target.checked)} />
            고화질(느림)
          </label>
        </div>
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
            const f = e.dataTransfer.files?.[0]
            if (f) handle(f)
          }}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <p className="font-medium text-gray-700">PDF를 끌어다 놓거나 클릭해서 선택</p>
          <p className="mt-1 text-sm text-gray-400">페이지마다 이미지로 변환돼요 · 서버로 전송되지 않아요</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handle(f)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    )
  }

  if (busy) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="font-medium text-gray-700">변환 중…</p>
        <p className="mt-1 text-sm text-gray-400">{progress}</p>
        <Button onClick={reset} variant="outline" className="mt-4">취소</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">{pages.length}개 페이지</span>
        <div className="ml-auto flex gap-2">
          <Button onClick={downloadZip} size="sm">
            전체 ZIP 다운로드
          </Button>
          <button onClick={reset} className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:text-gray-700">
            다른 PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pages.map((p) => (
          <div key={p.n} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={p.url} alt={`${p.n}페이지`} className="aspect-[3/4] w-full bg-gray-50 object-contain" />
            <button
              onClick={() => downloadOne(p)}
              className="flex w-full items-center justify-between border-t border-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <span>{p.n}페이지</span>
              <span className="font-medium text-blue-600">저장 ↓</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
