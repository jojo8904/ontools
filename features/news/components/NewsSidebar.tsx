'use client'

import { useNewsByTool } from '../hooks/useNews'

interface NewsSidebarProps {
  toolId: string
  title?: string
}

const categoryColors: Record<string, string> = {
  tech: 'bg-blue-500',
  finance: 'bg-emerald-500',
  health: 'bg-rose-500',
  energy: 'bg-amber-500',
  game: 'bg-violet-500',
  general: 'bg-gray-400',
}

export function NewsSidebar({ toolId, title = '관련 뉴스' }: NewsSidebarProps) {
  const { data: newsList, isLoading } = useNewsByTool(toolId, 5)

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex rounded-lg border bg-white overflow-hidden animate-pulse"
            >
              <div className="w-1 shrink-0 bg-gray-200" />
              <div className="p-4 flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-50 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!newsList || newsList.length === 0) return null

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsList.map((news) => {
          const primaryCategory = news.categories[0] || 'general'
          return (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex rounded-lg border bg-white overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div
                className={`w-1 shrink-0 ${categoryColors[primaryCategory] || categoryColors.general}`}
              />
              <div className="p-4 flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {news.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {news.source}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
