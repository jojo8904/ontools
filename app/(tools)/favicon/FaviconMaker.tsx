'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

const ICO_SIZES = [16, 32, 48, 64]

function drawSquare(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  // 원본을 정사각형 안에 contain (비율 유지, 가운데)
  const r = Math.min(size / img.naturalWidth, size / img.naturalHeight)
  const w = img.naturalWidth * r
  const h = img.naturalHeight * r
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
  return c
}

function canvasToPngBytes(c: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((res) => c.toBlob(async (b) => res(new Uint8Array(await b!.arrayBuffer())), 'image/png'))
}

/** 여러 크기의 PNG를 담은 멀티사이즈 ICO 생성 (PNG-in-ICO) */
function buildIco(pngs: { size: number; bytes: Uint8Array }[]): Blob {
  const count = pngs.length
  const headerSize = 6 + count * 16
  const dir = new Uint8Array(headerSize)
  const dv = new DataView(dir.buffer)
  dv.setUint16(0, 0, true) // reserved
  dv.setUint16(2, 1, true) // type = icon
  dv.setUint16(4, count, true)
  let offset = headerSize
  pngs.forEach((p, i) => {
    const e = 6 + i * 16
    dir[e] = p.size >= 256 ? 0 : p.size // width
    dir[e + 1] = p.size >= 256 ? 0 : p.size // height
    dir[e + 2] = 0 // color count
    dir[e + 3] = 0 // reserved
    dv.setUint16(e + 4, 1, true) // color planes
    dv.setUint16(e + 6, 32, true) // bits per pixel
    dv.setUint32(e + 8, p.bytes.length, true) // size of data
    dv.setUint32(e + 12, offset, true) // offset
    offset += p.bytes.length
  })
  return new Blob([dir, ...pngs.map((p) => p.bytes)] as BlobPart[], { type: 'image/x-icon' })
}

export function FaviconMaker() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<{ s16: string; s32: string; s64: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    setFileName(file.name)
    setPreview(null)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      setPreview({
        s16: drawSquare(image, 16).toDataURL('image/png'),
        s32: drawSquare(image, 32).toDataURL('image/png'),
        s64: drawSquare(image, 64).toDataURL('image/png'),
      })
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      alert('이미지를 불러오지 못했어요.')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }, [])

  const downloadIco = useCallback(async () => {
    if (!img) return
    setBusy(true)
    try {
      const pngs = await Promise.all(
        ICO_SIZES.map(async (size) => ({ size, bytes: await canvasToPngBytes(drawSquare(img, size)) })),
      )
      const blob = buildIco(pngs)
      const a = document.createElement('a')
      a.download = 'favicon.ico'
      a.href = URL.createObjectURL(blob)
      a.click()
    } finally {
      setBusy(false)
    }
  }, [img])

  const downloadPng = useCallback(
    (size: number) => {
      if (!img) return
      drawSquare(img, size).toBlob((b) => {
        if (!b) return
        const a = document.createElement('a')
        a.download = size >= 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`
        a.href = URL.createObjectURL(b)
        a.click()
      }, 'image/png')
    },
    [img],
  )

  const reset = () => {
    setImg(null)
    setFileName('')
    setPreview(null)
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
        <p className="font-medium text-gray-700">로고·이미지를 끌어다 놓거나 클릭해서 선택</p>
        <p className="mt-1 text-sm text-gray-400">정사각형 이미지 권장 · 서버로 전송되지 않아요</p>
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
        <span className="truncate text-gray-600">{fileName}</span>
        <button onClick={reset} className="shrink-0 text-gray-400 hover:text-gray-700">
          다른 이미지
        </button>
      </div>

      {/* 실제 크기 미리보기 */}
      {preview && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-3 text-sm font-medium text-gray-700">실제 표시 크기 미리보기</p>
          <div className="flex items-end gap-6">
            <div className="text-center">
              <img src={preview.s16} alt="16px" width={16} height={16} className="mx-auto" />
              <span className="mt-1 block text-xs text-gray-400">16px</span>
            </div>
            <div className="text-center">
              <img src={preview.s32} alt="32px" width={32} height={32} className="mx-auto" />
              <span className="mt-1 block text-xs text-gray-400">32px</span>
            </div>
            <div className="text-center">
              <img src={preview.s64} alt="64px" width={64} height={64} className="mx-auto" />
              <span className="mt-1 block text-xs text-gray-400">64px</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">16px(브라우저 탭)에서도 알아볼 수 있는지 확인하세요. 복잡한 로고는 단순할수록 좋아요.</p>
        </div>
      )}

      <Button onClick={downloadIco} size="lg" className="w-full" disabled={busy}>
        {busy ? '만드는 중…' : 'favicon.ico 다운로드 (16·32·48·64 통합)'}
      </Button>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => downloadPng(32)} size="sm" variant="outline">
          32px PNG
        </Button>
        <Button onClick={() => downloadPng(180)} size="sm" variant="outline">
          apple-touch-icon (180px)
        </Button>
      </div>
    </div>
  )
}
