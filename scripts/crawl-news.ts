#!/usr/bin/env tsx
/**
 * News Crawler Script
 * Fetches RSS feeds, summarizes with Claude Haiku, and saves to Supabase
 */

import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

type CustomItem = {
  title?: string
  link?: string
  content?: string
  contentSnippet?: string
  pubDate?: string
  enclosure?: { url?: string }
  'media:content'?: { $?: { url?: string } }
  'media:thumbnail'?: { $?: { url?: string } }
}

// Extract image URL from RSS item
function extractImageUrl(item: CustomItem): string | null {
  // 1. enclosure (common in RSS 2.0)
  if (item.enclosure?.url) return item.enclosure.url
  // 2. media:content
  if (item['media:content']?.$?.url) return item['media:content'].$.url
  // 3. media:thumbnail
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url
  // 4. Extract first <img> from content HTML
  const content = item.content || ''
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
  if (imgMatch?.[1]) return imgMatch[1]
  return null
}

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY!

// Supabase client (service_role for server-side writes)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// RSS sources
const RSS_SOURCES = [
  // IT/Tech (Google뉴스 RSS - 안정적)
  { url: 'https://news.google.com/rss/search?q=IT+%EA%B8%B0%EC%88%A0+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+%EB%B0%98%EB%8F%84%EC%B2%B4&hl=ko&gl=KR&ceid=KR:ko', category: 'tech', source: 'Google뉴스 IT' },
  { url: 'https://news.google.com/rss/search?q=AI+%EC%B1%97GPT+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+%EC%8A%A4%ED%83%80%ED%8A%B8%EC%97%85&hl=ko&gl=KR&ceid=KR:ko', category: 'tech', source: 'Google뉴스 AI' },

  // Finance
  { url: 'https://www.hankyung.com/feed/economy', category: 'finance', source: '한국경제' },
  { url: 'https://www.mk.co.kr/rss/30100041/', category: 'finance', source: '매일경제' },

  // Health
  { url: 'https://news.google.com/rss/search?q=%EA%B1%B4%EA%B0%95+%EC%9D%98%EB%A3%8C+%EB%B3%B4%EA%B1%B4&hl=ko&gl=KR&ceid=KR:ko', category: 'health', source: 'Google뉴스 건강' },

  // Energy
  { url: 'https://news.google.com/rss/search?q=%EC%97%90%EB%84%88%EC%A7%80+%EC%A0%84%EA%B8%B0%EC%9A%94%EA%B8%88+%EC%A0%84%EB%A0%A5&hl=ko&gl=KR&ceid=KR:ko', category: 'energy', source: 'Google뉴스 에너지' },

  // Game (게임메카 RSS는 폐기됨(404/malformed) → Google뉴스 게임으로 대체)
  { url: 'https://news.google.com/rss/search?q=%EA%B2%8C%EC%9E%84+%EC%8B%A0%EC%9E%91+%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8&hl=ko&gl=KR&ceid=KR:ko', category: 'game', source: 'Google뉴스 게임' },
]

// Tool mapping keywords
const TOOL_KEYWORDS: Record<string, string[]> = {
  salary: ['최저임금', '연봉', '급여', '임금', '월급', '실수령액'],
  retirement: ['퇴직금', '퇴직', '근속'],
  currency: ['환율', '달러', '엔화', '위안', '유로', '원화'],
  bmi: ['비만', 'BMI', '체중', '건강', '다이어트'],
  electricity: ['전기요금', '전기세', '누진제', '전력'],
  dday: ['공휴일', '휴일', '연휴', '명절'],
  unit: ['단위', '변환'],
}

// Claude API client
const claude = new Anthropic({ apiKey: CLAUDE_API_KEY })

// Check if news already exists
async function newsExists(url: string): Promise<boolean> {
  const { data } = await supabase
    .from('news')
    .select('id')
    .eq('url', url)
    .limit(1)
  return (data?.length ?? 0) > 0
}

