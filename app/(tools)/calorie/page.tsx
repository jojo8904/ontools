import type { Metadata } from 'next'
import { CalorieCalculator } from './CalorieCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
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
    url: 'https://ontools.com/calorie',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CaloriePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
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

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CalorieCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="calorie" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* BMR 계산 공식 */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
