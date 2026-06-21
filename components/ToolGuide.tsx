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
  hideAd = false,
  muted = true,
}: {
  title?: string
  sections: GuideSection[]
  /** 페이지 상단(제목 밑)에 애드핏을 따로 둔 경우 true → 중복 방지 */
  hideAd?: boolean
  /** 보조 콘텐츠로 차분하게(배경 톤다운) 표시 — 본 기능 강조용 */
  muted?: boolean
}) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {/* 결과 직후 "더 보기" 유도 (플로팅) → 아래 광고·콘텐츠로 스크롤 유도 */}
      <ScrollMoreButton />
      {/* 계산 결과 바로 아래 광고 (애드핏). 상단에 별도 배치한 페이지는 hideAd로 생략 */}
      {!hideAd && <ResponsiveAdFit />}
      <section className="mt-4">
        <h2 className="text-lg font-bold mb-3 text-[#241a33]">{title}</h2>
        <div className={`rounded-2xl border p-6 space-y-5 text-[15px] leading-relaxed text-[#444] ${muted ? 'bg-[#F2EEE6] border-[#ece6f2]' : 'bg-white border-[#ece6f2]'}`}>
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
