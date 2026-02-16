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
  tech: 'bg-blue-50 text-blue-700',
  finance: 'bg-emerald-50 text-emerald-700',
  health: 'bg-rose-50 text-rose-700',
  energy: 'bg-amber-50 text-amber-700',
  general: 'bg-gray-100 text-gray-600',
}

const categoryLabels: Record<string, string> = {
  tech: '기술/IT',
  finance: '금융',
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
      <article className="relative p-5 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-gray-100">
        {/* Categories */}
        {showCategories && news.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.categories
              .filter((c) => c !== 'labor')
              .map((category) => (
                <span
                  key={category}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                    categoryColors[category] || categoryColors.general
                  }`}
                >
                  {categoryLabels[category] || category}
                </span>
              ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[15px] font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight">
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
        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
          <span className="font-medium text-gray-500">{news.source}</span>
          <time dateTime={publishedDate.toISOString()}>{timeAgo}</time>
        </div>
      </article>
    </a>
  )
}
