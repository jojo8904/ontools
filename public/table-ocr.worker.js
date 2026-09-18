/* global importScripts, Tesseract */
// Own the engine in a dedicated worker so cancellation also stops initialization.
importScripts('/ocr/tesseract.min.js')
self.onmessage = async ({ data: { blob, language } }) => {
  let worker
  try {
    worker = await Tesseract.createWorker(language, 1, {
      workerPath: `${self.location.origin}/ocr/worker.min.js`,
      corePath: `${self.location.origin}/ocr`,
      workerBlobURL: false,
      logger: ({ status, progress }) => self.postMessage({ type: 'progress', status, progress }),
      errorHandler: () => self.postMessage({ type: 'error' }),
    })
    await worker.setParameters({ tessedit_pageseg_mode: '6', preserve_interword_spaces: '1' })
    const { data } = await worker.recognize(blob, {}, { blocks: true, text: true })
    const words = (data.blocks || []).flatMap((b) =>
      b.paragraphs.flatMap((p) =>
        p.lines.flatMap((l) => l.words.map((w) => ({ text: w.text, bbox: w.bbox })))
      )
    )
    self.postMessage({ type: 'result', words, confidence: data.confidence })
  } catch {
    self.postMessage({ type: 'error' })
  } finally {
    if (worker) await worker.terminate()
  }
}
