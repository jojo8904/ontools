'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

type Mode = 'black' | 'mosaic'
interface Mask {
  x: number
  y: number
  w: number
  h: number
  mode: Mode
}

const DISPLAY_MAX = 760

/** 한 영역을 모자이크(픽셀화) 처리 — 이미 그려진 캔버스 픽셀을 블록 단위로 뭉갬.
 *  block = 한 모자이크 칸의 픽셀 크기(클수록 더 강하게 뭉개짐). */
function pixelate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, block: number) {
  if (w < 2 || h < 2) return
  const tw = Math.max(1, Math.round(w / block))
  const th = Math.max(1, Math.round(h / block))
  const tmp = document.createElement('canvas')
  tmp.width = tw
  tmp.height = th
  const tctx = tmp.getContext('2d')!
  tctx.imageSmoothingEnabled = false
  tctx.drawImage(ctx.canvas, x, y, w, h, 0, 0, tw, th)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h)
  ctx.imageSmoothingEnabled = true
}

/** target 캔버스에 이미지 + 마스크 + 워터마크를 scale 배율로 렌더 */
function renderAll(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  masks: Mask[],
  scale: number,
  watermark: string,
  dragRect: Mask | null,
  mosaicBlock: number,
) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  for (const m of masks) {
    const x = m.x * scale
    const y = m.y * scale
    const mw = m.w * scale
    const mh = m.h * scale
    if (m.mode === 'black') {
      ctx.fillStyle = '#000000'
      ctx.fillRect(x, y, mw, mh)
    } else {
      pixelate(ctx, x, y, mw, mh, Math.max(2, mosaicBlock * scale))
    }
  }

  if (dragRect) {
    ctx.save()
    ctx.strokeStyle = dragRect.mode === 'black' ? '#111827' : '#2563eb'
    ctx.setLineDash([5, 4])
    ctx.lineWidth = 2
    ctx.strokeRect(dragRect.x, dragRect.y, dragRect.w, dragRect.h)
    ctx.restore()
  }

  if (watermark.trim()) {
    ctx.save()
    ctx.globalAlpha = 0.22
    ctx.fillStyle = '#ff2d2d'
    const fontSize = Math.max(16, Math.round(w / 22))
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.translate(w / 2, h / 2)
    ctx.rotate((-28 * Math.PI) / 180)
    const stepX = ctx.measureText(watermark).width + fontSize * 3
    const stepY = fontSize * 4
    for (let gy = -h; gy < h; gy += stepY) {
      for (let gx = -w; gx < w; gx += stepX) {
        ctx.fillText(watermark, gx, gy)
      }
    }
    ctx.restore()
  }
}

