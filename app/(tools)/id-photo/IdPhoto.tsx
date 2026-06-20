'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const DPI = 300
const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI)

const SPECS = [
  { id: 'passport', label: '여권/운전면허 (3.5×4.5cm)', wmm: 35, hmm: 45 },
  { id: 'id', label: '증명·반명함 (3×4cm)', wmm: 30, hmm: 40 },
  { id: 'visa', label: '미국 비자 (2×2inch)', wmm: 50.8, hmm: 50.8 },
]

const FRAME_MAX = 340

export function IdPhoto() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [specId, setSpecId] = useState('passport')
  const [zoom, setZoom] = useState(1)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const offset = useRef({ x: 0, y: 0 })
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null)

  const spec = SPECS.find((s) => s.id === specId)!
  const specPxW = mmToPx(spec.wmm)
  const specPxH = mmToPx(spec.hmm)

  // 프레임 디스플레이 크기 (긴 변 기준 FRAME_MAX)
  const Fh = spec.hmm >= spec.wmm ? FRAME_MAX : Math.round((FRAME_MAX * spec.hmm) / spec.wmm)
  const Fw = Math.round((Fh * spec.wmm) / spec.hmm)

  const baseScale = img ? Math.max(Fw / img.naturalWidth, Fh / img.naturalHeight) : 1

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, sf: number) => {
      if (!img) return
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      const drawW = img.naturalWidth * baseScale * zoom * sf
      const drawH = img.naturalHeight * baseScale * zoom * sf
      ctx.drawImage(img, offset.current.x * sf, offset.current.y * sf, drawW, drawH)
    },
    [img, baseScale, zoom],
  )

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    canvas.width = Fw
    canvas.height = Fh
    render(canvas.getContext('2d')!, 1)
  }, [img, Fw, Fh, render])

  const centerImage = useCallback(() => {
    if (!img) return
    offset.current = {
      x: (Fw - img.naturalWidth * baseScale * zoom) / 2,
      y: (Fh - img.naturalHeight * baseScale * zoom) / 2,
    }
  }, [img, Fw, Fh, baseScale, zoom])

  // 이미지/스펙/줌 변경 시 중앙 정렬 후 다시 그림
  useEffect(() => {
    if (!img) return
    centerImage()
    redraw()
    setResultUrl(null)
  }, [img, specId, zoom, centerImage, redraw])

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setResultUrl(null)
    setZoom(1)
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

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { px: e.clientX, py: e.clientY, ox: offset.current.x, oy: offset.current.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const dx = (e.clientX - dragRef.current.px) * sx
    const dy = (e.clientY - dragRef.current.py) * sx
    offset.current = { x: dragRef.current.ox + dx, y: dragRef.current.oy + dy }
    redraw()
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  const handleExport = () => {
    if (!img) return
    const out = document.createElement('canvas')
    out.width = specPxW
    out.height = specPxH
    const sf = specPxW / Fw
    render(out.getContext('2d')!, sf)
    out.toBlob(
      (blob) => {
        if (blob) setResultUrl(URL.createObjectURL(blob))
      },
      'image/jpeg',
      0.95,
    )
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'idphoto'
    link.download = `${base}_${spec.wmm}x${spec.hmm}.jpg`
    link.href = resultUrl
    link.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setResultUrl(null)
    setZoom(1)
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
          <p className="font-medium text-gray-700">사진을 끌어다 놓거나 클릭해서 선택</p>
          <p className="mt-1 text-sm text-gray-400">정면 얼굴 사진 권장 · 서버로 전송되지 않아요</p>
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
        <div className="space-y-5">
          {/* 규격 선택 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">규격 선택</label>
            <div className="flex flex-wrap gap-2">
              {SPECS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSpecId(s.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    specId === s.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              출력 크기: {specPxW}×{specPxH}px (300dpi · {spec.wmm}×{spec.hmm}mm)
            </p>
          </div>

          {/* 크롭 프레임 */}
          <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{ width: Fw, height: Fh }}
              className="cursor-move touch-none rounded border border-gray-300 shadow-sm"
            />
            <p className="text-xs text-gray-400">드래그로 위치 조정 · 아래 슬라이더로 확대</p>
            <div className="flex w-full max-w-xs items-center gap-3">
              <span className="text-xs text-gray-400">축소</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-400">확대</span>
            </div>
            <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-700">
              다른 사진
            </button>
          </div>

          <Button onClick={handleExport} className="w-full" size="lg">
            증명사진 만들기
          </Button>

          {resultUrl && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <p className="mb-3 text-sm font-medium text-gray-700">
                완성! ({specPxW}×{specPxH}px)
              </p>
              <img src={resultUrl} alt="증명사진 결과" className="mx-auto mb-4 max-h-64 rounded border border-gray-200" />
              <Button onClick={handleDownload} size="lg" className="w-full">
                JPG 다운로드
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
