'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface Item {
  id: string
  img: HTMLImageElement
  name: string
}

let _seq = 0

export function GifMaker() {
  const [items, setItems] = useState<Item[]>([])
  const [delay, setDelay] = useState(500)
  const [width, setWidth] = useState(480)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultInfo, setResultInfo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    setResultUrl(null)
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach((file) => {
        const url = URL.createObjectURL(file)
        const image = new Image()
        image.onload = () => {
          _seq += 1
          setItems((prev) => [...prev, { id: `g${_seq}`, img: image, name: file.name }])
          URL.revokeObjectURL(url)
        }
        image.onerror = () => URL.revokeObjectURL(url)
        image.src = url
      })
  }, [])

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const t = i + dir
      if (t < 0 || t >= next.length) return prev
      ;[next[i], next[t]] = [next[t], next[i]]
      return next
    })
  }
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id))

  const generate = useCallback(async () => {
    if (items.length < 2) return
    setBusy(true)
    setResultUrl(null)
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc')
      const first = items[0].img
      const W = Math.min(width, first.naturalWidth)
      const H = Math.max(1, Math.round((W * first.naturalHeight) / first.naturalWidth))
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      const gif = GIFEncoder()

      for (let i = 0; i < items.length; i++) {
        setProgress(`${i + 1} / ${items.length} 프레임 처리 중…`)
        // 프레임마다 흰 배경 + contain으로 맞춤
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, W, H)
        const img = items[i].img
        const r = Math.min(W / img.naturalWidth, H / img.naturalHeight)
        const dw = img.naturalWidth * r
        const dh = img.naturalHeight * r
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
        const { data } = ctx.getImageData(0, 0, W, H)
        const palette = quantize(data, 256)
        const index = applyPalette(data, palette)
        gif.writeFrame(index, W, H, { palette, delay })
        // UI가 멈추지 않게 잠깐 양보
        await new Promise((r2) => setTimeout(r2, 0))
      }
      gif.finish()
      const bytes = gif.bytes()
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'image/gif' })
      setResultUrl(URL.createObjectURL(blob))
      setResultInfo(`${W} × ${H}px · ${items.length}프레임 · ${(blob.size / 1024).toFixed(0)}KB`)
    } catch (e) {
      console.error('gif failed', e)
      alert('GIF 생성 중 오류가 발생했어요.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [items, delay, width])

  const download = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.download = `ontools_${items.length}프레임.gif`
    a.href = resultUrl
    a.click()
  }

  return (
    <div className="space-y-5">
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
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <p className="font-medium text-gray-700">사진을 끌어다 놓거나 클릭해서 여러 장 선택</p>
        <p className="mt-1 text-sm text-gray-400">순서대로 움짤 프레임이 돼요 · 서버로 전송되지 않아요</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {items.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{items.length}장 · 위에서부터 재생 순서</p>
            {items.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
                <span className="w-6 shrink-0 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <img src={it.img.src} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{it.name}</span>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">↓</button>
                  <button onClick={() => remove(it.id)} className="rounded px-2 py-1 text-red-400 hover:bg-red-50">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-end gap-5 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                프레임 간격 {(delay / 1000).toFixed(1)}초
              </span>
              <input type="range" min={100} max={2000} step={100} value={delay} onChange={(e) => setDelay(parseInt(e.target.value, 10))} />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">가로 크기</span>
              <div className="flex gap-2">
                {[320, 480, 640].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWidth(w)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${width === w ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={generate} size="lg" className="w-full" disabled={busy || items.length < 2}>
            {busy ? progress || '만드는 중…' : items.length < 2 ? '사진을 2장 이상 올려주세요' : 'GIF 만들기'}
          </Button>
        </>
      )}

      {resultUrl && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">완료 ✓</span>
            <span className="text-sm text-gray-500">{resultInfo}</span>
          </div>
          <img src={resultUrl} alt="GIF 미리보기" className="mx-auto mb-4 max-h-72 rounded-lg border border-gray-100" />
          <Button onClick={download} size="lg" className="w-full">
            GIF 다운로드
          </Button>
        </div>
      )}
    </div>
  )
}
