/** A compact partner link below the home tool directory. */
export function PromoBanner() {
  return (
    <a
      href="https://getluckylab.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto flex max-w-2xl items-center gap-4 rounded-xl border border-[#ece6f2] bg-[#faf8fc] p-4 transition-colors hover:bg-[#f3eff8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2563eb]"
      aria-label="행운연구소 - 로또·연금복권 당첨번호 통계 분석"
    >
      <span aria-hidden="true" className="shrink-0 text-2xl">🍀</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#8a8290]">함께 운영하는 사이트</p>
        <h3 className="text-sm font-bold text-[#241a33]">행운연구소 GetLuckyLab</h3>
        <p className="mt-1 text-xs text-[#6b6276]">로또·연금복권 당첨번호 통계를 무료로 살펴보세요.</p>
      </div>
      <span aria-hidden="true" className="shrink-0 text-[#2563eb] group-hover:translate-x-0.5 transition-transform">↗</span>
    </a>
  )
}
