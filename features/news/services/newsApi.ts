import { supabase } from '@/lib/supabase'
import { News } from '@/types/news'

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

function normalizeNews(raw: Record<string, unknown>): News {
  return {
    ...raw,
    categories: toArray(raw.categories),
    related_tools: toArray(raw.related_tools),
  } as News
}

export interface FetchNewsParams {
  limit?: number
  offset?: number
  category?: string
  relatedTool?: string
  sortBy?: 'published_at' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface NewsListResponse {
  data: News[]
  total: number
  hasMore: boolean
}

/**
 * Fetch news list from Supabase
 */
export async function fetchNewsList(
  params: FetchNewsParams = {}
): Promise<NewsListResponse> {
  const {
    limit = 10,
    offset = 0,
    category,
    relatedTool,
    sortBy = 'published_at',
    sortOrder = 'desc',
  } = params

  try {
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })

    if (category) {
      query = query.like('categories', `%${category}%`)
    }
    if (relatedTool) {
      query = query.like('related_tools', `%${relatedTool}%`)
    }

    const { data, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      data: (data || []).map(normalizeNews),
      total: count || 0,
      hasMore: offset + limit < (count || 0),
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
    throw error
  }
}

/**
 * Fetch a single news item by ID
 */
export async function fetchNewsById(id: string): Promise<News> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return normalizeNews(data as Record<string, unknown>)
}

/**
 * Fetch latest news (for homepage)
 */
export async function fetchLatestNews(limit: number = 6): Promise<News[]> {
  const response = await fetchNewsList({ limit, sortBy: 'published_at' })
  return response.data
}

/**
 * Fetch news by category (for category pages)
 */
export async function fetchNewsByCategory(
  category: string,
  limit: number = 10
): Promise<News[]> {
  const response = await fetchNewsList({ category, limit })
  return response.data
}

/** Map tool IDs to news categories */
const TOOL_CATEGORY_MAP: Record<string, string> = {
  salary: 'finance',
  currency: 'finance',
  severance: 'finance',
  loan: 'finance',
  savings: 'finance',
  'weekly-holiday-pay': 'finance',
  unemployment: 'finance',
  vat: 'finance',
  bmi: 'health',
  calorie: 'health',
  electricity: 'energy',
  unit: 'tech',
  dday: 'tech',
}

/** Primary categories that should not overlap */
const PRIMARY_CATEGORIES = ['finance', 'health', 'energy', 'tech']

/**
 * Fetch news related to a specific tool (for tool pages)
 * Uses category-based query since related_tools is TEXT, not array
 * Filters out articles that are cross-tagged with conflicting primary categories
 */
export async function fetchNewsByTool(
  toolId: string,
  limit: number = 5
): Promise<News[]> {
  const category = TOOL_CATEGORY_MAP[toolId]
  if (!category) {
    const response = await fetchNewsList({ limit })
    return response.data
  }
  // Fetch extra to account for filtering
  const response = await fetchNewsList({ category, limit: limit + 5 })
  const otherPrimary = PRIMARY_CATEGORIES.filter((c) => c !== category)
  return response.data
    .filter((news) => !news.categories.some((c) => otherPrimary.includes(c)))
    .slice(0, limit)
}
