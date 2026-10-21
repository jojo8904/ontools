
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { CalorieCalculator } from './CalorieCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const CALORIE_GUIDE = [
  { h: 'TDEE란?', p: ['TDEE는 하루 총 에너지 소비량의 추정치입니다. Mifflin-St Jeor 간편식으로 안정 시 대사량을 구하고 선택한 활동 계수를 곱합니다. 원문의 REE를 화면에서는 익숙한 BMR 명칭으로 표시합니다.'] },
  { h: '입력과 활동량 선택', p: ['만 18세 이상 성인의 나이·키·체중을 입력합니다. 운동 빈도뿐 아니라 일하는 동안의 움직임, 이동, 앉아 있는 시간까지 고려하세요. 운동 횟수가 같아도 하루 전체 활동량은 다를 수 있습니다.', '활동 계수 1.2~1.9는 간편 추정용 가정이며 운동으로 소비한 칼로리를 다시 더하지 않습니다.'] },
  { h: '계산 예시', p: ['30세 남성, 175cm, 75kg의 BMR은 1,698.75kcal/일입니다. 가벼운 활동 1.375를 선택하면 TDEE는 2,336kcal/일, 같은 조건의 여성은 2,108kcal/일입니다. 최종 표시에서만 반올림합니다.'] },
  { h: '결과 해석과 제한', p: ['개인별 체성분과 건강 상태를 직접 측정하지 않으므로 실제 소비량과 다를 수 있습니다. 임신·수유·성장기·치료 중인 경우에는 이 간편 계산을 개인 식사 계획에 적용하지 마세요.', '정해진 칼로리를 빼면 정해진 체중이 준다고 보장할 수 없습니다. 섭취량 처방은 제공하지 않으며 건강 상태에 맞는 계획은 전문가와 상의하세요.'] },
]
const CALORIE_FAQ = [
  { q: '활동 수준이 애매해요.', a: '운동 횟수와 함께 평소 직업과 이동량을 비교하세요. 인접한 두 수준을 각각 계산해 추정치가 얼마나 달라지는지 확인할 수 있습니다.' },
  { q: '입력을 바꾸면 다시 계산해야 하나요?', a: '네. 입력이나 활동량이 바뀌면 이전 결과를 지웁니다. 계산 버튼으로 새 조건의 결과를 확인하세요.' },
  { q: '이 수치만큼 꼭 먹어야 하나요?', a: '아니요. 하루 소비량의 대략적인 추정이며 개인별 섭취 권장량이나 의료 조언이 아닙니다.' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/calorie' },
  title: '일일 칼로리(TDEE) 계산기 - ontools',
  description:
    '기초대사량(BMR)과 하루 소비량 추정(TDEE)를 계산하세요. 성별, 나이, 키, 체중, 활동량 기반 Mifflin-St Jeor 공식. 활동량 선택과 추정치의 한계 안내.',
  keywords: [
    'TDEE계산기',
    '칼로리계산기',
    '기초대사량',
    'BMR계산',
    '일일칼로리',
    '다이어트칼로리',
    '활동대사량',
    '체중감량',
    '칼로리권장량',
  ],
  openGraph: {
    title: '일일 칼로리(TDEE) 계산기 - ontools',
    description: '기초대사량과 하루 소비량 추정를 계산하세요.',
    url: 'https://ontools.co.kr/calorie',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CaloriePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">건강</span>
          {' > '}
          <span className="text-foreground font-medium">일일 칼로리(TDEE) 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">일일 칼로리(TDEE) 계산기</h1>
          <p className="text-muted-foreground">
            신체 정보와 평소 활동량으로 하루 에너지 소비량을 추정하세요.
          </p>
        </div>

        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CalorieCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="calorie" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            {/* BMR 계산 공식 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">BMR 계산 공식</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Mifflin-St Jeor 공식</h3>
                  <p>1990년 발표된 안정 시 에너지 소비량 추정식의 간편형입니다. 개인의 실제 대사량을 직접 측정한 값은 아닙니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">남성</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    BMR = 10 x 체중(kg) + 6.25 x 키(cm) - 5 x 나이 + 5
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">여성</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    BMR = 10 x 체중(kg) + 6.25 x 키(cm) - 5 x 나이 - 161
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">TDEE 계산</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    TDEE = BMR x 활동 계수
                  </p>
                  <p className="mt-1">TDEE(Total Daily Energy Expenditure)는 하루 동안 소비하는 총 칼로리로, BMR에 활동량 계수를 곱해 산출합니다.</p>
                </div>
              </div>
            </section>

            {/* 활동량별 계수 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">활동량별 계수</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-3 font-semibold">활동 수준</th>
                        <th className="text-right py-1.5 font-semibold">계수</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-3">비활동 (좌식 생활)</td>
                        <td className="py-1.5 text-right font-medium">x 1.2</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">가벼운 활동 (주 1~3회)</td>
                        <td className="py-1.5 text-right font-medium">x 1.375</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">보통 활동 (주 3~5회)</td>
                        <td className="py-1.5 text-right font-medium">x 1.55</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">활발한 활동 (주 6~7회)</td>
                        <td className="py-1.5 text-right font-medium">x 1.725</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">매우 활발 (하루 2회+)</td>
                        <td className="py-1.5 text-right font-medium">x 1.9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>운동 빈도와 강도, 직업 활동량을 종합적으로 고려하여 자신에게 맞는 수준을 선택하세요.</p>
              </div>
            </section>

            {/* 다이어트 팁 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">추정 결과 활용 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">체중 변화 해석</h3>
                  <p>TDEE는 추정치입니다. 일정한 칼로리 차이가 일정한 감량 속도를 보장하지 않으며, 개인별 섭취 계획은 전문가와 상의하세요.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">식사 계획</h3>
                  <p>이 도구는 영양소 비율이나 개인별 식사량을 정하지 않습니다. 식사 계획에는 건강 상태와 영양 균형을 함께 고려해야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">증량 시 주의점</h3>
                  <p>체중 목표만으로 섭취량을 정하지 마세요. 체성분과 건강 상태에 맞는 계획이 필요하며 이 도구는 개인별 섭취 처방을 제공하지 않습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기록과 비교</h3>
                  <p>생활과 체중 기록을 일정 기간 살펴보고 추정치와 실제 경향을 비교하세요. 단기간의 체중 변동만으로 소비량을 확정하지 마세요.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={CALORIE_GUIDE} hideAd />
        <FaqSection items={CALORIE_FAQ} />
        <RelatedTools current="/calorie" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
