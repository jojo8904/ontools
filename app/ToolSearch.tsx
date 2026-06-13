'use client'

import { useState } from 'react'
import Link from 'next/link'
import { searchTools, TOOLS } from '@/lib/tools'

/**
 * 도구 검색바 — 25개+ 계산기를 빠르게 찾기
 */
export function ToolSearch() {
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const results = searchTools(q)
  const show = focused && q.trim().length > 0

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3aac2]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={`어떤 계산기를 찾으세요? (예: 연봉, 환율, 나이)`}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#e8e2f0] bg-white text-[15px] text-[#333] placeholder:text-[#b3aac2] shadow-sm focus:outline-none focus:border-[#c9b8e6] focus:ring-2 focus:ring-[#ede7f7] transition-all"
          aria-label="계산기 검색"
        />
      </div>

      {show && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl border border-[#ece6f2] shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-[#f7f3fb] transition-colors border-b border-[#f3eff8] last:border-0"
              >
                <span className="text-[15px] text-[#333]">{tool.label}</span>
                {tool.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full leading-none ${
                      tool.badge === 'NEW' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[#999]">
              &lsquo;{q}&rsquo; 검색 결과가 없어요. 전체 {TOOLS.length}개 도구를 둘러보세요.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
