import Link from 'next/link'
import { getRelatedTools } from '@/lib/tools'
import { AdUnit } from './AdUnit'

interface RelatedToolsProps {
  /** 현재 도구의 href (예: '/salary') */
  current: string
  limit?: number
}

/**
 * 관련 계산기 추천 (재사용)
 * - 같은 카테고리 우선, 부족하면 다른 카테고리로 채움
 * - 내부 링크로 체류시간·페이지뷰·SEO 향상
 */
export function RelatedTools({ current, limit = 4 }: RelatedToolsProps) {
  const related = getRelatedTools(current, limit)
  if (related.length === 0) return null

  return (
    <>
      {/* 계산기 페이지 공통 광고 (관련 도구 섹션이 모든 계산기에 들어가므로 여기에 두면 전 계산기에 노출) */}
      <AdUnit slot="0000000000" />
      <section className="mt-10">
      <h2 className="text-lg font-bold mb-3 text-[#241a33]">함께 보면 좋은 계산기</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-[#ece6f2] bg-white hover:border-[#c9b8e6] hover:shadow-sm transition-all group"
          >
            <span className="text-[15px] font-medium text-[#333] group-hover:text-[#241a33]">
              {tool.label}
            </span>
            <svg className="w-4 h-4 text-[#c9b8e6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
      </section>
    </>
  )
}
