import { expect, test } from '@playwright/test'

const sdk = '**/t1.kakaocdn.net/kas/static/ba.min.js'

// Synthetic SDK fixtures only: automated tests never generate real ad traffic.
for (const mode of ['blocked', 'no-fill', 'delayed-fill'] as const) {
  test(`home ad remains usable with ${mode}`, async ({ page }, info) => {
    let calls = 0
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, route => route.abort())
    await page.route(sdk, async route => {
      calls++
      if (mode === 'blocked') return route.abort()
      await route.fulfill({ contentType: 'application/javascript', body: mode === 'no-fill' ? '' : `
        setTimeout(() => {
          const ad = document.querySelector('ins.kakao_ad_area');
          if (!ad) return;
          ad.style.display = 'block';
          ad.style.width = ad.dataset.adWidth + 'px';
          ad.style.height = ad.dataset.adHeight + 'px';
          ad.style.background = '#ddd';
          ad.textContent = 'Synthetic ad fixture';
        }, 700);
      ` })
    })
    await page.goto('/')
    const ad = page.getByRole('complementary', { name: '광고', exact: true })
    const ins = ad.locator('ins.kakao_ad_area')
    await expect(ins).toHaveCount(1)
    await expect.poll(() => calls).toBe(1)
    const available = await ad.locator('p').evaluate(el => el.parentElement!.clientWidth)
    await expect(ins).toHaveAttribute('data-ad-unit', available >= 728 ? 'DAN-YmhVtuLiN5Q2MJ3K' : 'DAN-TMWlzezuMlSsAZtt')
    // Measure the wrapper's layout position, excluding its entrance transform.
    const initialToolsY = await page.locator('#tools').evaluate(el => el.parentElement!.offsetTop)
    const initialHeight = (await ad.boundingBox())!.height
    if (mode === 'delayed-fill') await expect(ins).toHaveText('Synthetic ad fixture')
    expect(await page.locator('#tools').evaluate(el => el.parentElement!.offsetTop)).toBe(initialToolsY)
    expect((await ad.boundingBox())!.height).toBe(initialHeight)
    expect(initialHeight).toBe(172)
    await page.screenshot({ path: info.outputPath(`home-${mode}.png`) })
    // Resize back and forth without refreshing the SDK, requesting a second unit,
    // or cropping a desktop creative into mobile content.
    const original = page.viewportSize()!
    await page.setViewportSize({ width: 320, height: 740 })
    if (available >= 728) await expect(ins).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.setViewportSize(original)
    await expect(page.locator('ins.kakao_ad_area')).toHaveCount(1)
    await expect(page.locator('script[src*="kas/static/ba.min.js"]')).toHaveCount(1)
    expect(calls).toBe(1)
    await page.getByRole('button', { name: '도구 모음으로 스크롤' }).click()
    await expect(page.getByRole('heading', { name: '도구 모음', exact: true })).toBeInViewport()
    await page.locator('#tools a[href="/salary"]').click()
    await expect(page).toHaveURL(/\/salary$/)
    await expect(page.getByRole('button', { name: '계산하기', exact: true })).toBeVisible()
    // SPA back to home cleans up the old mount and initializes one new home slot.
    const beforeReturn = calls
    await page.goBack()
    await expect(ad.locator('ins.kakao_ad_area')).toHaveCount(1)
    await expect(page.locator('ins.kakao_ad_area')).toHaveCount(1)
    await expect(page.locator('script[src*="kas/static/ba.min.js"]')).toHaveCount(1)
    await expect.poll(() => calls).toBe(beforeReturn + 1)
    expect(errors).toEqual([])
  })
}

test('home reserves its slot before JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(baseURL!)
  expect((await page.getByRole('complementary', { name: '광고', exact: true }).boundingBox())!.height).toBe(172)
  await expect(page.locator('ins.kakao_ad_area')).toHaveCount(0)
  await expect(page.locator('#tools a[href="/salary"]')).toHaveAttribute('href', '/salary')
  await context.close()
})

test('tablet uses a unit that fits its container', async ({ page }) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, route => route.abort())
  await page.setViewportSize({ width: 740, height: 1024 })
  await page.goto('/')
  await expect(page.locator('ins.kakao_ad_area')).toHaveAttribute('data-ad-width', '320')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
