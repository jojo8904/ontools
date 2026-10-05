
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GpaCalculator } from './GpaCalculator'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"계산 예시: 한 학기 성적","p":["3학점 A+(4.5), 3학점 B0(3.0), 2학점 A0(4.0), 1학점 P(패스)를 들었다면 P는 제외하고 (3 × 4.5 + 3 × 3.0 + 2 × 4.0) ÷ (3 + 3 + 2) = 30.5 ÷ 8 = 3.81입니다.","학점(이수 단위)이 큰 과목이 평점에 더 큰 영향을 줍니다. 1학점 교양에서 C를 받는 것보다 3학점 전공에서 B를 받는 것이 평점을 더 떨어뜨립니다."]},
  {"h":"4.5 만점과 4.3 만점 환산","p":["4.5 만점은 A+ 4.5, A0 4.0, B+ 3.5, B0 3.0, C+ 2.5, C0 2.0, D+ 1.5, D0 1.0입니다. 4.3 만점은 A+ 4.3, A0 4.0, A- 3.7, B+ 3.3, B0 3.0, B- 2.7 식으로 세분화됩니다.","두 체계 사이에 공식 환산 공식은 없습니다. 비례 환산(4.5 만점 평점 × 4.3 ÷ 4.5)을 쓰는 곳도 있고, 등급별 대응표(A+ → A+)를 쓰는 곳도 있어 결과가 0.1~0.2 차이 납니다. 지원하는 대학원·회사가 정한 환산표를 따르세요."]},
  {"h":"100점 환산과 백분위","p":["기업 지원서에서 요구하는 100점 환산은 보통 4.5 만점 기준 4.5 → 100, 4.0 → 95, 3.5 → 90, 3.0 → 85, 2.5 → 80으로 0.1당 1점씩 내려가는 표를 씁니다. 학교마다 표가 다르므로 성적증명서의 환산 점수를 먼저 확인하세요.","백분위(상위 몇 %)는 평점과 별개이며 학교가 발급하는 서류에만 있습니다. 평점 3.8이 어느 학교에서는 상위 20%, 어느 학교에서는 상위 40%일 수 있습니다."]},
  {"h":"재수강·계절학기·전공 평점","p":["재수강하면 보통 이전 성적이 지워지고 새 성적으로 대체되지만, 재수강 성적 상한(A0 또는 B+)을 두는 학교가 많습니다. 성적증명서에 재수강 표시가 남는 학교도 있습니다.","전공 평점은 전공 과목만으로 따로 계산하며 대학원 지원·일부 기업에서 요구합니다. 계산기에 전공 과목만 넣으면 전공 평점이 나옵니다. 계절학기 성적은 일반 학기와 같이 합산됩니다."]},
]

const EXTRA_FAQ = [
  {"q":"P/F 과목은 평점에 들어가나요?","a":"들어가지 않습니다. 이수 학점에는 포함되지만 평점 계산에서는 제외됩니다. 계산기에서는 P/F 과목을 빼고 입력하세요."},
  {"q":"F 받은 과목도 평점에 들어가나요?","a":"네. F는 0점으로 들어가 평점을 크게 떨어뜨립니다. 재수강으로 성적을 대체하면 대부분 F가 지워지므로 졸업 전에 재수강하는 것이 좋습니다."},
  {"q":"학점 3.5면 좋은 편인가요?","a":"4.5 만점 기준 3.5는 100점 환산 약 90점으로 대기업 서류 기준(보통 3.0~3.5 이상)을 넘깁니다. 다만 학교·학과 평균이 높은 곳에서는 중간 수준일 수 있습니다."},
  {"q":"유학 지원용 4.0 만점 환산은요?","a":"미국식 4.0 환산은 A 4.0, B 3.0, C 2.0, D 1.0이며 +/−를 0.3으로 조정하는 방식이 흔합니다. WES 같은 평가기관 환산을 요구하는 학교가 많으니 지원처 안내를 먼저 보세요."},
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/gpa" />
      </main>

      <SiteFooter />
    </div>
  )
}
