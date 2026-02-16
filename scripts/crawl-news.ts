#!/usr/bin/env tsx
/**
 * News Crawler Script
 * Fetches RSS feeds, summarizes with Claude Haiku, and saves to bkend.ai
 */

import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'

// Environment variables
const BKEND_API_URL = process.env.BKEND_API_URL || 'https://api-client.bkend.ai/v1'
const BKEND_PROJECT_ID = process.env.BKEND_PROJECT_ID!
const BKEND_ENV = process.env.BKEND_ENV || 'production'
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY!

// RSS sources from Plan document
const RSS_SOURCES = [
  // IT/Tech
  { url: 'https://it.chosun.com/site/data/rss/rss.xml', category: 'tech', source: 'IT조선' },
  { url: 'https://www.etnews.com/rss.xml', category: 'tech', source: '전자신문' },
  { url: 'https://zdnet.co.kr/rss/news.xml', category: 'tech', source: 'ZDNet Korea' },

  // Finance
  { url: 'https://www.hankyung.com/feed/economy', category: 'finance', source: '한국경제' },
  { url: 'https://www.mk.co.kr/rss/30100041/', category: 'finance', source: '매일경제' },

  // Labor
  { url: 'https://www.moel.go.kr/rss/news.xml', category: 'labor', source: '고용노동부' },

  // Health
  { url: 'https://health.chosun.com/rss/health.xml', category: 'health', source: '헬스조선' },

  // Energy
  { url: 'https://www.ekn.kr/rss/economy.xml', category: 'energy', source: '에너지경제' },
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

// bkend.ai API client
async function bkendFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BKEND_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': BKEND_PROJECT_ID,
      'x-environment': BKEND_ENV,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`bkend.ai API error: ${res.status} ${errorText}`)
  }

  return res.json()
}

// Claude API client
const claude = new Anthropic({ apiKey: CLAUDE_API_KEY })

// Check if news already exists
async function newsExists(url: string): Promise<boolean> {
  try {
    const response = await bkendFetch(`/data/news?filter=${encodeURIComponent(JSON.stringify({ url }))}`)
    return response.data && response.data.length > 0
  } catch {
    return false
  }
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
    model: 'claude-haiku-4-20250514', // Haiku 4.5
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

// Save news to bkend.ai
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
  return bkendFetch('/data/news', {
    method: 'POST',
    body: JSON.stringify(newsItem),
  })
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

          // Save to bkend.ai
          await saveNews({
            title: item.title,
            summary,
            original_content: item.contentSnippet || item.content || item.title,
            source,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            categories: [...new Set([category, ...categories])], // Merge with source category
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
