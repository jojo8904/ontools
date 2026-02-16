'use client'

import { useNewsByTool } from '../hooks/useNews'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-1.5">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-50 rounded w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!newsList || newsList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            관련 뉴스가 없습니다
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsList.map((news) => {
          const primaryCategory = news.categories[0] || 'general'
          return (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 group"
            >
              <div
                className={`w-1 shrink-0 rounded-full ${categoryColors[primaryCategory] || categoryColors.general}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {news.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {news.source}
                </p>
              </div>
            </a>
          )
        })}
      </CardContent>
    </Card>
  )
}
