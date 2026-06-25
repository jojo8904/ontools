'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface ExifInfo {
  hasExif: boolean
  gps?: { lat: number; lon: number }
  dateTime?: string
  make?: string
  model?: string
}

/** JPEG의 EXIF(APP1)에서 GPS·촬영정보를 최대한 읽어옴. 실패해도 제거 기능엔 영향 없음. */
function parseExif(buf: ArrayBuffer): ExifInfo {
  const info: ExifInfo = { hasExif: false }
  try {
    const view = new DataView(buf)
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return info // JPEG 아님
    let offset = 2
    const len = view.byteLength
    let tiff = -1
    while (offset + 4 <= len) {
      const marker = view.getUint16(offset)
      if ((marker & 0xff00) !== 0xff00) break
      if (marker === 0xffda) break // 이미지 데이터 시작
      const size = view.getUint16(offset + 2)
      if (marker === 0xffe1) {
        const start = offset + 4
        if (start + 6 <= len && view.getUint32(start) === 0x45786966 && view.getUint16(start + 4) === 0x0000) {
          info.hasExif = true
          tiff = start + 6
          break
        }
      }
      offset += 2 + size
    }
    if (tiff < 0) return info

    const le = view.getUint16(tiff) === 0x4949
    const u16 = (o: number) => view.getUint16(o, le)
    const u32 = (o: number) => view.getUint32(o, le)
    if (u16(tiff + 2) !== 0x002a) return info

    const readIFD = (start: number) => {
      const entries: Record<number, { type: number; count: number; off: number }> = {}
      const n = u16(start)
      for (let i = 0; i < n; i++) {
        const e = start + 2 + i * 12
        entries[u16(e)] = { type: u16(e + 2), count: u32(e + 4), off: e + 8 }
      }
      return entries
    }
    const ascii = (e: { count: number; off: number }) => {
      const p = e.count > 4 ? tiff + u32(e.off) : e.off
      let s = ''
      for (let i = 0; i < e.count - 1; i++) s += String.fromCharCode(view.getUint8(p + i))
      return s.trim()
    }
    const rationals = (e: { count: number; off: number }) => {
      const p = tiff + u32(e.off)
      const out: number[] = []
      for (let i = 0; i < e.count; i++) {
        const num = u32(p + i * 8)
        const den = u32(p + i * 8 + 4)
        out.push(den ? num / den : 0)
      }
      return out
    }

    const ifd0 = readIFD(tiff + u32(tiff + 4))
    if (ifd0[0x010f]) info.make = ascii(ifd0[0x010f])
    if (ifd0[0x0110]) info.model = ascii(ifd0[0x0110])
    if (ifd0[0x0132]) info.dateTime = ascii(ifd0[0x0132])
    if (ifd0[0x8825]) {
      const gps = readIFD(tiff + u32(ifd0[0x8825].off))
      if (gps[2] && gps[4]) {
        const toDec = (a: number[]) => (a[0] || 0) + (a[1] || 0) / 60 + (a[2] || 0) / 3600
        let la = toDec(rationals(gps[2]))
        let lo = toDec(rationals(gps[4]))
        if (gps[1] && ascii(gps[1]).toUpperCase() === 'S') la = -la
        if (gps[3] && ascii(gps[3]).toUpperCase() === 'W') lo = -lo
        if (isFinite(la) && isFinite(lo) && (la !== 0 || lo !== 0)) info.gps = { lat: la, lon: lo }
      }
    }
  } catch {
    /* 파싱 실패 — 정보 표시만 생략, 제거는 정상 동작 */
  }
  return info
}

export function ExifRemove() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [isJpg, setIsJpg] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [info, setInfo] = useState<ExifInfo | null>(null)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<File | null>(null)

  const load = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 올릴 수 있어요.')
      return
    }
    fileRef.current = file
    setFileName(file.name)
    setIsJpg(file.type === 'image/jpeg')
    setDone(false)
    setPreviewUrl(URL.createObjectURL(file))
    try {
      const buf = await file.arrayBuffer()
      setInfo(parseExif(buf))
    } catch {
      setInfo({ hasExif: false })
    }
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => setImg(image)
  }, [])

  const clean = useCallback(() => {
    if (!img) return
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')!
    if (isJpg) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, c.width, c.height)
    }
    ctx.drawImage(img, 0, 0)
    const type = isJpg ? 'image/jpeg' : 'image/png'
    c.toBlob(
      (b) => {
        if (!b) return
        const a = document.createElement('a')
        const base = fileName.replace(/\.[^.]+$/, '') || 'image'
        a.download = `${base}_정보제거.${isJpg ? 'jpg' : 'png'}`
        a.href = URL.createObjectURL(b)
        a.click()
        setDone(true)
      },
      type,
      0.95,
    )
  }, [img, isJpg, fileName])

  const reset = () => {
    setImg(null)
    setFileName('')
    setPreviewUrl(null)
    setInfo(null)
    setDone(false)
    fileRef.current = null
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
        <p className="font-medium text-gray-700">이미지를 끌어다 놓거나 클릭해서 선택</p>
        <p className="mt-1 text-sm text-gray-400">사진은 서버로 전송되지 않아요 · 브라우저에서 바로 처리</p>
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

      {previewUrl && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2">
          <img src={previewUrl} alt="미리보기" className="max-h-56 rounded object-contain" />
        </div>
      )}

      {/* 감지된 정보 */}
      {info && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            info.gps ? 'border-red-200 bg-red-50' : info.hasExif ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
          }`}
        >
          {info.gps ? (
            <div className="space-y-1.5">
              <p className="font-bold text-red-700">⚠️ 위치정보(GPS)가 들어있어요</p>
              <p className="text-gray-700">
                좌표: {info.gps.lat.toFixed(5)}, {info.gps.lon.toFixed(5)}{' '}
                <a
                  href={`https://www.google.com/maps?q=${info.gps.lat},${info.gps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline"
                >
                  지도에서 보기
                </a>
              </p>
              <p className="text-gray-500">이대로 공유하면 사진을 찍은 장소가 노출될 수 있어요. 아래 버튼으로 제거하세요.</p>
            </div>
          ) : info.hasExif ? (
            <p className="text-amber-700">
              📷 촬영정보(EXIF)가 들어있어요{info.model ? ` · ${[info.make, info.model].filter(Boolean).join(' ')}` : ''}
              {info.dateTime ? ` · ${info.dateTime}` : ''}. <span className="text-gray-500">위치정보는 발견되지 않았지만 기기·시각 정보가 남아 있어요.</span>
            </p>
          ) : (
            <p className="text-gray-500">이 사진에서는 위치·촬영정보가 발견되지 않았어요. (이미 없거나 PNG 등) 그래도 깨끗한 사본으로 저장할 수 있어요.</p>
          )}
        </div>
      )}

      <Button onClick={clean} size="lg" className="w-full">
        위치·촬영정보 지우고 저장
      </Button>

      {done && (
        <p className="text-center text-sm font-medium text-emerald-700">
          ✓ 정보를 제거한 사본이 저장됐어요. (원본은 그대로 남아 있어요)
        </p>
      )}
    </div>
  )
}
