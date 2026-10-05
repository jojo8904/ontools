
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { DdayCalculator } from './DdayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const DDAY_GUIDE = [
  { h: 'D-day란?', p: ['D-day는 목표한 날까지 남은(또는 지난) 일수를 뜻합니다. 목표일 당일은 D-day, 그 전은 D-숫자(예: D-30), 그 후는 D+숫자로 표시합니다.'] },
  { h: '어떻게 계산하나요', p: ['오늘 날짜와 목표 날짜 사이의 일수 차이를 계산합니다. 본 계산기는 시험일, 기념일, 전역일, 출산 예정일 등 다양한 목표일까지의 날짜를 한눈에 보여줍니다.'] },
  { h: '활용 팁', p: ['시험·자격증 준비, 커플 기념일, 여행, 프로젝트 마감 관리 등에 활용하면 동기 부여와 일정 관리에 도움이 됩니다.'] },
  {"h":"계산 예시: 100일 기념일은 언제인가","p":["사귄 날을 1일로 세는 관례에서 100일은 시작일 + 99일입니다. 3월 1일에 시작했다면 6월 8일이 100일째입니다. 반면 D-day 계산기에서 3월 1일을 기준일로 넣고 100일 뒤를 보면 6월 9일이 나옵니다. 어느 쪽으로 셀지 미리 정해 두면 하루 차이로 어긋나지 않습니다.","아기 100일도 태어난 날을 1일로 세어 출생일 + 99일이고, 돌(첫 생일)은 태어난 날의 1년 뒤 같은 날짜입니다."]},
  {"h":"D-day 당일 포함 여부","p":["D-7은 목표일 7일 전, D-day는 당일, D+1은 다음 날입니다. 수능이 11월 19일이고 오늘이 11월 12일이면 D-7입니다. 남은 '밤'은 7번, 공부할 수 있는 날은 당일을 빼면 7일입니다.","입대·전역 같은 복무 기간은 양 끝을 모두 포함해 셉니다. 2026년 1월 5일 입대, 18개월 복무면 전역일은 2027년 7월 4일이고, 이 기간은 546일입니다."]},
  {"h":"반복되는 기념일과 요일","p":["매년 돌아오는 기념일은 날짜는 같아도 요일이 바뀝니다. 평년에는 요일이 하루씩, 윤년을 지나면 이틀씩 밀립니다. 2026년 10월 5일 월요일인 날짜는 2027년에는 화요일입니다.","음력 생일이나 제사는 해마다 양력 날짜가 달라지므로 음력 변환기로 그해 양력 날짜를 확인한 뒤 D-day를 계산하세요."]},
  {"h":"자주 쓰는 D-day","p":["2027학년도 수능은 2026년 11월 19일(목)입니다. 수능은 매년 11월 셋째 목요일에 치러집니다. 설·추석 연휴, 전역일, 출산예정일, 계약 만료일, 비자 만료일이 D-day 계산기에 자주 쓰이는 날짜입니다.","비자·여권 만료는 만료일 당일에 효력이 없는 경우가 있으니 D-1을 기준으로 준비하고, 계약 만료는 계약서의 '까지'가 당일 포함인지 확인하세요."]},
]

const EXTRA_FAQ = [
  {"q":"D-day 계산에 오늘이 포함되나요?","a":"오늘부터 목표일까지의 차이를 세므로 오늘은 0일, 내일은 1일입니다. 목표일이 오늘이면 D-day(0)이고, 지났으면 D+n으로 표시됩니다."},
  {"q":"1000일은 언제인가요?","a":"시작일을 1일로 세면 시작일 + 999일, 시작일을 0일로 세면 + 1000일입니다. 2026년 3월 1일 시작이면 각각 2028년 11월 24일과 11월 25일입니다. 커플 기념일 앱 대부분은 시작일을 1일로 셉니다."},
  {"q":"윤년이 끼면 계산이 달라지나요?","a":"계산기는 실제 달력을 따르므로 2월 29일이 자동으로 포함됩니다. 2028년이 윤년이라 2027년과 2029년 사이 1년은 366일입니다."},
  {"q":"주말을 빼고 계산하고 싶어요.","a":"영업일 기준 계산은 날짜 계산기의 근무일 옵션을 쓰세요. 공휴일은 해마다 달라지므로 2027년 공휴일 가이드를 함께 참고하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/d-day' },
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
    url: 'https://ontools.co.kr/d-day',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function DdayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/d-day" />
      </main>

      <SiteFooter />
    </div>
  )
}
