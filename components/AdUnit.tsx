'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
// 아직 실제 발급 안 된 placeholder 슬롯 — 이 값이면 광고 요청하지 않음(400 방지)
const SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL,
  related: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RELATED,
}

interface AdUnitProps {
  /** AdSense 광고 단위 슬롯 ID (AdSense 대시보드에서 발급) */
  placement?: keyof typeof SLOTS
  format?: string
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
  /** 라벨 표시 여부 (광고임을 명시 — 정책상 권장) */
  label?: boolean
}

/**
 * Google AdSense 광고 단위 (재사용 컴포넌트)
 * - NEXT_PUBLIC_ADSENSE_CLIENT_ID 미설정 시 렌더하지 않음 (개발/프리뷰)
 * - 실제 노출은 AdSense 승인 + 슬롯 ID 발급 후
 */
export function AdUnit({
  placement = 'tool',
  format = 'auto',
  responsive = true,
  className = '',
  style,
  label = true,
}: AdUnitProps) {
  const slot = SLOTS[placement]
  const pathname = usePathname()
  const adRef = useRef<HTMLModElement>(null)
  const disabled = process.env.NODE_ENV !== 'production' || !ADSENSE_CLIENT_ID || !slot || !/^\d{10}$/.test(slot) || slot === '0000000000'

  useEffect(() => {
    if (disabled) return
    if (!adRef.current || adRef.current.dataset.adsbygoogleStatus) return
    try {
      ;((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({})
    } catch {
      // AdSense 스크립트 미로드 시 조용히 무시
    }
  }, [disabled, pathname, slot])

  // 클라이언트 ID 미설정 또는 placeholder 슬롯이면 아무것도 렌더하지 않음
  if (disabled) return null

  return (
    <div className={`my-6 text-center ${className}`}>
      {label && (
        <div className="text-[10px] uppercase tracking-widest text-[#bbb] mb-1">
          Advertisement
        </div>
      )}
      <ins
        key={`${pathname}:${slot}`}
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
