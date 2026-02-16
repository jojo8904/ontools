import type { Metadata } from 'next'
import { LoanCalculator } from './LoanCalculator'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '대출이자 계산기 - ontools',
  description:
    '대출금액, 이자율, 대출기간을 입력하면 원리금균등, 원금균등, 만기일시 세 가지 방식의 월 상환금과 총 이자를 계산합니다.',
  keywords: [
    '대출이자계산기',
    '대출계산기',
    '원리금균등',
    '원금균등',
    '만기일시',
    '주택담보대출',
    '대출금리',
    '대출상환',
    'LTV',
    'DTI',
  ],
  openGraph: {
    title: '대출이자 계산기 - ontools',
    description: '대출 상환방식별 월 상환금과 총 이자를 간편하게 계산하세요.',
    url: 'https://ontools.com/loan',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function LoanPage() {
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
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">대출이자 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대출이자 계산기</h1>
          <p className="text-muted-foreground">
            대출금액, 이자율, 기간을 입력하면 원리금균등/원금균등/만기일시 방식별 월 상환금과 총 이자를 계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LoanCalculator />
            <div className="mt-10 space-y-10">
              <NewsSidebar toolId="loan" title="관련 뉴스" />
              <YouTubeSection category="loan" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 대출 상환방식 비교 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">대출 상환방식 비교</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">원리금균등상환</h3>
                  <p>매달 동일한 금액을 상환합니다. 초기에는 이자 비중이 높고 후반으로 갈수록 원금 비중이 커집니다. 매달 같은 금액이라 가계 관리가 편합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">원금균등상환</h3>
                  <p>매달 동일한 원금을 상환하며 이자는 잔액에 따라 줄어듭니다. 초기 부담이 크지만 총 이자가 가장 적습니다. 장기 대출에 유리합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">만기일시상환</h3>
                  <p>매달 이자만 내고 만기에 원금 전액을 상환합니다. 월 부담은 적지만 총 이자가 가장 많고 만기에 목돈이 필요합니다.</p>
                </div>
              </div>
            </section>

            {/* 주택담보대출 금리 안내 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">주택담보대출 금리 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">고정금리 vs 변동금리</h3>
                  <p>고정금리는 대출 기간 내내 동일한 이율이 적용되어 안정적입니다. 변동금리는 기준금리에 따라 변동하며, 초기 금리가 낮은 편입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">혼합형 금리</h3>
                  <p>초기 일정 기간(보통 5년)은 고정금리, 이후 변동금리가 적용됩니다. 두 방식의 장점을 결합한 구조입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">금리 결정 요소</h3>
                  <p>한국은행 기준금리, COFIX(자금조달비용지수), 신용등급, LTV/DTI 비율 등에 따라 개인별 적용 금리가 달라집니다.</p>
                </div>
              </div>
            </section>

            {/* LTV/DTI 설명 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">LTV / DTI / DSR 이란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">LTV (담보인정비율)</h3>
                  <p>주택 가격 대비 대출 가능 비율. 투기지역 40%, 조정대상지역 50%, 기타 70%가 기준입니다. 예: 5억 주택, LTV 50%이면 최대 2.5억 대출 가능.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">DTI (총부채상환비율)</h3>
                  <p>연 소득 대비 연간 대출 원리금 상환액 비율. 주택담보대출 원리금 + 기타 대출 이자를 합산합니다. 보통 40~60% 이내로 제한됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">DSR (총부채원리금상환비율)</h3>
                  <p>모든 대출의 원리금 상환액을 연 소득으로 나눈 비율. DTI보다 엄격한 기준으로, 현재 40% 규제가 적용됩니다.</p>
                </div>
              </div>
            </section>
          </aside>
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
