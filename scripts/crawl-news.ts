#!/usr/bin/env tsx
/**
 * News Crawler Script
 * Fetches RSS feeds, summarizes with Claude Haiku, and saves to Supabase
 */

import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY!

// Supabase client (service_role for server-side writes)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// RSS sources
const RSS_SOURCES = [
  // IT/Tech
  { url: 'https://www.etnews.com/rss.xml', category: 'tech', source: '전자신문' },
  { url: 'https://www.bloter.net/feed', category: 'tech', source: '블로터' },
  { url: 'https://www.boannews.com/media/rss.xml', category: 'tech', source: '보안뉴스' },

  // Finance
  { url: 'https://www.hankyung.com/feed/economy', category: 'finance', source: '한국경제' },
  { url: 'https://www.mk.co.kr/rss/30100041/', category: 'finance', source: '매일경제' },

  // Labor
  { url: 'https://www.moel.go.kr/rss/policy.do', category: 'labor', source: '고용노동부' },

  // Health
  { url: 'https://news.google.com/rss/search?q=%EA%B1%B4%EA%B0%95+%EC%9D%98%EB%A3%8C+%EB%B3%B4%EA%B1%B4&hl=ko&gl=KR&ceid=KR:ko', category: 'health', source: 'Google뉴스 건강' },

  // Energy
  { url: 'https://news.google.com/rss/search?q=%EC%97%90%EB%84%88%EC%A7%80+%EC%A0%84%EA%B8%B0%EC%9A%94%EA%B8%88+%EC%A0%84%EB%A0%A5&hl=ko&gl=KR&ceid=KR:ko', category: 'energy', source: 'Google뉴스 에너지' },
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
  "categories": ["카테고리 배열 (tech, finance, labor, health, energy, general 중 선택)"],
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
}) {
  const { error } = await supabase.from('news').insert(newsItem)
  if (error) throw new Error(`Supabase insert error: ${error.message}`)
}

// Main crawler function
async function crawlNews() {
  const parser = new Parser()
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
}

// Run crawler
crawlNews().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
