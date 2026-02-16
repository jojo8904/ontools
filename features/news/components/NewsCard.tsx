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
  tech: 'bg-blue-500',
  finance: 'bg-emerald-500',
  health: 'bg-rose-500',
  energy: 'bg-amber-500',
  game: 'bg-violet-500',
  general: 'bg-gray-400',
}

const categoryBadgeColors: Record<string, string> = {
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

  const primaryCategory = news.categories[0] || 'general'

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="flex rounded-xl bg-white shadow-sm hover:shadow-lg hover:bg-gray-50/50 transition-all duration-300 h-full border border-gray-100 overflow-hidden">
        {/* Left category color bar */}
        <div
          className={`w-[4px] shrink-0 ${categoryColors[primaryCategory] || categoryColors.general}`}
        />

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 min-w-0">
          {/* Source + Category badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">
              {news.source}
            </span>
            {showCategories && news.categories.length > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex flex-wrap gap-1">
                  {news.categories.map((category) => (
                    <span
                      key={category}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                        categoryBadgeColors[category] || categoryBadgeColors.general
                      }`}
                    >
                      {categoryLabels[category] || category}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

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

          {/* Footer - time */}
          <div className="mt-3 pt-2.5 border-t border-gray-50">
            <time
              dateTime={publishedDate.toISOString()}
              className="text-xs text-gray-400"
            >
              {timeAgo}
            </time>
          </div>
        </div>
      </article>
    </a>
  )
}
