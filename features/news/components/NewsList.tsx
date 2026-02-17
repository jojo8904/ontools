'use client'

import { useState, useMemo } from 'react'
import { NewsCard } from './NewsCard'
import type { News, NewsCategory } from '@/types/news'

interface NewsListProps {
  news: News[]
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
  news,
  showCategories = true,
  showRelatedTools = false,
  title = '최신 뉴스',
}: NewsListProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | NewsCategory>('all')

  const filteredNews = useMemo(() => {
    if (activeCategory === 'all') return news
    return news.filter((item) =>
      item.categories.includes(activeCategory)
    )
  }, [news, activeCategory])

  if (news.length === 0) {
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
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeCategory === tab.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
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
          {filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
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
