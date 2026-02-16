import type { Metadata } from 'next'
import { BmiCalculator } from './BmiCalculator'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

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
    url: 'https://ontools.com/bmi',
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
            <img src="/mascot.PNG" alt="ontools" className="w-10 h-10 rounded-full" />
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
          <NewsSidebar toolId="bmi" title="건강 뉴스" />
          <YouTubeSection category="bmi" />
        </div>
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
