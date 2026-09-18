'use client'

import { useState } from 'react'
import { ScanText, Square, Download, Copy, Plus, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RectangleCanvas } from '@/components/tools/RectangleCanvas'
import {
  ErrorMessage,
  FilePicker,
  IconButton,
  NumberField,
  panelClass,
  fieldClass,
} from '@/components/tools/WorkflowFields'
import {
  checkImageFile,
  loadImage,
  makeCanvas,
  encodeCanvas,
  fittedCanvas,
  type Rect,
} from '@/lib/image-workflows'
import { useLocalTask } from '@/lib/useLocalTask'
import { downloadBlob } from '@/lib/useObjectUrls'
import { exportTable } from '@/lib/spreadsheet'
import { wordsToTable, type OcrWord } from '@/features/table-ocr/utils'
import { recognizeTable } from '@/features/table-ocr/recognize'
import { trackToolEvent } from '@/lib/analytics'

const FULL = { x: 0, y: 0, w: 1, h: 1 }
const edges = (count: number) =>
  Array.from({ length: count - 1 }, (_, i) => Math.round(((i + 1) * 1000) / count) / 10)

export function TableToExcel() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<Rect>(FULL)
  const [language, setLanguage] = useState('kor+eng')
  const [boundaries, setBoundaries] = useState<number[]>(edges(3))
  const [recognized, setRecognized] = useState<{
    words: OcrWord[]
    width: number
    confidence: number
  } | null>(null)
  const [rows, setRows] = useState<string[][]>([])
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const task = useLocalTask()
  function resetResult() {
    setRecognized(null)
    setRows([])
    setCopied(false)
    setStatus('')
    task.setError('')
  }
  function recognize() {
    if (!image) return
    resetResult()
    void task.run(async (signal) => {
      const sx = Math.round(crop.x * image.naturalWidth)
      const sy = Math.round(crop.y * image.naturalHeight)
      const sw = Math.min(image.naturalWidth - sx, Math.round(crop.w * image.naturalWidth))
      const sh = Math.min(image.naturalHeight - sy, Math.round(crop.h * image.naturalHeight))
      if (sw < 10 || sh < 10) throw new Error('선택 영역이 너무 작아요.')
      const canvas = makeCanvas(sw, sh)
      canvas.getContext('2d')!.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh)
      const blob = await encodeCanvas(canvas, 'image/png')
      canvas.width = 0
      canvas.height = 0
      const data = await recognizeTable(blob, language, signal, (stage, progress) =>
        setStatus(
          `${stage === 'recognizing text' ? '문자 인식' : '인식 엔진 준비'} ${Math.round(progress * 100)}%`
        )
      )
      signal.throwIfAborted()
      if (!data.words.length)
        throw new Error('인식된 글자가 없어요. 더 선명한 표 사진으로 다시 시도해 주세요.')
      const table = wordsToTable(data.words, sw, boundaries)
      setRecognized({ ...data, width: sw })
      setRows(table)
      setStatus('인식 완료')
      trackToolEvent('calculation_complete', '/table-to-excel')
    })
  }
  return (
    <div className="space-y-6">
      <FilePicker
        disabled={task.busy}
        onFiles={(files) => {
          resetResult()
          setImage(null)
          void task.run(async (signal) => {
            if (files.length !== 1) throw new Error('표 사진 한 장을 선택해 주세요.')
            checkImageFile(files[0])
            const original = await loadImage(files[0])
            signal.throwIfAborted()
            const scale = Math.min(1, 2400 / Math.max(original.naturalWidth, original.naturalHeight))
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
            const prepared = await loadImage(blob)
            signal.throwIfAborted()
            setImage(prepared)
            setCrop(FULL)
          })
        }}
      />
      {image && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">표 영역</h2>
            <IconButton
              label="전체 영역 선택"
              disabled={task.busy}
              onClick={() => {
                setCrop(FULL)
                resetResult()
              }}
            >
              <RotateCcw size={18} />
            </IconButton>
          </div>
          <RectangleCanvas
            image={image}
            crop={crop}
            onSelect={(rect) => {
              setCrop(rect)
              resetResult()
            }}
            disabled={task.busy}
          />
          <details className="text-sm">
            <summary className="cursor-pointer py-2">표 영역 좌표 (%)</summary>
            <fieldset disabled={task.busy} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  value={Math.round(crop[key] * 100)}
                  max={100}
                  onChange={(value) => {
                    const next = { ...crop, [key]: value / 100 }
                    if (
                      Number.isFinite(value) &&
                      value >= 0 &&
                      next.w > 0 &&
                      next.h > 0 &&
                      next.x + next.w <= 1 &&
                      next.y + next.h <= 1
                    ) {
                      setCrop(next)
                      resetResult()
                    }
                  }}
                />
              ))}
            </fieldset>
          </details>
        </section>
      )}
      <fieldset disabled={task.busy} className={panelClass}>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-medium">
            언어
            <select
              value={language}
              className={`${fieldClass} mt-1.5`}
              onChange={(e) => {
                setLanguage(e.target.value)
                resetResult()
              }}
            >
              <option value="kor+eng">한국어 + 영어</option>
              <option value="eng">영어 · 숫자</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            표 열 수
            <select
              className={`${fieldClass} mt-1.5`}
              value={boundaries.length + 1}
              onChange={(e) => setBoundaries(edges(Number(e.target.value)))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}열
                </option>
              ))}
            </select>
          </label>
        </div>
        <details>
          <summary className="cursor-pointer text-sm">열 경계 (%)</summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {boundaries.map((value, i) => (
              <NumberField
                key={i}
                label={`${i + 1}열 오른쪽`}
                min={0.1}
                max={99.9}
                value={value}
                onChange={(v) => setBoundaries(boundaries.map((n, j) => (j === i ? v : n)))}
              />
            ))}
          </div>
        </details>
        {recognized && (
          <Button
            variant="outline"
            onClick={() => {
              try {
                setRows(wordsToTable(recognized.words, recognized.width, boundaries))
                setCopied(false)
                task.setError('')
              } catch (e) {
                task.setError((e as Error).message)
              }
            }}
          >
            열 경계 적용 · 편집 초기화
          </Button>
        )}
        <p className="text-xs text-gray-500">
          최초 인식 시 jsDelivr에서 언어 데이터를 내려받습니다. 사진·인식 내용은 전송되지 않습니다.
        </p>
      </fieldset>
      <div className="flex gap-2">
        <Button className="flex-1 gap-2" disabled={!image || task.busy} onClick={recognize}>
          <ScanText size={18} />
          {task.busy ? '처리 중...' : '표 인식'}
        </Button>
        {task.busy && (
          <IconButton
            label="표 인식 취소"
            onClick={() => {
              task.cancel()
              setStatus('취소됨')
            }}
          >
            <Square size={18} />
          </IconButton>
        )}
      </div>
      <p role="status" className="text-sm text-gray-500">
        {status}
        {recognized ? ` · 인식 신뢰도 ${Math.round(recognized.confidence)}%` : ''}
      </p>
      <ErrorMessage error={task.error} />
      {rows.length > 0 && (
        <section className="space-y-4" aria-label="인식된 표">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              인식 결과 · {rows.length}행 {rows[0].length}열
            </h2>
            <IconButton
              label="행 추가"
              disabled={rows.length >= 200}
              onClick={() => {
                setRows([...rows, Array.from({ length: rows[0].length }, () => '')])
                setCopied(false)
              }}
            >
              <Plus size={18} />
            </IconButton>
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row, r) => (
                  <tr key={r} className="border-b last:border-0">
                    <th className="px-2 font-normal text-gray-400">{r + 1}</th>
                    {row.map((cell, c) => (
                      <td key={c} className="p-1">
                        <input
                          aria-label={`${r + 1}행 ${c + 1}열`}
                          className="w-full min-w-28 border border-transparent rounded px-2 py-2 focus:border-blue-400 outline-none"
                          value={cell}
                          maxLength={2000}
                          onChange={(e) => {
                            setRows(
                              rows.map((rr, ri) =>
                                ri === r ? rr.map((v, ci) => (ci === c ? e.target.value : v)) : rr
                              )
                            )
                            setCopied(false)
                          }}
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <IconButton
                        label={`${r + 1}행 삭제`}
                        disabled={rows.length <= 1}
                        onClick={() => {
                          setRows(rows.filter((_, i) => i !== r))
                          setCopied(false)
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-amber-700">
            OCR 결과는 틀릴 수 있습니다. 병합 셀·여러 줄 셀·손글씨·복잡한 테두리는 정확도가 낮으므로 원본과
            대조해 주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(exportTable(rows, '\t').slice(1))
                  setCopied(true)
                } catch {
                  task.setError('클립보드 접근이 차단됐어요. TSV 다운로드를 이용해 주세요.')
                }
              }}
            >
              <Copy size={18} />
              {copied ? '복사 완료' : '표 복사'}
            </Button>
            {(
              [
                ['CSV', ','],
                ['TSV', '\t'],
              ] as const
            ).map(([label, sep]) => (
              <Button
                key={label}
                className="gap-2"
                onClick={() =>
                  downloadBlob(
                    new Blob([exportTable(rows, sep)], { type: 'text/plain;charset=utf-8' }),
                    `ontools-table.${label.toLowerCase()}`
                  )
                }
              >
                <Download size={18} />
                {label} 다운로드
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
