import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import JSZip from 'jszip'
import { PDFDocument } from 'pdf-lib'

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, (route) =>
    route.abort()
  )
})

async function screenshot(page: Page, info: TestInfo, name: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: info.outputPath(`${name}-viewport.png`) })
}

async function photo(color = '#dd2244') {
  return {
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: await sharp({ create: { width: 600, height: 800, channels: 3, background: color } })
      .png()
      .toBuffer(),
  }
}

async function download(page: Page, name: string) {
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name, exact: true }).click()
  const file = await pending
  return readFile((await file.path())!)
}

test('seller price result, CSV and invalidation', async ({ page }, info) => {
  await page.goto('/selling-price')
  await page.getByRole('button', { name: '판매가 계산', exact: true }).click()
  const result = page.getByRole('region', { name: '판매가 계산 결과' })
  await expect(result.getByText('21,100원', { exact: true })).toBeVisible()
  const csv = await download(page, 'CSV 다운로드')
  expect(csv.toString('utf8')).toContain('"목표 판매가","21100"')
  await screenshot(page, info, 'selling-price')
  await page.getByLabel('목표 마진율 (%)').fill('99')
  await expect(result).toHaveCount(0)
  await page.getByRole('button', { name: '판매가 계산', exact: true }).click()
  await expect(page.locator('main').getByRole('alert')).toContainText('100% 미만')
})

test('shift calendar handles overnight breaks, eligibility and month boundaries', async ({ page }, info) => {
  await page.goto('/shift-pay-calendar')
  await page.getByLabel('통상 시급 (원)').fill('10000')
  await page.getByLabel('출근', { exact: true }).fill('21:00')
  await page.getByLabel('퇴근', { exact: true }).fill('07:00')
  await page.getByLabel('휴게 시작', { exact: true }).fill('02:00')
  await page.getByRole('button', { name: '근무 저장', exact: true }).click()
  const result = page.getByRole('region', { name: '월 급여 예상' })
  await expect(result.getByText('130,000원', { exact: true })).toBeVisible()
  expect((await download(page, 'CSV 다운로드')).toString('utf8')).toContain('"540","420","130000"')
  await screenshot(page, info, 'shift-pay-calendar')
  await page.getByLabel('상시 5인 이상').uncheck()
  await expect(result.getByText('90,000원', { exact: true }).first()).toBeVisible()
  await page.getByRole('button', { name: '다음 달', exact: true }).click()
  await expect(result).toHaveCount(0)
  await page.getByRole('button', { name: '이전 달', exact: true }).click()
  await expect(result).toBeVisible()
})

test('exit date comparison supports actual periods and stale result clearing', async ({ page }, info) => {
  await page.goto('/resignation-compare')
  await page.getByLabel('입사일', { exact: true }).fill('2025-01-01')
  await page.getByLabel('퇴직일 (마지막 근무 다음 날)').nth(0).fill('2025-12-31')
  await page.getByLabel('퇴직일 (마지막 근무 다음 날)').nth(1).fill('2026-01-01')
  await page.getByRole('button', { name: '퇴사일 비교', exact: true }).click()
  const result = page.getByRole('region', { name: '퇴사일 비교 결과' })
  await expect(result.getByText('대상 아님')).toBeVisible()
  await expect(result.getByText('3,000,000원').first()).toBeVisible()
  expect((await download(page, 'CSV 다운로드')).toString('utf8')).toContain(
    '"2026-01-01","365","92","3000000"'
  )
  await screenshot(page, info, 'resignation-compare')
  await page.getByLabel('정산 대상 미사용 연차 (일)').nth(1).fill('5')
  await expect(result).toHaveCount(0)
})

test('submission photo meets exact dimensions and bytes', async ({ page }, info) => {
  await page.goto('/photo-submit')
  await page.locator('input[type="file"]').setInputFiles(await photo())
  await page.getByRole('button', { name: '제출용 사진 만들기', exact: true }).click()
  await expect(page.getByRole('region', { name: '제출 파일' })).toBeVisible()
  const blob = await download(page, '사진 다운로드')
  expect(blob.byteLength).toBeLessThanOrEqual(200 * 1024)
  expect(await sharp(blob).metadata()).toMatchObject({ width: 600, height: 800, format: 'jpeg' })
  const { data } = await sharp(blob).raw().toBuffer({ resolveWithObject: true })
  expect(data[0]).toBeGreaterThan(200)
  expect(data[1]).toBeLessThan(60)
  await screenshot(page, info, 'photo-submit')
  await page.getByLabel('가로 (px)', { exact: true }).fill('500')
  await expect(page.getByRole('button', { name: '사진 다운로드', exact: true })).toHaveCount(0)
  await page.getByRole('combobox', { name: '저장 형식', exact: true }).selectOption('image/png')
  await page.getByLabel('최대 용량 (KB)', { exact: true }).fill('1')
  await page.getByRole('button', { name: '제출용 사진 만들기', exact: true }).click()
  await expect(page.locator('main').getByRole('alert')).toContainText('PNG')
})

