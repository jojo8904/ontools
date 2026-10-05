
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
  { h: 'TDEE(하루 총 에너지 소비량)란?', p: ['TDEE는 하루 동안 소비하는 총 칼로리로, 기초대사량(BMR)에 활동량을 반영한 값입니다. 다이어트나 체중 증량 시 하루에 얼마나 먹어야 하는지의 기준이 됩니다.'] },
  { h: '계산 방법', p: ['먼저 Mifflin-St Jeor 공식으로 기초대사량을 구합니다(남성: 10×체중 + 6.25×키 − 5×나이 + 5, 여성은 마지막에 −161). 여기에 활동 계수(거의 안 움직임 1.2 ~ 매우 활동적 1.9)를 곱하면 TDEE가 됩니다.'] },
  { h: '다이어트·증량 활용', p: ['체중 감량은 보통 TDEE보다 약 500kcal 적게 먹어 주당 0.5kg 감량을 목표로 합니다. 증량은 반대로 약간의 잉여 칼로리를 섭취합니다. 충분한 단백질 섭취와 근력운동을 병행하면 효과적입니다.'] },
  { h: '주의사항', p: ['계산값은 추정치입니다. 개인의 근육량·대사·건강 상태에 따라 실제 필요량은 다를 수 있으니, 무리한 감량보다 꾸준한 관리를 권장합니다.'] },
  {"h":"계산 예시: 30세 남성, 175cm, 75kg, 주 2회 운동","p":["기초대사량(Mifflin-St Jeor)은 10 × 75 + 6.25 × 175 − 5 × 30 + 5 = 1,699kcal입니다. 활동계수 1.375(가벼운 활동)를 곱하면 하루 소비량은 약 2,336kcal입니다.","감량 목표라면 여기서 500kcal을 뺀 약 1,836kcal, 유지는 2,336kcal, 증량은 300~500kcal을 더한 2,636~2,836kcal이 하루 섭취 목표입니다. 같은 조건의 여성은 기초대사량 1,533kcal, 소비량 약 2,108kcal입니다."]},
  {"h":"활동계수 고르는 기준","p":["1.2는 사무직이고 운동을 거의 안 하는 경우입니다. 1.375는 주 1~3회 가벼운 운동(걷기·요가), 1.55는 주 3~5회 땀 나는 운동, 1.725는 거의 매일 고강도 운동이나 육체노동, 1.9는 하루 2회 훈련하는 운동선수 수준입니다.","대부분의 사람이 자기 활동량을 한 단계 높게 잡습니다. 헬스장을 주 3회 가더라도 하루 대부분을 앉아 있으면 1.375가 현실적입니다. 애매하면 낮은 쪽을 고르고 2주 뒤 체중 변화로 보정하세요."]},
  {"h":"칼로리 안에서 탄수화물·단백질·지방 나누기","p":["감량 중에는 단백질을 체중 1kg당 1.6~2.2g(75kg이면 120~165g, 480~660kcal) 확보해 근육 손실을 막습니다. 지방은 총 칼로리의 20~30%, 나머지를 탄수화물로 채웁니다.","1,836kcal 감량 식단 예시는 단백질 130g(520kcal), 지방 55g(495kcal), 탄수화물 205g(820kcal)입니다. 단백질은 1g당 4kcal, 탄수화물 4kcal, 지방 9kcal로 환산합니다."]},
  {"h":"정체기가 오는 이유와 대응","p":["체중이 줄면 기초대사량과 활동 소비량이 함께 줄어 같은 식단으로는 더 이상 빠지지 않습니다. 5kg 감량마다 TDEE를 다시 계산하면 보통 100~150kcal씩 목표가 내려갑니다.","운동 앱의 소모 칼로리는 실제보다 20~40% 높게 나오는 경우가 많습니다. 걷기 30분은 100~150kcal, 달리기 30분은 300kcal 안팎이므로, 운동했다고 그만큼 더 먹으면 감량이 멈춥니다. 기초대사량 아래로 먹는 극단적 식단은 근육 손실과 요요를 부르니 피하세요."]},
]

