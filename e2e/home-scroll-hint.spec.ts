import { expect, test } from '@playwright/test'

const selector = '[data-scroll-hint="first-viewport"]'

test.beforeEach(async ({ page }, info) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, route => route.abort())
  await page.setViewportSize(info.project.name === 'mobile' ? { width: 390, height: 500 } : { width: 1440, height: 600 })
})

test('first viewport hint stays at the bottom, avoids controls, and disappears after scrolling', async ({ page }, info) => {
  await page.goto('/')
  const hint = page.locator(selector)
  await expect(hint).toBeVisible()
  await expect(hint).toHaveAttribute('aria-hidden', 'false')
  await expect.poll(async () => {
    const box = (await hint.boundingBox())!
    return [8, 20].includes(Math.round(page.viewportSize()!.height - box.y - box.height))
  }).toBe(true)
  const collisions = await page.evaluate(() => {
    const hint = document.querySelector('[data-scroll-hint="first-viewport"]')!.getBoundingClientRect()
    const search = document.querySelector('[aria-label="계산기 검색"]')!.getBoundingClientRect()
    const unit = document.querySelector('aside[aria-label="광고"] [data-width]')!.getBoundingClientRect()
    const ad = document.querySelector('aside[aria-label="광고"]')!.getBoundingClientRect()
    const overlaps = (box: DOMRect) => hint.left < box.right && hint.right > box.left && hint.top < box.bottom && hint.bottom > box.top
    return { search: overlaps(search), ad: overlaps(new DOMRect(unit.x, ad.y + 24, unit.width, 124)) }
  })
  expect(collisions).toEqual({ search: false, ad: false })
  await page.screenshot({ path: info.outputPath('first-viewport-hint.png') })
  await page.evaluate(() => window.scrollTo({ top: 90, behavior: 'instant' }))
  await expect(hint).toBeHidden()
  await expect(hint).toHaveAttribute('tabindex', '-1')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(hint).toBeHidden()
})

test('height and orientation changes recompute visibility without leaving a permanent button', async ({ page }) => {
  await page.goto('/')
  const hint = page.locator(selector)
  await expect(hint).toBeVisible()
  const original = page.viewportSize()!
  await page.setViewportSize({ width: original.width, height: 1200 })
  await expect(page.getByRole('heading', { name: '도구 모음', exact: true })).toBeInViewport()
  await expect(hint).toBeVisible()
  await page.setViewportSize({ width: original.width, height: 10000 })
  await expect(hint).toBeHidden()
  await page.setViewportSize({ width: 844, height: 500 })
  await expect(hint).toBeVisible()
  await expect.poll(async () => {
    const box = (await hint.boundingBox())!
    return Math.round(500 - box.y - box.height)
  }).toBe(20)
  // A full-width ad occupies the bottom: the hint must find a safe row above it.
  await page.setViewportSize({ width: 390, height: 650 })
  await page.goto('/')
  await expect(hint).toBeVisible()
  const safeBox = (await hint.boundingBox())!
  expect(safeBox.y).toBeGreaterThan(325)
  expect(safeBox.y + safeBox.height).toBeLessThan(650)
  for (const viewport of [{ width: 1188, height: 761 }, { width: 1920, height: 1080 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(hint).toBeVisible()
  }
})

test('click reaches the next content and reduced motion disables animated scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const hint = page.locator(selector)
  await expect(hint).toBeVisible()
  await expect(hint).toHaveCSS('transition-duration', '0s')
  await page.evaluate(() => {
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function (options) {
      ;(window as Window & { hintBehavior?: string }).hintBehavior = typeof options === 'object' ? options.behavior : undefined
      original.call(this, options)
    }
  })
  await hint.click()
  await expect(page.getByRole('heading', { name: '도구 모음', exact: true })).toBeInViewport()
  await expect(hint).toBeHidden()
  expect(await page.evaluate(() => (window as Window & { hintBehavior?: string }).hintBehavior)).toBe('auto')
})

test('hint is hidden when all content fits or search is open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 10000 })
  await page.goto('/')
  const hint = page.locator(selector)
  await expect(hint).toBeHidden()
  await page.setViewportSize({ width: 1440, height: 600 })
  await expect(hint).toBeVisible()
  await page.getByRole('button', { name: '계산기 검색', exact: true }).click()
  await expect(hint).toBeHidden()
})
