import { expect, test } from '@playwright/test'
import { PDFDocument, rgb } from 'pdf-lib'
import sharp from 'sharp'
import { TOOLS } from '../lib/tools'

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, (route) => route.abort())
})

test('home renders assets and fits the viewport', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('header img').first()).toBeVisible()
  await expect.poll(() => page.locator('header img').first().evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const tools = page.locator('#tools')
  expect(await tools.evaluate((el) => Number(getComputedStyle(el.parentElement!).opacity))).toBe(1)
  await page.getByRole('button', { name: '도구 모음으로 스크롤' }).click()
  await expect(page.locator('#tools a[href="/salary"]')).toBeInViewport()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: testInfo.outputPath('home-viewport.png') })
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true })
  expect(errors).toEqual([])
})

test('home keeps the runner and partner banner above the tool directory', async ({ page }, testInfo) => {
  const viewports = testInfo.project.name === 'mobile'
    ? [{ width: 390, height: 844 }, { width: 320, height: 740 }]
    : [{ width: 1440, height: 1000 }, { width: 1366, height: 768 }]
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const runner = page.getByRole('button', { name: '고양이 점프 게임', exact: true })
    const promo = page.getByRole('link', { name: '행운연구소 - 로또·연금복권 당첨번호 통계 분석', exact: true })
    await expect(runner).toHaveCount(1)
    await expect(promo).toHaveCount(1)
    await expect(runner).toBeInViewport()
    await expect(promo).toBeInViewport()
    const headerBox = (await page.locator('header').boundingBox())!
    const intro = page.locator('section').filter({ has: page.locator('h1') })
    await expect(intro).toHaveCSS('background-image', 'none')
    await expect(intro.locator('img')).toHaveCount(0)
    const introBox = (await intro.boundingBox())!
    const copyBox = (await intro.locator('p').boundingBox())!
    const runnerBox = (await runner.boundingBox())!
    const promoBox = (await promo.boundingBox())!
    const toolsBox = (await page.locator('#tools').boundingBox())!
    const scrollButtonBox = (await page.getByRole('button', { name: '도구 모음으로 스크롤' }).boundingBox())!
    const titleBox = (await page.getByRole('heading', { name: '도구 모음', exact: true }).boundingBox())!
    expect(introBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height)
    expect(copyBox.y + copyBox.height).toBeLessThanOrEqual(introBox.y + introBox.height)
    expect(runnerBox.y).toBeGreaterThanOrEqual(introBox.y + introBox.height)
    expect(promoBox.y).toBeGreaterThanOrEqual(runnerBox.y + runnerBox.height)
    expect(toolsBox.y).toBeGreaterThanOrEqual(promoBox.y + promoBox.height)
    expect(scrollButtonBox.y).toBeGreaterThanOrEqual(promoBox.y + promoBox.height)
    expect(scrollButtonBox.y + scrollButtonBox.height).toBeLessThanOrEqual(titleBox.y)
    for (const link of await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link').all()) {
      const box = (await link.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      expect(box.y + box.height).toBeLessThanOrEqual(headerBox.y + headerBox.height)
    }
    for (const url of ['/images/lucky-promo.webp', '/game/cat.png']) {
      expect(await page.evaluate(async (src) => {
        const image = new Image()
        image.src = src
        await image.decode()
        return image.naturalWidth > 0
      }, url)).toBe(true)
    }
    const canvas = runner.locator('canvas')
    expect(await canvas.evaluate((element) => {
      const c = element as HTMLCanvasElement
      return new Set(c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data).size
    })).toBeGreaterThan(5)
    await page.screenshot({ path: testInfo.outputPath(`home-top-${viewport.width}.png`) })
    await runner.click()
    await expect(runner.getByText('PRESS START', { exact: false })).toHaveCount(0)
    const initial = await canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL())
    await expect.poll(() => canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL())).not.toBe(initial)
    await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '도구', exact: true }).click()
    const toolsTitle = page.getByRole('heading', { name: '도구 모음', exact: true })
    await expect(toolsTitle).toBeInViewport()
    await expect.poll(async () => (await toolsTitle.boundingBox())!.y).toBeGreaterThanOrEqual(headerBox.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('all registered routes respond with their own canonical URL', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  for (const tool of TOOLS) {
    const response = await request.get(tool.href)
    expect(response.status(), tool.href).toBe(200)
    expect(await response.text(), tool.href).toContain(`rel="canonical" href="https://ontools.co.kr${tool.href}"`)
  }
})

