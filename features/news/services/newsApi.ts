import { supabase } from '@/lib/supabase'
import { News } from '@/types/news'

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
      query = query.contains('categories', [category])
    }
    if (relatedTool) {
      query = query.contains('related_tools', [relatedTool])
    }

    const { data, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      data: (data as News[]) || [],
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
  return data as News
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

/**
 * Fetch news related to a specific tool (for tool pages)
 */
export async function fetchNewsByTool(
  toolId: string,
  limit: number = 5
): Promise<News[]> {
  const response = await fetchNewsList({ relatedTool: toolId, limit })
  return response.data
}
