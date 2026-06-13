'use client'

import { useEffect, useRef } from 'react'

// 환경변수로 덮어쓸 수 있으나, 기본값으로 발급받은 광고단위 ID 사용 (애드핏 ID는 공개값)
const DEFAULT_UNIT = process.env.NEXT_PUBLIC_ADFIT_UNIT_ID || 'DAN-YmhVtuLiN5Q2MJ3K'

interface AdFitUnitProps {
  /** 카카오 애드핏 광고 단위 ID (예: DAN-xxxxxxxx). 미지정 시 환경변수 사용 */
  unit?: string
  width?: number
  height?: number
  className?: string
}

/**
 * 카카오 애드핏 광고 단위 (재사용)
 * - SPA 라우트 이동 시에도 매 마운트마다 스크립트를 다시 주입해 광고가 정상 렌더되도록 처리
 * - 단위 ID 미설정 시 아무것도 렌더하지 않음
 */
export function AdFitUnit({ unit, width = 728, height = 90, className = '' }: AdFitUnitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const adUnit = unit || DEFAULT_UNIT

  useEffect(() => {
    const el = ref.current
    if (!adUnit || !el) return

    const ins = document.createElement('ins')
    ins.className = 'kakao_ad_area'
    ins.style.display = 'none'
    ins.style.width = '100%'
    ins.setAttribute('data-ad-unit', adUnit)
    ins.setAttribute('data-ad-width', String(width))
    ins.setAttribute('data-ad-height', String(height))

    const script = document.createElement('script')
    script.async = true
    script.src = '//t1.kakaocdn.net/kas/static/ba.min.js'

    el.appendChild(ins)
    el.appendChild(script)

    return () => {
      el.innerHTML = ''
    }
  }, [adUnit, width, height])

  if (!adUnit) return null

  return <div ref={ref} className={`my-6 flex justify-center overflow-hidden ${className}`} />
}
