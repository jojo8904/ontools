import type { Metadata } from 'next'
import { UnitConverterCalculator } from './UnitConverterCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '단위 변환기 - ontools',
  description:
    '길이(cm/m/km/inch/ft/mile), 무게(g/kg/lb/oz), 온도(°C/°F), 시간(초/분/시간/일) 단위를 간편하게 변환하세요.',
  keywords: [
    '단위변환',
    '단위변환기',
    '길이변환',
    '무게변환',
    '온도변환',
    '시간변환',
    'cm인치',
    'kg파운드',
    '섭씨화씨',
  ],
  openGraph: {
    title: '단위 변환기 - ontools',
    description: '길이, 무게, 온도, 시간 단위를 간편하게 변환하세요.',
    url: 'https://ontools.com/unit-converter',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            홈
          </a>
          {' > '}
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">단위 변환기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">단위 변환기</h1>
          <p className="text-muted-foreground">
            길이, 무게, 온도, 시간 단위를 간편하게 변환합니다.
          </p>
        </div>

        {/* Calculator Component */}
        <UnitConverterCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="unit" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
