'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

const PRESETS = [
  { label: '100KB', kb: 100 },
  { label: '200KB', kb: 200 },
  { label: '500KB', kb: 500 },
  { label: '1MB', kb: 1024 },
  { label: '2MB', kb: 2048 },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

interface Result {
  url: string
  size: number
  width: number
  height: number
  quality: number
  ok: boolean
}

/**
 * 목표 용량 이하로 압축.
 * 1) 현재 해상도에서 JPEG 품질을 이진탐색으로 최대한 높게 잡되 목표 이하로
 * 2) 최저 품질로도 목표를 못 맞추면 해상도를 줄여가며 재시도
 */
async function compressToTarget(
  img: HTMLImageElement,
  targetBytes: number,
): Promise<{ blob: Blob; width: number; height: number; quality: number; ok: boolean }> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const render = (w: number, h: number, q: number): Promise<Blob> => {
    canvas.width = w
    canvas.height = h
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    return new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', q),
    )
  }

  let width = img.naturalWidth
  let height = img.naturalHeight

  for (let step = 0; step < 14; step++) {
    const w = Math.max(1, Math.round(width))
    const h = Math.max(1, Math.round(height))

    // 최저 품질로도 목표 초과면 해상도를 줄여서 재시도
    const minBlob = await render(w, h, 0.05)
    if (minBlob.size > targetBytes) {
      if (w <= 120 || h <= 120) {
        // 더 줄이기 어려움 → 가능한 최소 결과 반환(목표 못 맞춤)
        return { blob: minBlob, width: w, height: h, quality: 0.05, ok: false }
      }
      width *= 0.85
      height *= 0.85
      continue
    }

    // 목표 이하인 가장 높은 품질을 이진탐색
    let lo = 0.05
    let hi = 0.95
    let best = minBlob
    let bestQ = 0.05
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2
      const blob = await render(w, h, mid)
      if (blob.size <= targetBytes) {
        best = blob
        bestQ = mid
        lo = mid
      } else {
        hi = mid
      }
    }
    return { blob: best, width: w, height: h, quality: bestQ, ok: true }
  }

  const fb = await render(Math.round(width), Math.round(height), 0.05)
  return { blob: fb, width: Math.round(width), height: Math.round(height), quality: 0.05, ok: false }
}

export function ImageCompress() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [targetKb, setTargetKb] = useState(200)
  const [customKb, setCustomKb] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요. (HEIC는 "HEIC → JPG 변환" 도구를 먼저 사용하세요)')
      return
    }
    setFileName(file.name)
    setOriginalSize(file.size)
    setResult(null)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요. 다른 파일을 시도해 주세요.')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [])

  const effectiveKb = customKb ? Math.max(1, parseInt(customKb, 10) || 0) : targetKb

  const handleCompress = useCallback(async () => {
    if (!img) return
    setProcessing(true)
    setResult(null)
    try {
      const targetBytes = effectiveKb * 1024
      const { blob, width, height, quality, ok } = await compressToTarget(img, targetBytes)
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        width,
        height,
        quality,
        ok,
      })
    } catch (e) {
      console.error('compress failed', e)
      alert('압축 중 오류가 발생했어요.')
    } finally {
      setProcessing(false)
    }
  }, [img, effectiveKb])

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'image'
    link.download = `${base}_${effectiveKb}KB.jpg`
    link.href = result.url
    link.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setOriginalSize(0)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      {/* 업로드 영역 */}
      {!img ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) loadFile(file)
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <svg className="mx-auto mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
          <p className="mt-1 text-sm text-gray-400">JPG, PNG, WebP 등 · 파일은 서버로 전송되지 않아요</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) loadFile(file)
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* 원본 정보 */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-800">{fileName}</p>
              <p className="text-sm text-gray-500">
                원본 {formatBytes(originalSize)} · {img.naturalWidth}×{img.naturalHeight}px
              </p>
            </div>
            <button onClick={reset} className="ml-3 shrink-0 text-sm text-gray-400 hover:text-gray-700">
              다른 사진
            </button>
          </div>

          {/* 목표 용량 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">목표 용량</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.kb}
                  onClick={() => {
                    setTargetKb(p.kb)
                    setCustomKb('')
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    !customKb && targetKb === p.kb
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="직접"
                  value={customKb}
                  onChange={(e) => setCustomKb(e.target.value)}
                  className="w-16 bg-transparent py-2 text-sm outline-none"
                />
                <span className="text-sm text-gray-500">KB</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCompress} className="flex-1" size="lg" disabled={processing}>
              {processing ? '압축 중…' : `${effectiveKb}KB 이하로 압축`}
            </Button>
          </div>

          {/* 결과 */}
          {result && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                {result.ok ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    목표 달성 ✓
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    최대한 압축됨
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {result.width}×{result.height}px
                </span>
              </div>

              <div className="mb-4 grid grid-cols-3 items-center gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-400">원본</p>
                  <p className="font-semibold text-gray-700">{formatBytes(originalSize)}</p>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div>
                  <p className="text-xs text-gray-400">압축 후</p>
                  <p className="font-bold text-blue-600">{formatBytes(result.size)}</p>
                </div>
              </div>

              {originalSize > 0 && (
                <p className="mb-4 text-center text-sm text-emerald-600">
                  {Math.max(0, Math.round((1 - result.size / originalSize) * 100))}% 용량 감소
                </p>
              )}

              <img
                src={result.url}
                alt="압축 결과 미리보기"
                className="mx-auto mb-4 max-h-64 rounded-lg border border-gray-100"
              />

              {!result.ok && (
                <p className="mb-3 text-center text-xs text-amber-600">
                  목표보다 작게는 못 줄였어요. 목표 용량을 조금 키우거나 더 작은 이미지를 사용해 보세요.
                </p>
              )}

              <Button onClick={handleDownload} size="lg" className="w-full">
                JPG 다운로드 ({formatBytes(result.size)})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
