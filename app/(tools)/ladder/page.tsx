import type { Metadata } from 'next'
import { LadderGame } from './LadderGame'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '사다리타기란?',
    p: [
      '참가자와 결과를 세로줄 위아래에 두고, 무작위 가로줄을 따라 내려가며 짝을 정하는 추첨 방법입니다. 커피 내기, 청소 당번, 발표 순서 정하기 등에 널리 쓰입니다.',
      '가로줄이 무작위로 생성되므로 누구도 결과를 예측할 수 없어 공정합니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '인원 수(2~8명)를 고르고 참가자 이름과 결과(당첨·꽝·벌칙 등)를 입력한 뒤 "사다리 만들기"를 누르세요.',
      '위쪽 이름을 클릭하면 선이 사다리를 타고 내려가며 결과가 공개됩니다. "전체 결과 한 번에 보기"나 "새로 섞기"도 가능합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '결과 칸에는 "커피 사기", "청소", "1등 상품"처럼 자유롭게 적을 수 있습니다.',
      '한 명씩 차례로 클릭하면 긴장감이 살아나서 더 재미있습니다.',
      '순서만 정하고 싶다면 결과 칸에 1번, 2번, 3번… 처럼 숫자를 넣으면 됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '사다리타기 (온라인 사다리 게임) - ontools',
  description:
    '2~8명 사다리타기를 온라인에서 바로. 이름과 결과를 정하면 무작위 사다리가 만들어지고, 클릭하면 애니메이션으로 결과가 공개됩니다. 커피내기·당번 정하기에 딱.',
  keywords: ['사다리타기', '사다리 게임', '온라인 사다리', '사다리타기 게임', '제비뽑기', '내기 게임', '랜덤 뽑기'],
  openGraph: {
    title: '사다리타기 (온라인 사다리 게임) - ontools',
    description: '이름·결과 넣고 클릭하면 끝. 무작위 사다리로 공정하게 정하세요.',
    url: 'https://ontools.co.kr/ladder',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function LadderPage() {
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
          <span className="text-foreground font-medium">사다리타기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">사다리타기</h1>
          <p className="text-muted-foreground">
            이름과 결과를 넣으면 무작위 사다리가 만들어져요. 클릭하면 선이 내려가며 결과 공개!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LadderGame />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">커피·점심 내기</h3>
                  <p>누가 살지 공정하게 사다리로 정합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">당번·역할 정하기</h3>
                  <p>청소 당번, 발표 순서, 자리 배치를 빠르게 나눕니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">경품 추첨</h3>
                  <p>모임·행사에서 간단한 경품 추첨판으로 씁니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">공정한 무작위</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  가로줄은 매번 <strong className="text-gray-900">무작위로 생성</strong>되고, 모든 세로줄 사이에 최소 1개 이상 놓여 결과를 예측할 수 없습니다.
                </p>
                <p>마음에 안 들면 "새로 섞기"로 언제든 다시 만들 수 있어요.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/ladder" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
