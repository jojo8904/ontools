'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type Direction = 'vertical' | 'horizontal'

interface Item {
  id: string
  img: HTMLImageElement
  name: string
}

let _seq = 0

export function ImageStitch() {
  const [items, setItems] = useState<Item[]>([])
  const [direction, setDirection] = useState<Direction>('vertical')
  const [gap, setGap] = useState(0)
  const [bg, setBg] = useState('#ffffff')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    imageFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.onload = () => {
        _seq += 1
        setItems((prev) => [...prev, { id: `i${_seq}`, img: image, name: file.name }])
        URL.revokeObjectURL(url)
      }
      image.onerror = () => URL.revokeObjectURL(url)
      image.src = url
    })
  }, [])

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setResultUrl(null)
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    setResultUrl(null)
  }

  const handleCombine = useCallback(async () => {
    if (items.length === 0) return
    setProcessing(true)
    setResultUrl(null)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      if (direction === 'vertical') {
        const width = Math.max(...items.map((it) => it.img.naturalWidth))
        // 각 이미지를 width에 맞춰 비율 유지 스케일
        const scaled = items.map((it) => {
          const ratio = width / it.img.naturalWidth
          return { img: it.img, h: Math.round(it.img.naturalHeight * ratio) }
        })
        const totalHeight = scaled.reduce((s, x) => s + x.h, 0) + gap * (items.length - 1)
        canvas.width = width
        canvas.height = totalHeight
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, width, totalHeight)
        let y = 0
        for (const s of scaled) {
          ctx.drawImage(s.img, 0, y, width, s.h)
          y += s.h + gap
        }
      } else {
        const height = Math.max(...items.map((it) => it.img.naturalHeight))
        const scaled = items.map((it) => {
          const ratio = height / it.img.naturalHeight
          return { img: it.img, w: Math.round(it.img.naturalWidth * ratio) }
        })
        const totalWidth = scaled.reduce((s, x) => s + x.w, 0) + gap * (items.length - 1)
        canvas.width = totalWidth
        canvas.height = height
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, totalWidth, height)
        let x = 0
        for (const s of scaled) {
          ctx.drawImage(s.img, x, 0, s.w, height)
          x += s.w + gap
        }
      }

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), 'image/png'),
      )
      setResultUrl(URL.createObjectURL(blob))
    } catch (e) {
      console.error('stitch failed', e)
      alert('이어붙이는 중 오류가 발생했어요.')
    } finally {
      setProcessing(false)
    }
  }, [items, direction, gap, bg])

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    link.download = `combined_${items.length}장.png`
    link.href = resultUrl
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* 업로드 */}
      <div
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
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 여러 장 선택</p>
        <p className="mt-1 text-sm text-gray-400">선택한 순서대로 추가돼요 · 서버로 전송되지 않아요</p>
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
          {/* 순서 목록 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{items.length}장 · 위에서부터 순서대로 결합</p>
            {items.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
                <span className="w-6 shrink-0 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <img src={it.img.src} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{it.name}</span>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button onClick={() => remove(it.id)} className="rounded px-2 py-1 text-red-400 hover:bg-red-50">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 옵션 */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">방향</span>
              <div className="flex gap-2">
                {(['vertical', 'horizontal'] as Direction[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDirection(d)
                      setResultUrl(null)
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      direction === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d === 'vertical' ? '세로 ↓' : '가로 →'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">간격(px)</span>
              <input
                type="number"
                min={0}
                value={gap}
                onChange={(e) => {
                  setGap(Math.max(0, parseInt(e.target.value, 10) || 0))
                  setResultUrl(null)
                }}
                className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">간격 색상</span>
              <input
                type="color"
                value={bg}
                onChange={(e) => {
                  setBg(e.target.value)
                  setResultUrl(null)
                }}
                className="h-9 w-12 cursor-pointer rounded border border-gray-200"
              />
            </div>
          </div>

          <Button onClick={handleCombine} className="w-full" size="lg" disabled={processing}>
            {processing ? '결합 중…' : '이어붙이기'}
          </Button>

          {resultUrl && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-medium text-gray-700">결과 미리보기</p>
              <div className="mb-4 max-h-96 overflow-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
                <img src={resultUrl} alt="결합 결과" className="mx-auto" />
              </div>
              <Button onClick={handleDownload} size="lg" className="w-full">
                PNG 다운로드
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
