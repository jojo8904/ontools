import type { Metadata } from 'next'
import { YouthSavingsCalculator } from './YouthSavingsCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '청년 내일채움공제 계산기 - ontools',
  description: '청년 내일채움공제 만기 수령액을 계산하세요. 2년형/3년형 별 기업·정부 지원금을 포함한 총 수령액 확인.',
  keywords: ['내일채움공제', '청년내일채움공제계산기', '내일채움공제수령액', '청년지원금'],
  openGraph: { title: '청년 내일채움공제 계산기 - ontools', description: '내일채움공제 수령액 계산', url: 'https://ontools.co.kr/youth-savings', siteName: 'ontools', type: 'website' },
}

export default function YouthSavingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">청년 내일채움공제 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">청년 내일채움공제 계산기</h1><p className="text-muted-foreground">내일채움공제 만기 시 총 수령액을 계산하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <YouthSavingsCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="youth-savings" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">가입 대상</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>청년:</strong> 만 15~34세 (병역기간 최대 6년 추가 인정)</p>
                <p><strong>기업:</strong> 중소·중견기업 (5인 이상)</p>
                <p>정규직 채용 후 6개월 이내 가입 가능</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">2년형 vs 3년형</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>2년형:</strong> 본인 300만 + 기업 800만 + 정부 800만 = 1,900만원</p>
                <p><strong>3년형:</strong> 본인 600만 + 기업 1,800만 + 정부 600만 = 3,000만원</p>
                <p>만기 전 중도 퇴사 시 적립금 일부만 수령 가능</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
