import { test, expect } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

test('preview, reorder, rotate, delete, save and reset locally', async ({ page }) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, route => route.abort())
  const posts: string[] = []
  page.on('request', request => { if (request.method() !== 'GET') posts.push(request.url()) })
  const source = await PDFDocument.create()
  source.addPage([100, 200]); source.addPage([200, 300]); source.addPage([300, 400])
  await page.goto('/pdf-merge')
  await page.getByRole('button', { name: '페이지 미리보기·편집' }).click()
  await page.getByLabel('편집할 PDF', { exact: true }).setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await source.save()) })
  const first = page.getByRole('region', { name: '원본 1페이지', exact: true })
  await expect(first.getByRole('img')).toBeVisible()
  await first.getByRole('button', { name: '뒤로' }).click()
  await first.getByRole('button', { name: '90° 회전' }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('region', { name: '원본 3페이지', exact: true }).getByRole('button', { name: '삭제', exact: true }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '편집한 PDF 저장' }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  const result = await PDFDocument.load(Buffer.concat(chunks))
  expect(result.getPages().map(p => [p.getWidth(), p.getRotation().angle])).toEqual([[200, 0], [100, 90]])
  await first.getByRole('button', { name: '삭제', exact: true }).click()
  await expect(page.getByRole('button', { name: '삭제', exact: true })).toBeDisabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: '작업 초기화' }).click()
  await expect(page.getByRole('button', { name: '편집한 PDF 저장' })).toHaveCount(0)
  await page.getByLabel('편집할 PDF', { exact: true }).setInputFiles({ name: 'broken.pdf', mimeType: 'application/pdf', buffer: Buffer.from('broken') })
  await expect(page.getByRole('status')).toContainText('손상·암호화')
  expect(posts).toEqual([])
})

test('existing merge and extraction still download valid PDFs', async ({ page }) => {
  const doc = await PDFDocument.create(); doc.addPage([100, 200]); doc.addPage([200, 300])
  const buffer = Buffer.from(await doc.save())
  await page.goto('/pdf-merge')
  await page.locator('input[type=file]').setInputFiles([
    { name: 'a.pdf', mimeType: 'application/pdf', buffer },
    { name: 'b.pdf', mimeType: 'application/pdf', buffer },
  ])
  await expect(page.getByText('2개 · 위에서부터 합쳐지는 순서')).toBeVisible()
  const merged = page.waitForEvent('download')
  await page.getByRole('button', { name: '2개 PDF 하나로 합치기' }).click()
  const mergedStream = await (await merged).createReadStream()
  const mergedChunks: Buffer[] = []; for await (const chunk of mergedStream!) mergedChunks.push(Buffer.from(chunk))
  expect((await PDFDocument.load(Buffer.concat(mergedChunks))).getPageCount()).toBe(4)
  await page.getByRole('button', { name: '한 PDF 분할·추출' }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'a.pdf', mimeType: 'application/pdf', buffer })
  await page.getByPlaceholder('예: 1-3, 5 (전체 2페이지)').fill('2')
  const extracted = page.waitForEvent('download')
  await page.getByRole('button', { name: '추출', exact: true }).click()
  const stream = await (await extracted).createReadStream()
  const chunks: Buffer[] = []; for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  const result = await PDFDocument.load(Buffer.concat(chunks))
  expect(result.getPageCount()).toBe(1); expect(result.getPage(0).getWidth()).toBe(200)
  const split = page.waitForEvent('download')
  await page.getByRole('button', { name: '모든 페이지 낱개로 분할 (ZIP)' }).click()
  const zipDownload = await split
  expect(zipDownload.suggestedFilename()).toBe('a_분할.zip')
  const zipStream = await zipDownload.createReadStream()
  const zipChunks: Buffer[] = []; for await (const chunk of zipStream!) zipChunks.push(Buffer.from(chunk))
  const zip = await JSZip.loadAsync(Buffer.concat(zipChunks))
  expect(Object.keys(zip.files)).toEqual(['a_01.pdf', 'a_02.pdf'])
  expect((await PDFDocument.load(await zip.files['a_02.pdf'].async('uint8array'))).getPage(0).getWidth()).toBe(200)
})