export function ImageMask() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [masks, setMasks] = useState<Mask[]>([])
  const [mode, setMode] = useState<Mode>('mosaic')
  const [mosaicBlock, setMosaicBlock] = useState(12)
  const [watermark, setWatermark] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const dragRect = useRef<Mask | null>(null)
  const displayScale = useRef(1)

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setMasks([])
    setResultUrl(null)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요.')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [])

  // 이미지/마스크/워터마크 변경 시 디스플레이 캔버스 다시 그림
  useEffect(() => {
    if (!img) return
    const canvas = canvasRef.current
    if (!canvas) return
    const dispW = Math.min(img.naturalWidth, DISPLAY_MAX)
    const scale = dispW / img.naturalWidth
    displayScale.current = scale
    canvas.width = dispW
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')!
    // 디스플레이에서는 마스크가 이미 디스플레이 좌표라 scale=1로 렌더
    renderAll(ctx, img, masks, 1, watermark, dragRect.current, mosaicBlock)
  }, [img, masks, watermark, mosaicBlock])

  const toCanvasCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const sy = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toCanvasCoords(e)
    dragStart.current = p
    dragRect.current = { x: p.x, y: p.y, w: 0, h: 0, mode }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || !img) return
    const p = toCanvasCoords(e)
    const s = dragStart.current
    const r: Mask = {
      x: Math.min(s.x, p.x),
      y: Math.min(s.y, p.y),
      w: Math.abs(p.x - s.x),
      h: Math.abs(p.y - s.y),
      mode,
    }
    dragRect.current = r
    const ctx = canvasRef.current!.getContext('2d')!
    renderAll(ctx, img, masks, 1, watermark, r, mosaicBlock)
  }

  const onPointerUp = () => {
    if (!dragStart.current) return
    const r = dragRect.current
    dragStart.current = null
    dragRect.current = null
    if (r && r.w > 5 && r.h > 5) {
      setMasks((prev) => [...prev, r])
    } else if (img) {
      const ctx = canvasRef.current!.getContext('2d')!
      renderAll(ctx, img, masks, 1, watermark, null, mosaicBlock)
    }
  }

  const undo = () => setMasks((prev) => prev.slice(0, -1))
  const clearMasks = () => setMasks([])

  const handleExport = useCallback(() => {
    if (!img) return
    const out = document.createElement('canvas')
    out.width = img.naturalWidth
    out.height = img.naturalHeight
    const ctx = out.getContext('2d')!
    // 마스크는 디스플레이 좌표 → 실제 해상도로 확대
    const exportScale = 1 / displayScale.current
    renderAll(ctx, img, masks, exportScale, watermark, null, mosaicBlock)
    out.toBlob((blob) => {
      if (!blob) return
      setResultUrl(URL.createObjectURL(blob))
    }, 'image/png')
  }, [img, masks, watermark, mosaicBlock])

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'masked'
    link.download = `${base}_마스킹.png`
    link.href = resultUrl
    link.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setMasks([])
    setResultUrl(null)
  }

  return (
    <div className="space-y-6">
      {!img ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f) loadFile(f)
          }}
          className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center hover:bg-gray-100"
        >
          <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
          <p className="mt-1 text-sm text-gray-400">신분증·통장 등 · 서버로 전송되지 않아요</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) loadFile(f)
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* 도구 바 */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-400">가리기 방식</span>
              <button
                onClick={() => setMode('mosaic')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === 'mosaic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                ▦ 모자이크
              </button>
              <button
                onClick={() => setMode('black')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mode === 'black' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                ⬛ 검은칠
              </button>
              {mode === 'mosaic' && (
                <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
                  <span className="px-1.5 text-xs text-gray-400">강도</span>
                  {([['약', 8], ['보통', 12], ['강', 20]] as const).map(([label, v]) => (
                    <button
                      key={v}
                      onClick={() => setMosaicBlock(v)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${mosaicBlock === v ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={undo} disabled={masks.length === 0} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40">
                실행취소
              </button>
              <button onClick={clearMasks} disabled={masks.length === 0} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40">
                전체삭제
              </button>
              <button onClick={reset} className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:text-gray-700">
                다른 사진
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            가릴 부분을 <strong>마우스(또는 손가락)로 드래그</strong>하세요. <strong>모자이크</strong>(흐리게)와 <strong>검은칠</strong> 중 고를 수 있고, 모자이크는 강도(약·보통·강)를 조절할 수 있어요. 내보내면 사진의 위치정보(EXIF)도 함께 제거됩니다.
          </p>

          {/* 캔버스 */}
          <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="mx-auto block max-w-full cursor-crosshair touch-none"
            />
          </div>

          {/* 워터마크 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">워터마크 (선택) — 예: "○○은행 제출용"</label>
            <input
              type="text"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              placeholder="제출처를 적으면 사진 전체에 반복 표시됩니다"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <Button onClick={handleExport} className="w-full" size="lg">
            마스킹 적용해서 내보내기
          </Button>

          {resultUrl && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">완료 ✓</span>
                <span className="text-sm text-gray-500">위치정보(EXIF) 제거됨</span>
              </div>
              <img src={resultUrl} alt="마스킹 결과" className="mx-auto mb-4 max-h-72 rounded-lg border border-gray-100" />
              <Button onClick={handleDownload} size="lg" className="w-full">
                PNG 다운로드
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
