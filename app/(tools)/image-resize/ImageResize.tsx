'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type OutType = 'image/png' | 'image/jpeg'

export function ImageResize() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [outType, setOutType] = useState<OutType>('image/png')
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [lock, setLock] = useState(true)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultInfo, setResultInfo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const ratio = useRef(1)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setOutType(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png')
    setResultUrl(null)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      setW(image.naturalWidth)
      setH(image.naturalHeight)
      ratio.current = image.naturalWidth / image.naturalHeight
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요.')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [])

  const onW = (v: number) => {
    setW(v)
    if (lock && ratio.current) setH(Math.max(1, Math.round(v / ratio.current)))
  }
  const onH = (v: number) => {
    setH(v)
    if (lock && ratio.current) setW(Math.max(1, Math.round(v * ratio.current)))
  }
  const scaleBy = (p: number) => {
    if (!img) return
    setW(Math.max(1, Math.round(img.naturalWidth * p)))
    setH(Math.max(1, Math.round(img.naturalHeight * p)))
  }

  const run = useCallback(() => {
    if (!img || w < 1 || h < 1) return
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')!
    if (outType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
    }
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, w, h)
    c.toBlob(
      (b) => {
        if (!b) return
        setResultUrl(URL.createObjectURL(b))
        setResultInfo(`${w} × ${h}px · ${(b.size / 1024).toFixed(0)}KB`)
      },
      outType,
      0.92,
    )
  }, [img, w, h, outType])

  const download = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'image'
    a.download = `${base}_${w}x${h}.${outType === 'image/jpeg' ? 'jpg' : 'png'}`
    a.href = resultUrl
    a.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setResultUrl(null)
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
        <p className="mt-1 text-sm text-gray-400">서버로 전송되지 않아요 · 브라우저에서 바로 처리</p>
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
          원본: <strong>{img.naturalWidth} × {img.naturalHeight}px</strong>
        </span>
        <button onClick={reset} className="shrink-0 text-gray-400 hover:text-gray-700">
          다른 사진
        </button>
      </div>

      {/* 크기 입력 */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">가로(px)</label>
          <input
            type="number"
            value={w}
            min={1}
            onChange={(e) => onW(Math.max(1, parseInt(e.target.value, 10) || 0))}
            className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="pb-2 text-gray-400">×</div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">세로(px)</label>
          <input
            type="number"
            value={h}
            min={1}
            onChange={(e) => onH(Math.max(1, parseInt(e.target.value, 10) || 0))}
            className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-gray-600">
          <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
          비율 유지
        </label>
      </div>

      {/* 빠른 배율 + 출력 형식 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">빠른 배율</span>
        {([['25%', 0.25], ['50%', 0.5], ['75%', 0.75], ['원본', 1]] as const).map(([l, p]) => (
          <button
            key={l}
            onClick={() => scaleBy(p)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            {l}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-gray-400">형식</span>
        {([['PNG', 'image/png'], ['JPG', 'image/jpeg']] as [string, OutType][]).map(([l, t]) => (
          <button
            key={t}
            onClick={() => setOutType(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${outType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <Button onClick={run} size="lg" className="w-full">
        {w} × {h}px로 변환
      </Button>

      {resultUrl && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">완료 ✓</span>
            <span className="text-sm text-gray-500">{resultInfo}</span>
          </div>
          <img src={resultUrl} alt="변환 결과" className="mx-auto mb-4 max-h-72 rounded-lg border border-gray-100" />
          <Button onClick={download} size="lg" className="w-full">
            다운로드
          </Button>
        </div>
      )}
    </div>
  )
}
