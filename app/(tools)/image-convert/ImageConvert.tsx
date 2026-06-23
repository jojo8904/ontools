'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type OutType = 'image/png' | 'image/jpeg' | 'image/webp'

const LABELS: Record<OutType, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WEBP',
}
const EXT: Record<OutType, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

export function ImageConvert() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [srcType, setSrcType] = useState('')
  const [srcSize, setSrcSize] = useState(0)
  const [target, setTarget] = useState<OutType>('image/jpeg')
  const [quality, setQuality] = useState(92)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultInfo, setResultInfo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setSrcType(file.type || '알 수 없음')
    setSrcSize(file.size)
    setResultUrl(null)
    // 원본이 JPG면 기본 변환 대상은 PNG로, 그 외엔 JPG로
    setTarget(file.type === 'image/jpeg' ? 'image/png' : 'image/jpeg')
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요. (지원하지 않는 형식일 수 있어요)')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [])

  const run = useCallback(() => {
    if (!img) return
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')!
    if (target === 'image/jpeg') {
      // JPG는 투명 미지원 → 흰 배경
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, c.width, c.height)
    }
    ctx.drawImage(img, 0, 0)
    c.toBlob(
      (b) => {
        if (!b) return
        setResultUrl(URL.createObjectURL(b))
        const diff = srcSize > 0 ? Math.round((1 - b.size / srcSize) * 100) : 0
        const diffText = srcSize > 0 ? (diff > 0 ? ` (${diff}%↓)` : diff < 0 ? ` (${-diff}%↑)` : '') : ''
        setResultInfo(`${LABELS[target]} · ${(b.size / 1024).toFixed(0)}KB${diffText}`)
      },
      target,
      quality / 100,
    )
  }, [img, target, quality, srcSize])

  const download = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'image'
    a.download = `${base}.${EXT[target]}`
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
        <p className="mt-1 text-sm text-gray-400">PNG · JPG · WEBP 지원 · 서버로 전송되지 않아요</p>
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

  const showQuality = target === 'image/jpeg' || target === 'image/webp'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-sm">
        <span className="truncate text-gray-600">
          원본: <strong>{srcType.replace('image/', '').toUpperCase()}</strong> · {(srcSize / 1024).toFixed(0)}KB
        </span>
        <button onClick={reset} className="shrink-0 text-gray-400 hover:text-gray-700">
          다른 사진
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-gray-700">변환할 형식</span>
        <div className="flex gap-2">
          {(Object.keys(LABELS) as OutType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${target === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {LABELS[t]}
            </button>
          ))}
        </div>
        {showQuality && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">화질 {quality}%</label>
            <input
              type="range"
              min={40}
              max={100}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full max-w-xs"
            />
            <p className="mt-1 text-xs text-gray-400">낮출수록 용량이 작아져요. 보통 80~92% 추천.</p>
          </div>
        )}
      </div>

      <Button onClick={run} size="lg" className="w-full">
        {LABELS[target]}로 변환
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
