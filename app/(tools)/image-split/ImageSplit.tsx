'use client'

import { useObjectUrls } from '@/lib/useObjectUrls'

import { useState, useRef, useCallback } from 'react'
import { printPlacement, createPrintPdf } from '@/features/image-split/print'
import { useLocalTask } from '@/lib/useLocalTask'
import { Button } from '@/components/ui/Button'

type Dir = 'rows' | 'cols'

interface Piece {
  i: number
  url: string
  blob: Blob
  width: number
  height: number
}

export function ImageSplit() {
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()

  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [isJpg, setIsJpg] = useState(false)
  const [dir, setDir] = useState<Dir>('rows')
  const [count, setCount] = useState(3)
  const [pieces, setPieces] = useState<Piece[]>([])
  const { busy, error, run: task, cancel } = useLocalTask()
  const [margin, setMargin] = useState(10)
  const generation = useRef(0)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    const version = ++generation.current
    cancel()
    setImg(null)
    clearObjectUrls()
    setFileName(file.name)
    setIsJpg(file.type === 'image/jpeg')
    setPieces([])
    const url = createObjectUrl(file)
    const image = new Image()
    image.onload = () => {
      if (version !== generation.current) return
      setImg(image)
      // 가로로 긴 사진이면 세로 분할(cols)을 기본으로 추천
      setDir(image.naturalWidth > image.naturalHeight * 1.3 ? 'cols' : 'rows')
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요.')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [createObjectUrl, clearObjectUrls, cancel])

  const run = useCallback(async () => {
    if (!img) return
    await task(async (signal) => {
      setPieces([])
      clearObjectUrls()
      const W = img.naturalWidth
      const H = img.naturalHeight
      const type = isJpg ? 'image/jpeg' : 'image/png'
      const out: Piece[] = []
      if ((dir === 'rows' ? H : W) < count) throw new Error('이미지 픽셀 수보다 조각 수가 많아요.')
      for (let i = 0; i < count; i++) {
        let sx = 0
        let sy = 0
        let sw = W
        let sh = H
        if (dir === 'rows') {
          sy = Math.round((H * i) / count)
          sh = Math.round(H * (i + 1) / count) - sy
        } else {
          sx = Math.round((W * i) / count)
          sw = Math.round(W * (i + 1) / count) - sx
        }
        const c = document.createElement('canvas')
        c.width = sw
        c.height = sh
        const ctx = c.getContext('2d')!
        if (isJpg) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, sw, sh)
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
        const blob = await new Promise<Blob>((res, reject) => c.toBlob((b) => b ? res(b) : reject(new Error('이미지를 저장하지 못했어요.')), type, 0.95))
        if (signal.aborted) return
        out.push({ i: i + 1, url: createObjectUrl(blob), blob, width: sw, height: sh })
      }
      setPieces(out)
    })
  }, [img, isJpg, count, dir, createObjectUrl, clearObjectUrls, task])

  const ext = isJpg ? 'jpg' : 'png'
  const base = fileName.replace(/\.[^.]+$/, '') || 'image'
  const dlOne = (p: Piece) => {
    const a = document.createElement('a')
    a.download = `${base}_${p.i}.${ext}`
    a.href = p.url
    a.click()
  }
  const dlZip = async (signal: AbortSignal) => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    pieces.forEach((p) => zip.file(`${base}_${String(p.i).padStart(2, '0')}.${ext}`, p.blob))
    const blob = await zip.generateAsync({ type: 'blob' })
    if (signal.aborted) return
    const a = document.createElement('a')
    a.download = `${base}_분할.zip`
    a.href = createObjectUrl(blob)
    a.click()
  }

  const reset = () => {
    generation.current++
    cancel()
    clearObjectUrls()
    setImg(null)
    setFileName('')
    setPieces([])
  }

  if (!img) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="이미지 선택"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
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
          if (f) load(f)
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
        <p className="mt-1 text-sm text-gray-400">긴 캡처·파노라마를 여러 장으로 · 서버로 전송되지 않아요</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) load(f)
            e.target.value = ''
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-sm">
        <span className="truncate text-gray-600">
          {img.naturalWidth} × {img.naturalHeight}px
        </span>
        <button onClick={reset} className="shrink-0 text-gray-400 hover:text-gray-700">
          다른 사진
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">자르는 방향</span>
          <div className="flex gap-2">
            {([['rows', '위→아래 (세로로 긴 캡처)'], ['cols', '좌→우 (가로로 긴 파노라마)']] as [Dir, string][]).map(([v, l]) => (
              <button
                key={v}
                disabled={busy}
                aria-pressed={dir === v}
                onClick={() => { setDir(v); setPieces([]) }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${dir === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">조각 수 {count}개</span>
          <input aria-label="조각 수" disabled={busy} type="range" min={2} max={12} value={count} onChange={(e) => { setCount(parseInt(e.target.value, 10)); setPieces([]) }} />
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <Button onClick={run} size="lg" className="w-full" disabled={busy}>
        {busy ? '나누는 중…' : `${count}조각으로 나누기`}
      </Button>

      {pieces.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">{pieces.length}조각 완료</span>
            <Button disabled={busy} onClick={() => task(async (signal) => { if (!signal.aborted) await dlZip(signal) })} size="sm" className="ml-auto">
              전체 ZIP 다운로드
            </Button>
          </div>
          <section className="space-y-3 rounded-xl border p-4" aria-label="A4 인쇄 미리보기">
            <h3 className="font-semibold">A4 인쇄 미리보기 · 세로 210 × 297mm</h3>
            <label className="block text-sm">페이지 여백 (mm)
              <select aria-label="페이지 여백 (mm)" value={margin} disabled={busy} onChange={(e) => setMargin(Number(e.target.value))} className="ml-2 rounded border p-2">
                {[0, 5, 10, 15, 20, 30].map((m) => <option key={m} value={m}>{m}mm</option>)}
              </select>
            </label>
            <p className="text-sm text-gray-600">조각 1개를 A4 한 장에 비율 유지·가운데 맞춤합니다. 이어 붙이는 포스터 방식이 아니므로 조각별 배율이 다를 수 있습니다. 겹침은 없으며, 인쇄할 때 A4·실제 크기(100%)를 선택하세요. 0mm는 프린터에서 가장자리가 잘릴 수 있어요.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pieces.map((p) => {
                const box = printPlacement(p.width, p.height, margin)
                return <div key={p.i}><div className="relative w-full border bg-white shadow-sm" style={{ aspectRatio: '210 / 297' }}>
                  <img src={p.url} alt={`A4 ${p.i}페이지`} className="absolute" style={{ left: `${box.x / 210 * 100}%`, top: `${box.y / 297 * 100}%`, width: `${box.width / 210 * 100}%`, height: `${box.height / 297 * 100}%` }} />
                </div><p className="text-center text-xs">{p.i} / {pieces.length}</p></div>
              })}
            </div>
            <Button disabled={busy} onClick={() => task(async (signal) => {
              const bytes = await createPrintPdf(pieces.map((p) => p.blob), margin)
              if (signal.aborted) return
              const a = document.createElement('a')
              a.href = createObjectUrl(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
              a.download = `${base}_A4.pdf`
              a.click()
            })}>A4 PDF 다운로드</Button>
          </section>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {pieces.map((p) => (
              <div key={p.i} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img src={p.url} alt={`${p.i}조각`} className="aspect-square w-full bg-gray-50 object-contain" />
                <button
                  onClick={() => dlOne(p)}
                  className="flex w-full items-center justify-between border-t border-gray-100 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <span>{p.i}</span>
                  <span className="font-medium text-blue-600">저장 ↓</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
