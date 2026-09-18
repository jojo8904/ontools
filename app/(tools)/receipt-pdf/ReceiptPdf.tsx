'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, Undo2, FileDown, Download, Square } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RectangleCanvas } from '@/components/tools/RectangleCanvas'
import {
  ErrorMessage,
  FilePicker,
  IconButton,
  NumberField,
  panelClass,
} from '@/components/tools/WorkflowFields'
import {
  checkImageFile,
  loadImage,
  fittedCanvas,
  encodeCanvas,
  drawRedactions,
  type Rect,
} from '@/lib/image-workflows'
import { useObjectUrls, downloadBlob } from '@/lib/useObjectUrls'
import { useLocalTask } from '@/lib/useLocalTask'
import { trackToolEvent } from '@/lib/analytics'

interface Receipt {
  id: string
  name: string
  image: HTMLImageElement
  url: string
  bytes: number
  masks: Rect[]
}

export function ReceiptPdf() {
  const [items, setItems] = useState<Receipt[]>([])
  const [selected, setSelected] = useState('')
  const [margin, setMargin] = useState(10)
  const [result, setResult] = useState<Blob | null>(null)
  const [region, setRegion] = useState({ x: 10, y: 10, w: 40, h: 10 })
  const task = useLocalTask()
  const { createObjectUrl } = useObjectUrls()
  const current = items.find((item) => item.id === selected)
  function invalidate() {
    setResult(null)
    task.setError('')
  }
  function addMask(rect: Rect) {
    if (!current) return
    invalidate()
    setItems(items.map((item) => (item.id === selected ? { ...item, masks: [...item.masks, rect] } : item)))
  }
  function move(index: number, delta: number) {
    const next = [...items]
    ;[next[index], next[index + delta]] = [next[index + delta], next[index]]
    setItems(next)
    invalidate()
  }
  return (
    <div className="space-y-6">
      <FilePicker
        multiple
        disabled={task.busy}
        onFiles={(files) => {
          invalidate()
          void task.run(async (signal) => {
            if (items.length + files.length > 12) throw new Error('증빙 사진은 최대 12장까지 묶을 수 있어요.')
            if (
              items.reduce((sum, item) => sum + item.bytes, 0) + files.reduce((sum, f) => sum + f.size, 0) >
              80 * 1024 * 1024
            )
              throw new Error('원본 합계는 80MB 이하여야 해요.')
            files.forEach(checkImageFile)
            const added: Receipt[] = []
            for (const file of files) {
              const original = await loadImage(file)
              signal.throwIfAborted()
              const scale = Math.min(1, 1600 / Math.max(original.naturalWidth, original.naturalHeight))
              const canvas = fittedCanvas(
                original,
                Math.max(1, Math.round(original.naturalWidth * scale)),
                Math.max(1, Math.round(original.naturalHeight * scale)),
                'contain'
              )
              original.src = ''
              const blob = await encodeCanvas(canvas, 'image/png')
              canvas.width = 0
              canvas.height = 0
              const image = await loadImage(blob)
              signal.throwIfAborted()
              added.push({
                id: crypto.randomUUID(),
                name: file.name,
                image,
                url: createObjectUrl(blob),
                bytes: file.size,
                masks: [],
              })
            }
            setItems([...items, ...added])
            if (!selected) setSelected(added[0]?.id ?? '')
          })
        }}
      />
      {items.length > 0 && (
        <>
          <ol className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                className={`flex items-center gap-2 rounded-lg border bg-white p-2 ${selected === item.id ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <button
                  type="button"
                  disabled={task.busy}
                  aria-pressed={selected === item.id}
                  onClick={() => setSelected(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <img src={item.url} alt="" className="h-12 w-10 shrink-0 rounded object-contain" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">
                      {i + 1}. {item.name}
                    </span>
                    <span className="text-xs text-gray-500">가림 영역 {item.masks.length}개</span>
                  </span>
                </button>
                <div className="flex shrink-0 gap-1">
                  <IconButton
                    label={`${i + 1}번 위로`}
                    disabled={task.busy || i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp size={16} />
                  </IconButton>
                  <IconButton
                    label={`${i + 1}번 아래로`}
                    disabled={task.busy || i === items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown size={16} />
                  </IconButton>
                  <IconButton
                    label={`${i + 1}번 삭제`}
                    disabled={task.busy}
                    onClick={() => {
                      setItems(items.filter((r) => r.id !== item.id))
                      if (selected === item.id) setSelected(items.find((r) => r.id !== item.id)?.id ?? '')
                      URL.revokeObjectURL(item.url)
                      invalidate()
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ol>
          {current && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="min-w-0 truncate text-base font-bold">민감정보 가리기 · {current.name}</h2>
                <IconButton
                  label="마지막 가림 취소"
                  disabled={task.busy || !current.masks.length}
                  onClick={() => {
                    setItems(
                      items.map((item) =>
                        item.id === selected ? { ...item, masks: item.masks.slice(0, -1) } : item
                      )
                    )
                    invalidate()
                  }}
                >
                  <Undo2 size={18} />
                </IconButton>
              </div>
              <RectangleCanvas
                key={current.id}
                image={current.image}
                masks={current.masks}
                onSelect={addMask}
                disabled={task.busy}
              />
              <details className="text-sm">
                <summary className="cursor-pointer py-2">가림 좌표 (%)</summary>
                <fieldset disabled={task.busy} className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        ['x', '왼쪽'],
                        ['y', '위쪽'],
                        ['w', '너비'],
                        ['h', '높이'],
                      ] as const
                    ).map(([key, label]) => (
                      <NumberField
                        key={key}
                        label={label}
                        value={region[key]}
                        max={100}
                        onChange={(value) => setRegion({ ...region, [key]: value })}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        Object.values(region).some((n) => !Number.isFinite(n) || n < 0) ||
                        region.w <= 0 ||
                        region.h <= 0 ||
                        region.x + region.w > 100 ||
                        region.y + region.h > 100
                      ) {
                        task.setError('가림 영역이 사진 안에 있어야 해요.')
                        return
                      }
                      addMask({ x: region.x / 100, y: region.y / 100, w: region.w / 100, h: region.h / 100 })
                    }}
                  >
                    영역 가리기
                  </Button>
                </fieldset>
              </details>
            </section>
          )}
          <fieldset disabled={task.busy}>
            <label className="text-sm font-medium">
              A4 세로 · 여백 {margin}mm
              <input
                aria-label="PDF 여백"
                type="range"
                min={0}
                max={25}
                step={1}
                className="mt-2 block w-full"
                value={margin}
                onChange={(e) => {
                  setMargin(Number(e.target.value))
                  invalidate()
                }}
              />
            </label>
          </fieldset>
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              disabled={task.busy}
              onClick={() => {
                invalidate()
                void task.run(async (signal) => {
                  const { PDFDocument } = await import('pdf-lib')
                  const pdf = await PDFDocument.create()
                  pdf.setProducer('ontools')
                  pdf.setTitle('Receipts')
                  for (const item of items) {
                    signal.throwIfAborted()
                    const canvas = fittedCanvas(
                      item.image,
                      item.image.naturalWidth,
                      item.image.naturalHeight,
                      'contain'
                    )
                    // Only flattened, blacked-out pixels enter the PDF. Never embed originals.
                    drawRedactions(canvas, item.masks)
                    const blob = await encodeCanvas(canvas, 'image/png')
                    canvas.width = 0
                    canvas.height = 0
                    const image = await pdf.embedPng(await blob.arrayBuffer())
                    signal.throwIfAborted()
                    const page = pdf.addPage([595.28, 841.89])
                    const inset = (margin * 72) / 25.4
                    const scale = Math.min(
                      (page.getWidth() - inset * 2) / image.width,
                      (page.getHeight() - inset * 2) / image.height
                    )
                    const w = image.width * scale
                    const h = image.height * scale
                    page.drawImage(image, {
                      x: (page.getWidth() - w) / 2,
                      y: (page.getHeight() - h) / 2,
                      width: w,
                      height: h,
                    })
                  }
                  const bytes = await pdf.save()
                  signal.throwIfAborted()
                  setResult(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }))
                  trackToolEvent('calculation_complete', '/receipt-pdf')
                })
              }}
            >
              <FileDown size={18} />
              {task.busy ? '처리 중...' : '증빙 PDF 만들기'}
            </Button>
            {task.busy && (
              <IconButton
                label="작업 취소"
                onClick={() => {
                  task.cancel()
                  invalidate()
                }}
              >
                <Square size={18} />
              </IconButton>
            )}
          </div>
        </>
      )}
      <ErrorMessage error={task.error} />
      {result && (
        <div className={panelClass}>
          <p className="text-sm text-green-700">
            A4 · {items.length}페이지 · {(result.size / 1024 / 1024).toFixed(2)}MB
          </p>
          <Button className="w-full gap-2" onClick={() => downloadBlob(result, 'ontools-receipts.pdf')}>
            <Download size={18} />
            PDF 다운로드
          </Button>
        </div>
      )}
    </div>
  )
}
