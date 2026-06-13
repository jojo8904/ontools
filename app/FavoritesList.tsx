'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getToolByHref, type ToolMeta } from '@/lib/tools'

/**
 * 즐겨찾기한 계산기 모음 (홈 상단). 즐겨찾기가 없으면 렌더하지 않음.
 * FavoriteStar 토글에 실시간 반응.
 */
export function FavoritesList() {
  const [tools, setTools] = useState<ToolMeta[]>([])

  useEffect(() => {
    const load = () => {
      try {
        const hrefs: string[] = JSON.parse(localStorage.getItem('ontools:favorites') || '[]')
        setTools(hrefs.map((h) => getToolByHref(h)).filter((t): t is ToolMeta => Boolean(t)))
      } catch {
        setTools([])
      }
    }
    load()
    window.addEventListener('ontools:favorites-changed', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('ontools:favorites-changed', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  if (tools.length === 0) return null

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-[#6b6276] mb-2">⭐ 즐겨찾기</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm text-[#7a5a00] hover:bg-amber-100 transition-colors"
          >
            ★ {t.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
