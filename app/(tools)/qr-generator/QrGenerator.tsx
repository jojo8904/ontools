'use client'

import { useState, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

const SIZE_OPTIONS = [
  { label: '200x200', value: 200 },
  { label: '300x300', value: 300 },
  { label: '400x400', value: 400 },
  { label: '512x512', value: 512 },
]

export function QrGenerator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(300)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, text.trim(), {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      })

      setDataUrl(canvas.toDataURL('image/png'))
    } catch (err) {
      console.error('QR generation failed:', err)
    }
  }, [text, size])

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `qrcode-${size}x${size}.png`
    link.href = dataUrl
    link.click()
  }

  const handleReset = () => {
    setText('')
    setDataUrl(null)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR코드 생성</CardTitle>
          <CardDescription>
            URL이나 텍스트를 입력하면 QR코드를 생성합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">URL 또는 텍스트</label>
            <Input
              type="text"
              placeholder="https://example.com 또는 텍스트 입력"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">이미지 크기</label>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    size === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleGenerate} className="flex-1" size="lg">
              생성하기
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Result */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 inline-block">
              <canvas
                ref={canvasRef}
                className={dataUrl ? '' : 'hidden'}
              />
              {!dataUrl && (
                <div
                  className="flex items-center justify-center text-gray-300"
                  style={{ width: size, height: size }}
                >
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-sm">QR코드가 여기에 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>

            {dataUrl && (
              <Button onClick={handleDownload} size="lg" className="w-full max-w-xs">
                PNG 다운로드 ({size}x{size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
