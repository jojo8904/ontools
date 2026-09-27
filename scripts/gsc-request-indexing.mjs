/**
 * Google Search Console "색인 생성 요청" 자동화 (로컬 전용)
 *
 * 구글은 일반 페이지의 즉시 색인 요청 API가 없어서, 로그인된 브라우저 프로필로
 * Search Console의 URL 검사 → 색인 생성 요청 버튼을 대신 누른다.
 * 하루 요청 한도(대략 10건)가 있으므로 중요한 새 URL에만 쓴다.
 *
 * 준비: 처음 실행하면 전용 크롬 프로필 창이 열린다. 거기서 구글에 한 번 로그인하면
 *       이후에는 자동으로 진행된다. (일반 크롬의 로그인은 공유되지 않는다)
 *
 * 사용법:
 *   node scripts/gsc-request-indexing.mjs https://ontools.co.kr/salary https://ontools.co.kr/guide/holidays-2027
 *   node scripts/gsc-request-indexing.mjs --login          # 로그인만 하고 종료
 *   환경변수 GSC_PROPERTY 로 속성을 바꿀 수 있다 (기본 https://ontools.co.kr/)
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const PROPERTY = process.env.GSC_PROPERTY || 'https://ontools.co.kr/'
const PROFILE_DIR = path.join(os.homedir(), '.ontools-gsc-profile')
const SHOT_DIR = path.join(process.cwd(), 'test-results', 'gsc')
const args = process.argv.slice(2)
const loginOnly = args.includes('--login')
const urls = args.filter((a) => a.startsWith('http'))

fs.mkdirSync(SHOT_DIR, { recursive: true })

function inspectUrl(target) {
  return `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(PROPERTY)}&id=${encodeURIComponent(target)}`
}

async function ensureLoggedIn(page) {
  await page.goto(`https://search.google.com/search-console?resource_id=${encodeURIComponent(PROPERTY)}`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(3000)
  // 로그아웃 상태면 accounts.google.com 또는 소개 페이지(/search-console/about)로 이동한다.
  const isLoggedOut = () => /accounts\.google\.com|\/signin|ServiceLogin|\/search-console\/about|\/welcome/i.test(page.url())
  if (!isLoggedOut()) {
    console.log(`>>> 로그인 상태 확인 (${page.url()})`)
    return true
  }
  console.log('\n>>> 열린 크롬 창에서 "지금 시작하기"를 누르고 구글 로그인을 해 주세요. 최대 5분 기다립니다...')
  try {
    await page.waitForURL(
      (u) => u.hostname === 'search.google.com' && !/\/about|\/welcome|signin/i.test(u.href),
      { timeout: 5 * 60 * 1000 },
    )
    await page.waitForTimeout(3000)
    console.log(`>>> 로그인 확인됨 (${page.url()})`)
    return true
  } catch {
    console.error('로그인 시간 초과')
    return false
  }
}

async function requestIndexing(page, target, idx) {
  const shot = (name) => page.screenshot({ path: path.join(SHOT_DIR, `${idx}-${name}.png`), fullPage: false })
  // 딥링크(inspect?id=)는 404를 돌려주므로 상단 URL 검사창에 직접 입력한다
  await page.goto(`https://search.google.com/search-console?resource_id=${encodeURIComponent(PROPERTY)}`, { waitUntil: 'networkidle' }).catch(() => {})
  const box = page.locator('input[role="combobox"][aria-label*="URL 검사"], input[role="combobox"][aria-label*="Inspect"]').first()
  try {
    await box.waitFor({ state: 'visible', timeout: 30_000 })
  } catch {
    await shot('no-searchbox')
    return { url: target, result: '검사창을 찾지 못함 (스크린샷 확인)' }
  }
  await box.click()
  await box.fill(target)
  await box.press('Enter')

  // "Google 색인에서 데이터 가져오는 중" 로딩이 끝날 때까지 대기
  const loading = page.getByText(/데이터 가져오는 중|Retrieving data/i)
  await loading.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {})
  await loading.waitFor({ state: 'hidden', timeout: 120_000 }).catch(() => {})
  await page.waitForTimeout(2000)

  const requestBtn = page.getByRole('button', { name: /색인 생성 요청|Request indexing/i })
  const testedLive = page.getByRole('button', { name: /실제 URL 테스트|Test live URL/i })
  try {
    await Promise.race([
      requestBtn.waitFor({ state: 'visible', timeout: 60_000 }),
      testedLive.waitFor({ state: 'visible', timeout: 60_000 }),
    ])
  } catch {
    await shot('timeout')
    return { url: target, result: '검사 결과 화면 로드 실패 (스크린샷 확인)' }
  }
  await shot('inspected')

  if (!(await requestBtn.isVisible().catch(() => false))) {
    return { url: target, result: '요청 버튼 없음 (이미 요청됨이거나 화면 구조 변경)' }
  }

  // 검사 결과의 색인 상태 문구 (예: "URL이 Google에 등록되어 있지 않음", "리디렉션 오류")
  const statusText = await page.evaluate(() => {
    const t = document.body.innerText
    const m = t.match(/URL이 Google에 등록되어 있(?:음|지 않음)|URL is (?:not )?on Google/)
    const reason = t.match(/페이지 색인이 생성되지 않음: ([^\n]+)/)
    return [m?.[0], reason?.[1]].filter(Boolean).join(' / ')
  })

  await requestBtn.click()
  // 결과 다이얼로그를 본문 텍스트로 판정 (요청됨 / 할당량 초과 / 이미 요청)
  let outcome = '결과 확인 실패 (스크린샷 확인)'
  const started = Date.now()
  while (Date.now() - started < 120_000) {
    const text = await page.evaluate(() => document.body.innerText)
    if (/색인 생성 요청됨|Indexing requested/i.test(text)) { outcome = '요청 완료'; break }
    if (/할당량|Quota exceeded/i.test(text)) { outcome = '일일 할당량 초과'; break }
    if (/이미 요청|already requested/i.test(text)) { outcome = '이미 요청됨'; break }
    await page.waitForTimeout(2000)
  }
  if (statusText) outcome += ` (검사 상태: ${statusText})`
  await shot('result')
  // 다이얼로그 닫기
  const close = page.getByRole('button', { name: /확인|OK|닫기|Close/i }).first()
  if (await close.isVisible().catch(() => false)) await close.click().catch(() => {})
  return { url: target, result: outcome }
}

async function main() {
  if (!loginOnly && urls.length === 0) {
    console.error('URL을 하나 이상 주세요. 예: node scripts/gsc-request-indexing.mjs https://ontools.co.kr/salary')
    process.exitCode = 1
    return
  }

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    locale: 'ko-KR',
    args: ['--disable-blink-features=AutomationControlled'],
  })
  const page = context.pages()[0] ?? (await context.newPage())

  try {
    if (!(await ensureLoggedIn(page))) return
    if (loginOnly) {
      console.log('로그인 상태 저장됨. 이제 URL을 넘겨 실행하면 됩니다.')
      return
    }
    const results = []
    for (const [i, target] of urls.entries()) {
      console.log(`[${i + 1}/${urls.length}] ${target}`)
      // 로그인 과정에서 탭이 닫힐 수 있으므로 URL마다 새 탭을 쓴다
      const tab = await context.newPage()
      let r
      try {
        r = await requestIndexing(tab, target, i + 1)
      } catch (e) {
        r = { url: target, result: `오류: ${e.message.split('\n')[0]}` }
      } finally {
        await tab.close().catch(() => {})
      }
      console.log(`    → ${r.result}`)
      results.push(r)
      if (r.result === '일일 할당량 초과') break
      await new Promise((res) => setTimeout(res, 3000))
    }
    console.log('\n결과 요약')
    for (const r of results) console.log(`${r.result.padEnd(14)} ${r.url}`)
  } finally {
    await context.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
