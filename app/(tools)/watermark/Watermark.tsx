'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type Source = 'text' | 'logo'
type Layout = 'single' | 'tile'
type Pos = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br'

const POS_GRID: Pos[][] = [
  ['tl', 'tc', 'tr'],
  ['ml', 'mc', 'mr'],
  ['bl', 'bc', 'br'],
]

export function Watermark() {
  const [base, setBase] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [source, setSource] = useState<Source>('text')
  const [logo, setLogo] = useState<HTMLImageElement | null>(null)
  const [wmText, setWmText] = useState('© ontools')
  const [color, setColor] = useState('#ffffff')
  const [scale, setScale] = useState(5) // % of width
  const [opacity, setOpacity] = useState(0.5)
  const [layout, setLayout] = useState<Layout>('single')
  const [pos, setPos] = useState<Pos>('br')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baseInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const loadImage = (file: File, cb: (img: HTMLImageElement) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      cb(image)
      URL.revokeObjectURL(url)
    }
    image.onerror = () => URL.revokeObjectURL(url)
    image.src = url
  }

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!base) return
      const W = base.naturalWidth
      const H = base.naturalHeight
      ctx.canvas.width = W
      ctx.canvas.height = H
      ctx.drawImage(base, 0, 0)

      const pad = Math.round(W * 0.03)
      ctx.globalAlpha = opacity

      const drawAt = (cx: number, cy: number) => {
        if (source === 'logo' && logo) {
          const w = (W * scale) / 100 * 6
          const h = w * (logo.naturalHeight / logo.naturalWidth)
          ctx.drawImage(logo, cx - w / 2, cy - h / 2, w, h)
        } else {
          ctx.fillText(wmText, cx, cy)
        }
      }

      const fontSize = Math.max(12, Math.round((W * scale) / 100))
      ctx.font = `bold ${fontSize}px -apple-system, "Noto Sans KR", sans-serif`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.4)'
      ctx.shadowBlur = Math.round(fontSize / 6)

      if (layout === 'tile') {
        ctx.save()
        ctx.translate(W / 2, H / 2)
        ctx.rotate((-30 * Math.PI) / 180)
        const stepX = source === 'text' ? ctx.measureText(wmText).width + fontSize * 4 : (W * scale) / 100 * 6 + fontSize * 3
        const stepY = fontSize * 5
        for (let gy = -H; gy < H; gy += stepY) {
          for (let gx = -W; gx < W; gx += stepX) {
            if (source === 'logo' && logo) {
              const w = (W * scale) / 100 * 6
              const h = w * (logo.naturalHeight / logo.naturalWidth)
              ctx.drawImage(logo, gx - w / 2, gy - h / 2, w, h)
            } else {
              ctx.fillText(wmText, gx, gy)
            }
          }
        }
        ctx.restore()
      } else {
        // single position
        const col = pos[1] === 'l' ? 0 : pos[1] === 'c' ? 1 : 2
        const row = pos[0] === 't' ? 0 : pos[0] === 'm' ? 1 : 2
        const itemW = source === 'logo' && logo ? (W * scale) / 100 * 6 : ctx.measureText(wmText).width
        const itemH = source === 'logo' && logo ? ((W * scale) / 100 * 6) * (logo.naturalHeight / logo.naturalWidth) : fontSize
        const cx = col === 0 ? pad + itemW / 2 : col === 1 ? W / 2 : W - pad - itemW / 2
        const cy = row === 0 ? pad + itemH / 2 : row === 1 ? H / 2 : H - pad - itemH / 2
        drawAt(cx, cy)
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    },
    [base, source, logo, wmText, color, scale, opacity, layout, pos],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && base) render(canvas.getContext('2d')!)
  }, [render, base])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !base) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const link = document.createElement('a')
      const b = fileName.replace(/\.[^.]+$/, '') || 'image'
      link.download = `${b}_watermark.png`
      link.href = URL.createObjectURL(blob)
      link.click()
    }, 'image/png')
  }

  if (!base) {
    return (
      <div
        onClick={() => baseInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files?.[0]
          if (f) loadImage(f, (img) => { setBase(img); setFileName(f.name) })
        }}
        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center hover:bg-gray-100"
      >
        <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
        <p className="mt-1 text-sm text-gray-400">워터마크를 넣을 사진 · 서버로 전송되지 않아요</p>
        <input
          ref={baseInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) loadImage(f, (img) => { setBase(img); setFileName(f.name) })
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 옵션 */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {([['text', '텍스트'], ['logo', '로고 이미지']] as [Source, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setSource(v)} className={`flex-1 rounded-lg py-2 text-sm font-medium ${source === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
            ))}
          </div>

          {source === 'text' ? (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">워터마크 문구</label>
                <input value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-gray-700">색</span>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-gray-200" />
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">로고 이미지 (PNG 권장)</label>
              <button onClick={() => logoInputRef.current?.click()} className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 py-3 text-sm text-gray-600 hover:bg-gray-100">
                {logo ? '로고 변경' : '로고 선택'}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) loadImage(f, setLogo)
                }}
              />
            </div>
          )}

          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">크기 {scale}%</span>
            <input type="range" min={2} max={20} value={scale} onChange={(e) => setScale(parseInt(e.target.value, 10))} className="w-full" />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">투명도 {Math.round(opacity * 100)}%</span>
            <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full" />
          </div>

          <div className="flex gap-2">
            {([['single', '한 곳'], ['tile', '전체 반복']] as [Layout, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setLayout(v)} className={`flex-1 rounded-lg py-2 text-sm font-medium ${layout === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
            ))}
          </div>

          {layout === 'single' && (
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">위치</span>
              <div className="inline-grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
                {POS_GRID.flat().map((p) => (
                  <button key={p} onClick={() => setPos(p)} className={`h-8 w-8 rounded ${pos === p ? 'bg-blue-600' : 'bg-white hover:bg-gray-200'}`} aria-label={p} />
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setBase(null); setLogo(null); setFileName('') }} className="text-sm text-gray-400 hover:text-gray-700">
            다른 사진
          </button>
        </div>

        {/* 미리보기 */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
          <canvas ref={canvasRef} className="mx-auto block max-h-[420px] max-w-full rounded-lg" />
        </div>
      </div>

      <Button onClick={handleDownload} className="w-full" size="lg">
        PNG 다운로드
      </Button>
    </div>
  )
}
