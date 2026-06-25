'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type BgMode = 'transparent' | 'white' | 'custom'

const CHECKER: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)',
  backgroundSize: '18px 18px',
  backgroundPosition: '0 0,0 9px,9px -9px,-9px 0',
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

export function BgRemove() {
  const [origUrl, setOrigUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [cutBlob, setCutBlob] = useState<Blob | null>(null)
  const [cutUrl, setCutUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [bgMode, setBgMode] = useState<BgMode>('transparent')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<File | null>(null)

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    fileRef.current = file
    setFileName(file.name)
    setCutBlob(null)
    setCutUrl(null)
    setBgMode('transparent')
    setOrigUrl(URL.createObjectURL(file))
  }, [])

  const run = useCallback(async () => {
    const file = fileRef.current
    if (!file) return
    setBusy(true)
    setProgress('AI 모델 준비 중…')
    try {
      // onnxruntime-web의 ESM 전용 코드 때문에 webpack 번들에 넣지 않고,
      // 런타임에 브라우저가 CDN(esm.sh)에서 직접 ESM으로 로드한다.
      // @ts-ignore - 외부 URL 동적 import (webpack 번들 제외)
      const mod: any = await import(/* webpackIgnore: true */ 'https://esm.sh/@imgly/background-removal@1.7.0')
      const removeBackground = mod.removeBackground
      const blob: Blob = await removeBackground(file, {
        output: { format: 'image/png' },
        progress: (key: string, current: number, total: number) => {
          const pct = total ? Math.round((current / total) * 100) : 0
          if (key.startsWith('fetch')) setProgress(`AI 모델 받는 중… ${pct}% (처음 한 번만)`)
          else setProgress(`배경 분석 중… ${pct}%`)
        },
      })
      setCutBlob(blob)
      setCutUrl(URL.createObjectURL(blob))
    } catch (e) {
      console.error('bg remove failed', e)
      alert('배경 제거 중 오류가 발생했어요. 인터넷 연결을 확인하고 잠시 후 다시 시도해 주세요.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }, [])

  const buildBlob = useCallback(async (): Promise<Blob | null> => {
    if (!cutBlob) return null
    if (bgMode === 'transparent') return cutBlob
    const img = await blobToImage(cutBlob)
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')!
    ctx.fillStyle = bgMode === 'white' ? '#ffffff' : bgColor
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0)
    return await new Promise((res) => c.toBlob((b) => res(b!), 'image/png'))
  }, [cutBlob, bgMode, bgColor])

  const download = useCallback(async () => {
    const blob = await buildBlob()
    if (!blob) return
    const a = document.createElement('a')
    const base = fileName.replace(/\.[^.]+$/, '') || 'image'
    a.download = `${base}_누끼.png`
    a.href = URL.createObjectURL(blob)
    a.click()
  }, [buildBlob, fileName])

  const reset = () => {
    setOrigUrl(null)
    setCutBlob(null)
    setCutUrl(null)
    setFileName('')
    fileRef.current = null
  }

  if (!origUrl) {
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
        <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
        <p className="mt-1 text-sm text-gray-400">사진은 서버로 전송되지 않아요 · AI 모델만 처음 한 번 다운로드</p>
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
          다른 사진
        </button>
      </div>

      {/* 원본 / 결과 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-400">원본</p>
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2">
            <img src={origUrl} alt="원본" className="max-h-64 rounded object-contain" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-400">배경 제거 결과</p>
          <div className="flex h-[calc(100%-1.25rem)] min-h-[8rem] items-center justify-center rounded-lg border border-gray-200 p-2" style={cutUrl ? CHECKER : undefined}>
            {cutUrl ? (
              <img
                src={cutUrl}
                alt="배경 제거 결과"
                className="max-h-64 object-contain"
                style={bgMode === 'transparent' ? undefined : { background: bgMode === 'white' ? '#fff' : bgColor }}
              />
            ) : (
              <span className="text-sm text-gray-400">아래 버튼을 눌러주세요</span>
            )}
          </div>
        </div>
      </div>

      {!cutUrl ? (
        <Button onClick={run} size="lg" className="w-full" disabled={busy}>
          {busy ? progress || '처리 중…' : '배경 제거하기'}
        </Button>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <span className="mb-2 block text-sm font-medium text-gray-700">배경</span>
            <div className="flex flex-wrap items-center gap-2">
              {([['투명', 'transparent'], ['흰색', 'white'], ['색상 지정', 'custom']] as [string, BgMode][]).map(([l, m]) => (
                <button
                  key={m}
                  onClick={() => setBgMode(m)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${bgMode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {l}
                </button>
              ))}
              {bgMode === 'custom' && (
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-gray-200"
                />
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={download} size="lg" className="flex-1">
              PNG 다운로드
            </Button>
            <Button onClick={run} size="lg" variant="outline" disabled={busy}>
              다시 처리
            </Button>
          </div>
        </>
      )}

      {busy && progress && <p className="text-center text-sm text-gray-500">{progress}</p>}
    </div>
  )
}
