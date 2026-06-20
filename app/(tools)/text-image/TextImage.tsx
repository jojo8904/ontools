'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type SizeKey = 'square' | 'story' | 'wide'
type Mode = 'quote' | 'code'

const SIZES: Record<SizeKey, { w: number; h: number; label: string }> = {
  square: { w: 1080, h: 1080, label: '정사각형 (인스타)' },
  story: { w: 1080, h: 1920, label: '스토리 (세로)' },
  wide: { w: 1200, h: 630, label: '가로 (블로그)' },
}

const GRADIENTS: { id: string; from: string; to: string; label: string }[] = [
  { id: 'sunset', from: '#ff9a9e', to: '#fad0c4', label: '선셋' },
  { id: 'ocean', from: '#2193b0', to: '#6dd5ed', label: '오션' },
  { id: 'purple', from: '#667eea', to: '#764ba2', label: '퍼플' },
  { id: 'peach', from: '#ffecd2', to: '#fcb69f', label: '피치' },
  { id: 'mint', from: '#a8edea', to: '#fed6e3', label: '민트' },
  { id: 'dark', from: '#232526', to: '#414345', label: '다크' },
  { id: 'forest', from: '#134e5e', to: '#71b280', label: '포레스트' },
  { id: 'night', from: '#0f2027', to: '#2c5364', label: '나이트' },
]

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    if (para === '') {
      out.push('')
      continue
    }
    const words = para.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line)
        line = word
      } else {
        line = test
      }
    }
    if (line) out.push(line)
  }
  return out
}

export function TextImage() {
  const [text, setText] = useState('오늘 할 수 있는 일에\n최선을 다하면\n내일은 한 걸음 나아가 있다.')
  const [mode, setMode] = useState<Mode>('quote')
  const [size, setSize] = useState<SizeKey>('square')
  const [grad, setGrad] = useState('purple')
  const [fontSize, setFontSize] = useState(56)
  const [textColor, setTextColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { w: W, h: H } = SIZES[size]
      ctx.canvas.width = W
      ctx.canvas.height = H

      // 배경 그라데이션
      const g = GRADIENTS.find((x) => x.id === grad)!
      const grd = ctx.createLinearGradient(0, 0, W, H)
      grd.addColorStop(0, g.from)
      grd.addColorStop(1, g.to)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      const outerPad = Math.round(W * 0.08)

      if (mode === 'code') {
        // 코드 카드 (carbon 스타일)
        const cardX = outerPad
        const cardW = W - outerPad * 2
        const headerH = 56
        const innerPad = 44
        ctx.font = `${fontSize}px ui-monospace, Menlo, Consolas, monospace`
        const maxTextW = cardW - innerPad * 2
        const lines = wrapLines(ctx, text, maxTextW)
        const lineH = fontSize * 1.5
        const cardH = headerH + innerPad * 2 + lines.length * lineH
        const cardY = Math.max(outerPad, (H - cardH) / 2)

        // 그림자 + 카드
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.shadowBlur = 40
        ctx.shadowOffsetY = 16
        ctx.fillStyle = '#282a36'
        roundRect(ctx, cardX, cardY, cardW, cardH, 18)
        ctx.fill()
        ctx.restore()

        // 윈도우 점 3개
        const dots = ['#ff5f56', '#ffbd2e', '#27c93f']
        dots.forEach((c, i) => {
          ctx.fillStyle = c
          ctx.beginPath()
          ctx.arc(cardX + 30 + i * 30, cardY + 30, 9, 0, Math.PI * 2)
          ctx.fill()
        })

        // 코드 텍스트
        ctx.fillStyle = textColor === '#ffffff' ? '#f8f8f2' : textColor
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = `${fontSize}px ui-monospace, Menlo, Consolas, monospace`
        let ty = cardY + headerH + innerPad
        for (const line of lines) {
          ctx.fillText(line, cardX + innerPad, ty)
          ty += lineH
        }
      } else {
        // 명언/메모 — 중앙 정렬
        ctx.font = `bold ${fontSize}px -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`
        const maxTextW = W - outerPad * 2
        const lines = wrapLines(ctx, text, maxTextW)
        const lineH = fontSize * 1.5
        const totalH = lines.length * lineH
        ctx.fillStyle = textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.18)'
        ctx.shadowBlur = 12
        ctx.shadowOffsetY = 3
        let ty = H / 2 - totalH / 2 + lineH / 2
        for (const line of lines) {
          ctx.fillText(line, W / 2, ty)
          ty += lineH
        }
      }
    },
    [text, mode, size, grad, fontSize, textColor],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) render(canvas.getContext('2d')!)
  }, [render])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const link = document.createElement('a')
      link.download = `ontools_image_${size}.png`
      link.href = URL.createObjectURL(blob)
      link.click()
    }, 'image/png')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 입력 + 옵션 */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">텍스트</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="명언, 코드, 메모를 입력하세요"
            />
          </div>

          <div className="flex gap-2">
            {([['quote', '명언/메모'], ['code', '코드']] as [Mode, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setMode(v)} className={`flex-1 rounded-lg py-2 text-sm font-medium ${mode === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
            ))}
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">크기</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SIZES) as SizeKey[]).map((k) => (
                <button key={k} onClick={() => setSize(k)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${size === k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{SIZES[k].label}</button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">배경</span>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((gr) => (
                <button
                  key={gr.id}
                  onClick={() => setGrad(gr.id)}
                  title={gr.label}
                  style={{ background: `linear-gradient(135deg, ${gr.from}, ${gr.to})` }}
                  className={`h-9 w-9 rounded-full border-2 transition-transform ${grad === gr.id ? 'scale-110 border-blue-500' : 'border-white'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">글자 크기 {fontSize}</span>
              <input type="range" min={28} max={120} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full" />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">글자색</span>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-gray-200" />
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="flex flex-col items-center">
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
            <canvas ref={canvasRef} className="mx-auto block max-h-[420px] max-w-full rounded-lg shadow-sm" />
          </div>
        </div>
      </div>

      <Button onClick={handleDownload} className="w-full" size="lg">
        PNG 다운로드
      </Button>
    </div>
  )
}
