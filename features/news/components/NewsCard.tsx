'use client'

import { useState } from 'react'
import { News } from '@/types/news'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface NewsCardProps {
  news: News
  showCategories?: boolean
  showRelatedTools?: boolean
}

const categoryColors: Record<string, string> = {
  tech: 'bg-blue-50 text-blue-700',
  finance: 'bg-emerald-50 text-emerald-700',
  health: 'bg-rose-50 text-rose-700',
  energy: 'bg-amber-50 text-amber-700',
  game: 'bg-violet-50 text-violet-700',
  general: 'bg-gray-100 text-gray-600',
}

const categoryLabels: Record<string, string> = {
  tech: '기술/IT',
  finance: '금융',
  health: '건강',
  energy: '에너지',
  game: '게임',
  general: '일반',
}

const categoryIcons: Record<string, string> = {
  tech: '💻',
  finance: '💰',
  health: '💪',
  energy: '⚡',
  game: '🎮',
  general: '📰',
}

const categoryGradients: Record<string, string> = {
  tech: 'from-blue-400 to-blue-600',
  finance: 'from-emerald-400 to-emerald-600',
  health: 'from-rose-400 to-rose-600',
  energy: 'from-amber-400 to-amber-600',
  game: 'from-violet-400 to-violet-600',
  general: 'from-gray-400 to-gray-600',
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
  const [imgError, setImgError] = useState(false)
  const publishedDate = new Date(news.published_at)
  const timeAgo = formatDistanceToNow(publishedDate, {
    addSuffix: true,
    locale: ko,
  })

  const primaryCategory = news.categories[0] || 'general'
  const hasImage = news.image_url && !imgError

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-gray-100 overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-40 overflow-hidden bg-gray-100">
          {hasImage ? (
            <img
              src={news.image_url!}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[primaryCategory] || categoryGradients.general} flex items-center justify-center`}>
              <span className="text-4xl opacity-80">
                {categoryIcons[primaryCategory] || categoryIcons.general}
              </span>
            </div>
          )}
          {/* Source badge on image */}
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-medium bg-black/50 text-white rounded-md backdrop-blur-sm">
            {news.source}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Categories */}
          {showCategories && news.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {news.categories.map((category) => (
                <span
                  key={category}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                    categoryColors[category] || categoryColors.general
                  }`}
                >
                  {categoryLabels[category] || category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-[15px] font-bold mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight">
            {news.title}
          </h3>

          {/* Summary */}
          <p className="text-gray-500 mb-auto line-clamp-2 text-sm leading-relaxed">
            {news.summary}
          </p>

          {/* Related Tools */}
          {showRelatedTools && news.related_tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {news.related_tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 text-[11px] bg-gray-50 text-gray-500 rounded-md"
                >
                  {toolLabels[tool] || tool}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-2.5 border-t border-gray-50">
            <span className="font-medium text-gray-500">{news.source}</span>
            <time dateTime={publishedDate.toISOString()}>{timeAgo}</time>
          </div>
        </div>
      </article>
    </a>
  )
}
