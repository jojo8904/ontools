'use client'

import { useEffect, useState } from 'react'
import { AdFitUnit } from './AdFitUnit'

const PC_UNIT = 'DAN-YmhVtuLiN5Q2MJ3K' // 728x90
const MOBILE_UNIT = 'DAN-TMWlzezuMlSsAZtt' // 320x100

/**
 * 화면 폭에 따라 PC/모바일 애드핏 광고단위를 자동 선택해 노출.
 * - 768px 미만: 모바일(320x100), 이상: PC(728x90)
 * - 초기(측정 전)에는 렌더하지 않아 하이드레이션 불일치 방지
 */
export function ResponsiveAdFit() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isMobile === null) return null

  return isMobile ? (
    <AdFitUnit unit={MOBILE_UNIT} width={320} height={100} />
  ) : (
    <AdFitUnit unit={PC_UNIT} width={728} height={90} />
  )
}
