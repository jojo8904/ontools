import type { Metadata } from 'next'
import { SavingsCalculator } from './SavingsCalculator'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '적금/예금 이자 계산기 - ontools',
  description:
    '적금, 예금 이자를 단리/복리로 계산하고 세전·세후 수령액을 확인하세요. 이자소득세 15.4% 자동 계산.',
  keywords: [
    '적금계산기',
    '예금계산기',
    '이자계산기',
    '단리',
    '복리',
    '이자소득세',
    '세후이자',
    '적금이자',
    '예금이자',
  ],
  openGraph: {
    title: '적금/예금 이자 계산기 - ontools',
    description: '적금, 예금 이자를 단리/복리로 계산하세요.',
    url: 'https://ontools.com/savings',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SavingsPage() {
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
          <span className="text-foreground font-medium">적금/예금 이자 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">적금/예금 이자 계산기</h1>
          <p className="text-muted-foreground">
            적금·예금의 단리/복리 이자를 계산하고 세전·세후 수령액을 확인하세요.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SavingsCalculator />
            <div className="mt-10 space-y-10">
              <NewsSidebar toolId="savings" title="관련 뉴스" />
              <YouTubeSection category="savings" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 단리 vs 복리 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">단리 vs 복리 차이</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">단리 (Simple Interest)</h3>
                  <p>원금에 대해서만 이자를 계산합니다. 이자가 원금에 더해지지 않아 매 기간 동일한 이자가 발생합니다. 대부분의 시중은행 적금이 단리 방식입니다.</p>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs mt-2">
                    이자 = 원금 x 이율 x 기간
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">복리 (Compound Interest)</h3>
                  <p>원금 + 이자에 대해 다시 이자가 붙습니다. 기간이 길수록 단리 대비 이자 차이가 커집니다. 저축은행이나 일부 특판 상품에서 월복리를 제공합니다.</p>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs mt-2">
                    이자 = 원금 x (1 + 이율/n)^(n x 기간) - 원금
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">예시 비교</h3>
                  <p>1,000만원을 연 5%로 3년 예치 시:</p>
                  <div className="overflow-x-auto mt-1">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-1.5 pr-3 font-semibold">방식</th>
                          <th className="text-right py-1.5 font-semibold">이자</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">단리</td>
                          <td className="py-1.5 text-right font-medium">150만원</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">월복리</td>
                          <td className="py-1.5 text-right font-medium">~161만원</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* 이자소득세 안내 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">이자소득세 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">세율 구조</h3>
                  <p>이자소득에 대해 소득세 14% + 지방소득세 1.4% = 총 15.4%가 원천징수됩니다. 만기 시 자동으로 차감되어 세후 금액이 지급됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">금융소득종합과세</h3>
                  <p>연간 금융소득(이자+배당)이 2,000만원을 초과하면 다른 소득과 합산하여 종합소득세가 부과됩니다. 고액 예금자는 주의가 필요합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">세금 예시</h3>
                  <p>이자 100만원 발생 시: 소득세 14만원 + 지방세 1.4만원 = 15.4만원 차감. 세후 수령 이자 84.6만원.</p>
                </div>
              </div>
            </section>

            {/* 비과세 저축 안내 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">비과세/세금우대 저축</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">비과세종합저축</h3>
                  <p>만 65세 이상, 장애인 등 대상. 1인당 5,000만원 한도로 이자소득세가 면제됩니다. 은행, 증권사 등 금융기관에서 가입 가능합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">ISA (개인종합자산관리계좌)</h3>
                  <p>연 2,000만원(총 1억원) 한도. 순이익 200만원(서민형 400만원)까지 비과세, 초과분은 9.9% 분리과세됩니다. 3년 이상 유지 조건.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">청년도약계좌</h3>
                  <p>만 19~34세 청년 대상. 월 최대 70만원, 5년간 납입. 정부 기여금 + 비과세 혜택으로 실질 수익률이 높습니다.</p>
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
