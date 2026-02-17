import type { Metadata } from 'next'
import { UsedCarTaxCalculator } from './UsedCarTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '중고차 취등록세 계산기 - ontools',
  description: '중고차 구매 시 취등록세를 계산하세요. 승용차 7%, 승합/화물 5%, 장애인 감면 지원.',
  keywords: ['중고차취등록세', '자동차취득세', '차량등록세', '중고차세금', '취등록세계산기'],
  openGraph: { title: '중고차 취등록세 계산기 - ontools', description: '중고차 취등록세를 계산하세요.', url: 'https://ontools.co.kr/used-car-tax', siteName: 'ontools', type: 'website' },
}

export default function UsedCarTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">중고차 취등록세 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">중고차 취등록세 계산기</h1><p className="text-muted-foreground">중고차 구매 시 필요한 취등록세를 간편하게 계산하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <UsedCarTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="used-car-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">취등록세 세율</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>승용차:</strong> 취득세 7%</p>
                <p><strong>승합차/화물차:</strong> 취득세 5%</p>
                <p><strong>경차 (1,000cc 이하):</strong> 취득세 4% (감면 적용 시 면제)</p>
                <p><strong>장애인:</strong> 취득세 면제 (2,000cc 이하 비영업용)</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">등록 시 필요 서류</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>매매계약서, 자동차등록증, 자동차세 완납증명서, 보험가입증명서, 신분증</p>
                <p>관할 구청 차량등록사업소에서 이전등록 진행</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
