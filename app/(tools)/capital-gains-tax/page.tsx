import type { Metadata } from 'next'
import { CapitalGainsTaxCalculator } from './CapitalGainsTaxCalculator'

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2"><CapitalGainsTaxCalculator /></div>
          <aside className="space-y-6">
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
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
