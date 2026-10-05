
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { IncomeTaxCalculator } from './IncomeTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const INCOME_TAX_GUIDE = [
  { h: '종합소득세란?', p: ['종합소득세는 1년간 발생한 종합소득(사업·프리랜서·임대·이자·배당·근로 외 소득 등)을 합산해 부과하는 세금으로, 매년 5월에 신고·납부합니다.'] },
  { h: '세율과 계산 구조', p: ['과세표준(소득에서 각종 공제를 뺀 금액)에 6%~45%의 누진세율을 적용하고, 산출세액에 지방소득세 10%가 더해집니다. 누진공제액을 빼는 방식으로 간편하게 계산할 수 있습니다.'] },
  { h: '절세 팁', p: ['필요경비를 빠짐없이 반영하고, 소득공제·세액공제(연금저축, 노란우산공제 등)를 활용하면 세금을 줄일 수 있습니다. 5월 신고를 놓치면 무신고가산세가 부과되니 기한을 지키세요.'] },
  { h: '주의사항', p: ['본 계산기는 과세표준 기준 근사치입니다. 실제 세액은 소득 종류·공제 항목에 따라 달라지므로 정확한 신고는 홈택스 또는 세무사를 통해 확인하세요.'] },
  {"h":"계산 예시: 프리랜서 연 소득 5,000만 원","p":["종합소득세는 수입에서 경비를 뺀 소득금액에 매깁니다. 연 수입 5,000만 원에 경비 1,500만 원을 인정받으면 소득금액 3,500만 원이고, 본인 기본공제 150만 원과 국민연금 납부액 등을 빼면 과세표준이 약 3,200만 원입니다.","1,400만 원 이하 6%, 5,000만 원 이하 15% 구간이므로 산출세액은 3,200만 × 15% − 126만(누진공제) = 354만 원입니다. 여기에 표준세액공제 7만 원 등을 빼고 지방소득세 10%를 더하면 약 380만 원이 최종 부담입니다.","이미 3.3%로 원천징수된 165만 원(5,000만 × 3.3%)은 기납부세액으로 빼므로, 5월에 추가로 내는 금액은 약 215만 원입니다. 경비를 더 인정받을수록 이 금액이 줄어듭니다."]},
  {"h":"경비 인정: 장부 vs 경비율","p":["장부를 쓰지 않는 소규모 사업자는 업종별 단순경비율이나 기준경비율로 경비를 추정합니다. 단순경비율은 수입이 적은 사업자(전년 수입 2,400만 원 미만 등 업종별 기준)에게 적용되며 경비율이 높아 유리합니다.","수입이 기준을 넘으면 기준경비율로 바뀌어 인정 경비가 크게 줄어듭니다. 이때부터는 간편장부라도 쓰는 것이 세금을 줄이는 길입니다. 장부를 쓰면 실제 지출을 전부 경비로 넣을 수 있고 기장세액공제도 받습니다."]},
  {"h":"신고 기간과 방법","p":["매년 5월 1일부터 31일까지 전년도 소득을 홈택스에서 신고합니다. 성실신고확인 대상 사업자는 6월 30일까지입니다. 국세청이 미리 채워주는 '모두채움' 신고서가 오면 내용을 확인하고 제출만 하면 됩니다.","근로소득만 있는 직장인은 연말정산으로 끝나므로 신고하지 않습니다. 직장인이라도 부업 소득, 임대소득, 금융소득 2,000만 원 초과가 있으면 5월에 합산 신고해야 합니다."]},
  {"h":"안 내거나 늦게 내면","p":["무신고 가산세는 납부할 세액의 20%, 납부 지연 이자는 하루 0.022%(연 약 8%)입니다. 기한 후 1개월 안에 신고하면 무신고 가산세의 50%를 감면받습니다.","5월에 한꺼번에 내기 어렵다면 납부할 세액이 1,000만 원을 넘을 때 2개월 분납할 수 있습니다. 신고는 기한 안에 하고 납부만 나누는 것이 가산세를 피하는 방법입니다."]},
]