test('salary policy date changes invalidate the previous result', async ({ page }, testInfo) => {
  await page.goto('/salary')
  await page.locator('input[type="number"]').first().fill('120000000')
  await page.getByRole('button', { name: '계산하기', exact: true }).click()
  await expect(page.getByText('-₩313,025', { exact: true }).first()).toBeVisible()
  const queued = await page.evaluate(() => {
    const layer = (window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? []
    return layer.map((item) => Array.from(item))
  })
  const configIndex = queued.findIndex((entry) => entry[0] === 'config')
  const viewIndex = queued.findIndex((entry) => entry[1] === 'tool_view')
  expect(configIndex).toBeGreaterThanOrEqual(0)
  expect(viewIndex).toBeGreaterThan(configIndex)
  expect(queued.find((entry) => entry[1] === 'calculation_complete')?.[2]).toEqual({ tool_path: '/salary' })
  await page.locator('select').first().selectOption('2026-01-01')
  await expect(page.getByText('-₩313,025', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '계산하기', exact: true }).click()
  await expect(page.getByText('-₩302,575', { exact: true }).first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('salary.png'), fullPage: true })
})

test('currency fallback is clearly identified', async ({ page }) => {
  await page.route('**/rest/v1/exchange_rates?**', (route) => route.abort())
  await page.goto('/currency')
  await page.getByRole('button', { name: '환율 계산', exact: true }).click()
  await expect(page.getByText(/기준일 미확인/).first()).toBeVisible()
  await expect(page.getByText(/참고용 고정 환율/).first()).toBeVisible()
})

test('masking and photo edits invalidate exported files', async ({ page }, testInfo) => {
  const png = await sharp({ create: { width: 600, height: 800, channels: 3, background: '#dd4488' } }).png().toBuffer()
  await page.goto('/image-mask')
  await page.locator('input[type="file"]').setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: png })
  await page.getByRole('button', { name: '마스킹 적용해서 내보내기', exact: true }).click()
  await expect(page.getByRole('button', { name: /다운로드/ })).toBeVisible()
  const canvas = page.locator('canvas').first()
  await canvas.scrollIntoViewIfNeeded()
  const box = (await canvas.boundingBox())!
  await page.mouse.move(box.x + 20, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(box.x + 90, box.y + 90)
  await page.mouse.up()
  await expect(page.getByRole('button', { name: /다운로드/ })).toHaveCount(0)
  await page.screenshot({ path: testInfo.outputPath('mask.png'), fullPage: true })
  await page.goto('/id-photo')
  await page.locator('input[type="file"]').setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: png })
  await page.getByRole('button', { name: '증명사진 만들기', exact: true }).click()
  await expect(page.getByRole('button', { name: 'JPG 다운로드', exact: true })).toBeVisible()
  await page.locator('input[type="range"]').fill('1.5')
  await expect(page.getByRole('button', { name: 'JPG 다운로드', exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('PDF conversion uses the local worker and produces a nonblank image', async ({ page }, testInfo) => {
  const pdf = await PDFDocument.create()
  pdf.addPage([200, 300]).drawRectangle({ x: 20, y: 20, width: 160, height: 260, color: rgb(1, 0, 0) })
  const buffer = Buffer.from(await pdf.save())
  const workers: string[] = []
  const errors: string[] = []
  page.on('request', (request) => { if (request.url().includes('pdf.worker')) workers.push(request.url()) })
  page.on('dialog', async (dialog) => { errors.push(dialog.message()); await dialog.dismiss() })
  await page.goto('/pdf-to-image')
  await page.getByRole('button', { name: 'PNG', exact: true }).click()
  await page.locator('input[type="file"]').setInputFiles({ name: 'sample.pdf', mimeType: 'application/pdf', buffer })
  const result = page.locator('img[src^="blob:"]').first()
  await expect(result).toBeVisible({ timeout: 30000 })
  const pixels = await result.evaluate((element) => {
    const img = element as HTMLImageElement
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
    const context = canvas.getContext('2d')!
    context.drawImage(img, 0, 0)
    return { width: img.naturalWidth, pixel: [...context.getImageData(50, 50, 1, 1).data] }
  })
  expect(pixels.width).toBe(320)
  expect(pixels.pixel).toEqual([255, 0, 0, 255])
  expect(workers.some((url) => url.startsWith(`${new URL(page.url()).origin}/pdf.worker-`))).toBe(true)
  expect(errors).toEqual([])
  await page.screenshot({ path: testInfo.outputPath('pdf.png'), fullPage: true })
})

test('canvas games render and advance after starting', async ({ page }, testInfo) => {
  for (const route of ['/games/flappy', '/games/typing', '/games/tetris']) {
    await page.goto(route)
    await page.getByRole('button', { name: '시작', exact: true }).click()
    const canvas = page.locator('canvas').first()
    const initial = await canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL())
    await expect.poll(() => canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL())).not.toBe(initial)
    const colored = await canvas.evaluate((c) => {
      const ctx = (c as HTMLCanvasElement).getContext('2d')!
      return new Set(ctx.getImageData(0, 0, (c as HTMLCanvasElement).width, (c as HTMLCanvasElement).height).data).size
    })
    expect(colored).toBeGreaterThan(5)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`${route.split('/').pop()}.png`) })
  }
})
