import type { Metadata } from 'next'
import { UnemploymentCalculator } from './UnemploymentCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const UNEMPLOYMENT_GUIDE = [
  { h: '실업급여란?', p: ['실업급여(구직급여)는 고용보험에 가입한 근로자가 비자발적으로 실직했을 때, 재취업을 준비하는 기간 동안 생계를 지원하는 제도입니다.'] },
  { h: '얼마를 얼마 동안 받나요?', p: ['1일 지급액은 퇴직 전 평균임금의 60%이며, 1일 상한액과 하한액이 적용됩니다. 받는 기간(소정급여일수)은 나이와 고용보험 가입기간에 따라 120일에서 270일까지입니다.'] },
  { h: '신청 조건과 방법', p: ['비자발적 이직이어야 하고, 워크넷 구직 등록 후 거주지 고용센터에 수급 신청을 합니다. 이후 적극적인 재취업 활동을 증명해야 계속 받을 수 있습니다. 자발적 퇴사는 원칙적으로 제외되나 정당한 사유가 인정되면 예외가 됩니다.'] },
  { h: '주의사항', p: ['상한·하한액과 소정급여일수 기준은 매년 바뀔 수 있습니다. 본 계산기는 추정치이며 정확한 수급액은 고용센터에서 확인하세요.'] },
]

const UNEMPLOYMENT_FAQ = [
  { q: '실업급여는 얼마를 받나요?', a: '퇴직 전 평균임금의 60%를 소정급여일수만큼 받습니다. 단 1일 상한액과 하한액이 적용됩니다.' },
  { q: '며칠 동안 받을 수 있나요?', a: '연령과 고용보험 가입기간에 따라 120일~270일입니다.' },
  { q: '누구나 받을 수 있나요?', a: '비자발적 이직 등 수급요건을 충족하고 적극적으로 재취업 활동을 해야 합니다. 자발적 퇴사는 원칙적으로 제외됩니다.' },
]

export const metadata: Metadata = {
  title: '실업급여 계산기 - ontools',
  description:
    '나이, 고용보험 가입기간, 퇴직 전 월 평균임금을 입력하면 1일 구직급여, 소정급여일수, 총 예상 수급액을 계산합니다. 2026년 상한액/하한액 적용.',
  keywords: [
    '실업급여계산기',
    '구직급여',
    '실업급여',
    '소정급여일수',
    '고용보험',
    '실업급여조건',
    '실업급여금액',
    '실업급여신청',
    '구직급여계산',
  ],
  openGraph: {
    title: '실업급여 계산기 - ontools',
    description: '실업급여(구직급여) 예상 수급액을 계산하세요.',
    url: 'https://ontools.com/unemployment',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function UnemploymentPage() {
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
          <span className="text-foreground font-medium">실업급여 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">실업급여 계산기</h1>
          <p className="text-muted-foreground">
            고용보험 가입기간과 퇴직 전 임금을 기반으로 구직급여 예상 수급액을 계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <UnemploymentCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="unemployment" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 수급 조건 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">실업급여 수급 조건</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기본 요건 (모두 충족)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>고용보험 피보험기간 180일(약 6개월) 이상</li>
                    <li>비자발적 퇴사 (권고사직, 계약만료 등)</li>
                    <li>근로 의사와 능력이 있으나 취업하지 못한 상태</li>
                    <li>적극적인 재취업 활동 (구직활동 인정)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">피보험기간 산정</h3>
                  <p>이직일 이전 18개월(초단시간 근로자 24개월) 중 고용보험에 가입하여 실제 근무한 날이 180일 이상이어야 합니다.</p>
                </div>
              </div>
            </section>

            {/* 비자발적 퇴사 기준 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">비자발적 퇴사 기준</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">수급 가능</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>권고사직, 해고, 정리해고</li>
                    <li>계약기간 만료 (갱신 거절 포함)</li>
                    <li>임금체불, 최저임금 미달</li>
                    <li>근로조건 위반 (근무지 변경 등)</li>
                    <li>직장 내 괴롭힘, 성희롱</li>
                    <li>사업장 이전 (통근 곤란)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">수급 불가</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>단순 자발적 퇴사 (이직, 개인 사유)</li>
                    <li>중대한 귀책사유로 해고</li>
                    <li>정당한 사유 없는 장기 결근</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 소정급여일수 표 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">소정급여일수</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-2 font-semibold">가입기간</th>
                        <th className="text-center py-1.5 px-1 font-semibold text-xs">50세 미만</th>
                        <th className="text-center py-1.5 pl-1 font-semibold text-xs">50세 이상</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-2">1년 미만</td>
                        <td className="py-1.5 text-center font-medium">120일</td>
                        <td className="py-1.5 text-center font-medium">120일</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">1~3년</td>
                        <td className="py-1.5 text-center font-medium">150일</td>
                        <td className="py-1.5 text-center font-medium">180일</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">3~5년</td>
                        <td className="py-1.5 text-center font-medium">180일</td>
                        <td className="py-1.5 text-center font-medium">210일</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">5~10년</td>
                        <td className="py-1.5 text-center font-medium">210일</td>
                        <td className="py-1.5 text-center font-medium">240일</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2">10년 이상</td>
                        <td className="py-1.5 text-center font-medium">240일</td>
                        <td className="py-1.5 text-center font-medium">270일</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>50세 이상 또는 장애인은 동일 가입기간 대비 30일 더 수급 가능합니다 (1년 미만 제외).</p>
              </div>
            </section>

            {/* 신청 절차 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">실업급여 신청 절차</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <ol className="list-decimal list-inside space-y-2">
                  <li><span className="font-semibold text-gray-900">워크넷 구직 등록</span> — 워크넷(work.go.kr) 회원가입 후 구직 등록</li>
                  <li><span className="font-semibold text-gray-900">수급자격 신청</span> — 거주지 관할 고용센터 방문 또는 온라인 신청</li>
                  <li><span className="font-semibold text-gray-900">수급자격 교육</span> — 온라인 교육 이수 (약 1시간)</li>
                  <li><span className="font-semibold text-gray-900">구직급여 수급</span> — 1~4주 단위 실업인정일에 고용센터 출석</li>
                  <li><span className="font-semibold text-gray-900">재취업 활동</span> — 매 실업인정 기간마다 구직활동 실적 제출</li>
                </ol>
                <div className="bg-blue-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-700">
                    퇴직 후 12개월 이내에 신청해야 합니다. 기한 초과 시 남은 급여일수가 소멸됩니다.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={UNEMPLOYMENT_GUIDE} />
        <FaqSection items={UNEMPLOYMENT_FAQ} />
        <RelatedTools current="/unemployment" />
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
