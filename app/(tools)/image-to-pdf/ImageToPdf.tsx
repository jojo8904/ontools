'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type PageSize = 'a4' | 'letter' | 'fit'
type Orient = 'auto' | 'portrait' | 'landscape'

interface Item {
  id: string
  img: HTMLImageElement
  name: string
}

const PX_TO_MM = 0.264583

let _seq = 0

function toJpegDataUrl(img: HTMLImageElement): string {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.92)
}

export function ImageToPdf() {
  const [items, setItems] = useState<Item[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [orient, setOrient] = useState<Orient>('auto')
  const [margin, setMargin] = useState(10)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach((file) => {
        const url = URL.createObjectURL(file)
        const image = new Image()
        image.onload = () => {
          _seq += 1
          setItems((prev) => [...prev, { id: `p${_seq}`, img: image, name: file.name }])
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

  const handleGenerate = useCallback(async () => {
    if (items.length === 0) return
    setBusy(true)
    try {
      const { jsPDF } = await import('jspdf')
      let pdf: InstanceType<typeof jsPDF> | null = null

      items.forEach((it, i) => {
        const dataUrl = toJpegDataUrl(it.img)
        const landscape = it.img.naturalWidth > it.img.naturalHeight

        if (pageSize === 'fit') {
          const wmm = it.img.naturalWidth * PX_TO_MM
          const hmm = it.img.naturalHeight * PX_TO_MM
          const o = wmm >= hmm ? 'landscape' : 'portrait'
          const format: [number, number] = [wmm, hmm]
          if (i === 0) pdf = new jsPDF({ unit: 'mm', orientation: o, format })
          else pdf!.addPage(format, o)
          pdf!.addImage(dataUrl, 'JPEG', 0, 0, wmm, hmm)
        } else {
          const o: 'portrait' | 'landscape' =
            orient === 'auto' ? (landscape ? 'landscape' : 'portrait') : orient
          if (i === 0) pdf = new jsPDF({ unit: 'mm', orientation: o, format: pageSize })
          else pdf!.addPage(pageSize, o)
          const pw = pdf!.internal.pageSize.getWidth()
          const ph = pdf!.internal.pageSize.getHeight()
          const availW = pw - 2 * margin
          const availH = ph - 2 * margin
          const r = it.img.naturalWidth / it.img.naturalHeight
          let w = availW
          let h = availW / r
          if (h > availH) {
            h = availH
            w = availH * r
          }
          pdf!.addImage(dataUrl, 'JPEG', (pw - w) / 2, (ph - h) / 2, w, h)
        }
      })

      pdf!.save(`ontools_${items.length}장.pdf`)
    } catch (e) {
      console.error('pdf failed', e)
      alert('PDF 생성 중 오류가 발생했어요.')
    } finally {
      setBusy(false)
    }
  }, [items, pageSize, orient, margin])

  return (
    <div className="space-y-6">
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
        <p className="mt-1 text-sm text-gray-400">선택한 순서대로 페이지가 만들어져요 · 서버로 전송되지 않아요</p>
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
            <p className="text-sm font-medium text-gray-700">{items.length}장 · 위에서부터 페이지 순서</p>
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

          <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">페이지 크기</span>
              <div className="flex gap-2">
                {([['a4', 'A4'], ['letter', 'Letter'], ['fit', '이미지맞춤']] as [PageSize, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setPageSize(v)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${pageSize === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
                ))}
              </div>
            </div>
            {pageSize !== 'fit' && (
              <>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">방향</span>
                  <div className="flex gap-2">
                    {([['auto', '자동'], ['portrait', '세로'], ['landscape', '가로']] as [Orient, string][]).map(([v, l]) => (
                      <button key={v} onClick={() => setOrient(v)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${orient === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">여백 {margin}mm</span>
                  <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(parseInt(e.target.value, 10))} />
                </div>
              </>
            )}
          </div>

          <Button onClick={handleGenerate} className="w-full" size="lg" disabled={busy}>
            {busy ? 'PDF 만드는 중…' : 'PDF로 저장'}
          </Button>
        </>
      )}
    </div>
  )
}
