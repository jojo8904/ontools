'use client'

import { useLatestNews } from '../hooks/useNews'
import { NewsCard } from './NewsCard'

interface NewsListProps {
  limit?: number
  showCategories?: boolean
  showRelatedTools?: boolean
  title?: string
}

export function NewsList({
  limit = 6,
  showCategories = true,
  showRelatedTools = false,
  title = '최신 뉴스',
}: NewsListProps) {
  const { data: newsList, isLoading, error } = useLatestNews(limit)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="p-6 border rounded-lg animate-pulse bg-gray-50"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800 font-medium">뉴스를 불러오는데 실패했습니다.</p>
        <p className="text-red-600 text-sm mt-1">
          {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
        </p>
      </div>
    )
  }

  if (!newsList || newsList.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground text-center">
          표시할 뉴스가 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <NewsCard
            key={news._id}
            news={news}
            showCategories={showCategories}
            showRelatedTools={showRelatedTools}
          />
        ))}
      </div>
    </div>
  )
}
