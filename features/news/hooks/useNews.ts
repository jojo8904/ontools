import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { News } from '@/types/news'
import {
  fetchNewsList,
  fetchNewsById,
  fetchLatestNews,
  fetchNewsByCategory,
  fetchNewsByTool,
  FetchNewsParams,
  NewsListResponse,
} from '../services/newsApi'
import {
  MOCK_NEWS,
  getLatestMockNews,
  getMockNewsByCategory,
  getMockNewsByTool,
} from '../data/mockNews'

// Phase 2: Use mock data for development
// TODO: Switch to real API when bkend.ai permissions are configured
const USE_MOCK_DATA = true

/**
 * Fetch news list with filters
 */
export function useNewsList(
  params: FetchNewsParams = {}
): UseQueryResult<NewsListResponse> {
  return useQuery({
    queryKey: ['news', 'list', params],
    queryFn: () => fetchNewsList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch single news item by ID
 */
export function useNewsById(id: string): UseQueryResult<News> {
  return useQuery({
    queryKey: ['news', 'detail', id],
    queryFn: () => fetchNewsById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Fetch latest news (for homepage)
 */
export function useLatestNews(limit: number = 6): UseQueryResult<News[]> {
  return useQuery({
    queryKey: ['news', 'latest', limit],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Phase 2: Return mock data
        return getLatestMockNews(limit)
      }
      // Phase 2+: Return real API data
      return fetchLatestNews(limit)
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

/**
 * Fetch news by category
 */
export function useNewsByCategory(
  category: string,
  limit: number = 10
): UseQueryResult<News[]> {
  return useQuery({
    queryKey: ['news', 'category', category, limit],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return getMockNewsByCategory(category).slice(0, limit)
      }
      return fetchNewsByCategory(category, limit)
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch news related to a specific tool
 */
export function useNewsByTool(
  toolId: string,
  limit: number = 5
): UseQueryResult<News[]> {
  return useQuery({
    queryKey: ['news', 'tool', toolId, limit],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return getMockNewsByTool(toolId).slice(0, limit)
      }
      return fetchNewsByTool(toolId, limit)
    },
    enabled: !!toolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
