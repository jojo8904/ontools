import type { Metadata } from 'next'
import { BmiCalculator } from './BmiCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const BMI_GUIDE = [
  { h: 'BMI(체질량지수)란?', p: ['BMI는 체중(kg)을 키(m)의 제곱으로 나눈 값으로, 키 대비 체중이 적정한지 간단히 가늠하는 지표입니다. 비만도를 빠르게 확인할 때 널리 사용됩니다.'] },
  { h: '판정 기준', p: ['대한비만학회 기준으로 18.5 미만은 저체중, 18.5~22.9는 정상, 23~24.9는 과체중, 25 이상은 비만으로 봅니다. 아시아인은 같은 BMI에서도 대사질환 위험이 높아 WHO 기준(25 이상 과체중)보다 엄격하게 설정되어 있습니다.'] },
  { h: 'BMI의 한계', p: ['BMI는 근육량과 체지방을 구분하지 못합니다. 운동선수처럼 근육이 많으면 높게 나올 수 있고, 반대로 마른 비만은 정상으로 보일 수 있습니다. 허리둘레·체지방률 등과 함께 종합적으로 판단하는 것이 좋습니다.'] },
  { h: '건강 체중 관리', p: ['적정 체중 유지를 위해서는 균형 잡힌 식사와 규칙적인 운동이 기본입니다. 급격한 체중 변화보다 꾸준한 생활습관 개선이 건강에 이롭습니다.'] },
]

const BMI_FAQ = [
  {
    q: 'BMI는 어떻게 계산하나요?',
    a: '체중(kg)을 키(m)의 제곱으로 나눕니다. 예: 70kg, 175cm → 70 ÷ (1.75 × 1.75) ≈ 22.9.',
  },
  {
    q: '정상 BMI 범위는 얼마인가요?',
    a: '대한비만학회 기준 18.5~22.9는 정상, 23~24.9는 과체중, 25 이상은 비만입니다. (WHO 기준은 25 이상 과체중, 30 이상 비만으로 다소 다릅니다.)',
  },
  {
    q: '한국 기준과 WHO 기준이 왜 다른가요?',
    a: '아시아인은 같은 BMI에서도 대사질환 위험이 더 높은 것으로 알려져, 한국·아시아 기준이 더 엄격하게 설정되어 있습니다.',
  },
  {
    q: 'BMI의 한계는 무엇인가요?',
    a: '근육량과 체지방을 구분하지 못해 근육이 많은 사람은 높게 나올 수 있습니다. 체성분·허리둘레 등과 함께 참고 지표로만 활용하세요.',
  },
]

export const metadata: Metadata = {
  title: 'BMI 계산기 - ontools',
  description:
    'BMI(체질량지수) 계산기로 당신의 건강 상태를 확인하세요. 신장과 체중만 입력하면 BMI 지수, 체중 분류, 표준 체중 범위를 알 수 있습니다.',
  keywords: [
    'BMI계산기',
    '체질량지수',
    '비만도',
    '표준체중',
    '적정체중',
    '건강체중',
    'BMI',
    '체중관리',
  ],
  openGraph: {
    title: 'BMI 계산기 - ontools',
    description: 'BMI 지수로 당신의 건강 상태를 확인하세요.',
    url: 'https://ontools.co.kr/bmi',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BmiPage() {
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
          <span className="text-foreground">건강</span>
          {' > '}
          <span className="text-foreground font-medium">BMI 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">BMI 계산기</h1>
          <p className="text-muted-foreground">
            신장과 체중으로 BMI(체질량지수)를 계산하고 건강 상태를
            확인하세요.
          </p>
        </div>

        {/* Calculator Component */}
        <BmiCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="bmi" />
        </div>
        <ToolGuide sections={BMI_GUIDE} />
        <FaqSection items={BMI_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <a href="/guide/bmi-guide" className="text-sm font-semibold text-blue-700 hover:underline">BMI(체질량지수) 보는 법과 한국 기준</a>
        </div>
        <RelatedTools current="/bmi" />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
