import type { Metadata } from 'next'
import { CurrencyConverter } from './CurrencyConverter'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

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
          </div>

          <aside className="space-y-8">
            {/* 환전 수수료 절약 팁 */}
            <section>
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
            <section>
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

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <NewsSidebar toolId="currency" title="환율 뉴스" />
          <YouTubeSection category="currency" />
        </div>
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
