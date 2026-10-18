import { expect, test } from '@playwright/test'

test('duplicate lines keep source, recompute options, copy and reset safely', async ({ page }, testInfo) => {
  await page.route(/googletagmanager|googlesyndication|doubleclick|kakao|daumcdn|google-analytics/, (route) => route.abort())
  const requests: string[] = []
  page.on('request', (request) => { if (request.method() !== 'GET') requests.push(request.url()) })
  await page.goto('/remove-duplicate-lines')
  const source = page.getByLabel('원본 텍스트', { exact: true })
  const result = page.getByLabel('정리 결과', { exact: true })
  await expect(result).toHaveValue('')
  await expect(page.getByRole('button', { name: '결과 복사' })).toBeDisabled()
  await source.fill(' 사과 \n사과\n\n😀\n사과\n<script>alert(1)</script>')
  await expect(result).toHaveValue(' 사과 \n사과\n\n😀\n<script>alert(1)</script>')
  await page.getByLabel('줄 앞뒤 공백 제거').check()
  await page.getByLabel('빈 줄 제거').check()
  await expect(result).toHaveValue('사과\n😀\n<script>alert(1)</script>')
  await expect(source).toHaveValue(' 사과 \n사과\n\n😀\n사과\n<script>alert(1)</script>')
  await page.getByLabel('줄 앞뒤 공백 제거').uncheck()
  await expect(result).toHaveValue(' 사과 \n사과\n😀\n<script>alert(1)</script>')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text },
    } })
  })
  await page.getByRole('button', { name: '결과 복사' }).click()
  await expect(page.getByText('결과를 복사했습니다.', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => (window as Window & { copied?: string }).copied)).toBe(await result.inputValue())
  await page.getByRole('button', { name: '결과 복사' }).click()
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('denied') },
    } })
  })
  await page.getByRole('button', { name: '결과 복사' }).click()
  await expect(page.getByText('복사하지 못했습니다. 결과 칸을 선택해 직접 복사해 주세요.')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('duplicate-lines.png'), fullPage: true })
  await page.getByRole('button', { name: '초기화' }).click()
  await page.getByRole('button', { name: '초기화' }).click()
  await expect(source).toHaveValue('')
  await expect(result).toHaveValue('')
  await expect(page.getByLabel('빈 줄 제거')).not.toBeChecked()
  await source.fill(' \n\t\n')
  await page.getByLabel('빈 줄 제거').check()
  await expect(result).toHaveValue('')
  await expect(page.getByRole('button', { name: '결과 복사' })).toBeDisabled()
  await expect(page.getByText('입력 2줄 → 결과 0줄 · 중복 0줄 · 빈 줄 2줄 제거')).toBeVisible()
  expect(requests).toEqual([])
})
