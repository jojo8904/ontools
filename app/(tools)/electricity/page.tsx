
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ElectricityCalculator } from './ElectricityCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const ELECTRICITY_GUIDE = [
  { h: '전기요금은 어떻게 구성되나요?', p: ['주택용 전기요금은 기본요금, 전력량요금, 기후환경요금, 연료비조정요금에 부가가치세 10%와 전력산업기반기금 2.7%(2025년 7월 이후)를 더합니다. 이 도구는 기타계절 저압 0~1,000kWh만 추정합니다.'] },
  { h: '누진제란?', p: ['주택용은 사용량이 많을수록 높은 단가가 적용되는 누진제가 적용됩니다. 보통 월 200kWh, 400kWh를 경계로 3단계로 나뉘며, 특히 여름철 냉방으로 사용량이 급증하면 상위 구간 단가가 적용돼 요금이 크게 오를 수 있습니다.'] },
  { h: '절약 팁', p: ['에어컨은 적정 온도로 설정하고, 사용하지 않는 가전의 대기전력을 차단하면 누진 구간 진입을 늦출 수 있습니다.'] },
  { h: '주의사항', p: ['한전 단가는 개정될 수 있고 계약종별·계절에 따라 다릅니다. 본 계산기는 주택용 저압 기준 추정치입니다.'] },
]

const ELECTRICITY_FAQ = [
  { q: '전기요금은 어떻게 계산되나요?', a: '기타계절 저압 누진 구간에 기본요금·기후환경요금·가정한 연료비조정액을 더한 뒤 부가세 10%와 기금 2.7%를 적용합니다. 하계·고압·할인·수신료는 미반영합니다.' },
  { q: '누진제가 무엇인가요?', a: '사용량이 많을수록 높은 단가가 적용되는 제도로, 주택용은 200kWh·400kWh를 경계로 3단계입니다.' },
  { q: '실제 고지서와 다를 수 있나요?', a: '한전 단가는 개정될 수 있고 계절·계약종별에 따라 달라집니다. 본 계산기는 주택용 저압 기준 추정치입니다.' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/electricity' },
  title: '전기요금 계산기 - ontools',
  description:
    '한국전력 주택용 전기요금 누진제 기준. 사용량(kWh)으로 예상 요금 계산, 금액으로 사용량 역계산. 기본료, 전력량요금, 부가세, 전력산업기반기금 포함.',
  keywords: [
    '전기요금계산기',
    '전기요금',
    '전기세',
    '누진제',
    '전력량요금',
    '한국전력',
    'kWh',
    '전기요금누진',
  ],
  openGraph: {
    title: '전기요금 계산기 - ontools',
    description: '전기 사용량으로 예상 요금 계산, 금액으로 사용량 역계산.',
    url: 'https://ontools.co.kr/electricity',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ElectricityPage() {
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
          <span className="text-foreground font-medium">전기요금 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">전기요금 계산기</h1>
          <p className="text-muted-foreground">
            한국전력 주택용 누진제 기준. 사용량으로 요금 계산, 금액으로 사용량
            역계산을 지원합니다.
          </p>
        </div>

        <ElectricityCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="electricity" />
        </div>
        <ToolGuide sections={ELECTRICITY_GUIDE} />
        <FaqSection items={ELECTRICITY_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/electricity-bill" className="text-sm font-semibold text-blue-700 hover:underline">전기요금 누진제 이해하고 여름 전기세 줄이기</Link>
        </div>
        <RelatedTools current="/electricity" />
      </main>

      <SiteFooter />
    </div>
  )
}
