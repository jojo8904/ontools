'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type Dir = 'rows' | 'cols'

interface Piece {
  i: number
  url: string
  blob: Blob
}

export function ImageSplit() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [isJpg, setIsJpg] = useState(false)
  const [dir, setDir] = useState<Dir>('rows')
  const [count, setCount] = useState(3)
  const [pieces, setPieces] = useState<Piece[]>([])
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setIsJpg(file.type === 'image/jpeg')
    setPieces([])
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
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
  }, [])

  const run = useCallback(async () => {
    if (!img) return
    setBusy(true)
    try {
      const W = img.naturalWidth
      const H = img.naturalHeight
      const type = isJpg ? 'image/jpeg' : 'image/png'
      const out: Piece[] = []
      for (let i = 0; i < count; i++) {
        let sx = 0
        let sy = 0
        let sw = W
        let sh = H
        if (dir === 'rows') {
          sh = Math.round(H / count)
          sy = Math.round((H * i) / count)
          if (i === count - 1) sh = H - sy
        } else {
          sw = Math.round(W / count)
          sx = Math.round((W * i) / count)
          if (i === count - 1) sw = W - sx
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
        const blob: Blob = await new Promise((res) => c.toBlob((b) => res(b!), type, 0.95))
        out.push({ i: i + 1, url: URL.createObjectURL(blob), blob })
      }
      setPieces(out)
    } finally {
      setBusy(false)
    }
  }, [img, count, dir, isJpg])

  const ext = isJpg ? 'jpg' : 'png'
  const base = fileName.replace(/\.[^.]+$/, '') || 'image'
  const dlOne = (p: Piece) => {
    const a = document.createElement('a')
    a.download = `${base}_${p.i}.${ext}`
    a.href = p.url
    a.click()
  }
  const dlZip = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    pieces.forEach((p) => zip.file(`${base}_${String(p.i).padStart(2, '0')}.${ext}`, p.blob))
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.download = `${base}_분할.zip`
    a.href = URL.createObjectURL(blob)
    a.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setPieces([])
  }

  if (!img) {
    return (
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
                onClick={() => setDir(v)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${dir === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">조각 수 {count}개</span>
          <input type="range" min={2} max={12} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))} />
        </div>
      </div>

      <Button onClick={run} size="lg" className="w-full" disabled={busy}>
        {busy ? '나누는 중…' : `${count}조각으로 나누기`}
      </Button>

      {pieces.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">{pieces.length}조각 완료</span>
            <Button onClick={dlZip} size="sm" className="ml-auto">
              전체 ZIP 다운로드
            </Button>
          </div>
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
