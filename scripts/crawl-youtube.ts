#!/usr/bin/env tsx
/**
 * YouTube Video Crawler Script
 * Searches YouTube Data API v3 for tool-related videos and saves to Supabase
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// 카테고리별 검색 키워드
const SEARCH_QUERIES: Record<string, string> = {
  salary: '2026 연봉 실수령액',
  currency: '환율 계산 환전 팁',
  severance: '퇴직금 계산 방법',
  electricity: '전기요금 절약',
  bmi: 'BMI 다이어트',
  loan: '대출이자 계산',
  savings: '적금 이자 계산',
  calorie: '기초대사량 다이어트',
  'weekly-holiday-pay': '주휴수당 계산 알바',
  unemployment: '실업급여 구직급여 신청',
}

const MAX_RESULTS = 5

interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      medium: { url: string }
    }
  }
}

interface YouTubeVideoItem {
  id: string
  statistics: {
    viewCount?: string
  }
}

// YouTube Data API v3 - search
async function searchVideos(query: string): Promise<YouTubeSearchItem[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: String(MAX_RESULTS),
    order: 'relevance',
    regionCode: 'KR',
    relevanceLanguage: 'ko',
    key: YOUTUBE_API_KEY,
  })

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
  const data = await res.json()

  if (data.error) {
    throw new Error(`YouTube API error: ${data.error.message}`)
  }

  return data.items || []
}

// YouTube Data API v3 - get video statistics
async function getVideoStats(videoIds: string[]): Promise<Map<string, string>> {
  const params = new URLSearchParams({
    part: 'statistics',
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY,
  })

  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`)
  const data = await res.json()

  const statsMap = new Map<string, string>()
  for (const item of (data.items || []) as YouTubeVideoItem[]) {
    statsMap.set(item.id, item.statistics.viewCount || '0')
  }
  return statsMap
}

// Format view count
function formatViewCount(count: string): string {
  const num = parseInt(count, 10)
  if (num >= 10000) return `${Math.floor(num / 10000)}만회`
  if (num >= 1000) return `${Math.floor(num / 1000)}천회`
  return `${num}회`
}

async function crawlYouTube() {
  console.log('Starting YouTube crawler...')

  let totalSaved = 0
  let totalErrors = 0

  for (const [category, query] of Object.entries(SEARCH_QUERIES)) {
    console.log(`\nSearching: "${query}" (${category})...`)

    try {
      const items = await searchVideos(query)
      console.log(`  Found ${items.length} videos`)

      if (items.length === 0) continue

      // Get view counts
      const videoIds = items.map((item) => item.id.videoId)
      const statsMap = await getVideoStats(videoIds)

      // Delete old videos for this category
      await supabase.from('youtube_videos').delete().eq('tool_category', category)

      // Insert new videos
      const records = items.map((item) => ({
        title: item.snippet.title,
        video_id: item.id.videoId,
        thumbnail_url: item.snippet.thumbnails.medium.url,
        channel_name: item.snippet.channelTitle,
        view_count: formatViewCount(statsMap.get(item.id.videoId) || '0'),
        tool_category: category,
      }))

      const { error } = await supabase.from('youtube_videos').insert(records)
      if (error) throw new Error(`Supabase insert error: ${error.message}`)

      console.log(`  Saved ${records.length} videos`)
      totalSaved += records.length

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`  Error: ${error}`)
      totalErrors++
    }
  }

  console.log(`\nCrawler Summary:`)
  console.log(`  Saved: ${totalSaved}`)
  console.log(`  Errors: ${totalErrors}`)
}

crawlYouTube().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
