export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp'
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
export const MAX_FILE_BYTES = 20 * 1024 * 1024

export function checkImageFile(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('JPG, PNG, WebP 파일만 지원해요.')
  if (!file.size || file.size > MAX_FILE_BYTES)
    throw new Error('사진 한 장은 0바이트 초과, 20MB 이하여야 해요.')
}

export async function loadImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    if (!img.naturalWidth || img.naturalWidth * img.naturalHeight > 40_000_000)
      throw new Error('사진은 4,000만 픽셀 이하여야 해요.')
    return img
  } catch (error) {
    if (error instanceof Error && error.message.includes('픽셀')) throw error
    throw new Error('사진을 읽을 수 없어요. 파일 형식을 확인해 주세요.')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function validateImageDimensions(width: number, height: number) {
  if (![width, height].every((n) => Number.isInteger(n) && n > 0 && n <= 4096) || width * height > 16_000_000)
    throw new Error('가로·세로는 1~4096px, 전체는 1,600만 픽셀 이하여야 해요.')
}

export function makeCanvas(width: number, height: number) {
  validateImageDimensions(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export function fittedCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  mode: 'cover' | 'contain',
  x = 50,
  y = 50,
  zoom = 1
) {
  const canvas = makeCanvas(width, height)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  const scale =
    (mode === 'cover'
      ? Math.max(width / img.naturalWidth, height / img.naturalHeight)
      : Math.min(width / img.naturalWidth, height / img.naturalHeight)) * zoom
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  ctx.drawImage(img, ((width - w) * x) / 100, ((height - h) * y) / 100, w, h)
  return canvas
}

export function encodeCanvas(canvas: HTMLCanvasElement, format: ImageFormat, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('이미지 저장에 실패했어요.'))
        else if (blob.type !== format)
          reject(new Error('이 브라우저는 선택한 저장 형식을 지원하지 않아요. JPG 또는 PNG를 선택해 주세요.'))
        else resolve(blob)
      },
      format,
      quality
    )
  )
}

export async function encodeUnderLimit(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  maxKB: number,
  signal?: AbortSignal
): Promise<Blob> {
  if (!Number.isFinite(maxKB) || maxKB < 1 || maxKB > 20000)
    throw new Error('최대 용량은 1~20,000KB로 입력해 주세요.')
  const bytes = Math.floor(maxKB * 1024)
  const high = await encodeCanvas(canvas, format, 0.95)
  signal?.throwIfAborted()
  if (high.size <= bytes) return high
  if (format === 'image/png')
    throw new Error(
      '이 크기의 PNG로는 제한 용량을 맞출 수 없어요. JPG/WebP 또는 더 작은 픽셀 크기를 선택해 주세요.'
    )
  let lowQuality = 0.02
  let highQuality = 0.95
  let best = await encodeCanvas(canvas, format, lowQuality)
  if (best.size > bytes)
    throw new Error(
      '지정한 픽셀 크기에서는 제한 용량을 맞출 수 없어요. 용량 제한을 높이거나 픽셀 크기를 줄여 주세요.'
    )
  for (let i = 0; i < 9; i++) {
    signal?.throwIfAborted()
    const quality = (lowQuality + highQuality) / 2
    const blob = await encodeCanvas(canvas, format, quality)
    if (blob.size <= bytes) {
      best = blob
      lowQuality = quality
    } else highQuality = quality
  }
  signal?.throwIfAborted()
  return best
}

export function imageExtension(format: ImageFormat) {
  return format === 'image/jpeg' ? 'jpg' : format.split('/')[1]
}
export function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function drawRedactions(canvas: HTMLCanvasElement, masks: Rect[]) {
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  for (const mask of masks) {
    const left = Math.floor(mask.x * canvas.width)
    const top = Math.floor(mask.y * canvas.height)
    ctx.fillRect(
      left,
      top,
      Math.ceil((mask.x + mask.w) * canvas.width) - left,
      Math.ceil((mask.y + mask.h) * canvas.height) - top
    )
  }
}
