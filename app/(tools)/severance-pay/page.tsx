
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { SeveranceCalculator } from './SeveranceCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const SEVERANCE_GUIDE = [
  { h: '퇴직금이란?', p: ['퇴직금은 1년 이상 계속 근무한 근로자가 퇴직할 때 받는 급여로, 근로자퇴직급여보장법에 따라 지급됩니다.'] },
  { h: '계산 방법', p: ['퇴직금은 "1일 평균임금 × 30일 × (재직일수 ÷ 365)"로 계산합니다. 평균임금은 퇴직 직전 3개월간 받은 임금 총액을 그 기간의 날짜 수로 나눈 값으로, 기본급뿐 아니라 정기 상여금·수당이 포함됩니다.'] },
  { h: '지급 요건과 기한', p: ['1주 평균 15시간 이상, 계속근로 1년 이상이면 퇴직금이 발생합니다. 사용자는 퇴직일로부터 14일 이내에 지급해야 하며, 미지급 시 지연이자가 붙을 수 있습니다.'] },
  { h: '주의사항', p: ['평균임금 산정 항목은 회사마다 차이가 있을 수 있습니다. 본 계산기는 근사치이며, 정확한 금액은 회사 또는 노무 전문가에게 확인하세요.'] },
  {"h":"계산 예시: 3년 2개월 근무, 월급 300만 원","p":["퇴직금은 '1일 평균임금 × 30일 × (재직일수 ÷ 365)'입니다. 퇴사 직전 3개월 급여 합계가 900만 원이고 그 기간이 92일이면 1일 평균임금은 900만 ÷ 92 = 97,826원입니다.","재직일수 1,157일(3년 2개월)을 넣으면 97,826 × 30 × (1,157 ÷ 365) = 약 930만 원입니다. 월급의 약 3.1배로, '1년에 한 달치'라는 통념과 맞아떨어집니다.","퇴사 전 3개월 안에 상여금이나 연차수당이 들어가면 평균임금이 올라 퇴직금도 커집니다. 연간 상여금은 3개월분(연 상여 ÷ 12 × 3)만 포함하고, 연차수당도 전년도 발생분의 3개월분을 넣습니다."]},
  {"h":"평균임금이 통상임금보다 적으면 통상임금으로","p":["퇴사 직전 3개월에 무급 휴직이나 결근이 많아 평균임금이 통상임금보다 낮아지면, 법은 통상임금을 기준으로 퇴직금을 계산하도록 정하고 있습니다. 근로자에게 불리하지 않게 하려는 장치입니다.","출산휴가·육아휴직 기간은 평균임금 산정 기간에서 빼고 그 이전 3개월로 계산합니다. 휴직 직후 퇴사해도 퇴직금이 줄지 않습니다."]},
  {"h":"퇴직연금(DC·DB)과 퇴직금의 차이","p":["회사가 확정급여형(DB) 퇴직연금에 가입돼 있으면 받는 금액은 위 퇴직금 계산과 같고, 지급만 금융기관이 합니다. 확정기여형(DC)이면 회사가 매년 연봉의 1/12 이상을 내 계좌에 넣고 운용 수익에 따라 최종 금액이 달라져 이 계산기와 다를 수 있습니다.","55세 이전에 퇴직하면 퇴직금은 IRP 계좌로 받는 것이 원칙이며, 이 경우 퇴직소득세가 바로 부과되지 않고 연금으로 받을 때 30~40% 감면됩니다."]},
  {"h":"퇴직소득세는 얼마나 빠지나","p":["퇴직금에는 일반 소득세가 아니라 퇴직소득세가 붙으며, 근속연수가 길수록 공제가 커져 세금이 매우 적습니다. 3년 근속 930만 원 퇴직금이면 세금이 몇만 원 수준이고, 10년 근속 5,000만 원도 100만 원 안팎입니다.","퇴직금은 퇴사 후 14일 안에 지급해야 하며, 당사자 합의로만 늦출 수 있습니다. 기한을 넘기면 연 20%의 지연이자가 붙습니다."]},
]

