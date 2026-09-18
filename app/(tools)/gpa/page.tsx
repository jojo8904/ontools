
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GpaCalculator } from './GpaCalculator'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '학점(GPA) 계산 방법',
    p: [
      '평점(GPA)은 각 과목의 (이수학점 × 성적점수)를 모두 더한 뒤, 평점에 반영되는 총 이수학점으로 나눈 값입니다.',
      '예: 3학점 A0(4.0) + 3학점 B+(3.5)라면 (3×4.0 + 3×3.5) ÷ 6 = 3.75가 됩니다.',
    ],
  },
  {
    h: '4.5 만점과 4.3 만점',
    p: [
      '국내 대학은 대부분 4.5 만점(A+=4.5)이지만, 일부 대학은 4.3 만점(A+=4.3, A-·B- 세분화)을 씁니다. 위에서 학교에 맞는 기준을 선택하세요.',
      'P(Pass)로 이수한 과목은 학점(이수학점)에는 포함되지만 평점 계산에서는 제외되는 것이 일반적입니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '이번 학기 예상 성적을 넣어 학기 평점을 미리 가늠하거나, 전 학기 성적을 넣어 누적 평점을 확인할 수 있습니다.',
      '장학금·대학원·취업 기준 학점(예: 3.5 이상)에 도달하려면 남은 과목에서 어떤 성적이 필요한지 시뮬레이션해 보세요.',
      '학교마다 등급별 점수·P 처리 방식이 조금씩 다르니, 공식 성적은 학교 포털 기준으로 확인하세요.',
    ],
  },
]

export const metadata: Metadata = {
  alternates: { canonical: '/gpa' },
  title: '학점 계산기 (GPA · 4.5/4.3 만점) - ontools',
  description:
    '과목별 학점과 성적을 넣으면 평점(GPA)을 계산합니다. 4.5·4.3 만점 지원, P(Pass) 과목 처리, 학기·누적 평점 시뮬레이션.',
  keywords: ['학점 계산기', 'gpa 계산기', '평점 계산', '4.5 만점 학점', '대학 학점 계산', '학점 평점', '학기 평점'],
  openGraph: {
    title: '학점 계산기 (GPA · 4.5/4.3 만점) - ontools',
    description: '과목별 성적으로 평점 계산. 4.5·4.3 만점 지원.',
    url: 'https://ontools.co.kr/gpa',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function GpaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">생활·유틸</span>
          {' > '}
          <span className="text-foreground font-medium">학점 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">학점 계산기</h1>
          <p className="text-muted-foreground">
            과목별 학점·성적을 넣으면 평점(GPA)을 계산합니다. 4.5·4.3 만점 지원.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <GpaCalculator />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">성적 점수표 (4.5 만점)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="py-1.5 pr-4">A+</td><td className="py-1.5 text-right font-medium">4.5</td><td className="py-1.5 pl-6 pr-4">C+</td><td className="py-1.5 text-right font-medium">2.5</td></tr>
                    <tr><td className="py-1.5 pr-4">A0</td><td className="py-1.5 text-right font-medium">4.0</td><td className="py-1.5 pl-6 pr-4">C0</td><td className="py-1.5 text-right font-medium">2.0</td></tr>
                    <tr><td className="py-1.5 pr-4">B+</td><td className="py-1.5 text-right font-medium">3.5</td><td className="py-1.5 pl-6 pr-4">D+</td><td className="py-1.5 text-right font-medium">1.5</td></tr>
                    <tr><td className="py-1.5 pr-4">B0</td><td className="py-1.5 text-right font-medium">3.0</td><td className="py-1.5 pl-6 pr-4">D0</td><td className="py-1.5 text-right font-medium">1.0</td></tr>
                    <tr><td className="py-1.5 pr-4">F</td><td className="py-1.5 text-right font-medium">0</td><td className="py-1.5 pl-6 pr-4">P</td><td className="py-1.5 text-right font-medium">평점 제외</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">장학금 기준 확인</h3>
                  <p>성적 장학금 기준 평점에 도달하는지 미리 계산합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">취업·대학원 지원</h3>
                  <p>지원 자격 학점 요건을 채우는지 확인합니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/gpa" />
      </main>

      <SiteFooter />
    </div>
  )
}