// Summarize news with Claude Haiku
async function summarizeNews(title: string, content: string): Promise<{
  summary: string
  categories: string[]
  related_tools: string[]
}> {
  const prompt = `다음 뉴스 기사를 분석하여 JSON 형식으로 응답해주세요:

제목: ${title}
내용: ${content}

응답 형식:
{
  "summary": "200자 내외의 한국어 요약",
  "categories": ["카테고리 배열 (tech, finance, health, energy, game, general 중 선택)"],
  "related_tools": ["관련 도구 배열 (salary, currency, retirement, bmi, electricity, dday, unit 중 선택)"]
}

규칙:
1. summary는 핵심 내용만 간결하게 200자 내외로 작성
2. categories는 1-2개 선택 (주요 카테고리만)
3. related_tools는 뉴스 내용과 관련된 도구만 포함 (없으면 빈 배열)
4. JSON만 반환 (설명 없이)`

  const message = await claude.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error('Failed to parse Claude response')
  }

  return JSON.parse(jsonMatch[0])
}

// Save news to Supabase
async function saveNews(newsItem: {
  title: string
  summary: string
  original_content: string
  source: string
  published_at: string
  categories: string[]
  related_tools: string[]
  url: string
  image_url: string | null
}) {
  const { error } = await supabase.from('news').insert(newsItem)
  if (error) throw new Error(`Supabase insert error: ${error.message}`)
}

// Main crawler function
async function crawlNews() {
  const parser = new Parser<Record<string, unknown>, CustomItem>({
    customFields: { item: [['media:content', 'media:content'], ['media:thumbnail', 'media:thumbnail']] },
  })
  let totalProcessed = 0
  let totalSaved = 0
  let totalSkipped = 0
  let totalErrors = 0

  console.log('🚀 Starting news crawler...')
  console.log(`📡 Processing ${RSS_SOURCES.length} RSS sources`)

  for (const { url, category, source } of RSS_SOURCES) {
    console.log(`\n📰 Fetching from ${source} (${category})...`)

    try {
      const feed = await parser.parseURL(url)
      console.log(`  Found ${feed.items.length} items`)

      // Process latest 10 items per source
      for (const item of feed.items.slice(0, 10)) {
        totalProcessed++

        if (!item.link || !item.title) {
          console.log(`  ⏭️  Skipping item without link or title`)
          totalSkipped++
          continue
        }

        // Check if already exists
        const exists = await newsExists(item.link)
        if (exists) {
          console.log(`  ⏭️  Already exists: ${item.title.substring(0, 50)}...`)
          totalSkipped++
          continue
        }

        try {
          // Summarize with Claude
          console.log(`  🤖 Summarizing: ${item.title.substring(0, 50)}...`)
          const { summary, categories, related_tools } = await summarizeNews(
            item.title,
            item.contentSnippet || item.content || item.title
          )

          // Save to Supabase
          await saveNews({
            title: item.title,
            summary,
            original_content: item.contentSnippet || item.content || item.title,
            source,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            categories: [...new Set([category, ...categories])],
            related_tools,
            url: item.link,
            image_url: extractImageUrl(item as CustomItem),
          })

          console.log(`  ✅ Saved: ${item.title.substring(0, 50)}...`)
          totalSaved++

          // Rate limiting for Claude API
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error(`  ❌ Error processing item: ${error}`)
          totalErrors++
        }
      }
    } catch (error) {
      console.error(`  ❌ Error fetching ${source}: ${error}`)
      totalErrors++
    }
  }

  console.log(`\n📊 Crawler Summary:`)
  console.log(`  Total processed: ${totalProcessed}`)
  console.log(`  Saved: ${totalSaved}`)
  console.log(`  Skipped (duplicates): ${totalSkipped}`)
  console.log(`  Errors: ${totalErrors}`)

  // 재발 방지: 새로 저장한 게 0건인데 에러만 발생했다면 심각한 장애(Claude 크레딧/키 만료,
  // Supabase 연결 등)로 간주하고 명시적으로 실패 처리한다.
  // (이전에는 try-catch로 에러를 삼켜 "성공(초록불)"으로 끝나 4개월간 방치됨)
  if (totalSaved === 0 && totalErrors > 0) {
    throw new Error(
      `크롤링 이상: 신규 저장 0건 / 에러 ${totalErrors}건. ` +
      `Claude API 크레딧·키 또는 Supabase 연결을 확인하세요.`
    )
  }
}

// Run crawler
crawlNews().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
