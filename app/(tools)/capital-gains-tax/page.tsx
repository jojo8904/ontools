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
]

const CAPITAL_GAINS_FAQ = [
  { q: '양도소득세는 언제 내나요?', a: '부동산·주식 등을 팔아 양도차익(이익)이 생기면 냅니다.' },
  { q: '어떻게 계산되나요?', a: '양도차익에서 기본공제(250만원)·장기보유특별공제 등을 뺀 과세표준에 누진세율을 적용한 뒤 지방소득세 10%를 더합니다.' },
  { q: '계산 결과가 실제와 다를 수 있나요?', a: '1세대1주택 비과세, 다주택 중과 등 변수가 많습니다. 본 계산기는 간이 추정이니 정확한 신고는 세무 전문가와 상담하세요.' },
]

export const metadata: Metadata = {
  title: '양도소득세 계산기 - ontools',
  description: '부동산 양도소득세를 계산하세요. 장기보유특별공제, 다주택 중과세, 기본공제 250만원 반영.',
  keywords: ['양도소득세계산기', '양도세', '부동산세금', '장기보유특별공제', '다주택양도세'],
  openGraph: { title: '양도소득세 계산기 - ontools', description: '부동산 양도소득세를 계산하세요.', url: 'https://ontools.co.kr/capital-gains-tax', siteName: 'ontools', type: 'website' },
}

export default function CapitalGainsTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">양도소득세 계산기</span></div>
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
              <AdUnit slot="0000000000" />
            </div>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">1세대 1주택 비과세</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>2년 이상 보유 (조정대상지역은 2년 거주 필요) 시 양도차익 12억원까지 비과세</p>
                <p>12억 초과분에 대해서만 과세</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
