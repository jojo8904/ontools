
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { WaterIntakeCalculator } from './WaterIntakeCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const WATER_GUIDE = [
  { h: '하루 물 섭취량, 얼마나?', p: ['일반적으로 체중 1kg당 약 30~35ml가 권장됩니다. 예를 들어 70kg 성인은 하루 약 2.1~2.5L가 기준이 됩니다.'] },
  { h: '상황에 따른 조절', p: ['운동량이 많거나 더운 환경, 임신·수유 중에는 더 많은 수분이 필요합니다. 반대로 신장·심장 질환이 있으면 섭취량을 제한해야 할 수 있으니 의사와 상담하세요.'] },
  { h: '참고', p: ['물뿐 아니라 음식·음료에 포함된 수분도 섭취량에 포함됩니다. 한 번에 많이 마시기보다 하루 동안 나눠 마시는 것이 좋고, 과도한 수분 섭취는 오히려 해로울 수 있습니다.'] },
  {"h":"계산 예시: 체중 70kg","p":["일반적인 기준은 체중 1kg당 30~35ml입니다. 70kg이면 하루 2.1~2.45L이고, 500ml 생수병 4~5개 분량입니다. 50kg은 1.5~1.75L, 90kg은 2.7~3.15L입니다.","이 양에는 국·과일·채소에 든 수분(하루 섭취 수분의 약 20%)이 포함됩니다. 음식으로 들어오는 양을 빼면 실제로 마셔야 할 물은 계산값의 80% 정도입니다."]},
  {"h":"더 마셔야 하는 상황","p":["운동으로 땀을 흘리면 1시간당 500ml~1L를 더 마십니다. 체온 30도 이상의 더위, 사우나, 비행기 탑승(건조한 기내)도 마찬가지입니다. 임신 중에는 300ml, 수유 중에는 700ml 정도를 더 권장합니다.","감기·설사·구토가 있으면 평소보다 많이 마시되 전해질이 함께 빠지므로 이온음료나 경구수액이 낫습니다."]},
  {"h":"커피와 차도 수분으로 치나요","p":["커피·녹차의 카페인은 약한 이뇨 작용이 있지만 마신 양보다 많이 배출되지는 않습니다. 하루 2~3잔 수준이면 수분 섭취에 포함해도 됩니다. 다만 물 대신 전부 커피로 채우는 것은 카페인 과다라 피하세요.","술은 반대입니다. 알코올의 이뇨 작용이 강해 마신 양보다 더 많은 수분이 빠져나가므로 수분 섭취에서 빼고, 음주 후에는 물을 따로 마셔야 합니다."]},
  {"h":"너무 많이 마시면","p":["짧은 시간에 1L 이상을 반복해서 마시면 혈중 나트륨이 희석되어 저나트륨혈증이 올 수 있습니다. 드물지만 마라톤 중 물만 많이 마신 경우 보고됩니다. 한 번에 200~300ml씩 나눠 마시세요.","신장 질환, 심부전, 간경화 환자는 의사가 정한 수분 제한량을 따라야 합니다. 이 계산기의 값은 건강한 성인 기준입니다."]},
]

const EXTRA_FAQ = [
  {"q":"하루 2L는 꼭 마셔야 하나요?","a":"2L는 평균적인 성인 체중 기준의 어림값입니다. 체중·활동량·기온에 따라 1.5~3L로 달라지며, 소변 색이 연한 노란색이면 충분히 마시고 있는 것입니다."},
  {"q":"물을 언제 마시는 게 좋나요?","a":"목이 마르기 전에 조금씩, 하루에 걸쳐 나눠 마시는 것이 좋습니다. 기상 직후 한 잔, 식사 30분 전, 운동 전후가 흔한 권장 시점입니다. 잠들기 직전 많이 마시면 수면을 방해합니다."},
  {"q":"물을 많이 마시면 살이 빠지나요?","a":"물 자체에 칼로리가 없고 식사 전 물 한 잔이 포만감을 주어 섭취량을 조금 줄이는 효과는 있습니다. 다만 직접적인 감량 효과는 작으며, 음료수를 물로 바꾸는 것이 더 효과적입니다."},
  {"q":"아이들은 얼마나 마셔야 하나요?","a":"4~8세는 하루 1.2L, 9~13세는 1.6~1.9L, 14~18세는 1.9~2.6L가 일반적인 권장량입니다. 아이는 갈증을 잘 표현하지 않으므로 정해진 시간에 마시게 하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/water-intake' },
  title: '물 섭취량 계산기 - ontools',
  description: '체중과 활동량에 맞는 하루 권장 물 섭취량을 계산하세요.',
  keywords: ['물섭취량계산기', '하루물섭취량', '수분섭취', '물마시기', '건강물섭취'],
  openGraph: { title: '물 섭취량 계산기 - ontools', description: '하루 권장 물 섭취량을 계산하세요.', url: 'https://ontools.co.kr/water-intake', siteName: 'ontools', type: 'website' },
}

export default function WaterIntakePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-foreground">홈</Link>{' > '}<span className="text-foreground">건강</span>{' > '}<span className="text-foreground font-medium">물 섭취량 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">물 섭취량 계산기</h1><p className="text-muted-foreground">체중과 활동량에 맞는 하루 권장 물 섭취량을 확인하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <WaterIntakeCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="water-intake" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">물 섭취 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>기상 후 공복에 물 1잔(250ml)을 마시면 신진대사 활성화에 도움됩니다.</p>
                <p>한 번에 많이 마시기보다 1~2시간 간격으로 나눠 마시는 것이 흡수에 효과적입니다.</p>
                <p>카페인 음료(커피, 차)는 이뇨작용이 있어 물 섭취량에 포함하지 않는 것이 좋습니다.</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">탈수 증상</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>초기:</strong> 갈증, 소변 색 진해짐, 입 마름</p>
                <p><strong>중기:</strong> 두통, 피로감, 집중력 저하</p>
                <p><strong>심각:</strong> 어지러움, 심박수 증가, 혼란</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={WATER_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/water-intake" />
      </main>
      <SiteFooter />
    </div>
  )
}
