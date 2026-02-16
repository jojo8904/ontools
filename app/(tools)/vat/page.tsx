import type { Metadata } from 'next'
import { VatCalculator } from './VatCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '부가세(VAT) 계산기 - ontools',
  description:
    '공급가액에서 부가세와 합계를 계산하거나, 합계금액에서 공급가액과 부가세를 역산합니다. 10% 일반세율, 영세율(0%) 지원.',
  keywords: [
    '부가세계산기',
    'VAT계산기',
    '부가가치세',
    '공급가액',
    '부가세역산',
    '세금계산서',
    '부가세10%',
    '영세율',
    '부가세신고',
  ],
  openGraph: {
    title: '부가세(VAT) 계산기 - ontools',
    description: '부가세 계산 및 역산을 간편하게 하세요.',
    url: 'https://ontools.com/vat',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function VatPage() {
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
          <span className="text-foreground font-medium">부가세(VAT) 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">부가세(VAT) 계산기</h1>
          <p className="text-muted-foreground">
            공급가액에서 부가세를 계산하거나, 합계금액에서 공급가액을 역산하세요.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <VatCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="vat" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 부가세 신고 기간 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">부가세 신고 기간</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">일반과세자</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-1.5 pr-3 font-semibold">구분</th>
                          <th className="text-left py-1.5 font-semibold">과세기간</th>
                          <th className="text-right py-1.5 font-semibold">신고기한</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">1기 확정</td>
                          <td className="py-1.5">1~6월</td>
                          <td className="py-1.5 text-right font-medium">7/25</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">2기 확정</td>
                          <td className="py-1.5">7~12월</td>
                          <td className="py-1.5 text-right font-medium">1/25</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-1">예정신고(4/25, 10/25)는 법인 또는 직전기 납부세액 기준 개인사업자 대상입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">간이과세자</h3>
                  <p>연 1회 신고. 과세기간 1~12월, 신고기한 다음 해 1월 25일까지.</p>
                </div>
              </div>
            </section>

            {/* 간이과세자 vs 일반과세자 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">간이과세자 vs 일반과세자</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-2 font-semibold">구분</th>
                        <th className="text-left py-1.5 px-1 font-semibold text-xs">일반</th>
                        <th className="text-left py-1.5 pl-1 font-semibold text-xs">간이</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-2">매출 기준</td>
                        <td className="py-1.5 px-1 text-xs">제한 없음</td>
                        <td className="py-1.5 pl-1 text-xs">연 1.04억 미만</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">세금계산서</td>
                        <td className="py-1.5 px-1 text-xs">발행 의무</td>
                        <td className="py-1.5 pl-1 text-xs">4,800만 이상 발행</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">세율</td>
                        <td className="py-1.5 px-1 text-xs">10%</td>
                        <td className="py-1.5 pl-1 text-xs">1.5~4%</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">매입세액공제</td>
                        <td className="py-1.5 px-1 text-xs">전액 공제</td>
                        <td className="py-1.5 pl-1 text-xs">업종별 0.5% 공제</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">신고 횟수</td>
                        <td className="py-1.5 px-1 text-xs">연 2회</td>
                        <td className="py-1.5 pl-1 text-xs">연 1회</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>연 매출 4,800만원 미만 간이과세자는 부가세 납부 면제 (신고는 필요).</p>
              </div>
            </section>

            {/* 매입세액공제 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">매입세액공제 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">공제 원리</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    납부세액 = 매출세액 - 매입세액
                  </p>
                  <p className="mt-1">사업과 관련하여 발생한 매입에 대해 부담한 부가세를 매출세액에서 차감합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">공제 가능</h3>
                  <p>세금계산서·신용카드·현금영수증으로 증빙된 사업용 매입. 원재료, 사무용품, 임차료, 차량유지비 등.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">공제 불가</h3>
                  <p>비영업용 소형승용차, 접대비, 사업과 무관한 지출, 간이영수증(3만원 초과), 면세 매입.</p>
                </div>
              </div>
            </section>

            {/* 전자세금계산서 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">전자세금계산서 발행</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">의무 발행 대상</h3>
                  <p>모든 법인사업자, 직전 연도 공급가액 합계 1억원 이상 개인사업자는 전자세금계산서를 의무적으로 발행해야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">발행 기한</h3>
                  <p>공급일이 속하는 달의 다음 달 10일까지 발행. 기한 초과 시 공급가액의 1% 가산세 부과.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">발행 방법</h3>
                  <p>국세청 홈택스(hometax.go.kr), 전자세금계산서 ASP, ERP 시스템을 통해 발행 가능합니다. 공인인증서 또는 보안카드 필요.</p>
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
