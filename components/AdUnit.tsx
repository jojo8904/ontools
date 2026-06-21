'use client'

import { useEffect } from 'react'

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
// 아직 실제 발급 안 된 placeholder 슬롯 — 이 값이면 광고 요청하지 않음(400 방지)
const PLACEHOLDER_SLOT = '0000000000'

interface AdUnitProps {
  /** AdSense 광고 단위 슬롯 ID (AdSense 대시보드에서 발급) */
  slot: string
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
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style,
  label = true,
}: AdUnitProps) {
  const disabled = !ADSENSE_CLIENT_ID || !slot || slot === PLACEHOLDER_SLOT

  useEffect(() => {
    if (disabled) return
    try {
      ;((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({})
    } catch {
      // AdSense 스크립트 미로드 시 조용히 무시
    }
  }, [disabled])

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
