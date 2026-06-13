import type { Metadata } from 'next'
import { UnitConverterCalculator } from './UnitConverterCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const UNIT_GUIDE = [
  { h: '단위 변환기란?', p: ['길이(m·cm·인치·피트), 무게(kg·g·파운드·온스), 온도(℃·℉), 시간 등 서로 다른 단위를 빠르게 환산해주는 도구입니다. 해외직구, 요리, 학습 등에서 유용합니다.'] },
  { h: '온도 변환 공식', p: ['섭씨를 화씨로 바꿀 때는 "℉ = ℃ × 9/5 + 32", 화씨를 섭씨로 바꿀 때는 "℃ = (℉ − 32) × 5/9"를 사용합니다. 예를 들어 25℃는 77℉입니다.'] },
  { h: '자주 쓰는 환산', p: ['1인치 = 2.54cm, 1피트 = 30.48cm, 1마일 ≈ 1.609km, 1파운드 ≈ 453.6g, 1온스 ≈ 28.35g입니다.'] },
]

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
        <ToolGuide sections={UNIT_GUIDE} />
        <RelatedTools current="/unit-converter" />
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