const INCOME_TAX_FAQ = [
  { q: '종합소득세는 누가 내나요?', a: '사업·프리랜서·임대·금융 등 종합소득이 있는 사람이 매년 5월에 신고·납부합니다.' },
  { q: '세율은 어떻게 되나요?', a: '과세표준에 따라 6%~45%의 누진세율이 적용되며, 여기에 지방소득세 10%가 추가됩니다.' },
  { q: '계산 결과가 실제와 다를 수 있나요?', a: '각종 소득공제·세액공제·필요경비에 따라 달라집니다. 본 계산기는 과세표준 기준 근사치이니 참고용으로 활용하세요.' },
  {"q":"직장인인데 부업 수입이 300만 원 있어요. 신고해야 하나요?","a":"기타소득이면 300만 원 이하는 분리과세 선택이 가능하지만, 사업소득(지속적인 부업)이면 금액과 관계없이 5월에 근로소득과 합산 신고해야 합니다. 합산하면 세율 구간이 올라갈 수 있습니다."},
  {"q":"3.3% 떼인 프리랜서는 환급을 받나요?","a":"경비와 공제를 반영한 결정세액이 원천징수된 3.3%보다 적으면 차액을 환급받습니다. 연 수입 2,000만 원 안팎의 프리랜서는 환급이 나오는 경우가 많습니다. 신고를 안 하면 환급도 없습니다."},
  {"q":"종합소득세와 지방소득세는 따로 내나요?","a":"홈택스에서 종합소득세를 신고하면 지방소득세(종합소득세의 10%)는 위택스로 자동 연계되어 함께 신고·납부합니다. 두 번 신고할 필요는 없지만 납부는 각각 이루어집니다."},
  {"q":"금융소득(이자·배당)도 종합소득에 들어가나요?","a":"연 2,000만 원 이하는 15.4% 원천징수로 끝나고, 2,000만 원을 넘으면 넘는 금액이 다른 소득과 합산되어 누진세율이 적용됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/income-tax' },
  title: '종합소득세 계산기 - ontools',
  description: '종합소득세를 간편하게 계산하세요. 2026년 기준 세율 구간 적용, 소득공제 반영, 지방소득세 포함.',
  keywords: ['종합소득세계산기', '소득세', '세율구간', '종소세', '소득세신고'],
  openGraph: {
    title: '종합소득세 계산기 - ontools',
    description: '종합소득세를 간편하게 계산하세요.',
    url: 'https://ontools.co.kr/income-tax',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function IncomeTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <span className="text-foreground">급여/세금</span>{' > '}
          <span className="text-foreground font-medium">종합소득세 계산기</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">종합소득세 계산기</h1>
          <p className="text-muted-foreground">총 수입금액과 공제액을 입력하면 예상 종합소득세를 계산합니다.</p>
        </div>
        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <IncomeTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="income-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">종합소득세 세율 (2025)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-1.5 pr-2 font-semibold">과세표준</th>
                      <th className="text-right py-1.5 font-semibold">세율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr><td className="py-1.5 pr-2">~1,400만</td><td className="py-1.5 text-right">6%</td></tr>
                    <tr><td className="py-1.5 pr-2">~5,000만</td><td className="py-1.5 text-right">15%</td></tr>
                    <tr><td className="py-1.5 pr-2">~8,800만</td><td className="py-1.5 text-right">24%</td></tr>
                    <tr><td className="py-1.5 pr-2">~1.5억</td><td className="py-1.5 text-right">35%</td></tr>
                    <tr><td className="py-1.5 pr-2">~3억</td><td className="py-1.5 text-right">38%</td></tr>
                    <tr><td className="py-1.5 pr-2">~5억</td><td className="py-1.5 text-right">40%</td></tr>
                    <tr><td className="py-1.5 pr-2">~10억</td><td className="py-1.5 text-right">42%</td></tr>
                    <tr><td className="py-1.5 pr-2">10억 초과</td><td className="py-1.5 text-right">45%</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">신고 기간</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>매년 5월 1일 ~ 5월 31일 (성실신고확인 대상자는 6월 30일)</p>
                <p>홈택스(hometax.go.kr)에서 전자신고 가능</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={INCOME_TAX_GUIDE} hideAd />
        <FaqSection items={INCOME_TAX_FAQ} />
        <RelatedTools current="/income-tax" />
      </main>
      <SiteFooter />
    </div>
  )
}
