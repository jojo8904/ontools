/**
 * getluckylab.com 크로스 프로모션 배너
 * 로또 6/45 · 연금복권 720+ 당첨번호 통계 분석 사이트 홍보
 * - 은근히 눈에 띄는 풀블리드 카드 (밝은 테마 일관)
 */
export function PromoBanner() {
  return (
    <a
      href="https://getluckylab.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
      style={{ minHeight: '210px' }}
      aria-label="행운연구소 - 로또·연금복권 당첨번호 통계 분석"
    >
      {/* 배경 이미지 (AI 생성, 마스코트 행운 테마) — 얼굴이 보이도록 위쪽 기준 */}
      <div
        className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: "url('/images/lucky-promo.webp')",
          backgroundColor: '#FBF1DD',
          backgroundPosition: 'center 22%',
        }}
      />
      {/* 왼쪽 밝은 그라데이션 — 텍스트 가독성 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,251,240,0.96) 0%, rgba(255,251,240,0.7) 42%, rgba(255,251,240,0.05) 75%)',
        }}
      />
      <div className="relative z-[1] p-6 md:p-8 flex flex-col justify-center h-full" style={{ minHeight: '210px' }}>
        <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2563eb] text-white mb-2.5">
          🍀 행운연구소
        </span>
        <h3 className="text-[1.35rem] md:text-[1.6rem] font-[800] tracking-tight text-[#1a2440] leading-snug mb-1.5">
          로또·연금복권 당첨번호,
          <br />
          <span className="text-[#2563eb] whitespace-nowrap">데이터로 분석</span>
        </h3>
        <p className="text-sm text-[#5a6172] mb-4 max-w-[36ch]">
          최근 회차 통계 · 빈도/패턴 분석 · 번호 추천까지
          <br />
          <b className="text-[#2563eb] whitespace-nowrap">완전 무료</b>. 재미로 보는 행운 데이터.
        </p>
        <span className="inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-xl text-sm font-bold bg-[#2563eb] text-white group-hover:bg-[#1d4ed8] transition-colors">
          행운연구소 바로가기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  )
}
