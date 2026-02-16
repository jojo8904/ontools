'use client'

export function ScrollDownButton() {
  return (
    <button
      onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
      className="scroll-down-btn"
      aria-label="최신 뉴스로 스크롤"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  )
}
