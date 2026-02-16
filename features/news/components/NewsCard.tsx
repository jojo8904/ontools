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
  tech: 'from-[#3B82F6] to-[#6366F1]',
  finance: 'from-[#10B981] to-[#059669]',
  health: 'from-[#EF4444] to-[#EC4899]',
  energy: 'from-[#F59E0B] to-[#F97316]',
  game: 'from-[#8B5CF6] to-[#7C3AED]',
  general: 'from-gray-400 to-gray-500',
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

const categoryIcons: Record<string, string> = {
  tech: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25',
  finance: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  health: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  energy: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  game: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.18-.143-2.224-.632-2.995-1.37A3 3 0 002.25 8.25v1.5A2.25 2.25 0 004.5 12h.667c.278 0 .547.06.79.168l1.065.487c.488.223.86.637 1.07 1.114.23.525.325 1.068.325 1.606v0c0 1.183-.456 2.36-1.371 3.157A3.75 3.75 0 005.25 21h2.577c.614 0 1.22-.135 1.777-.4l1.036-.494A2.25 2.25 0 0112 19.5v0a2.25 2.25 0 011.36.606l1.036.494c.558.265 1.163.4 1.777.4h2.577a3.75 3.75 0 01-1.796-2.468C16.456 17.235 16 16.058 16 14.875v0c0-.538.095-1.081.325-1.606.21-.477.582-.891 1.07-1.114l1.065-.487c.243-.108.512-.168.79-.168h.667A2.25 2.25 0 0022.167 9.75v-1.5a3 3 0 00-1.435-2.561c-.771.738-1.815 1.227-2.995 1.37a48.474 48.474 0 01-4.163.3.64.64 0 01-.657-.643v0z',
  general: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z',
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
          <div className={`h-24 bg-gradient-to-br ${categoryGradients[primaryCategory] || categoryGradients.general} flex flex-col items-center justify-center gap-1.5`}>
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[primaryCategory] || categoryIcons.general} />
            </svg>
            <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
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
