'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type Status = 'converting' | 'done' | 'error'
interface Item {
  id: string
  name: string
  status: Status
  url?: string
  size?: number
  error?: string
}

type OutType = 'image/jpeg' | 'image/png'

let _seq = 0

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function isHeic(file: File): boolean {
  const n = file.name.toLowerCase()
  return file.type === 'image/heic' || file.type === 'image/heif' || n.endsWith('.heic') || n.endsWith('.heif')
}

export function HeicToJpg() {
  const [items, setItems] = useState<Item[]>([])
  const [outType, setOutType] = useState<OutType>('image/jpeg')
  const [quality, setQuality] = useState(0.9)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const convertFiles = useCallback(
    async (files: File[], type: OutType, q: number) => {
      const heicFiles = files.filter(isHeic)
      if (heicFiles.length === 0) {
        alert('HEIC/HEIF 파일을 올려주세요. (아이폰 사진 형식)')
        return
      }
      setBusy(true)
      const heic2any = (await import('heic2any')).default
      for (const file of heicFiles) {
        _seq += 1
        const id = `h${_seq}`
        setItems((prev) => [...prev, { id, name: file.name, status: 'converting' }])
        try {
          const out = await heic2any({ blob: file, toType: type, quality: q })
          const blob = Array.isArray(out) ? out[0] : out
          const url = URL.createObjectURL(blob as Blob)
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, status: 'done', url, size: (blob as Blob).size } : it)),
          )
        } catch (e) {
          console.error('heic convert failed', e)
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, status: 'error', error: '변환 실패' } : it)),
          )
        }
      }
      setBusy(false)
    },
    [],
  )

  const ext = outType === 'image/jpeg' ? 'jpg' : 'png'

  const download = (it: Item) => {
    if (!it.url) return
    const link = document.createElement('a')
    link.download = `${it.name.replace(/\.[^.]+$/, '')}.${ext}`
    link.href = it.url
    link.click()
  }

  const downloadAll = () => {
    items.filter((it) => it.status === 'done').forEach((it, i) => {
      setTimeout(() => download(it), i * 250)
    })
  }

  const clearAll = () => setItems([])

  return (
    <div className="space-y-6">
      {/* 옵션 */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">출력 형식</span>
          <div className="flex gap-2">
            {(['image/jpeg', 'image/png'] as OutType[]).map((t) => (
              <button
                key={t}
                onClick={() => setOutType(t)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${outType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {t === 'image/jpeg' ? 'JPG' : 'PNG'}
              </button>
            ))}
          </div>
        </div>
        {outType === 'image/jpeg' && (
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">화질 {Math.round(quality * 100)}%</span>
            <input type="range" min={0.5} max={1} step={0.05} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
          </div>
        )}
      </div>

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
          if (e.dataTransfer.files?.length) convertFiles(Array.from(e.dataTransfer.files), outType, quality)
        }}
        onClick={() => !busy && inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${busy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <p className="font-medium text-gray-700">{busy ? '변환 중…' : 'HEIC 파일을 끌어다 놓거나 클릭해서 선택'}</p>
        <p className="mt-1 text-sm text-gray-400">.heic / .heif · 여러 장 가능 · 서버로 전송되지 않아요</p>
        <input
          ref={inputRef}
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) convertFiles(Array.from(e.target.files), outType, quality)
            e.target.value = ''
          }}
        />
      </div>

      {/* 결과 목록 */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{items.length}개 파일</p>
            <div className="flex gap-2">
              <button onClick={downloadAll} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                전체 다운로드
              </button>
              <button onClick={clearAll} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
                목록 비우기
              </button>
            </div>
          </div>
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
              {it.status === 'done' && it.url ? (
                <img src={it.url} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                  {it.status === 'converting' ? '…' : '✕'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-700">{it.name}</p>
                <p className="text-xs text-gray-400">
                  {it.status === 'converting' && '변환 중…'}
                  {it.status === 'done' && `${ext.toUpperCase()} · ${formatBytes(it.size || 0)}`}
                  {it.status === 'error' && <span className="text-red-500">{it.error}</span>}
                </p>
              </div>
              {it.status === 'done' && (
                <button onClick={() => download(it)} className="shrink-0 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  저장
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
