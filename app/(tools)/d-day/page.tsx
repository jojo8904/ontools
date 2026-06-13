import type { Metadata } from 'next'
import { DdayCalculator } from './DdayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const DDAY_GUIDE = [
  { h: 'D-day란?', p: ['D-day는 목표한 날까지 남은(또는 지난) 일수를 뜻합니다. 목표일 당일은 D-day, 그 전은 D-숫자(예: D-30), 그 후는 D+숫자로 표시합니다.'] },
  { h: '어떻게 계산하나요', p: ['오늘 날짜와 목표 날짜 사이의 일수 차이를 계산합니다. 본 계산기는 시험일, 기념일, 전역일, 출산 예정일 등 다양한 목표일까지의 날짜를 한눈에 보여줍니다.'] },
  { h: '활용 팁', p: ['시험·자격증 준비, 커플 기념일, 여행, 프로젝트 마감 관리 등에 활용하면 동기 부여와 일정 관리에 도움이 됩니다.'] },
]

export const metadata: Metadata = {
  title: 'D-day 계산기 - ontools',
  description:
    '목표 날짜까지 남은 일수 카운트다운, 두 날짜 사이 일수 계산. D-day를 간편하게 확인하세요.',
  keywords: [
    'D-day',
    '디데이',
    '디데이계산기',
    '날짜계산',
    '남은일수',
    '기간계산',
    '날짜간격',
    '카운트다운',
  ],
  openGraph: {
    title: 'D-day 계산기 - ontools',
    description: '목표 날짜까지 남은 일수, 두 날짜 사이 기간을 간편하게 계산하세요.',
    url: 'https://ontools.com/d-day',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function DdayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            홈
          </a>
          {' > '}
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">D-day 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">D-day 계산기</h1>
          <p className="text-muted-foreground">
            목표 날짜까지 남은 일수 카운트다운, 두 날짜 사이 일수를 계산합니다.
          </p>
        </div>

        <DdayCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="dday" />
        </div>
        <ToolGuide sections={DDAY_GUIDE} />
        <RelatedTools current="/d-day" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
