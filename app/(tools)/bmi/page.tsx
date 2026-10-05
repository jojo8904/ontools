
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
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
  {"h":"키별 정상 체중 범위 (BMI 18.5~22.9)","p":["160cm는 47.4~58.6kg, 165cm는 50.4~62.3kg, 170cm는 53.5~66.2kg, 175cm는 56.7~70.1kg, 180cm는 59.9~74.2kg입니다. 키(m)의 제곱에 18.5와 22.9를 곱해 구합니다.","같은 방식으로 BMI 25(비만 기준)는 160cm 64kg, 170cm 72.3kg, 180cm 81kg입니다. 이 선을 넘으면 건강검진에서 비만으로 분류됩니다."]},
  {"h":"허리둘레를 함께 보세요","p":["BMI가 정상이어도 허리둘레가 남성 90cm, 여성 85cm 이상이면 복부비만으로 봅니다. 복부 지방은 당뇨·고혈압·심혈관 질환과 더 직접적으로 관련되어 BMI보다 위험을 잘 반영합니다.","허리둘레는 숨을 내쉰 상태에서 배꼽 위 갈비뼈 아래와 골반뼈 위의 중간 지점을 잽니다. 바지 치수와 다르므로 줄자로 직접 재세요."]},
  {"h":"나이와 성별에 따라 다르게 보는 법","p":["19세 미만 소아·청소년은 성인 기준 대신 같은 나이·성별의 BMI 백분위를 씁니다. 85~95 백분위는 과체중, 95 이상은 비만입니다. 성장기에는 BMI가 자연스럽게 변하므로 성장도표로 판단합니다.","65세 이상 노인은 BMI 23~25 정도가 사망률이 가장 낮다는 연구가 많습니다. 노년기에는 살이 빠지는 것보다 근육이 줄어드는 것(근감소증)이 더 위험하므로 체중 감량 목표를 낮게 잡는 것이 좋습니다."]},
  {"h":"BMI 구간별 건강 위험","p":["BMI 25 이상이면 정상 체중보다 제2형 당뇨병 위험이 약 2배, 30 이상이면 5배 이상 높아집니다. 고혈압·이상지질혈증·수면무호흡·관절염 위험도 함께 오릅니다.","저체중(18.5 미만)도 위험합니다. 영양 결핍, 면역력 저하, 골다공증, 여성의 경우 생리 불순과 관련됩니다. 체중은 많아도 적어도 문제이며, 정상 범위 안에서 유지하는 것이 목표입니다."]},
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
  {"q":"BMI 23인데 과체중이라니 살을 빼야 하나요?","a":"23~24.9는 '비만 전 단계'로 당장 질병은 아니지만 체중이 더 늘지 않게 관리하라는 신호입니다. 허리둘레가 정상이고 운동을 하고 있다면 체중보다 근육량과 식습관에 집중하세요."},
  {"q":"체지방률은 몇 %가 정상인가요?","a":"일반적으로 남성 15~20%, 여성 20~25%를 정상 범위로 봅니다. 체성분 분석기(인바디)는 수분 상태에 따라 오차가 있으므로 같은 시간대, 같은 조건에서 재는 추세가 중요합니다."},
  {"q":"근육이 많은데 BMI가 높게 나와요.","a":"BMI는 근육과 지방을 구분하지 않습니다. 체지방률이 정상이고 허리둘레가 기준 이하면 BMI만으로 비만이라고 볼 필요는 없습니다. 다만 체중 자체가 무거우면 관절 부담은 있습니다."},
  {"q":"BMI는 얼마나 자주 재야 하나요?","a":"체중은 하루에도 1~2kg 변하므로 매일 재되 주간 평균으로 보세요. 아침 공복, 화장실 다녀온 뒤, 같은 옷차림이 비교하기 가장 좋습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/bmi' },
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
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
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
          <Link href="/guide/bmi-guide" className="text-sm font-semibold text-blue-700 hover:underline">BMI(체질량지수) 보는 법과 한국 기준</Link>
        </div>
        <RelatedTools current="/bmi" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
