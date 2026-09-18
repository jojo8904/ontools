import { copyFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const packagePath = require.resolve('pdfjs-dist/package.json')
const { version } = require(packagePath)
await copyFile(path.join(path.dirname(packagePath), 'build/pdf.worker.min.mjs'), new URL(`../public/pdf.worker-${version}.min.mjs`, import.meta.url))
