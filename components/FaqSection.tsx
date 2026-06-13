export interface FaqItem {
  q: string
  a: string
}

/**
 * 계산기 페이지용 FAQ 섹션 (재사용)
 * - 네이티브 <details> 아코디언 (JS 불필요, 접근성 OK)
 * - FAQPage 구조화 데이터(JSON-LD) 주입 → 구글 리치 결과(검색 유입↑)
 */
export function FaqSection({
  items,
  title = '자주 묻는 질문',
}: {
  items: FaqItem[]
  title?: string
}) {
  if (!items || items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold mb-3 text-[#241a33]">{title}</h2>
      <div className="space-y-2">
        {items.map((it, i) => (
          <details
            key={i}
            className="group bg-white rounded-xl border border-[#ece6f2] px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-medium text-[#241a33]">
              <span>{it.q}</span>
              <span className="shrink-0 text-[#c9b8e6] text-xl leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-[#5a6172] leading-relaxed whitespace-pre-line">
              {it.a}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
