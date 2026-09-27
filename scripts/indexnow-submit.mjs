/**
 * IndexNow 제출 스크립트
 *
 * 배포된 커밋 범위에서 새로 생기거나 바뀐 페이지 URL을 찾아 IndexNow(네이버·빙 등)에 알린다.
 * 구글은 IndexNow를 받지 않으므로 사이트맵 lastmod와 Search Console 색인 요청으로 처리한다.
 *
 * 사용법:
 *   node scripts/indexnow-submit.mjs --before <sha> --after <sha>   # 커밋 범위에서 변경 URL 추출
 *   node scripts/indexnow-submit.mjs https://ontools.co.kr/salary ... # URL 직접 지정
 *   node scripts/indexnow-submit.mjs --all                            # 사이트맵 전체 (초기 1회용)
 *   --dry-run 을 붙이면 제출하지 않고 URL만 출력한다.
 */
import { execSync } from 'node:child_process'

const HOST = 'ontools.co.kr'
const BASE = `https://${HOST}`
const KEY = 'df1d40d783b5f68375200b544645f432' // public/<KEY>.txt 와 같아야 한다 (공개 키)
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const dryRun = args.includes('--dry-run')

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim()
}

function slugsOfGuides(ref) {
  try {
    const src = git(`show ${ref}:lib/guides.ts`)
    return new Set([...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]))
  } catch {
    return new Set()
  }
}

function changedRoutes(before, after) {
  const routes = new Set()
  let files = []
  try {
    files = git(`diff --name-only ${before} ${after}`).split('\n').filter(Boolean)
  } catch (e) {
    console.error('git diff 실패 (fetch-depth 확인):', e.message)
    return []
  }

  for (const f of files) {
    // app/(tools)/<slug>/...  → /<slug>
    let m = f.match(/^app\/\(tools\)\/([^/]+)\//)
    if (m) { routes.add(`/${m[1]}`); continue }
    // app/<segment>/page.tsx 또는 app/<segment>/<Component>.tsx (동적 라우트 제외)
    m = f.match(/^app\/((?!\(|\[|_)[^/]+)(?:\/([^/[]+))?\/?[^/]*\.tsx$/)
    if (m) {
      const top = m[1]
      if (top === 'guide') { routes.add('/guide'); continue }
      if (top === 'games' && m[2]) { routes.add(`/games/${m[2]}`); continue }
      routes.add(`/${top}`)
      continue
    }
    if (f === 'app/page.tsx' || f === 'lib/tools.ts') routes.add('/')
    if (f === 'lib/guides.ts') {
      routes.add('/guide')
      const prev = slugsOfGuides(before)
      for (const slug of slugsOfGuides(after)) if (!prev.has(slug)) routes.add(`/guide/${slug}`)
    }
    if (f === 'app/salary-table/page.tsx') routes.add('/salary-table')
  }
  return [...routes]
}

async function sitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function waitLive(url, maxMs = 6 * 60 * 1000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 20_000))
  }
  return false
}

async function main() {
  let urls = []
  if (args.includes('--all')) {
    urls = await sitemapUrls()
  } else if (flag('--before') && flag('--after')) {
    let before = flag('--before')
    const after = flag('--after')
    if (/^0+$/.test(before)) before = `${after}~1`
    urls = changedRoutes(before, after).map((r) => `${BASE}${r === '/' ? '' : r}`)
  } else {
    urls = args.filter((a) => a.startsWith('http'))
  }

  urls = [...new Set(urls)].sort()
  if (urls.length === 0) {
    console.log('제출할 URL 없음')
    return
  }
  console.log(`제출 대상 ${urls.length}건:`)
  for (const u of urls) console.log('  ' + u)
  if (dryRun) return

  // 배포가 끝나 실제로 200을 돌려줄 때까지 기다린 뒤 제출 (미배포 URL은 제외)
  const live = []
  for (const u of urls) {
    if (await waitLive(u)) live.push(u)
    else console.warn(`아직 응답 없음, 제외: ${u}`)
  }
  if (live.length === 0) {
    console.error('라이브 URL이 없어 제출하지 않음')
    process.exitCode = 1
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: live }),
  })
  console.log(`IndexNow 응답: ${res.status} ${res.statusText}`)
  if (!(res.status === 200 || res.status === 202)) {
    console.error(await res.text())
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