const CALORIE_FAQ = [
  { q: 'TDEE가 무엇인가요?', a: '하루 총 에너지 소비량입니다. 기초대사량(BMR)에 활동량 계수를 곱해 구합니다.' },
  { q: '기초대사량은 어떻게 구하나요?', a: 'Mifflin-St Jeor 공식을 사용합니다. (남성: 10×체중 + 6.25×키 − 5×나이 + 5, 여성: 마지막에 −161)' },
  { q: '다이어트하려면 얼마나 먹어야 하나요?', a: '보통 TDEE보다 약 500kcal 적게 먹으면 주당 약 0.5kg 감량을 목표로 할 수 있습니다. 과도한 감량은 권장되지 않습니다.' },
  {"q":"하루 1,200kcal로 먹으면 더 빨리 빠지나요?","a":"단기간은 빠지지만 근육이 함께 빠지고 기초대사량이 떨어져 요요가 옵니다. 성인 여성 1,200kcal, 남성 1,500kcal 아래로는 내려가지 않는 것이 일반적인 권고이며, TDEE에서 500kcal 빼는 수준이 지속 가능합니다."},
  {"q":"기초대사량과 TDEE의 차이가 뭔가요?","a":"기초대사량(BMR)은 누워만 있어도 쓰는 칼로리이고, TDEE는 여기에 일상 활동과 운동을 더한 하루 총 소비량입니다. 먹는 양의 기준은 TDEE입니다."},
  {"q":"치팅데이는 괜찮나요?","a":"주간 총량 안에서 하루 정도 더 먹는 것은 괜찮습니다. 하루 500kcal 적자를 6일 유지하고 하루 1,000kcal 초과하면 주간 적자는 2,000kcal로 여전히 감량 방향입니다. 폭식으로 이어지지 않게 양을 정해 두세요."},
  {"q":"근육을 키우면서 살을 뺄 수 있나요?","a":"운동 초보자나 체지방이 많은 경우에는 가능합니다. TDEE 근처로 먹으면서 단백질을 충분히 섭취하고 근력 운동을 하면 체중은 비슷해도 체지방이 줄고 근육이 늡니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/calorie' },
  title: '일일 칼로리(TDEE) 계산기 - ontools',
  description:
    '기초대사량(BMR)과 일일 권장 칼로리(TDEE)를 계산하세요. 성별, 나이, 키, 체중, 활동량 기반 Mifflin-St Jeor 공식. 다이어트/유지/증량 목표별 칼로리 안내.',
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
    description: '기초대사량과 일일 권장 칼로리를 계산하세요.',
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
            기초대사량(BMR)과 활동량을 기반으로 하루 권장 칼로리를 계산하세요.
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
                  <p>현재 가장 정확하다고 인정받는 기초대사량 계산 공식입니다. 1990년 발표 이후 전 세계적으로 널리 사용됩니다.</p>
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
              <h2 className="text-xl font-bold mb-4">건강한 다이어트 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">적정 감량 속도</h3>
                  <p>주당 0.5~1kg 감량이 권장됩니다. TDEE에서 하루 500kcal 줄이면 주 약 0.45kg 감량 효과가 있습니다. 1,200kcal(여성)/1,500kcal(남성) 미만은 피하세요.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">영양소 비율</h3>
                  <p>다이어트 시 권장 비율: 탄수화물 40~50%, 단백질 25~35%, 지방 20~30%. 특히 단백질을 체중 1kg당 1.6~2.2g 섭취하면 근손실을 줄일 수 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">증량 시 주의점</h3>
                  <p>TDEE + 300~500kcal로 설정하고, 근력 운동과 병행하세요. 과도한 칼로리 잉여는 체지방 증가로 이어집니다. 주당 0.25~0.5kg 증가가 적정합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">대사 적응 주의</h3>
                  <p>장기 다이어트 시 대사율이 떨어질 수 있습니다. 2~3개월마다 유지 칼로리로 1~2주간 식사하는 &apos;다이어트 브레이크&apos;를 권장합니다.</p>
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
