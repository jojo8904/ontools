import type { OcrWord } from './utils'

export function recognizeTable(
  blob: Blob,
  language: string,
  signal: AbortSignal,
  onProgress: (status: string, progress: number) => void
): Promise<{ words: OcrWord[]; confidence: number }> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const worker = new Worker('/table-ocr.worker.js')
    const timeout = setTimeout(
      () => finish(new Error('인식 시간이 초과됐어요. 더 작은 표 영역으로 다시 시도해 주세요.')),
      180000
    )
    function cleanup() {
      clearTimeout(timeout)
      signal.removeEventListener('abort', abort)
      worker.terminate()
    }
    function finish(error: Error) {
      cleanup()
      reject(error)
    }
    function abort() {
      finish(new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', abort, { once: true })
    worker.onerror = () =>
      finish(new Error('표 인식 엔진을 불러오지 못했어요. 네트워크 연결을 확인해 주세요.'))
    worker.onmessage = ({ data }) => {
      if (signal.aborted) return
      if (data.type === 'progress') onProgress(data.status, data.progress)
      else if (data.type === 'result') {
        cleanup()
        resolve({ words: data.words, confidence: data.confidence })
      } else if (data.type === 'error')
        finish(new Error('사진 인식에 실패했어요. 언어 데이터 다운로드와 파일 상태를 확인해 주세요.'))
    }
    worker.postMessage({ blob, language })
  })
}
