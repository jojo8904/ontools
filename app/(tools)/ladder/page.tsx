
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { LadderGame } from './LadderGame'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"사다리타기가 공평한 이유","p":["사다리타기는 세로선 사이에 가로선을 무작위로 긋고 위에서 아래로 내려가며 가로선을 만나면 옆으로 옮기는 방식입니다. 가로선이 어떻게 그어져도 출발점마다 도착점이 하나씩 정해지고 겹치지 않으므로, 모든 참가자가 같은 확률로 각 결과에 배정됩니다.","다만 가로선이 적으면 바로 옆 결과로 갈 확률이 높아지는 편향이 있습니다. 이 도구는 가로선을 충분히 많이 무작위로 그어 편향을 줄입니다."]},
  {"h":"이렇게 쓰입니다","p":["점심 메뉴·커피 사기·청소 당번·발표 순서·회식 자리 배치처럼 '누가 무엇을'을 정할 때 가장 흔합니다. 결과 칸에 '당첨'과 '꽝'을 섞어 벌칙 뽑기로도 쓰고, 모든 칸을 서로 다른 항목으로 두면 순서 정하기가 됩니다.","참가자 이름과 결과 항목을 각각 입력하고 시작하면 애니메이션으로 경로를 보여 줍니다. 결과만 빠르게 보려면 애니메이션을 건너뛸 수 있습니다."]},
  {"h":"공정성을 의심받지 않으려면","p":["참가자가 보는 앞에서 실행하고, 결과가 나온 뒤 다시 돌리지 않는 것이 규칙입니다. 결과 화면을 캡처해 단체방에 올리면 뒷말이 없습니다.","이름 순서를 바꾸면 결과도 바뀌므로 순서는 가나다순이나 입력 순으로 미리 합의하세요. 섞기 기능을 쓰면 순서도 무작위가 됩니다."]},
  {"h":"다른 뽑기 방식과 비교","p":["사다리타기는 참가자 수와 결과 수가 같을 때 적합합니다. 한 명만 뽑으면 되면 제비뽑기나 룰렛이 빠르고, 여러 명을 팀으로 나누려면 팀 나누기 방식이 맞습니다.","이 도구는 브라우저에서 실행되며 입력한 이름은 서버로 전송되지 않습니다. 페이지를 새로 고치면 초기화됩니다."]},
]

const EXTRA_FAQ = [
  {"q":"참가자는 몇 명까지 되나요?","a":"2명부터 수십 명까지 가능하지만 화면 폭 때문에 10명 안팎이 보기 편합니다. 그 이상이면 두 번에 나눠 하거나 결과 칸만 보세요."},
  {"q":"결과 수가 참가자 수보다 적으면요?","a":"참가자 수와 결과 수는 같아야 합니다. 결과가 적으면 '꽝'이나 '통과'를 채워 수를 맞추세요."},
  {"q":"같은 결과가 두 번 나올 수 있나요?","a":"없습니다. 사다리 구조상 출발점과 도착점은 1:1로 대응되어 두 사람이 같은 결과에 가지 않습니다."},
  {"q":"결과를 저장하거나 공유할 수 있나요?","a":"결과 화면을 캡처해 공유하세요. 별도 저장 기능은 없으며 새로 고치면 초기화됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/ladder' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
                <p>마음에 안 들면 &quot;새로 섞기&quot;로 언제든 다시 만들 수 있어요.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/ladder" />
      </main>

      <SiteFooter />
    </div>
  )
}