test('batch output contains only successes with exact sizes and unique names', async ({ page }, info) => {
  await page.goto('/product-photo-batch')
  await page
    .locator('input[type="file"]')
    .setInputFiles([
      await photo(),
      await photo('#229955'),
      { name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('broken') },
    ])
  await page.getByLabel('가로 (px)', { exact: true }).fill('400')
  await page.getByLabel('세로 (px)', { exact: true }).fill('300')
  await page.getByLabel('장당 최대 용량 (KB)').fill('100')
  await page.getByLabel('워터마크 (선택)').fill('ONT')
  await page.getByRole('button', { name: '일괄 가공 시작', exact: true }).click()
  await expect(page.getByRole('button', { name: '성공한 2장 ZIP 다운로드', exact: true })).toBeVisible()
  const zip = await JSZip.loadAsync(await download(page, '성공한 2장 ZIP 다운로드'))
  expect(Object.keys(zip.files)).toEqual(['01-product.jpg', '02-product.jpg'])
  for (const file of Object.values(zip.files)) {
    const bytes = await file.async('nodebuffer')
    expect(bytes.length).toBeLessThanOrEqual(100 * 1024)
    expect(await sharp(bytes).metadata()).toMatchObject({ width: 400, height: 300, format: 'jpeg' })
  }
  await screenshot(page, info, 'product-photo-batch')
  await page.getByLabel('워터마크 (선택)').fill('CHANGED')
  await expect(page.getByRole('button', { name: /ZIP 다운로드/ })).toHaveCount(0)
})

test('receipt PDF redaction is flattened and edits invalidate downloads', async ({ page }, info) => {
  await page.goto('/receipt-pdf')
  await page.locator('input[type="file"]').setInputFiles([await photo(), await photo('#229955')])
  await page.getByRole('button', { name: '증빙 PDF 만들기', exact: true }).click()
  await expect(page.getByRole('button', { name: 'PDF 다운로드', exact: true })).toBeVisible()
  await page.getByText('가림 좌표 (%)', { exact: true }).click()
  await page.getByLabel('왼쪽', { exact: true }).fill('0')
  await page.getByLabel('위쪽', { exact: true }).fill('0')
  await page.getByLabel('너비', { exact: true }).fill('100')
  await page.getByLabel('높이', { exact: true }).fill('100')
  await page.getByRole('button', { name: '영역 가리기', exact: true }).click()
  await expect(page.getByRole('button', { name: 'PDF 다운로드', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '증빙 PDF 만들기', exact: true }).click()
  await expect(page.getByRole('button', { name: 'PDF 다운로드', exact: true })).toBeVisible()
  await screenshot(page, info, 'receipt-pdf')
  const bytes = await download(page, 'PDF 다운로드')
  const pdf = await PDFDocument.load(bytes)
  expect(pdf.getPageCount()).toBe(2)
  expect(pdf.getPage(0).getWidth()).toBeCloseTo(595.28)
  await page.goto('/pdf-to-image')
  await page.getByRole('button', { name: 'PNG', exact: true }).click()
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'redacted.pdf', mimeType: 'application/pdf', buffer: bytes })
  const img = page.locator('img[src^="blob:"]').first()
  await expect(img).toBeVisible({ timeout: 30000 })
  const center = await img.evaluate((element) => {
    const image = element as HTMLImageElement
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    return [...ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data]
  })
  expect(center).toEqual([0, 0, 0, 255])
})

test('real OCR produces editable table and formula-safe exports', async ({ page }, info) => {
  test.setTimeout(180000)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/table-to-excel')
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 900
    canvas.height = 260
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 900, 260)
    ctx.fillStyle = 'black'
    ctx.font = '40px Arial'
    for (const [i, row] of [
      ['NAME', 'QTY', 'PRICE'],
      ['APPLE', '10', '500'],
      ['PEAR', '20', '600'],
    ].entries())
      row.forEach((text, j) => ctx.fillText(text, 20 + j * 300, 60 + i * 80))
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'table.png', mimeType: 'image/png', buffer: Buffer.from(dataUrl, 'base64') })
  if (info.project.name === 'desktop') await page.getByRole('combobox', { name: '언어', exact: true }).selectOption('eng')
  await page.getByRole('button', { name: '표 인식', exact: true }).click()
  await expect(page.getByLabel('2행 1열')).toHaveValue('APPLE', { timeout: 150000 })
  await expect(page.getByLabel('2행 2열')).toHaveValue('10')
  await page.getByLabel('2행 1열').fill('=1+1')
  const csv = (await download(page, 'CSV 다운로드')).toString('utf8')
  expect(csv).toContain('"\'=1+1","10","500"')
  await screenshot(page, info, 'table-to-excel')
  expect(errors).toEqual([])
})

test('OCR initialization can be cancelled without stale results', async ({ page }) => {
  await page.route('**/ocr/tesseract.min.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await route.continue().catch(() => {})
  })
  await page.goto('/table-to-excel')
  await page.locator('input[type="file"]').setInputFiles(await photo())
  await page.getByRole('button', { name: '표 인식', exact: true }).click()
  await page.getByRole('button', { name: '표 인식 취소', exact: true }).click()
  await expect(page.getByRole('button', { name: '표 인식', exact: true })).toBeEnabled()
  await page.locator('input[type="file"]').setInputFiles(await photo('#229955'))
  await expect(page.getByRole('region', { name: '인식된 표' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '표 인식', exact: true })).toBeEnabled()
})

test('narrow phone layouts fit all new tools', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile')
  await page.setViewportSize({ width: 320, height: 740 })
  for (const route of ['/photo-submit', '/receipt-pdf', '/product-photo-batch', '/table-to-excel', '/selling-price', '/shift-pay-calendar', '/resignation-compare']) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
  }
})
