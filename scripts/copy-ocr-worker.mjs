import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const root = new URL('../public/ocr/', import.meta.url)
await mkdir(root, { recursive: true })
const worker = path.dirname(require.resolve('tesseract.js/package.json'))
const core = path.dirname(require.resolve('tesseract.js-core/package.json'))
await copyFile(path.join(worker, 'dist/worker.min.js'), new URL('worker.min.js', root))
await copyFile(path.join(worker, 'dist/tesseract.min.js'), new URL('tesseract.min.js', root))
for (const file of ['worker.min.js.LICENSE.txt', 'tesseract.min.js.LICENSE.txt']) {
  await copyFile(path.join(worker, 'dist', file), new URL(file, root))
}
await copyFile(path.join(worker, 'LICENSE.md'), new URL('TESSERACT-LICENSE.txt', root))
await copyFile(path.join(core, 'LICENSE'), new URL('CORE-LICENSE.txt', root))
for (const file of await readdir(core)) {
  if (file.endsWith('.wasm.js')) await copyFile(path.join(core, file), new URL(file, root))
}
