'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { searchTools, getToolByHref, TOOLS, type ToolMeta } from '@/lib/tools'

/**
 * 우측 하단 플로팅 위젯: 검색 + 즐겨찾기 + 최근 본 계산기를 한 곳에.
 * - 검색어 없을 때: 즐겨찾기 / 최근 본 계산기 표시
 * - 검색어 있을 때: 검색 결과 표시
 */
export function FloatingSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [favs, setFavs] = useState<ToolMeta[]>([])
  const [recents, setRecents] = useState<ToolMeta[]>([])

  // 데스크톱에서는 기본으로 열어둠 (모바일은 화면을 가리므로 버튼 탭 시 열림)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setOpen(true)
  }, [])

  useEffect(() => {
    const load = () => {
      try {
        const f: string[] = JSON.parse(localStorage.getItem('ontools:favorites') || '[]')
        setFavs(f.map((h) => getToolByHref(h)).filter((t): t is ToolMeta => Boolean(t)))
        const r: string[] = JSON.parse(localStorage.getItem('ontools:recent') || '[]')
        setRecents(r.map((h) => getToolByHref(h)).filter((t): t is ToolMeta => Boolean(t)))
      } catch {
        /* ignore */
      }
    }
    if (open) load()
    window.addEventListener('ontools:favorites-changed', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('ontools:favorites-changed', load)
      window.removeEventListener('storage', load)
    }
  }, [open])

  const results = searchTools(q)
  const hasQuery = q.trim().length > 0

  const chip =
    'px-3 py-1.5 rounded-full bg-[#faf8fc] border border-[#ece6f2] text-sm text-[#555] hover:border-[#c9b8e6] hover:text-[#241a33] transition-colors'

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[330px] max-w-[88vw] bg-white rounded-2xl border border-[#e8e2f0] shadow-2xl overflow-hidden">
          {/* 검색 입력 */}
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

          <div className="max-h-[60vh] overflow-y-auto">
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
              <div className="p-4 space-y-4">
                {favs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#a78bc4] mb-2">⭐ 즐겨찾기</p>
                    <div className="flex flex-wrap gap-2">
                      {favs.map((t) => (
                        <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm text-[#7a5a00] hover:bg-amber-100 transition-colors">
                          ★ {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {recents.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#8a93a8] mb-2">🕘 최근 본 계산기</p>
                    <div className="flex flex-wrap gap-2">
                      {recents.map((t) => (
                        <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className={chip}>
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {favs.length === 0 && recents.length === 0 && (
                  <div className="text-sm text-[#999] py-2">
                    <p className="mb-2 font-medium text-[#666]">어떤 계산기를 찾으세요?</p>
                    <p className="text-xs leading-relaxed">전체 {TOOLS.length}개 도구에서 검색해요. 계산기에 ★를 누르면 여기 즐겨찾기에 모여요.</p>
                  </div>
                )}
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
