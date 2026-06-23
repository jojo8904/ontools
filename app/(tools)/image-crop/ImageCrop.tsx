'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const DISPLAY_MAX = 760
type Rect = { x: number; y: number; w: number; h: number }

const PRESETS: [string, number | null][] = [
  ['자유', null],
  ['1:1 정사각', 1],
  ['4:5 인스타', 4 / 5],
  ['3:4', 3 / 4],
  ['16:9 썸네일', 16 / 9],
  ['9:16 스토리', 9 / 16],
]

export function ImageCrop() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [isJpg, setIsJpg] = useState(false)
  const [aspect, setAspect] = useState<number | null>(null)
  const [crop, setCrop] = useState<Rect | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultInfo, setResultInfo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scaleRef = useRef(1) // display / natural
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const live = useRef<Rect | null>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setIsJpg(file.type === 'image/jpeg')
    setResultUrl(null)
    setAspect(null)
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

  // 이미지 로드 → 캔버스 셋업 + 기본 크롭(전체)
  useEffect(() => {
    if (!img) return
    const canvas = canvasRef.current
    if (!canvas) return
    const dispW = Math.min(img.naturalWidth, DISPLAY_MAX)
    const scale = dispW / img.naturalWidth
    scaleRef.current = scale
    canvas.width = dispW
    canvas.height = Math.round(img.naturalHeight * scale)
    setCrop({ x: 0, y: 0, w: canvas.width, h: canvas.height })
  }, [img])

  const draw = useCallback(
    (rect: Rect | null) => {
      const canvas = canvasRef.current
      if (!canvas || !img) return
      const ctx = canvas.getContext('2d')!
      const cw = canvas.width
      const ch = canvas.height
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, 0, 0, cw, ch)
      if (rect && rect.w > 0 && rect.h > 0) {
        ctx.fillStyle = 'rgba(17,24,39,0.45)'
        ctx.fillRect(0, 0, cw, ch)
        const s = scaleRef.current
        ctx.drawImage(img, rect.x / s, rect.y / s, rect.w / s, rect.h / s, rect.x, rect.y, rect.w, rect.h)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
      }
    },
    [img],
  )

  useEffect(() => {
    draw(crop)
  }, [crop, draw])

  const toCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const r = canvas.getBoundingClientRect()
    const sx = canvas.width / r.width
    const sy = canvas.height / r.height
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  const rectFrom = (s: { x: number; y: number }, p: { x: number; y: number }): Rect => {
    const canvas = canvasRef.current!
    const px = Math.max(0, Math.min(p.x, canvas.width))
    const py = Math.max(0, Math.min(p.y, canvas.height))
    const signX = px >= s.x ? 1 : -1
    const signY = py >= s.y ? 1 : -1
    let w = Math.abs(px - s.x)
    let h = aspect ? w / aspect : Math.abs(py - s.y)
    let x = signX > 0 ? s.x : s.x - w
    let y = signY > 0 ? s.y : s.y - h
    if (x < 0) {
      w += x
      x = 0
      if (aspect) h = w / aspect
      if (signY < 0) y = s.y - h
    }
    if (y < 0) {
      h += y
      y = 0
      if (aspect) {
        w = h * aspect
        if (signX < 0) x = s.x - w
      }
    }
    if (x + w > canvas.width) {
      w = canvas.width - x
      if (aspect) h = w / aspect
    }
    if (y + h > canvas.height) {
      h = canvas.height - y
      if (aspect) {
        w = h * aspect
        if (x + w > canvas.width) w = canvas.width - x
      }
    }
    return { x, y, w: Math.max(0, w), h: Math.max(0, h) }
  }

  const onDown = (e: React.PointerEvent) => {
    if (!img) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toCoords(e)
    dragStart.current = p
    live.current = { x: p.x, y: p.y, w: 0, h: 0 }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragStart.current || !img) return
    const r = rectFrom(dragStart.current, toCoords(e))
    live.current = r
    draw(r)
  }
  const onUp = () => {
    if (!dragStart.current) return
    const r = live.current
    dragStart.current = null
    live.current = null
    if (r && r.w > 8 && r.h > 8) setCrop(r)
    else draw(crop)
  }

  const pickAspect = (a: number | null) => {
    setAspect(a)
    if (a && crop) {
      const canvas = canvasRef.current!
      const cx = crop.x + crop.w / 2
      const cy = crop.y + crop.h / 2
      let w = crop.w
      let h = w / a
      if (h > canvas.height) {
        h = canvas.height
        w = h * a
      }
      if (w > canvas.width) {
        w = canvas.width
        h = w / a
      }
      let x = cx - w / 2
      let y = cy - h / 2
      x = Math.max(0, Math.min(x, canvas.width - w))
      y = Math.max(0, Math.min(y, canvas.height - h))
      setCrop({ x, y, w, h })
    }
  }

  const run = useCallback(() => {
    if (!img || !crop || crop.w < 1 || crop.h < 1) return
    const inv = 1 / scaleRef.current
    const sw = Math.max(1, Math.round(crop.w * inv))
    const sh = Math.max(1, Math.round(crop.h * inv))
    const c = document.createElement('canvas')
    c.width = sw
    c.height = sh
    const ctx = c.getContext('2d')!
    if (isJpg) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, sw, sh)
    }
    ctx.drawImage(img, crop.x * inv, crop.y * inv, sw, sh, 0, 0, sw, sh)
    const type = isJpg ? 'image/jpeg' : 'image/png'
    c.toBlob(
      (b) => {
        if (!b) return
        setResultUrl(URL.createObjectURL(b))
        setResultInfo(`${sw} × ${sh}px · ${(b.size / 1024).toFixed(0)}KB`)
      },
      type,
      0.92,
    )
  }, [img, crop, isJpg])

  const download = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'image'
    a.download = `${base}_crop.${isJpg ? 'jpg' : 'png'}`
    a.href = resultUrl
    a.click()
  }

  const reset = () => {
    setImg(null)
    setFileName('')
    setResultUrl(null)
    setCrop(null)
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
        <p className="mt-1 text-sm text-gray-400">인스타 정사각·유튜브 썸네일 규격 지원 · 서버로 전송되지 않아요</p>
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">비율</span>
        {PRESETS.map(([l, a]) => (
          <button
            key={l}
            onClick={() => pickAspect(a)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${aspect === a ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {l}
          </button>
        ))}
        <button onClick={reset} className="ml-auto text-sm text-gray-400 hover:text-gray-700">
          다른 사진
        </button>
      </div>

      <p className="text-sm text-gray-500">
        자를 영역을 <strong>드래그</strong>하세요. 비율을 고르면 그 비율로 고정돼요.
      </p>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="mx-auto block max-w-full cursor-crosshair touch-none"
        />
      </div>

      <Button onClick={run} size="lg" className="w-full">
        이 영역으로 자르기
      </Button>

      {resultUrl && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">완료 ✓</span>
            <span className="text-sm text-gray-500">{resultInfo}</span>
          </div>
          <img src={resultUrl} alt="자른 결과" className="mx-auto mb-4 max-h-72 rounded-lg border border-gray-100" />
          <Button onClick={download} size="lg" className="w-full">
            다운로드
          </Button>
        </div>
      )}
    </div>
  )
}
