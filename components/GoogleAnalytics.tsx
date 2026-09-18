import Script from 'next/script'
import { GA_ID } from '@/lib/analytics'

/**
 * Google Analytics 4 (gtag.js)
 * - 개발 모드에서는 로드하지 않음. 미설정 시 기존 사이트 측정 ID 사용.
 */
export function GoogleAnalytics() {
  if (!GA_ID || process.env.NODE_ENV !== 'production') return null

  return (
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
  )
}
