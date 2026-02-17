import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://ontools.co.kr'),
  title: "ontools - 실생활 유틸리티 + AI 자동 뉴스",
  description: "필요한 계산, 관련 뉴스까지 한 번에. 연봉 계산기, 환율 계산기, BMI 계산기 등",
  keywords: ["계산기", "유틸리티", "뉴스", "연봉계산기", "환율계산기"],
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'ontools - 당신의 스마트한 일상 도구',
    description: '필요한 계산, 관련 뉴스까지 한 번에. 연봉 계산기, 환율 계산기, BMI 계산기 등',
    url: 'https://ontools.co.kr',
    siteName: 'ontools',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ontools - 당신의 스마트한 일상 도구',
    description: '필요한 계산, 관련 뉴스까지 한 번에',
  },
  verification: {
    google: 'iotm6566LAXWYZHbVROJejB6Z7dqbA7OOS7z0ikycIU',
    other: {
      'naver-site-verification': ['63d1997b6b0f63f4df0908dab12b0fdac9f1e987'],
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#0f0f1a" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8367801233123288"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
