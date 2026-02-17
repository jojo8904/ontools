import type { Metadata } from 'next'
import { WaterIntakeCalculator } from './WaterIntakeCalculator'

export const metadata: Metadata = {
  title: '물 섭취량 계산기 - ontools',
  description: '체중과 활동량에 맞는 하루 권장 물 섭취량을 계산하세요.',
  keywords: ['물섭취량계산기', '하루물섭취량', '수분섭취', '물마시기', '건강물섭취'],
  openGraph: { title: '물 섭취량 계산기 - ontools', description: '하루 권장 물 섭취량을 계산하세요.', url: 'https://ontools.co.kr/water-intake', siteName: 'ontools', type: 'website' },
}

export default function WaterIntakePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">건강</span>{' > '}<span className="text-foreground font-medium">물 섭취량 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">물 섭취량 계산기</h1><p className="text-muted-foreground">체중과 활동량에 맞는 하루 권장 물 섭취량을 확인하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2"><WaterIntakeCalculator /></div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">물 섭취 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>기상 후 공복에 물 1잔(250ml)을 마시면 신진대사 활성화에 도움됩니다.</p>
                <p>한 번에 많이 마시기보다 1~2시간 간격으로 나눠 마시는 것이 흡수에 효과적입니다.</p>
                <p>카페인 음료(커피, 차)는 이뇨작용이 있어 물 섭취량에 포함하지 않는 것이 좋습니다.</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">탈수 증상</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>초기:</strong> 갈증, 소변 색 진해짐, 입 마름</p>
                <p><strong>중기:</strong> 두통, 피로감, 집중력 저하</p>
                <p><strong>심각:</strong> 어지러움, 심박수 증가, 혼란</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
