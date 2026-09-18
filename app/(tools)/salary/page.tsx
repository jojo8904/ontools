import { calculateSalaryTakeHome } from '@/features/salary/utils'
import { PolicySources } from '@/components/PolicySources'

import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { SalaryCalculator } from './SalaryCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const SALARY_GUIDE = [
  { h: '연봉 실수령액이란?', p: ['연봉 실수령액은 세전 연봉에서 4대보험(국민연금·건강보험·장기요양보험·고용보험)과 소득세·지방소득세를 공제한 뒤 실제로 통장에 입금되는 금액입니다. 채용공고의 연봉과 매달 체감하는 월급이 다른 이유가 바로 이 공제 때문입니다.'] },
  { h: '계산 방법', p: ['총 연봉을 12로 나눈 세전 월급에서 4대보험료(근로자 부담 약 9.4%)와 소득세·지방소득세를 뺍니다. 소득세는 과세표준에 따라 6~45% 누진세율이 적용되며, 부양가족 수에 따른 인적공제로 줄어듭니다.', '예를 들어 연봉 4,000만원(본인 1인 기준)이면 세전 월급 약 333만원에서 공제 후 월 실수령액은 대략 288만원 수준입니다.'] },
  { h: '실수령액을 높이는 팁', p: ['식대·자가운전보조금 등 비과세 수당을 활용하면 과세 대상 금액이 줄어 실수령액이 늘어납니다. 부양가족 등록과 연말정산 시 신용카드·의료비·기부금 공제도 환급에 도움이 됩니다.'] },
  { h: '주의사항', p: ['본 계산기는 2026년 기준 근사치입니다. 실제 금액은 회사 급여 규정, 비과세 항목, 성과급·상여금 지급 방식에 따라 달라질 수 있으니 참고용으로 활용하세요.'] },
]

const SALARY_FAQ = [
  {
    q: '연봉 실수령액은 어떻게 계산되나요?',
    a: '총 연봉에서 4대보험(국민연금·건강보험·장기요양보험·고용보험)과 소득세·지방소득세를 공제한 금액이 실수령액입니다. 본 계산기는 2026년 요율을 기준으로 월 실수령액을 계산합니다.',
  },
  {
    q: '4대보험 요율은 얼마인가요?',
    a: '근로자 부담 기준으로 국민연금 4.75%, 건강보험 3.595%, 장기요양보험(건강보험료의 13.14%), 고용보험 0.9%입니다. 합계 약 9.72% 수준입니다.',
  },
  {
    q: '부양가족 수가 실수령액에 영향을 주나요?',
    a: '네. 부양가족이 많을수록 인적공제가 커져 과세표준이 줄고 소득세가 감소하므로 실수령액이 늘어납니다.',
  },
  {
    q: '계산 결과가 실제 급여와 다른 이유는?',
    a: '식대 등 비과세 수당, 회사별 급여 규정, 연말정산 등에 따라 달라질 수 있습니다. 본 계산기는 기본 과세 기준의 근사치이므로 참고용으로 활용하세요.',
  },
]

