'use client'

import { useState, useMemo } from 'react'
import { useLatestNews } from '../hooks/useNews'
import { NewsCard } from './NewsCard'
import type { NewsCategory } from '@/types/news'

interface NewsListProps {
  limit?: number
  showCategories?: boolean
  showRelatedTools?: boolean
  title?: string
}

const CATEGORY_TABS: Array<{ key: 'all' | NewsCategory; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'tech', label: '기술/IT' },
  { key: 'finance', label: '금융' },
  { key: 'health', label: '건강' },
  { key: 'energy', label: '에너지' },
  { key: 'game', label: '게임' },
]

export function NewsList({
  limit = 6,
  showCategories = true,
  showRelatedTools = false,
  title = '최신 뉴스',
}: NewsListProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | NewsCategory>('all')
  const { data: newsList, isLoading, error } = useLatestNews(limit)

  const filteredNews = useMemo(() => {
    if (!newsList) return []
    if (activeCategory === 'all') return newsList
    return newsList.filter((news) =>
      news.categories.includes(activeCategory)
    )
  }, [newsList, activeCategory])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex rounded-xl animate-pulse bg-white shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="w-1 shrink-0 bg-gray-200" />
              <div className="p-4 flex-1">
                <div className="flex gap-2 mb-2">
                  <div className="h-4 bg-gray-100 rounded w-16"></div>
                  <div className="h-4 bg-gray-100 rounded w-12"></div>
                </div>
                <div className="h-5 bg-gray-100 rounded mb-1.5"></div>
                <div className="h-5 bg-gray-100 rounded w-4/5 mb-2"></div>
                <div className="h-4 bg-gray-50 rounded mb-1"></div>
                <div className="h-4 bg-gray-50 rounded w-2/3 mb-3"></div>
                <div className="pt-2.5 border-t border-gray-50">
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
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

      {/* Category Filter Tabs */}
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              showCategories={showCategories}
              showRelatedTools={showRelatedTools}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 border rounded-lg bg-gray-50 text-center">
          <p className="text-muted-foreground">
            해당 카테고리의 뉴스가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
