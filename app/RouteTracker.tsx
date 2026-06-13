'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getToolByHref } from '@/lib/tools'

const KEY = 'ontools:recent'

/**
 * 도구 페이지 방문을 localStorage에 기록 (최근 본 계산기용).
 * 루트 레이아웃에 한 번만 두면 모든 페이지가 자동 추적됨.
 */
export function RouteTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    const tool = getToolByHref(pathname)
    if (!tool) return // 등록된 도구 페이지만 기록
    try {
      const prev: string[] = JSON.parse(localStorage.getItem(KEY) || '[]')
      const next = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, 6)
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // localStorage 비활성(사생활 보호 모드 등) 시 무시
    }
  }, [pathname])

  return null
}
