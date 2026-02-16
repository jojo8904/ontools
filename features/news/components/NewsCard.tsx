'use client'

import { News } from '@/types/news'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface NewsCardProps {
  news: News
  showCategories?: boolean
  showRelatedTools?: boolean
}

const categoryColors: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-800',
  finance: 'bg-green-100 text-green-800',
  labor: 'bg-purple-100 text-purple-800',
  health: 'bg-red-100 text-red-800',
  energy: 'bg-yellow-100 text-yellow-800',
  general: 'bg-gray-100 text-gray-800',
}

const categoryLabels: Record<string, string> = {
  tech: '기술/IT',
  finance: '금융',
  labor: '노동',
  health: '건강',
  energy: '에너지',
  general: '일반',
}

const toolLabels: Record<string, string> = {
  salary: '연봉계산',
  currency: '환율',
  retirement: '퇴직금',
  bmi: 'BMI',
  unit: '단위변환',
  dday: 'D-day',
  electricity: '전기요금',
}

export function NewsCard({
  news,
  showCategories = true,
  showRelatedTools = false,
}: NewsCardProps) {
  const publishedDate = new Date(news.published_at)
  const timeAgo = formatDistanceToNow(publishedDate, {
    addSuffix: true,
    locale: ko,
  })

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white h-full">
        {/* Categories */}
        {showCategories && news.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {news.categories.map((category) => (
              <span
                key={category}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  categoryColors[category] || categoryColors.general
                }`}
              >
                {categoryLabels[category] || category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
          {news.summary}
        </p>

        {/* Related Tools */}
        {showRelatedTools && news.related_tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-muted-foreground">관련 도구:</span>
            {news.related_tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded border"
              >
                {toolLabels[tool] || tool}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{news.source}</span>
          <time dateTime={publishedDate.toISOString()}>{timeAgo}</time>
        </div>
      </article>
    </a>
  )
}
