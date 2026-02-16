import type { Metadata } from 'next'
import { WeeklyHolidayPayCalculator } from './WeeklyHolidayPayCalculator'
import { NewsSidebar } from '@/features/news/components/NewsSidebar'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '주휴수당 계산기 - ontools',
  description:
    '시급, 주 근무시간, 근무일수를 입력하면 주휴수당, 주급, 월 예상 급여를 자동 계산합니다. 2026년 최저시급 기준 주휴수당 계산.',
  keywords: [
    '주휴수당계산기',
    '주휴수당',
    '주휴수당계산',
    '알바주급',
    '최저시급',
    '주급계산',
    '알바급여',
    '주휴시간',
    '시급계산기',
  ],
  openGraph: {
    title: '주휴수당 계산기 - ontools',
    description: '주휴수당과 월 예상 급여를 계산하세요.',
    url: 'https://ontools.com/weekly-holiday-pay',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function WeeklyHolidayPayPage() {
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
          <span className="text-foreground font-medium">주휴수당 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">주휴수당 계산기</h1>
          <p className="text-muted-foreground">
            시급과 근무시간을 입력하면 주휴수당, 주급, 월 예상 급여를 계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <WeeklyHolidayPayCalculator />
            <div className="mt-10 space-y-10">
              <NewsSidebar toolId="weekly-holiday-pay" title="관련 뉴스" />
              <YouTubeSection category="weekly-holiday-pay" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 주휴수당 지급 조건 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">주휴수당 지급 조건</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기본 요건</h3>
                  <p>주 15시간 이상 근무하는 근로자에게 유급 주휴일을 부여해야 합니다. 1주 소정근로일을 개근한 경우 주휴수당이 발생합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">적용 대상</h3>
                  <p>정규직, 계약직, 아르바이트 등 고용 형태에 관계없이 주 15시간 이상 근무하면 모두 해당됩니다. 5인 미만 사업장도 포함됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">지급하지 않는 경우</h3>
                  <p>주 15시간 미만 단시간 근로자, 해당 주 결근이 있는 경우(지각/조퇴 제외), 4주 이내의 단기 근로자는 제외됩니다.</p>
                </div>
              </div>
            </section>

            {/* 2026년 최저시급 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">2026년 최저시급</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-600 font-semibold mb-1">시간당</p>
                  <p className="text-2xl font-bold text-blue-900">10,030원</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-3 font-semibold">구분</th>
                        <th className="text-right py-1.5 font-semibold">금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-3">일급 (8시간)</td>
                        <td className="py-1.5 text-right font-medium">80,240원</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">주급 (40시간+주휴)</td>
                        <td className="py-1.5 text-right font-medium">481,440원</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">월급 (209시간)</td>
                        <td className="py-1.5 text-right font-medium">2,096,270원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>209시간 = (주 40시간 + 주휴 8시간) x 365일 / 7일 / 12개월</p>
              </div>
            </section>

            {/* 계산 공식 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">주휴수당 계산 공식</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">주휴시간</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    주휴시간 = 1주 소정근로시간 / 40 x 8
                  </p>
                  <p className="mt-1">주 40시간 이상 근무 시 최대 8시간. 주 20시간 근무 시 주휴시간 4시간.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">주휴수당</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    주휴수당 = 시급 x 주휴시간
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">예시</h3>
                  <p>시급 10,030원, 주 40시간 근무 시:</p>
                  <p>주휴시간 = 40/40 x 8 = 8시간</p>
                  <p>주휴수당 = 10,030 x 8 = 80,240원/주</p>
                </div>
              </div>
            </section>

            {/* 알바 급여 팁 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">알바 급여 체크리스트</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">근로계약서 확인</h3>
                  <p>시급, 근무시간, 주휴수당 포함 여부를 반드시 근로계약서에 명시해야 합니다. 서면 미교부 시 500만원 이하 벌금.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">야간·연장·휴일 가산수당</h3>
                  <p>야간근로(22시~06시) 50% 가산, 연장근로(주 40시간 초과) 50% 가산, 휴일근로 50% 가산(8시간 초과 시 100%).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4대보험</h3>
                  <p>주 15시간 이상, 1개월 이상 근무 시 4대보험 가입 대상입니다. 국민연금·건강보험은 사업주와 반반 부담합니다.</p>
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
