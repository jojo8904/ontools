import Script from 'next/script'

// 환경변수로 덮어쓸 수 있으나, 기본값으로 발급받은 GA4 측정 ID 사용
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JMXBEHHQ4K'

/**
 * Google Analytics 4 (gtag.js)
 * - NEXT_PUBLIC_GA_ID(G-XXXXXXX) 미설정 시 아무것도 로드하지 않음
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
