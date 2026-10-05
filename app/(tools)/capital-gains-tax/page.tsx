
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { CapitalGainsTaxCalculator } from './CapitalGainsTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const CAPITAL_GAINS_GUIDE = [
  { h: '양도소득세란?', p: ['양도소득세는 부동산·주식 등 자산을 팔아 차익(양도차익)이 생겼을 때 그 이익에 부과하는 세금입니다.'] },
  { h: '계산 구조', p: ['양도차익(양도가액 − 취득가액 − 필요경비)에서 기본공제(연 250만원)와 장기보유특별공제 등을 뺀 과세표준에 누진세율을 적용하고, 여기에 지방소득세 10%가 더해집니다. 보유·거주 기간이 길수록 장기보유특별공제로 세금이 줄어듭니다.'] },
  { h: '주의사항', p: ['1세대 1주택 비과세, 다주택자 중과세 등 변수가 많고 부동산 정책에 따라 자주 바뀝니다. 본 계산기는 간이 추정이므로, 실제 신고는 반드시 세무 전문가와 상담하세요.'] },
  {"h":"1세대 1주택 비과세 조건","p":["1세대가 집 한 채를 2년 이상 보유하고 양도가액이 12억 원 이하면 양도소득세가 없습니다. 2017년 8월 이후 조정대상지역에서 취득한 주택은 2년 거주 요건도 채워야 합니다.","양도가액이 12억 원을 넘으면 넘는 비율만큼만 과세합니다. 15억 원에 팔았다면 양도차익의 (15억 − 12억) ÷ 15억 = 20%만 과세 대상이고, 여기에 장기보유특별공제를 적용합니다."]},
  {"h":"장기보유특별공제","p":["3년 이상 보유하면 양도차익에서 보유기간에 따라 공제합니다. 일반 자산은 3년 6%부터 매년 2%씩 늘어 15년 이상 30%입니다.","1세대 1주택(12억 초과분 과세분)은 보유기간 연 4%(최대 40%)와 거주기간 연 4%(최대 40%)를 합쳐 최대 80%까지 공제받습니다. 10년 보유·10년 거주면 과세 대상 차익의 80%가 사라집니다."]},
  {"h":"계산 예시: 5억에 사서 8억에 판 1주택 (12억 이하, 비과세 요건 미충족)","p":["양도차익은 8억 − 5억 − 필요경비(취득세·중개수수료·자본적 지출 약 2,000만 원) = 2억 8,000만 원입니다. 5년 보유 시 장기보유특별공제 10%(2,800만 원)를 빼고 기본공제 250만 원을 빼면 과세표준은 약 2억 4,950만 원입니다.","세율 38%(1.5억~3억 구간), 누진공제 1,994만 원을 적용하면 산출세액은 약 7,487만 원이고 지방소득세 10%를 더해 약 8,236만 원입니다. 비과세 요건을 채웠다면 0원이 되므로 2년 보유·거주 요건이 얼마나 중요한지 알 수 있습니다."]},
  {"h":"단기 양도 중과와 신고 기한","p":["주택을 1년 미만 보유하고 팔면 70%, 2년 미만이면 60%의 단일 세율이 적용됩니다. 토지·상가는 1년 미만 50%, 2년 미만 40%입니다. 분양권은 1년 미만 70%, 그 이상 60%입니다.","양도일(잔금일과 등기일 중 빠른 날)이 속한 달의 말일부터 2개월 안에 예정신고하고 납부해야 합니다. 3월 15일에 팔았다면 5월 31일까지입니다. 기한을 넘기면 무신고 가산세 20%가 붙습니다."]},
]

const CAPITAL_GAINS_FAQ = [
  { q: '양도소득세는 언제 내나요?', a: '부동산·주식 등을 팔아 양도차익(이익)이 생기면 냅니다.' },
  { q: '어떻게 계산되나요?', a: '양도차익에서 기본공제(250만원)·장기보유특별공제 등을 뺀 과세표준에 누진세율을 적용한 뒤 지방소득세 10%를 더합니다.' },
  { q: '계산 결과가 실제와 다를 수 있나요?', a: '1세대1주택 비과세, 다주택 중과 등 변수가 많습니다. 본 계산기는 간이 추정이니 정확한 신고는 세무 전문가와 상담하세요.' },
  {"q":"필요경비로 뭘 인정받나요?","a":"취득세, 법무사·중개 수수료, 발코니 확장·새시 교체 같은 자본적 지출이 인정됩니다. 도배·장판·싱크대 교체 같은 수선비는 안 됩니다. 영수증이나 계좌이체 기록이 있어야 합니다."},
  {"q":"부부 공동명의면 세금이 줄어드나요?","a":"양도차익이 두 사람에게 나뉘어 각자 낮은 세율 구간이 적용되고 기본공제 250만 원도 각각 받습니다. 차익이 클수록 절세 효과가 커서 취득 때 공동명의를 검토할 만합니다."},
  {"q":"일시적 2주택은 비과세인가요?","a":"새 집을 산 뒤 3년 안에 기존 집을 팔면 기존 집은 1주택으로 보아 비과세 요건을 적용합니다. 기존 집 취득 후 1년 이상 지나 새 집을 샀어야 합니다."},
  {"q":"양도세 계산기 결과를 그대로 믿어도 되나요?","a":"비과세·중과·감면 규정이 매우 많고 자주 바뀝니다. 이 계산기는 기본 구조의 추정치이며, 실제 거래 전에는 세무사 상담을 권합니다. 수수료보다 절세액이 훨씬 큰 경우가 많습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/capital-gains-tax' },
  title: '양도소득세 계산기 - ontools',
  description: '부동산 양도소득세를 계산하세요. 장기보유특별공제, 다주택 중과세, 기본공제 250만원 반영.',
  keywords: ['양도소득세계산기', '양도세', '부동산세금', '장기보유특별공제', '다주택양도세'],
  openGraph: { title: '양도소득세 계산기 - ontools', description: '부동산 양도소득세를 계산하세요.', url: 'https://ontools.co.kr/capital-gains-tax', siteName: 'ontools', type: 'website' },
}

export default function CapitalGainsTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-foreground">홈</Link>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">양도소득세 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">양도소득세 계산기</h1><p className="text-muted-foreground">부동산 매도 시 예상 양도소득세를 계산하세요.</p></div>
        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CapitalGainsTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="capital-gains-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">1세대 1주택 비과세</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>2년 이상 보유 (조정대상지역은 2년 거주 필요) 시 양도차익 12억원까지 비과세</p>
                <p>12억 초과분에 대해서만 과세</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">신고 기한</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>양도일(잔금일)이 속하는 달의 말일부터 2개월 이내 예정신고</p>
                <p>미신고 시 무신고가산세 20% + 납부지연가산세 부과</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={CAPITAL_GAINS_GUIDE} hideAd />
        <FaqSection items={CAPITAL_GAINS_FAQ} />
        <RelatedTools current="/capital-gains-tax" />
      </main>
      <SiteFooter />
    </div>
  )
}
