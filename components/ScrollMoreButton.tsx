'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * "아래로 더 많은 정보" 플로팅 유도 버튼.
 * - 화면 하단 중앙에 고정(fixed)
 * - 기본 표시, 아래로 스크롤하면 숨고 위로 스크롤하면 다시 표시
 * - 페이지 맨 아래 근처면 숨김(더 내려갈 내용 없음)
 */
export function ScrollMoreButton({ label = '아래로 더 많은 정보' }: { label?: string }) {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      const nearBottom =
        y + window.innerHeight >= document.documentElement.scrollHeight - 240
      if (nearBottom) setVisible(false)
      else if (goingDown && y > 120) setVisible(false)
      else setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollDown = () => {
    if (typeof window === 'undefined') return
    window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: 'smooth' })
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollDown}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563eb] text-white text-sm font-bold shadow-lg hover:bg-[#1d4ed8] transition-colors"
      >
        {label}
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
