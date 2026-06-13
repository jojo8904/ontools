'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title?: string
  /** 미지정 시 현재 페이지 URL 사용 */
  url?: string
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '03120f5849190844457b510f457232ee'

// 카카오 JS SDK 로드 + 초기화 (1회)
function ensureKakao(): Promise<unknown> {
  return new Promise((resolve) => {
    const w = window as unknown as { Kakao?: { isInitialized: () => boolean; init: (k: string) => void } }
    const init = () => {
      try {
        if (w.Kakao && !w.Kakao.isInitialized()) w.Kakao.init(KAKAO_JS_KEY)
      } catch {
        /* ignore */
      }
      resolve(w.Kakao)
    }
    if (w.Kakao) return init()
    const existing = document.getElementById('kakao-sdk') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', init)
      return
    }
    const s = document.createElement('script')
    s.id = 'kakao-sdk'
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    s.async = true
    s.onload = init
    s.onerror = () => resolve(undefined)
    document.head.appendChild(s)
  })
}

/**
 * 결과/페이지 공유 버튼 (재사용) — 카카오톡 · 링크복사 · X · 페이스북 · 네이티브 공유
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
      /* ignore */
    }
  }

  const shareKakao = async () => {
    const Kakao = (await ensureKakao()) as
      | { Share?: { sendDefault: (o: unknown) => void } }
      | undefined
    if (!Kakao?.Share) {
      copyLink()
      return
    }
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: getTitle(),
        description: '필요한 계산, 여기서 한 번에 — ontools',
        imageUrl: 'https://ontools.co.kr/images/hero.webp',
        link: { mobileWebUrl: getUrl(), webUrl: getUrl() },
      },
      buttons: [
        { title: '계산기 열기', link: { mobileWebUrl: getUrl(), webUrl: getUrl() } },
      ],
    })
  }

  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (data: { title: string; url: string }) => Promise<void>
    }
    if (nav.share) {
      try {
        await nav.share({ title: getTitle(), url: getUrl() })
      } catch {
        /* 취소 등 무시 */
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
      <button
        type="button"
        onClick={shareKakao}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-[#FEE500] text-[#3A1D1D] hover:brightness-95 transition-all"
        aria-label="카카오톡 공유"
      >
        💬 카카오톡
      </button>
      <button type="button" onClick={copyLink} className={btn} aria-label="링크 복사">
        {copied ? '✓ 복사됨' : '📋 링크 복사'}
      </button>
      <button type="button" onClick={nativeShare} className={btn} aria-label="공유하기">
        🔗 공유
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
