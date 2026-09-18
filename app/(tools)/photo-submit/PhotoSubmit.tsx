'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, WandSparkles, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  ErrorMessage,
  FilePicker,
  NumberField,
  IconButton,
  fieldClass,
  panelClass,
} from '@/components/tools/WorkflowFields'
import {
  checkImageFile,
  loadImage,
  fittedCanvas,
  encodeUnderLimit,
  imageExtension,
  formatBytes,
  validateImageDimensions,
  type ImageFormat,
} from '@/lib/image-workflows'
import { useObjectUrls, downloadBlob } from '@/lib/useObjectUrls'
import { useLocalTask } from '@/lib/useLocalTask'
import { trackToolEvent } from '@/lib/analytics'

export function PhotoSubmit() {
  const [source, setSource] = useState<{ image: HTMLImageElement; name: string; size: number } | null>(null)
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(800)
  const [maxKB, setMaxKB] = useState(200)
  const [format, setFormat] = useState<ImageFormat>('image/jpeg')
  const [mode, setMode] = useState<'cover' | 'contain'>('cover')
  const [x, setX] = useState(50)
  const [y, setY] = useState(50)
  const [zoom, setZoom] = useState(1)
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null)
  let previewError = ''
  try {
    validateImageDimensions(width, height)
  } catch (e) {
    previewError = (e as Error).message
  }
  const preview = useRef<HTMLCanvasElement>(null)
  const task = useLocalTask()
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()
  useEffect(() => {
    if (!source || !preview.current) return
    const target = preview.current
    if (previewError) {
      target.width = 0
      target.height = 0
      return
    }
    const ratio = Math.min(1, 760 / width, 900 / height)
    target.width = Math.max(1, Math.round(width * ratio))
    target.height = Math.max(1, Math.round(height * ratio))
    const canvas = fittedCanvas(source.image, target.width, target.height, mode, x, y, zoom)
    target.getContext('2d')!.drawImage(canvas, 0, 0)
    canvas.width = 0
    canvas.height = 0
  }, [source, width, height, mode, x, y, zoom, previewError])
  function invalidate() {
    setResult(null)
    clearObjectUrls()
    task.setError('')
  }
  return (
    <div className="space-y-6">
      <FilePicker
        disabled={task.busy}
        onFiles={(files) => {
          invalidate()
          setSource(null)
          void task.run(async (signal) => {
            if (files.length !== 1) throw new Error('사진 한 장을 선택해 주세요.')
            const file = files[0]
            checkImageFile(file)
            const image = await loadImage(file)
            signal.throwIfAborted()
            setSource({ image, name: file.name, size: file.size })
            setX(50)
            setY(50)
            setZoom(1)
          })
        }}
      />
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (!source) return
          invalidate()
          void task.run(async (signal) => {
            const canvas = fittedCanvas(source.image, width, height, mode, x, y, zoom)
            try {
              const blob = await encodeUnderLimit(canvas, format, maxKB, signal)
              signal.throwIfAborted()
              setResult({ blob, url: createObjectUrl(blob, 'result') })
              trackToolEvent('calculation_complete', '/photo-submit')
            } finally {
              canvas.width = 0
              canvas.height = 0
            }
          })
        }}
      >
        <fieldset disabled={task.busy} className={panelClass} onChange={invalidate}>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="가로 (px)" value={width} min={1} max={4096} step={1} onChange={setWidth} />
            <NumberField label="세로 (px)" value={height} min={1} max={4096} step={1} onChange={setHeight} />
            <NumberField label="최대 용량 (KB)" value={maxKB} min={1} max={20000} onChange={setMaxKB} />
            <label className="text-sm font-medium">
              저장 형식
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
          <fieldset>
            <legend className="mb-2 text-sm font-medium">화면 맞춤</legend>
            <div className="flex flex-wrap gap-4">
              {(
                [
                  ['cover', '비율에 맞춰 자르기'],
                  ['contain', '전체 사진 + 흰 여백'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="photo-fit"
                    checked={mode === value}
                    onChange={() => {
                      setMode(value)
                      setZoom(1)
                      setX(50)
                      setY(50)
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {mode === 'cover' && (
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                ['가로 위치', x, setX, 0, 100, 1],
                ['세로 위치', y, setY, 0, 100, 1],
                ['확대', zoom, setZoom, 1, 3, 0.05],
              ].map(([label, value, setter, min, max, step]) => (
                <label key={String(label)} className="text-xs text-gray-600">
                  {String(label)}
                  <input
                    className="mt-2 w-full"
                    aria-label={String(label)}
                    type="range"
                    value={value as number}
                    min={min as number}
                    max={max as number}
                    step={step as number}
                    onChange={(e) => (setter as (n: number) => void)(Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
          )}
        </fieldset>
        {source && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 break-all text-sm text-gray-600">
                {source.name} · {source.image.naturalWidth} × {source.image.naturalHeight}px ·{' '}
                {formatBytes(source.size)}
              </p>
              <IconButton
                label="사진 위치 초기화"
                disabled={task.busy}
                onClick={() => {
                  setX(50)
                  setY(50)
                  setZoom(1)
                  invalidate()
                }}
              >
                <RotateCcw size={18} />
              </IconButton>
            </div>
            <canvas
              ref={preview}
              aria-label="제출 사진 미리보기"
              className="mx-auto block h-auto max-w-full rounded-lg border border-gray-200"
            />
          </section>
        )}
        <ErrorMessage error={task.error || previewError} />
        <Button
          type="submit"
          disabled={!source || task.busy || !!previewError}
          className="w-full gap-2"
          size="lg"
        >
          <WandSparkles size={18} />
          {task.busy ? '사진 처리 중...' : '제출용 사진 만들기'}
        </Button>
      </form>
      {result && (
        <section className={panelClass} aria-label="제출 파일">
          <h2 className="font-bold text-green-700">규격 확인 완료</h2>
          <p className="text-sm">
            {width} × {height}px · {formatBytes(result.blob.size)} · {result.blob.size.toLocaleString()} bytes
          </p>
          <img
            src={result.url}
            alt="완성된 제출 사진"
            className="max-h-80 max-w-full mx-auto object-contain"
          />
          <Button
            className="w-full gap-2"
            onClick={() =>
              downloadBlob(result.blob, `ontools-submit-${width}x${height}.${imageExtension(format)}`)
            }
          >
            <Download size={18} />
            사진 다운로드
          </Button>
        </section>
      )}
    </div>
  )
}
