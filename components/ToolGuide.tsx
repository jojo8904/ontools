import { ResponsiveAdFit } from './ResponsiveAdFit'
import { ScrollMoreButton } from './ScrollMoreButton'

export interface GuideSection {
  h: string
  p: string[]
}

/**
 * 계산기 설명 가이드 (재사용) — 고유 본문 콘텐츠로 페이지 품질·SEO 강화
 */
export function ToolGuide({
  title = '알아두기',
  sections,
}: {
  title?: string
  sections: GuideSection[]
}) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {/* 결과 직후 "더 보기" 유도 → 아래 광고·콘텐츠로 스크롤 유도 */}
      <ScrollMoreButton />
      {/* 계산 결과 바로 아래 광고 — 시선이 머무는 명당(애드핏). AdSense는 하단 관련도구에 별도 배치 */}
      <ResponsiveAdFit />
      <section className="mt-4">
        <h2 className="text-lg font-bold mb-3 text-[#241a33]">{title}</h2>
        <div className="bg-white rounded-2xl border border-[#ece6f2] p-6 space-y-5 text-[15px] leading-relaxed text-[#444]">
          {sections.map((s, i) => (
            <div key={i}>
              <h3 className="font-bold text-[#241a33] mb-1.5">{s.h}</h3>
              {s.p.map((para, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
