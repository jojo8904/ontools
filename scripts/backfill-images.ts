#!/usr/bin/env tsx
/**
 * 이미지가 없는 기존 뉴스 행에 og:image를 채우는 일회성 백필 스크립트
 * 실행: GitHub Actions(backfill-images.yml) 또는 `npx tsx scripts/backfill-images.ts`
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// 기사 페이지에서 대표 이미지(og:image) 스크래핑 (crawl-news.ts와 동일 로직)
async function fetchOgImage(link: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(link, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ontools-bot/1.0)' },
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const html = await res.text()
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    const url = m?.[1]
    if (url && /^https?:\/\//i.test(url)) return url
    return null
  } catch {
    return null
  }
}

async function main() {
  console.log('🖼️  이미지 백필 시작...')
  // image_url이 비어 있는 뉴스 조회 (최근 것 우선)
  const { data, error } = await supabase
    .from('news')
    .select('id, url, title')
    .is('image_url', null)
    .order('published_at', { ascending: false })
    .limit(300)

  if (error) throw new Error(`조회 실패: ${error.message}`)
  const rows = data ?? []
  console.log(`📋 이미지 없는 뉴스: ${rows.length}건`)

  let filled = 0
  let failed = 0
  for (const row of rows) {
    const img = await fetchOgImage(row.url)
    if (img) {
      const { error: upErr } = await supabase.from('news').update({ image_url: img }).eq('id', row.id)
      if (upErr) {
        console.log(`  ⚠️  업데이트 실패: ${row.title?.substring(0, 30)} (${upErr.message})`)
        failed++
      } else {
        console.log(`  ✅ ${row.title?.substring(0, 40)}`)
        filled++
      }
    } else {
      failed++
    }
    await new Promise((r) => setTimeout(r, 300)) // 과도한 요청 방지
  }

  console.log(`\n📊 백필 완료: 성공 ${filled}건 / 이미지 못 찾음·실패 ${failed}건 (총 ${rows.length}건)`)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
