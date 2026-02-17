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

/**
 * Fetch news list with filters
 */
export function useNewsList(
  params: FetchNewsParams = {}
): UseQueryResult<NewsListResponse> {
  return useQuery({
    queryKey: ['news', 'list', params],
    queryFn: () => fetchNewsList(params),
    staleTime: 5 * 60 * 1000,
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
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch latest news (for homepage)
 */
export function useLatestNews(limit: number = 6, initialData?: News[]): UseQueryResult<News[]> {
  return useQuery({
    queryKey: ['news', 'latest', limit],
    queryFn: () => fetchLatestNews(limit),
    staleTime: 3 * 60 * 1000,
    initialData,
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
    queryFn: () => fetchNewsByCategory(category, limit),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
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
    queryFn: () => fetchNewsByTool(toolId, limit),
    enabled: !!toolId,
    staleTime: 5 * 60 * 1000,
  })
}
