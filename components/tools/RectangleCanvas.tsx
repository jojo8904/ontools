'use client'

import { useEffect, useRef, useState } from 'react'
import { drawRedactions, type Rect } from '@/lib/image-workflows'

export function RectangleCanvas({
  image,
  masks = [],
  crop,
  onSelect,
  disabled = false,
}: {
  image: HTMLImageElement
  masks?: Rect[]
  crop?: Rect
  onSelect: (rect: Rect) => void
  disabled?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const [draft, setDraft] = useState<Rect | null>(null)
  const scale = Math.min(1, 760 / image.naturalWidth, 900 / image.naturalHeight)
  const width = Math.round(image.naturalWidth * scale)
  const height = Math.round(image.naturalHeight * scale)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0, width, height)
    drawRedactions(canvas, masks)
    const selection = draft ?? crop
    if (selection) {
      ctx.fillStyle = 'rgba(37,99,235,0.15)'
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.fillRect(selection.x * width, selection.y * height, selection.w * width, selection.h * height)
      ctx.strokeRect(selection.x * width, selection.y * height, selection.w * width, selection.h * height)
    }
  }, [image, masks, crop, draft, width, height])
  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
      y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)),
    }
  }
  function rectangle(end: { x: number; y: number }): Rect {
    const first = start.current!
    return {
      x: Math.min(first.x, end.x),
      y: Math.min(first.y, end.y),
      w: Math.abs(first.x - end.x),
      h: Math.abs(first.y - end.y),
    }
  }
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label="사진 영역 선택"
      className="mx-auto block h-auto max-w-full touch-none rounded-lg border border-gray-200"
      style={{ cursor: disabled ? 'default' : 'crosshair' }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0) return
        start.current = point(event)
        setDraft(null)
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (start.current) setDraft(rectangle(point(event)))
      }}
      onPointerUp={(event) => {
        if (!start.current) return
        const rect = rectangle(point(event))
        start.current = null
        setDraft(null)
        if (rect.w * width >= 3 && rect.h * height >= 3) onSelect(rect)
      }}
      onPointerCancel={() => {
        start.current = null
        setDraft(null)
      }}
    />
  )
}
