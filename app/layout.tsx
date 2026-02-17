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
    apple: '/mascot.png',
  },
  openGraph: {
    siteName: 'ontools',
    type: 'website',
    images: [{ url: '/mascot.png', width: 512, height: 512, alt: 'ontools' }],
  },
  verification: {
    other: {
      'naver-site-verification': ['63d1997b6b0f63f4df0908dab12b0fdac9f1e987'],
    },
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8367801233123288"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
