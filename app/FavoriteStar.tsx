'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'ontools:favorites'

function readFavs(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function subscribe(update: () => void) {
  window.addEventListener('ontools:favorites-changed', update)
  window.addEventListener('storage', update)
  return () => {
    window.removeEventListener('ontools:favorites-changed', update)
    window.removeEventListener('storage', update)
  }
}

/**
 * 도구 즐겨찾기 토글 별표 (localStorage)
 * 링크 옆에 두며, 클릭 시 네비게이션을 막고 즐겨찾기만 토글
 */
export function FavoriteStar({ href }: { href: string }) {
  const fav = useSyncExternalStore(subscribe, () => readFavs().includes(href), () => false)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const cur = readFavs()
    const next = cur.includes(href) ? cur.filter((h) => h !== href) : [href, ...cur]
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // 무시
    }
    window.dispatchEvent(new Event('ontools:favorites-changed'))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={fav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      aria-pressed={fav}
      className={`shrink-0 text-lg leading-none transition-colors ${
        fav ? 'text-amber-400' : 'text-[#dcd6e6] hover:text-amber-300'
      }`}
    >
      {fav ? '★' : '☆'}
    </button>
  )
}
