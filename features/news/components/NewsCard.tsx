'use client'

import { News } from '@/types/news'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface NewsCardProps {
  news: News
  showCategories?: boolean
  showRelatedTools?: boolean
}

const categoryGradients: Record<string, string> = {
  tech: 'from-blue-400 to-indigo-500',
  finance: 'from-emerald-400 to-teal-500',
  health: 'from-rose-400 to-pink-500',
  energy: 'from-amber-400 to-orange-500',
  game: 'from-violet-400 to-purple-500',
  general: 'from-gray-300 to-gray-400',
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
      <article className="news-card h-full overflow-hidden flex flex-col">
        {/* Thumbnail or gradient header */}
        {news.image_url ? (
          <div className="h-36 overflow-hidden">
            <img
              src={news.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className={`h-20 bg-gradient-to-br ${categoryGradients[primaryCategory] || categoryGradients.general} flex items-center justify-center`}>
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
              {categoryLabels[primaryCategory] || 'News'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 min-w-0">
          {/* Source + Category badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-[#999]">
              {news.source}
            </span>
            {showCategories && news.categories.length > 0 && (
              <>
                <span className="text-[#ddd]">|</span>
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
          <h3 className="text-[15px] font-bold mb-1.5 text-[#111] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight">
            {news.title}
          </h3>

          {/* Summary */}
          <p className="text-[#888] mb-auto line-clamp-2 text-sm leading-relaxed">
            {news.summary}
          </p>

          {/* Related Tools */}
          {showRelatedTools && news.related_tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {news.related_tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 text-[11px] bg-[#f5f5f5] text-[#888] rounded-md"
                >
                  {toolLabels[tool] || tool}
                </span>
              ))}
            </div>
          )}

          {/* Footer - time */}
          <div className="mt-3 pt-2.5 border-t border-[#f0f0f0]">
            <time
              dateTime={publishedDate.toISOString()}
              className="text-xs text-[#bbb]"
            >
              {timeAgo}
            </time>
          </div>
        </div>
      </article>
    </a>
  )
}
