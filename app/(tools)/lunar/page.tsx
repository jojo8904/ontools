import type { Metadata } from 'next'
import { LunarConverter } from './LunarConverter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '음력 ↔ 양력 변환이란?',
    p: [
      '양력 날짜를 음력으로, 음력 날짜를 양력으로 바꾸는 도구입니다. 어르신 생신, 제사, 설·추석 같은 명절 날짜를 확인할 때 사용합니다.',
      '한국천문연구원 기준의 한국 음력 데이터를 사용하며, 1000년~2050년 범위를 지원합니다.',
    ],
  },
  {
    h: '윤달이란?',
    p: [
      '음력은 달의 주기를 기준으로 해서 1년이 약 354일입니다. 양력과의 차이를 맞추기 위해 몇 년에 한 번 같은 달을 한 번 더 넣는데, 이것이 윤달입니다.',
      '음력 → 양력으로 변환할 때 해당 날짜가 윤달이라면 "윤달"을 체크해야 정확한 양력 날짜가 나옵니다.',
    ],
  },
  {
    h: '간지(육십갑자)란?',
    p: [
      '갑을병정… 10개의 천간과 자축인묘… 12개의 지지를 조합해 60년 주기로 해·달·날에 이름을 붙이는 방식입니다. "갑진년", "을사년" 같은 표현이 여기서 나옵니다.',
      '변환 결과와 함께 해당 날짜의 간지도 보여드립니다. 사주·전통 기념일 확인에 참고하세요.',
    ],
  },
]

export const metadata: Metadata = {
  title: '음력 양력 변환기 (윤달·간지 지원) - ontools',
  description:
    '양력↔음력 날짜를 서로 변환합니다. 어르신 생신·제사·명절 날짜 확인, 윤달 처리, 간지(육십갑자) 표시. 한국 음력 기준 1000~2050년 지원.',
  keywords: ['음력 변환', '양력 음력 변환', '음력 계산기', '음력 생일', '윤달', '음양력 변환', '간지', '육십갑자'],
  openGraph: {
    title: '음력 양력 변환기 (윤달·간지 지원) - ontools',
    description: '음력↔양력 변환, 윤달·간지까지. 한국 음력 기준.',
    url: 'https://ontools.co.kr/lunar',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function LunarPage() {
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
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground">생활·유틸</span>
          {' > '}
          <span className="text-foreground font-medium">음력 양력 변환기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">음력 ↔ 양력 변환기</h1>
          <p className="text-muted-foreground">
            어르신 생신·제사·명절 날짜 확인. 윤달과 간지(육십갑자)까지 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LunarConverter />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">어르신 생신 챙기기</h3>
                  <p>음력 생신이 올해 양력으로 며칠인지 확인합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제사·기일</h3>
                  <p>음력 기일을 양력 달력에 표시할 날짜로 바꿉니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">전통 기념일</h3>
                  <p>내 음력 생일, 명절 관련 날짜를 확인합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">함께 쓰면 좋아요</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p><a href="/age" className="font-semibold text-blue-700 hover:underline">만 나이 계산기</a> — 생일로 만 나이 확인</p>
                <p><a href="/d-day" className="font-semibold text-blue-700 hover:underline">D-day 계산기</a> — 생신·기념일까지 며칠?</p>
                <p><a href="/date-calc" className="font-semibold text-blue-700 hover:underline">날짜 계산기</a></p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/lunar" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
