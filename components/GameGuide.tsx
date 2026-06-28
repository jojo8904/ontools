import { GAME_INFO } from '@/lib/gameInfo'

/** 게임 페이지 하단 설명·조작법·팁 (콘텐츠 보강 + 검색 유입) */
export function GameGuide({ slug }: { slug: string }) {
  const info = GAME_INFO[slug]
  if (!info) return null

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-3 text-[#241a33]">{info.name} 게임 안내</h2>
      <div className="rounded-2xl border border-[#ece6f2] bg-[#F2EEE6] p-6 space-y-5 text-[15px] leading-relaxed text-[#444]">
        {info.sections.map((s, i) => (
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
  )
}
