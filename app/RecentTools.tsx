'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getToolByHref, type ToolMeta } from '@/lib/tools'

/**
 * 최근 본 계산기 (localStorage 기반). 기록이 없으면 렌더하지 않음.
 */
export function RecentTools() {
  const [tools, setTools] = useState<ToolMeta[]>([])

  useEffect(() => {
    try {
      const hrefs: string[] = JSON.parse(localStorage.getItem('ontools:recent') || '[]')
      const resolved = hrefs
        .map((h) => getToolByHref(h))
        .filter((t): t is ToolMeta => Boolean(t))
      setTools(resolved)
    } catch {
      setTools([])
    }
  }, [])

  if (tools.length === 0) return null

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-[#6b6276] mb-2">🕘 최근 본 계산기</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-3 py-1.5 rounded-full bg-white border border-[#ece6f2] text-sm text-[#555] hover:border-[#c9b8e6] hover:text-[#241a33] transition-colors"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
