// One read-only visit per viewport. Never click, refresh or retry real ads.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH })
const output = 'test-results/production/home-adfit-live'
await mkdir(output, { recursive: true })
const results = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, serviceWorkers: 'block' })
    const network = []
    page.on('response', response => {
      const url = new URL(response.url())
      if (/kakao|daum/.test(url.hostname)) {
        // Do not retain query strings, cookies, IPs or response bodies.
        network.push({ host: url.hostname, path: url.pathname, status: response.status() })
      }
    })
    page.on('requestfailed', request => {
      const url = new URL(request.url())
      if (/kakao|daum/.test(url.hostname)) network.push({ host: url.hostname, path: url.pathname, error: request.failure()?.errorText })
    })
    try {
      await page.goto('https://ontools.co.kr/', { waitUntil: 'domcontentloaded' })
      const slot = page.locator('aside[aria-label="광고"] ins.kakao_ad_area')
      await slot.waitFor({ state: 'attached' })
      // A bounded observation window, without additional ad requests.
      await page.waitForTimeout(5000)
      const result = await page.evaluate(() => {
        const ad = document.querySelector('aside[aria-label="광고"]')
        const ins = ad?.querySelector('ins.kakao_ad_area')
        const box = ins?.getBoundingClientRect()
        const promo = document.querySelector('a[aria-label="행운연구소 - 로또·연금복권 당첨번호 통계 분석"]')
        const tools = document.querySelector('#tools')
        const runner = document.querySelector('[aria-label="고양이 점프 게임"]')
        return {
          width: innerWidth,
          layout: document.querySelector('[data-home-layout]')?.getAttribute('data-home-layout'),
          scrollHint: document.querySelector('[data-scroll-hint]')?.getAttribute('data-scroll-hint'),
          hintVersion: document.querySelector('[data-scroll-hint]')?.getAttribute('data-scroll-hint-version'),
          hintVisible: getComputedStyle(document.querySelector('[data-scroll-hint]')).visibility === 'visible',
          pageHeight: document.documentElement.scrollHeight,
          unit: ins?.getAttribute('data-ad-unit'),
          adWidth: ins?.getAttribute('data-ad-width'),
          adHeight: ins?.getAttribute('data-ad-height'),
          slotCount: document.querySelectorAll('ins.kakao_ad_area').length,
          scriptCount: document.querySelectorAll('script[src*="kas/static/ba.min.js"]').length,
          frameCount: ad?.querySelectorAll('iframe').length ?? 0,
          visibleArea: !!box && box.width > 0 && box.height > 0 && getComputedStyle(ins).display !== 'none',
          // Frame/area presence alone does not prove a filled paid impression.
          toolsY: tools?.getBoundingClientRect().y,
          topAdAfterGame: !!ad && !!runner && ad.getBoundingClientRect().top >= runner.getBoundingClientRect().bottom,
          promoBelowTools: !!promo && !!tools && promo.getBoundingClientRect().top >= tools.getBoundingClientRect().bottom,
          promoHeight: promo?.getBoundingClientRect().height,
          menuLink: document.querySelector('nav[aria-label="주 메뉴"] a[href="https://getluckylab.com/"]') !== null,
          noOverflow: document.documentElement.scrollWidth <= innerWidth,
        }
      })
      result.network = network
      results.push(result)
      console.log(JSON.stringify(result))
      await page.screenshot({ path: `${output}/home-${width}.png` })
      await page.locator('section[aria-label="함께 운영하는 사이트"]').screenshot({ path: `${output}/partner-${width}.png` })
      assert.equal(result.unit, width >= 728 ? 'DAN-YmhVtuLiN5Q2MJ3K' : 'DAN-TMWlzezuMlSsAZtt')
      assert.equal(result.slotCount, 1)
      assert.equal(result.scriptCount, 1)
      assert.equal(result.layout, 'game-ad-tools')
      assert.equal(result.scrollHint, 'first-viewport')
      assert.equal(result.hintVersion, '2')
      if (result.pageHeight > 1032) assert.equal(result.hintVisible, true)
      assert.ok(result.topAdAfterGame && result.promoBelowTools && result.menuLink && result.noOverflow)
      assert.ok(result.promoHeight <= 130)
    } finally {
      await page.close()
    }
  }
} finally {
  await writeFile(`${output}/observation.json`, JSON.stringify({ observedAt: new Date().toISOString(), results }, null, 2))
  await browser.close()
}
