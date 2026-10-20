'use client'

import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'
import { Button } from '@/components/ui/Button'
import { useObjectUrls } from '@/lib/useObjectUrls'
import { loadEditablePdf, MAX_PDF_BYTES, saveEditedPdf, type EditablePage } from '@/lib/pdf-editor'

export function PdfPageEditor() {
  const [source, setSource] = useState<{ bytes: ArrayBuffer; name: string } | null>(null)
  const [pages, setPages] = useState<EditablePage[]>([])
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({})
  const [batch, setBatch] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const pdf = useRef<PDFDocumentProxy | null>(null)
  const task = useRef<PDFDocumentLoadingTask | null>(null)
  const generation = useRef(0)
  const lock = useRef(false)
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()
  useEffect(() => () => { generation.current++; void task.current?.destroy() }, [])

  const reset = () => {
    generation.current++
    void task.current?.destroy().catch(() => {})
    task.current = null
    pdf.current = null
    clearObjectUrls()
    setSource(null); setPages([]); setThumbnails({}); setBatch(0); setMessage(''); setBusy(false); lock.current = false
  }

  async function open(file: File) {
    if (lock.current) return
    reset()
    if (file.size > MAX_PDF_BYTES) { setMessage('50MB 이하 PDF를 선택해주세요.'); return }
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { setMessage('PDF 파일을 선택해주세요.'); return }
    const job = generation.current
    lock.current = true; setBusy(true)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await loadEditablePdf(bytes)
      const pdfjs = await import('pdfjs-dist')
      if (job !== generation.current) return
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker-${pdfjs.version}.min.mjs`
      const loading = pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true })
      task.current = loading
      // Reject encrypted documents rather than leaving a password prompt pending.
      loading.onPassword = () => { void loading.destroy() }
      pdf.current = await loading.promise
      if (job !== generation.current) return
      setSource({ bytes, name: file.name })
      setPages(doc.getPageIndices().map(index => ({ index, rotation: 0 })))
    } catch {
      if (job === generation.current) { void task.current?.destroy().catch(() => {}); pdf.current = null; setMessage('PDF를 읽지 못했어요. 손상·암호화 PDF는 지원하지 않아요. 다른 파일을 선택해주세요.') }
    } finally { if (job === generation.current) { lock.current = false; setBusy(false) } }
  }

  // Only twelve small canvases are retained. Render sequentially and release on paging/reset.
  useEffect(() => {
    if (!source || !pdf.current) return
    let cancelled = false
    const document = pdf.current
    setThumbnails({})
    const urls: string[] = []
    const active: { cancel(): void }[] = []
    void (async () => {
      for (const entry of pages.slice(batch * 12, batch * 12 + 12)) {
        if (cancelled) break
        const page = await document.getPage(entry.index + 1)
        const natural = page.getViewport({ scale: 1 })
        const viewport = page.getViewport({ scale: 180 / Math.max(natural.width, natural.height), rotation: page.rotate + entry.rotation })
        const canvas = window.document.createElement('canvas')
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
        const rendering = page.render({ canvas, viewport })
        active.push(rendering)
        await rendering.promise
        if (cancelled) break
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
        canvas.width = canvas.height = 0
        page.cleanup()
        if (cancelled || !blob) continue
        const url = URL.createObjectURL(blob); urls.push(url)
        setThumbnails(prev => ({ ...prev, [entry.index]: url }))
      }
    })().catch(() => { if (!cancelled) setMessage('일부 미리보기를 표시하지 못했어요. 저장을 시도하거나 다른 PDF를 선택해주세요.') })
    return () => { cancelled = true; active.forEach(render => render.cancel()); urls.forEach(url => URL.revokeObjectURL(url)) }
  }, [source, pages, batch])

  function move(position: number, delta: number) {
    setPages(prev => {
      const next = [...prev], target = position + delta
      if (target < 0 || target >= next.length) return prev
      ;[next[position], next[target]] = [next[target], next[position]]
      return next
    })
    setMessage('페이지 순서를 변경했어요.')
  }

  async function save() {
    if (!source || lock.current) return
    const job = generation.current
    lock.current = true; setBusy(true); setMessage('저장 중…')
    try {
      const bytes = await saveEditedPdf(source.bytes, pages)
      if (job !== generation.current) return
      const a = document.createElement('a')
      a.href = createObjectUrl(new Blob([bytes as BlobPart], { type: 'application/pdf' }), 'edited')
      a.download = `${source.name.replace(/\.pdf$/i, '')}_편집.pdf`; a.click()
      setMessage('편집한 PDF를 저장했어요. 원본 파일은 그대로예요.')
    } catch { if (job === generation.current) setMessage('저장하지 못했어요. 다시 시도하거나 다른 PDF를 선택해주세요.') }
    finally { if (job === generation.current) { lock.current = false; setBusy(false) } }
  }

  return <div className="space-y-4">
    <p className="text-sm text-gray-600">무료 · 브라우저 안에서 처리 · 원본 보존. 최대 50MB, 200페이지. 미리보기는 12페이지씩 표시해요.</p>
    <label className="block">편집할 PDF<input aria-label="편집할 PDF" type="file" accept="application/pdf,.pdf" disabled={busy} className="block w-full py-3" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void open(file) }} /></label>
    <p role="status" aria-live="polite">{busy ? message || 'PDF 읽는 중…' : message}</p>
    {source && <>
      <p className="break-all">{source.name} · 남은 {pages.length}페이지</p>
      <Button variant="outline" onClick={reset}>작업 초기화</Button>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pages.slice(batch * 12, batch * 12 + 12).map((entry, offset) => {
          const position = batch * 12 + offset
          return <section key={entry.index} aria-label={`원본 ${entry.index + 1}페이지`} className="rounded-lg border p-3">
            <p>저장 순서 {position + 1} · 원본 {entry.index + 1}페이지 · 추가 회전 {entry.rotation}°</p>
            <div className="flex h-48 items-center justify-center bg-gray-50">{thumbnails[entry.index] ? <img src={thumbnails[entry.index]} alt={`원본 ${entry.index + 1}페이지 미리보기`} className="max-h-44 max-w-full" /> : <span>미리보기 준비 중…</span>}</div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button className="min-h-11 rounded border px-3 disabled:opacity-40" disabled={busy || position === 0} onClick={() => move(position, -1)}>앞으로</button>
              <button className="min-h-11 rounded border px-3 disabled:opacity-40" disabled={busy || position === pages.length - 1} onClick={() => move(position, 1)}>뒤로</button>
              <button className="min-h-11 rounded border px-3" disabled={busy} onClick={() => setPages(prev => prev.map(p => p.index === entry.index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))}>90° 회전</button>
              <button className="min-h-11 rounded border px-3 disabled:opacity-40" disabled={busy || pages.length === 1} onClick={() => { setPages(prev => prev.length > 1 ? prev.filter(p => p.index !== entry.index) : prev); setBatch(0); setMessage('페이지를 삭제했어요. 초기화하면 원본에서 다시 시작할 수 있어요.') }}>삭제</button>
            </div>
          </section>
        })}
      </div>
      <div className="flex items-center gap-3"><Button variant="outline" disabled={batch === 0} onClick={() => setBatch(n => n - 1)}>이전 미리보기</Button><span>{batch + 1} / {Math.ceil(pages.length / 12)}</span><Button variant="outline" disabled={(batch + 1) * 12 >= pages.length} onClick={() => setBatch(n => n + 1)}>다음 미리보기</Button></div>
      <p className="text-sm">버튼은 Tab으로 이동하고 Enter 또는 Space로 실행할 수 있어요. 마지막 페이지는 삭제할 수 없어요.</p>
      <Button disabled={busy} onClick={save}>편집한 PDF 저장</Button>
    </>}
  </div>
}
