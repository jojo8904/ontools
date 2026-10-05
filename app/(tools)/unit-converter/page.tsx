
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { UnitConverterCalculator } from './UnitConverterCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const UNIT_GUIDE = [
  { h: '단위 변환기란?', p: ['길이(m·cm·인치·피트), 무게(kg·g·파운드·온스), 온도(℃·℉), 시간 등 서로 다른 단위를 빠르게 환산해주는 도구입니다. 해외직구, 요리, 학습 등에서 유용합니다.'] },
  { h: '온도 변환 공식', p: ['섭씨를 화씨로 바꿀 때는 "℉ = ℃ × 9/5 + 32", 화씨를 섭씨로 바꿀 때는 "℃ = (℉ − 32) × 5/9"를 사용합니다. 예를 들어 25℃는 77℉입니다.'] },
  { h: '자주 쓰는 환산', p: ['1인치 = 2.54cm, 1피트 = 30.48cm, 1마일 ≈ 1.609km, 1파운드 ≈ 453.6g, 1온스 ≈ 28.35g입니다.'] },
  {"h":"자주 쓰는 환산값 모음","p":["길이: 1인치 2.54cm, 1피트 30.48cm, 1야드 91.44cm, 1마일 1.609km. 무게: 1파운드 453.6g, 1온스 28.35g, 1돈(금) 3.75g, 1근(정육) 600g. 넓이: 1평 3.3058㎡, 1에이커 4,047㎡, 1헥타르 10,000㎡. 부피: 1리터 1,000ml, 1미국 갤런 3.785L, 1컵(미국 레시피) 240ml, 1테이블스푼 15ml, 1티스푼 5ml.","온도는 섭씨 × 1.8 + 32 = 화씨입니다. 화씨 100도는 섭씨 37.8도, 오븐 350°F는 약 177°C입니다. 속도 1마일/시는 1.609km/h, 1노트는 1.852km/h입니다."]},
  {"h":"해외 직구와 레시피에서","p":["TV·모니터의 '55인치'는 화면 대각선 길이로 139.7cm입니다. 가로 폭은 16:9 기준 약 121cm이므로 TV장 폭과 비교할 때는 대각선이 아니라 가로를 계산해야 합니다. 미국 옷 사이즈의 허리 32인치는 81cm입니다.","미국 레시피의 1컵은 240ml, 영국 1컵은 250ml, 일본 1컵은 200ml로 나라마다 다릅니다. 밀가루 1컵은 약 120g, 설탕 1컵은 약 200g처럼 재료마다 무게가 다르므로 '컵 → 그램' 환산은 재료별로 봐야 합니다."]},
  {"h":"헷갈리기 쉬운 단위","p":["1kB는 1,000바이트(SI)인지 1,024바이트(이진)인지에 따라 다르고, 저장장치 제조사는 1,000을, 윈도우는 1,024를 씁니다. 1TB 하드가 윈도우에서 931GB로 보이는 이유입니다.","마력은 PS(미터마력, 735.5W)와 HP(영국마력, 745.7W)가 다르며 국내 자동차 제원은 PS를 씁니다. 평은 1㎡ = 0.3025평이므로 ㎡에 0.3을 곱하면 빠르게 어림할 수 있습니다."]},
  {"h":"법정 단위와 관행 단위","p":["한국은 2007년부터 평·돈·근 같은 비법정 단위를 상거래에 쓰지 못하도록 했습니다. 부동산은 ㎡, 금은 g으로 표기하지만 관행상 평수·돈을 함께 말하므로 환산이 계속 필요합니다.","정육점의 1근은 600g, 채소·과일의 1근은 400g으로 품목에 따라 다릅니다. 금 1돈은 3.75g이며 시세는 보통 돈당 가격으로 표시됩니다."]},
]

const EXTRA_FAQ = [
  {"q":"1마일은 몇 km인가요?","a":"1.609km입니다. 미국 고속도로 제한속도 65mph는 약 105km/h이고, 마라톤 26.2마일은 42.195km입니다."},
  {"q":"체중 150파운드는 몇 kg인가요?","a":"약 68kg입니다. 파운드에 0.4536을 곱하면 kg이 되고, 반대로 kg에 2.2를 곱하면 파운드입니다."},
  {"q":"화씨를 섭씨로 빠르게 어림하는 법은요?","a":"화씨에서 30을 빼고 2로 나누면 대략 섭씨입니다. 화씨 80도는 (80 − 30) ÷ 2 = 25도이며 정확한 값은 26.7도입니다."},
  {"q":"1리터는 몇 cc인가요?","a":"1,000cc입니다. cc는 세제곱센티미터(㎤)로 ml와 같습니다. 자동차 배기량 2,000cc는 2리터입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/unit-converter' },
  title: '단위 변환기 - ontools',
  description:
    '길이(cm/m/km/inch/ft/mile), 무게(g/kg/lb/oz), 온도(°C/°F), 시간(초/분/시간/일) 단위를 간편하게 변환하세요.',
  keywords: [
    '단위변환',
    '단위변환기',
    '길이변환',
    '무게변환',
    '온도변환',
    '시간변환',
    'cm인치',
    'kg파운드',
    '섭씨화씨',
  ],
  openGraph: {
    title: '단위 변환기 - ontools',
    description: '길이, 무게, 온도, 시간 단위를 간편하게 변환하세요.',
    url: 'https://ontools.co.kr/unit-converter',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
          {' > '}
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">단위 변환기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">단위 변환기</h1>
          <p className="text-muted-foreground">
            길이, 무게, 온도, 시간 단위를 간편하게 변환합니다.
          </p>
        </div>

        {/* Calculator Component */}
        <UnitConverterCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="unit" />
        </div>
        <ToolGuide sections={UNIT_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/unit-converter" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
