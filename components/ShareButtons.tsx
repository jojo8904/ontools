'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title?: string
  /** 미지정 시 현재 페이지 URL 사용 */
  url?: string
}

/**
 * 결과/페이지 공유 버튼 (재사용)
 * - 모바일: 네이티브 공유 시트 (navigator.share)
 * - 데스크톱: 링크 복사 + X / 페이스북 공유
 */
export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => url || (typeof window !== 'undefined' ? window.location.href : '')
  const getTitle = () =>
    title || (typeof document !== 'undefined' ? document.title : 'ontools')

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 API 미지원 시 무시
    }
  }

  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (data: { title: string; url: string }) => Promise<void>
    }
    if (nav.share) {
      try {
        await nav.share({ title: getTitle(), url: getUrl() })
      } catch {
        // 사용자가 취소한 경우 등 무시
      }
    } else {
      copyLink()
    }
  }

  const shareX = () => {
    const u = encodeURIComponent(getUrl())
    const t = encodeURIComponent(getTitle())
    window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, '_blank', 'noopener')
  }

  const shareFacebook = () => {
    const u = encodeURIComponent(getUrl())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank', 'noopener')
  }

  const btn =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#e8e2f0] bg-white text-[#555] hover:bg-[#f7f3fb] hover:text-[#241a33] transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[#999] mr-1">공유</span>
      <button type="button" onClick={nativeShare} className={btn} aria-label="공유하기">
        🔗 공유
      </button>
      <button type="button" onClick={copyLink} className={btn} aria-label="링크 복사">
        {copied ? '✓ 복사됨' : '📋 링크 복사'}
      </button>
      <button type="button" onClick={shareX} className={btn} aria-label="X에 공유">
        𝕏
      </button>
      <button type="button" onClick={shareFacebook} className={btn} aria-label="페이스북에 공유">
        f
      </button>
    </div>
  )
}