export const metadata: Metadata = {
  alternates: { canonical: '/salary' },
  title: '연봉 실수령액 계산기 - ontools',
  description:
    '2026년 최신 세율 적용. 연봉, 부양가족 수 입력으로 세금과 4대보험을 제외한 실수령액을 계산하세요. 최저임금, 연말정산 뉴스 제공.',
  keywords: [
    '연봉계산기',
    '실수령액',
    '세금계산',
    '4대보험',
    '국민연금',
    '건강보험',
    '소득세',
    '월급계산',
  ],
  openGraph: {
    title: '연봉 실수령액 계산기 - ontools',
    description: '연봉에서 세금 제외한 실수령액을 간편하게 계산하세요.',
    url: 'https://ontools.co.kr/salary',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SalaryCalculatorPage() {
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
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">
            연봉 실수령액 계산기
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연봉 실수령액 계산기</h1>
          <p className="text-muted-foreground">
            2026년 최신 세율 적용. 연봉에서 세금과 4대보험을 제외한 실수령액을
            계산합니다.
          </p>
        </div>

        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SalaryCalculator />
              <PolicySources />
            <div className="mt-10">
              <YouTubeSection category="salary" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            {/* 4대보험 요율표 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">2026년 4대보험 요율표</h2>
              <p className="text-sm text-gray-500 mb-3">
                근로자 부담분 기준. 사업주의 고용보험 추가 부담과 산재보험은 제외합니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">항목</th>
                      <th className="text-right py-2 font-semibold">요율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 pr-4">국민연금</td>
                      <td className="py-2 text-right font-medium">4.75%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">건강보험</td>
                      <td className="py-2 text-right font-medium">3.595%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">장기요양보험</td>
                      <td className="py-2 text-right font-medium">0.4724%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">고용보험</td>
                      <td className="py-2 text-right font-medium">0.9%</td>
                    </tr>
                    <tr className="border-t-2 border-gray-200 font-bold">
                      <td className="py-2 pr-4">합계</td>
                      <td className="py-2 text-right">9.7174% (상·하한 전)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 소득세율 구간표 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">소득세율 구간표</h2>
              <p className="text-sm text-gray-500 mb-3">
                2026년 귀속 종합소득세 기준. 과세표준 구간별 세율입니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">과세표준</th>
                      <th className="text-right py-2 font-semibold">세율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 pr-4">1,400만원 이하</td>
                      <td className="py-2 text-right font-medium">6%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">1,400만 ~ 5,000만</td>
                      <td className="py-2 text-right font-medium">15%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">5,000만 ~ 8,800만</td>
                      <td className="py-2 text-right font-medium">24%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">8,800만 ~ 1.5억</td>
                      <td className="py-2 text-right font-medium">35%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">1.5억 ~ 3억</td>
                      <td className="py-2 text-right font-medium">38%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">3억 ~ 5억</td>
                      <td className="py-2 text-right font-medium">40%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">5억 ~ 10억</td>
                      <td className="py-2 text-right font-medium">42%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">10억 초과</td>
                      <td className="py-2 text-right font-medium">45%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 연봉별 실수령액 비교표 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">연봉별 실수령액 비교표</h2>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                2026년 7~12월 · 본인 1인 기준 월 예상 실수령액
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold">연봉</th>
                      <th className="text-right py-2 pr-4 font-semibold">월 실수령액</th>
                      <th className="text-right py-2 font-semibold">공제율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">{[3000,3500,4000,4500,5000,5500,6000,7000,8000,9000,10000].map((salary) => {
        const result = calculateSalaryTakeHome({ annualSalary: salary * 10000, dependents: 0, hasDisability: false })
        return <tr key={salary}><td className="py-2 pr-4">{salary.toLocaleString()}만원</td><td className="py-2 pr-4 text-right">{result.monthlyTakeHome.toLocaleString()}원</td><td className="py-2 text-right">{((1-result.monthlyTakeHome/result.monthlySalary)*100).toFixed(1)}%</td></tr>
      })}</tbody>
                </table>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={SALARY_GUIDE} hideAd />
        <FaqSection items={SALARY_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-1.5">
          <div>
            <span className="text-sm text-gray-600">표로 한눈에 — </span>
            <Link href="/salary-table" className="text-sm font-semibold text-blue-700 hover:underline">2026 연봉 실수령액 표 (2,500만~1억원)</Link>
          </div>
          <div>
            <span className="text-sm text-gray-600">더 알아보기 — </span>
            <Link href="/guide/salary-take-home" className="text-sm font-semibold text-blue-700 hover:underline">연봉 실수령액이 생각보다 적은 이유 (세금·4대보험 구조)</Link>
          </div>
        </div>
        <RelatedTools current="/salary" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
