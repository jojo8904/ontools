'use client'

/**
 * "아래로 더 많은 정보" 스크롤 유도 버튼.
 * 계산 결과 직후에 두어, 사용자가 아래의 가이드·FAQ·광고까지 내려오도록 유도(스크롤 깊이↑).
 */
export function ScrollMoreButton({ label = '아래로 더 많은 정보 보기' }: { label?: string }) {
  const scrollDown = () => {
    if (typeof window === 'undefined') return
    window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="flex justify-center my-5">
      <button
        type="button"
        onClick={scrollDown}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563eb] text-white text-sm font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors"
      >
        {label}
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
