'use client'

import { useState } from 'react'
import Link from 'next/link'
import { searchTools, TOOLS } from '@/lib/tools'

/**
 * 화면 우측 하단에 떠다니는 플로팅 검색 위젯.
 * 버튼을 누르면 채팅창처럼 검색 패널이 열려, 상단으로 스크롤하지 않아도 계산기를 찾을 수 있다.
 */
export function FloatingSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const results = searchTools(q)
  const hasQuery = q.trim().length > 0

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[320px] max-w-[85vw] bg-white rounded-2xl border border-[#e8e2f0] shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease]">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#f0ebf7] bg-[#faf8fc]">
            <svg className="w-4 h-4 text-[#b3aac2] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="계산기 검색 (예: 연봉, 환율)"
              className="flex-1 bg-transparent text-sm text-[#333] placeholder:text-[#b3aac2] focus:outline-none"
            />
            <button onClick={() => setOpen(false)} aria-label="닫기" className="text-[#b3aac2] hover:text-[#666] text-lg leading-none">✕</button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {hasQuery ? (
              results.length > 0 ? (
                results.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-[#f7f3fb] transition-colors border-b border-[#f5f1fa] last:border-0"
                  >
                    <span className="text-sm text-[#333]">{tool.label}</span>
                    {tool.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full leading-none ${tool.badge === 'NEW' ? 'bg-blue-500' : 'bg-orange-500'}`}>{tool.badge}</span>
                    )}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-[#999]">검색 결과가 없어요</div>
              )
            ) : (
              <div className="px-4 py-5 text-sm text-[#999]">
                <p className="mb-2 font-medium text-[#666]">어떤 계산기를 찾으세요?</p>
                <p className="text-xs leading-relaxed">전체 {TOOLS.length}개 도구에서 검색해요. 연봉, 환율, BMI, 나이, 자동차세 등을 입력해보세요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? '검색 닫기' : '계산기 검색'}
        className="w-14 h-14 rounded-full bg-[#2563eb] text-white shadow-lg hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
      >
        {open ? (
          <span className="text-2xl leading-none">✕</span>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        )}
      </button>
    </div>
  )
}
