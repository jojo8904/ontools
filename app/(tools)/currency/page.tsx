import type { Metadata } from 'next'
import { CurrencyConverter } from './CurrencyConverter'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const CURRENCY_GUIDE = [
  { h: '환율 계산기란?', p: ['입력한 금액을 현재 환율 기준으로 원화↔외화로 환산해주는 도구입니다. 해외여행 예산, 해외직구 결제금액, 해외송금액을 가늠할 때 유용합니다.'] },
  { h: '매매기준율과 실제 환전 환율의 차이', p: ['본 계산기는 매매기준율(은행 간 거래 기준 환율)을 사용합니다. 실제로 은행·환전소에서 돈을 바꿀 때는 여기에 스프레드(수수료)가 붙어, 살 때는 더 비싸고 팔 때는 더 싸게 적용됩니다. 환전 우대를 받으면 이 차이를 줄일 수 있습니다.'] },
  { h: '엔화 표기 주의', p: ['일본 엔화는 은행 고시에서 100엔 단위로 표기되는 경우가 많습니다. 본 계산기는 1엔 기준으로 환산해 보여주므로 은행 고시 숫자와 달라 보일 수 있습니다.'] },
  { h: '활용 팁', p: ['환율은 평일에 수시로 변동하고 주말·공휴일에는 직전 영업일 기준이 유지됩니다. 큰 금액을 환전한다면 며칠간 환율 추이를 지켜보고, 주거래은행의 환전 우대를 활용하는 것이 유리합니다.'] },
]

const CURRENCY_FAQ = [
  {
    q: '환율은 어느 시점 기준인가요?',
    a: '평일 오전에 업데이트되는 매매기준율 근사치입니다. 주말·공휴일에는 직전 영업일의 환율이 적용됩니다.',
  },
  {
    q: '실제 환전 금액과 다른 이유는 무엇인가요?',
    a: '은행·환전소는 매매기준율에 스프레드(수수료)를 더하기 때문에 "살 때"와 "팔 때" 환율이 다릅니다. 본 계산기는 기준율 참고용입니다.',
  },
  {
    q: '엔화(JPY)는 100엔 기준인가요?',
    a: '본 계산기는 1엔 기준으로 환산해 보여줍니다. 은행 고시는 100엔 단위로 표기되는 경우가 많아 숫자가 달라 보일 수 있습니다.',
  },
  {
    q: '어떤 통화를 지원하나요?',
    a: '미국 달러(USD), 일본 엔(JPY), 유로(EUR), 중국 위안(CNY)과 원화(KRW) 간 변환을 지원합니다.',
  },
]

export const metadata: Metadata = {
  title: '환율 계산기 - ontools',
  description:
    '실시간 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게 변환하세요. 한국수출입은행 환율 기준, 최신 환율 뉴스 제공.',
  keywords: [
    '환율계산기',
    '환율변환',
    '원달러환율',
    '달러환율',
    '엔화환율',
    '유로환율',
    '위안화환율',
    '실시간환율',
  ],
  openGraph: {
    title: '환율 계산기 - ontools',
    description: '실시간 환율로 통화를 간편하게 변환하세요.',
    url: 'https://ontools.com/currency',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CurrencyPage() {
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
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">환율 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">환율 계산기</h1>
          <p className="text-muted-foreground">
            실시간 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게
            변환하세요.
          </p>
        </div>

        {/* Converter + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CurrencyConverter />
            <div className="mt-10 space-y-10">
              <NewsSidebar toolId="currency" title="환율 뉴스" />
              <YouTubeSection category="currency" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 환전 수수료 절약 팁 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">환전 수수료 절약 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. 인터넷/모바일 환전 이용</h3>
                  <p>은행 창구 대비 최대 90% 우대율을 받을 수 있습니다. 대부분의 시중은행 앱에서 환전 예약 후 공항에서 수령 가능합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. 환율 우대 쿠폰 활용</h3>
                  <p>은행별로 환율 우대 쿠폰을 수시로 제공합니다. 여행 전 미리 쿠폰을 확보하면 추가 할인을 받을 수 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3. 달러 강세/약세 시점 활용</h3>
                  <p>환율이 낮을 때(원화 강세) 미리 환전하면 유리합니다. 급하지 않다면 환율 추이를 지켜보며 분할 환전도 좋은 방법입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4. 해외 직접 인출 주의</h3>
                  <p>현지 ATM 인출 시 수수료가 2~3% 추가될 수 있습니다. 가능하면 국내에서 미리 환전하는 것이 유리합니다.</p>
                </div>
              </div>
            </section>

            {/* 통화별 특징 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">주요 통화별 특징</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">USD (미국 달러)</h3>
                  <p>세계 기축통화. 전 세계 외환거래의 약 88%에 관여합니다. 원/달러 환율은 한국 경제의 핵심 지표입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">JPY (일본 엔)</h3>
                  <p>안전자산 통화. 글로벌 위기 시 엔화 강세 경향이 있습니다. 100엔 단위로 고시됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">EUR (유로)</h3>
                  <p>유로존 20개국 공통 통화. 달러 다음으로 거래량이 많으며, 유럽 여행 시 필수 통화입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">CNY (중국 위안)</h3>
                  <p>중국 인민은행이 관리하는 관리변동환율제. 한중 교역 규모가 큰 만큼 원/위안 환율도 중요합니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={CURRENCY_GUIDE} />
        <FaqSection items={CURRENCY_FAQ} />
        <RelatedTools current="/currency" />
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