const SEVERANCE_FAQ = [
  { q: '퇴직금은 어떻게 계산되나요?', a: '1일 평균임금 × 30일 × (재직일수 ÷ 365)로 계산합니다. 평균임금은 퇴직 직전 3개월간 받은 임금을 그 기간의 일수로 나눈 값입니다.' },
  { q: '퇴직금을 받으려면 얼마나 일해야 하나요?', a: '1주 평균 15시간 이상 근무하고, 계속근로기간이 1년 이상이면 퇴직금이 발생합니다.' },
  { q: '평균임금에는 무엇이 포함되나요?', a: '기본급뿐 아니라 정기적으로 지급된 상여금·수당 등이 포함됩니다. 실제 금액은 회사 산정 기준에 따라 달라질 수 있습니다.' },
  {"q":"1년을 하루 못 채우면 퇴직금이 없나요?","a":"네. 퇴직금은 계속 근로 1년 이상일 때 발생합니다. 364일 근무는 퇴직금이 0원이고 365일이면 약 한 달치가 생기므로, 경계에 있다면 며칠 더 근무하는 것이 유리합니다."},
  {"q":"아르바이트도 퇴직금을 받나요?","a":"주 15시간 이상 일하고 1년 이상 계속 근무했다면 아르바이트, 계약직, 5인 미만 사업장 모두 퇴직금 대상입니다. 주 15시간 미만은 해당되지 않습니다."},
  {"q":"중간정산은 언제 가능한가요?","a":"무주택자의 주택 구입·전세보증금, 본인·가족의 6개월 이상 요양, 파산·회생, 임금피크제 적용 등 법이 정한 사유에만 가능합니다. 단순히 돈이 필요하다는 이유로는 안 됩니다."},
  {"q":"퇴직금을 못 받으면 어떻게 하나요?","a":"고용노동부에 임금체불 진정을 제기할 수 있고, 회사가 지급 능력이 없으면 체당금(대지급금) 제도로 국가가 일정 범위를 먼저 지급합니다. 소멸시효는 3년입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/severance-pay' },
  title: '퇴직금 계산기 - ontools',
  description:
    '입사일, 퇴사일, 월 평균임금을 입력하면 근로기준법에 따른 퇴직금을 계산합니다. 1일 평균임금, 재직일수 기반 정확한 퇴직금 산정.',
  keywords: [
    '퇴직금계산기',
    '퇴직금',
    '퇴직금계산',
    '퇴직금산정',
    '1일평균임금',
    '근로기준법',
    '퇴직금지급',
    '퇴직소득',
  ],
  openGraph: {
    title: '퇴직금 계산기 - ontools',
    description: '입사일, 퇴사일, 월 평균임금으로 퇴직금을 간편하게 계산하세요.',
    url: 'https://ontools.co.kr/severance-pay',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SeverancePayPage() {
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
          <span className="text-foreground font-medium">퇴직금 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">퇴직금 계산기</h1>
          <p className="text-muted-foreground">
            근로기준법 기준. 입사일, 퇴사일, 월 평균임금으로 퇴직금을
            계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SeveranceCalculator />
            <div className="mt-10">
              <YouTubeSection category="severance" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            {/* 퇴직금 계산 방법 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">퇴직금 계산 방법</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기본 공식</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    퇴직금 = 1일 평균임금 x 30일 x (재직일수 / 365)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1일 평균임금 산정</h3>
                  <p>퇴직 전 3개월간 지급된 임금 총액을 해당 기간의 총 일수로 나눕니다. 상여금, 연차수당 등도 포함됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">지급 조건</h3>
                  <p>1년 이상 근무한 근로자에게 지급됩니다. 주 15시간 미만 단시간 근로자는 제외됩니다. 퇴직일로부터 14일 이내에 지급해야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">포함 임금 항목</h3>
                  <p>기본급, 고정 수당, 상여금(정기), 연차수당이 포함됩니다. 실비 변상적 급여(식대, 교통비 등)는 회사 규정에 따라 다를 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* 퇴직소득세 계산법 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">퇴직소득세 계산법</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">계산 순서</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>퇴직급여액에서 근속연수공제를 차감</li>
                    <li>환산급여 산출 (공제 후 금액 x 12 / 근속연수)</li>
                    <li>환산급여에 환산급여공제 적용</li>
                    <li>산출세액 계산 후 근속연수로 환산</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">근속연수공제</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-1.5 pr-3 font-semibold">근속연수</th>
                          <th className="text-right py-1.5 font-semibold">공제액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">5년 이하</td>
                          <td className="py-1.5 text-right">30만원 x 근속연수</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">5~10년</td>
                          <td className="py-1.5 text-right">150만 + 50만 x (근속-5)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">10~20년</td>
                          <td className="py-1.5 text-right">400만 + 80만 x (근속-10)</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">20년 초과</td>
                          <td className="py-1.5 text-right">1,200만 + 120만 x (근속-20)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">절세 팁</h3>
                  <p>퇴직금을 IRP(개인형 퇴직연금)로 이전하면 퇴직소득세가 이연되며, 연금으로 수령 시 퇴직소득세의 60~70%만 부과됩니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={SEVERANCE_GUIDE} hideAd />
        <FaqSection items={SEVERANCE_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/severance-pay" className="text-sm font-semibold text-blue-700 hover:underline">퇴직금 계산법 — 평균임금·상여금 포함 여부까지</Link>
        </div>
        <RelatedTools current="/severance-pay" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
