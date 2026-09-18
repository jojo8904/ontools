'use client'

import { useState } from 'react'
import { Download, Play, Square, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  ErrorMessage,
  FilePicker,
  NumberField,
  IconButton,
  panelClass,
  fieldClass,
} from '@/components/tools/WorkflowFields'
import {
  checkImageFile,
  loadImage,
  fittedCanvas,
  encodeUnderLimit,
  formatBytes,
  imageExtension,
  type ImageFormat,
} from '@/lib/image-workflows'
import { useLocalTask } from '@/lib/useLocalTask'
import { useObjectUrls, downloadBlob } from '@/lib/useObjectUrls'
import { trackToolEvent } from '@/lib/analytics'

interface Outcome {
  name: string
  error?: string
  size?: number
  url?: string
}

export function ProductPhotoBatch() {
  const [files, setFiles] = useState<File[]>([])
  const [width, setWidth] = useState(1000)
  const [height, setHeight] = useState(1000)
  const [limit, setLimit] = useState(300)
  const [format, setFormat] = useState<ImageFormat>('image/jpeg')
  const [mode, setMode] = useState<'contain' | 'cover'>('contain')
  const [watermark, setWatermark] = useState('')
  const [opacity, setOpacity] = useState(0.55)
  const [color, setColor] = useState('#000000')
  const [position, setPosition] = useState('bottom')
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [zip, setZip] = useState<Blob | null>(null)
  const [progress, setProgress] = useState(0)
  const task = useLocalTask()
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()
  function invalidate() {
    setZip(null)
    setOutcomes([])
    setProgress(0)
    clearObjectUrls()
    task.setError('')
  }
  function process() {
    invalidate()
    void task.run(async (signal) => {
      const { default: JSZip } = await import('jszip')
      const archive = new JSZip()
      const output: Outcome[] = []
      for (let i = 0; i < files.length; i++) {
        signal.throwIfAborted()
        const file = files[i]
        let canvas: HTMLCanvasElement | null = null
        try {
          const img = await loadImage(file)
          signal.throwIfAborted()
          canvas = fittedCanvas(img, width, height, mode)
          img.src = ''
          if (watermark.trim()) {
            const ctx = canvas.getContext('2d')!
            ctx.globalAlpha = opacity
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            ctx.textBaseline = position === 'center' ? 'middle' : 'bottom'
            const size = Math.max(12, Math.round(Math.min(width, height) * 0.045))
            ctx.font = `bold ${size}px sans-serif`
            ctx.fillText(
              watermark.trim(),
              width / 2,
              position === 'center' ? height / 2 : height - size * 0.65,
              width * 0.9
            )
          }
          const blob = await encodeUnderLimit(canvas, format, limit, signal)
          signal.throwIfAborted()
          const filename = `${String(i + 1).padStart(2, '0')}-product.${imageExtension(format)}`
          archive.file(filename, await blob.arrayBuffer())
          signal.throwIfAborted()
          output.push({ name: file.name, size: blob.size, url: createObjectUrl(blob) })
        } catch (e) {
          signal.throwIfAborted()
          output.push({ name: file.name, error: (e as Error).message })
        } finally {
          if (canvas) {
            canvas.width = 0
            canvas.height = 0
          }
        }
        setOutcomes([...output])
        setProgress(i + 1)
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
      if (!output.some((r) => !r.error))
        throw new Error('완성된 사진이 없어요. 파일과 출력 규격을 확인해 주세요.')
      const blob = await archive.generateAsync({ type: 'blob', compression: 'STORE' }, () =>
        signal.throwIfAborted()
      )
      signal.throwIfAborted()
      setZip(blob)
      trackToolEvent('calculation_complete', '/product-photo-batch')
    })
  }
  return (
    <div className="space-y-6">
      <FilePicker
        multiple
        disabled={task.busy}
        onFiles={(incoming) => {
          invalidate()
          try {
            if (files.length + incoming.length > 20)
              throw new Error('한 번에 최대 20장까지 처리할 수 있어요.')
            const next = [...files, ...incoming]
            if (next.reduce((sum, f) => sum + f.size, 0) > 80 * 1024 * 1024)
              throw new Error('선택한 원본의 합계는 80MB 이하여야 해요.')
            incoming.forEach(checkImageFile)
            setFiles(next)
          } catch (e) {
            task.setError((e as Error).message)
          }
        }}
      />
      {files.length > 0 && (
        <ul className="divide-y border-y border-gray-200">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 py-2">
              <span className="min-w-0 flex-1 truncate text-sm">
                {i + 1}. {file.name}
              </span>
              <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
              <IconButton
                label={`사진 ${i + 1} 삭제`}
                disabled={task.busy}
                onClick={() => {
                  setFiles(files.filter((_, n) => n !== i))
                  invalidate()
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          process()
        }}
        className="space-y-4"
      >
        <fieldset disabled={task.busy} className={panelClass} onChange={invalidate}>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="가로 (px)" value={width} min={1} max={4096} step={1} onChange={setWidth} />
            <NumberField label="세로 (px)" value={height} min={1} max={4096} step={1} onChange={setHeight} />
            <NumberField label="장당 최대 용량 (KB)" value={limit} min={1} max={2000} onChange={setLimit} />
            <label className="text-sm font-medium">
              형식
              <select
                className={`${fieldClass} mt-1.5`}
                value={format}
                onChange={(e) => setFormat(e.target.value as ImageFormat)}
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium">
            맞춤 방식
            <select
              className={`${fieldClass} mt-1.5`}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'contain' | 'cover')}
            >
              <option value="contain">전체 사진 + 흰 여백</option>
              <option value="cover">가운데 기준으로 자르기</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            워터마크 (선택)
            <input
              className={`${fieldClass} mt-1.5`}
              value={watermark}
              maxLength={60}
              onChange={(e) => setWatermark(e.target.value)}
            />
          </label>
          {watermark && (
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="text-sm">
                색상
                <input
                  className="mt-2 block h-10 w-14"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
              <label className="text-sm">
                불투명도 {Math.round(opacity * 100)}%
                <input
                  className="mt-3 w-full"
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                />
              </label>
              <label className="text-sm">
                위치
                <select
                  className={`${fieldClass} mt-1.5`}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="bottom">아래 가운데</option>
                  <option value="center">가운데</option>
                </select>
              </label>
            </div>
          )}
        </fieldset>
        <ErrorMessage error={task.error} />
        <div className="flex gap-2">
          <Button type="submit" disabled={task.busy || !files.length} className="flex-1 gap-2" size="lg">
            <Play size={18} />
            {task.busy ? `${progress} / ${files.length}장 처리 중...` : '일괄 가공 시작'}
          </Button>
          {task.busy && (
            <IconButton
              label="작업 취소"
              onClick={() => {
                task.cancel()
                invalidate()
                task.setError('작업을 취소했어요.')
              }}
            >
              <Square size={18} />
            </IconButton>
          )}
        </div>
      </form>
      {outcomes.length > 0 && (
        <section className="space-y-3" aria-label="가공 결과">
          <h2 className="font-bold">처리 결과</h2>
          <ul className="space-y-3">
            {outcomes.map((r, i) => (
              <li key={i} className="flex items-center gap-3 border-b border-gray-200 pb-3">
                {r.url && (
                  <img
                    src={r.url}
                    alt={`가공된 상품 사진 ${i + 1}`}
                    className="h-20 w-20 shrink-0 rounded object-contain bg-gray-50"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className={`text-xs mt-1 ${r.error ? 'text-red-600' : 'text-green-700'}`}>
                    {r.error ?? `${width} × ${height}px · ${formatBytes(r.size!)}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {zip && (
        <Button className="w-full gap-2" onClick={() => downloadBlob(zip, 'ontools-product-photos.zip')}>
          <Download size={18} />
          성공한 {outcomes.filter((r) => !r.error).length}장 ZIP 다운로드
        </Button>
      )}
    </div>
  )
}
