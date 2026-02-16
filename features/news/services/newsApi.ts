import { bkend } from '@/lib/bkend'
import { News } from '@/types/news'

export interface FetchNewsParams {
  limit?: number
  offset?: number
  category?: string
  relatedTool?: string
  sortBy?: 'published_at' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface NewsListResponse {
  data: News[]
  total: number
  hasMore: boolean
}

/**
 * Fetch news list from bkend.ai
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
    // Build filter
    const filter: Record<string, any> = {}
    if (category) {
      filter.categories = { $contains: category }
    }
    if (relatedTool) {
      filter.related_tools = { $contains: relatedTool }
    }

    // Build query params
    const queryParams: Record<string, string> = {
      limit: limit.toString(),
      offset: offset.toString(),
      sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
    }

    if (Object.keys(filter).length > 0) {
      queryParams.filter = JSON.stringify(filter)
    }

    const response = await bkend.data.list('news', queryParams)

    return {
      data: response.data || [],
      total: response.total || 0,
      hasMore: offset + limit < (response.total || 0),
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
  try {
    const response = await bkend.data.get('news', id)
    return response.data
  } catch (error) {
    console.error('Failed to fetch news by ID:', error)
    throw error
  }
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
