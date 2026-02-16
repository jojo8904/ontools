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
  tech: 'bg-blue-50 text-blue-700 border-blue-200',
  finance: 'bg-green-50 text-green-700 border-green-200',
  labor: 'bg-purple-50 text-purple-700 border-purple-200',
  health: 'bg-red-50 text-red-700 border-red-200',
  energy: 'bg-amber-50 text-amber-700 border-amber-200',
  general: 'bg-gray-50 text-gray-700 border-gray-200',
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
      <article className="p-5 border rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white h-full flex flex-col">
        {/* Categories */}
        {showCategories && news.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.categories.map((category) => (
              <span
                key={category}
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                  categoryColors[category] || categoryColors.general
                }`}
              >
                {categoryLabels[category] || category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed flex-1">
          {news.summary}
        </p>

        {/* Related Tools */}
        {showRelatedTools && news.related_tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.related_tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded border"
              >
                {toolLabels[tool] || tool}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <span className="font-medium">{news.source}</span>
          <time dateTime={publishedDate.toISOString()}>{timeAgo}</time>
        </div>
      </article>
    </a>
  )
}
