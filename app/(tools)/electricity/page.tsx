
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ElectricityCalculator } from './ElectricityCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const ELECTRICITY_GUIDE = [
  { h: '전기요금은 어떻게 구성되나요?', p: ['주택용 전기요금은 기본요금, 전력량요금, 기후환경요금, 연료비조정요금에 부가가치세 10%와 전력산업기반기금 2.7%(2025년 7월 이후)를 더합니다. 이 도구는 기타계절 저압 0~1,000kWh만 추정합니다.'] },
  { h: '누진제란?', p: ['주택용은 사용량이 많을수록 높은 단가가 적용되는 누진제가 적용됩니다. 보통 월 200kWh, 400kWh를 경계로 3단계로 나뉘며, 특히 여름철 냉방으로 사용량이 급증하면 상위 구간 단가가 적용돼 요금이 크게 오를 수 있습니다.'] },
  { h: '절약 팁', p: ['에어컨은 적정 온도로 설정하고, 사용하지 않는 가전의 대기전력을 차단하면 누진 구간 진입을 늦출 수 있습니다.'] },
  { h: '주의사항', p: ['한전 단가는 개정될 수 있고 계약종별·계절에 따라 다릅니다. 본 계산기는 주택용 저압 기준 추정치입니다.'] },
  {"h":"사용량별 요금 예시 (주택용 저압, 기타계절)","p":["200kWh는 31,220원, 300kWh는 57,760원, 400kWh는 83,530원, 500kWh는 126,160원, 600kWh는 162,370원입니다. 부가세 10%와 전력산업기반기금 2.7%를 포함한 청구 예상액입니다.","200kWh에서 300kWh로 100kWh 늘면 26,540원이 오르지만, 400kWh에서 500kWh로 같은 100kWh가 늘면 42,630원이 오릅니다. 3단계 구간(400kWh 초과)에 들어가면 기본요금이 1,600원에서 7,300원으로 뛰고 전력량요금도 kWh당 307.3원이 되기 때문입니다."]},
  {"h":"요금 구성: 300kWh를 뜯어보면","p":["기본요금 1,600원, 전력량요금 45,460원(처음 200kWh는 kWh당 120원으로 24,000원, 다음 100kWh는 214.6원으로 21,460원), 기후환경요금 2,700원(kWh당 9원), 연료비조정요금 1,500원(kWh당 5원)을 더하면 51,260원입니다.","여기에 부가세 5,126원과 전력산업기반기금 1,380원을 더해 57,760원이 청구됩니다. TV 수신료 2,500원이 전기요금과 함께 고지되는 가구는 그만큼 더 나옵니다."]},
  {"h":"가전별 월 사용량 어림값","p":["냉장고(양문형) 30~50kWh, 김치냉장고 15~25kWh, 세탁기 주 3회 5~10kWh, 건조기 주 3회 20~30kWh, TV 하루 4시간 10~15kWh, 인덕션 하루 1시간 20~30kWh, 컴퓨터 하루 4시간 10~20kWh가 보통입니다.","에어컨(벽걸이 1.5kW) 하루 8시간은 월 150~250kWh, 전기히터(2kW) 하루 5시간은 월 300kWh입니다. 냉난방기구 하나가 나머지 가전 전부와 맞먹으므로, 사용량이 400kWh를 넘는 달은 거의 항상 냉난방이 원인입니다."]},
  {"h":"요금을 줄이는 현실적인 순서","p":["첫째, 400kWh 경계를 넘지 않는 것입니다. 350kWh와 450kWh의 차이는 100kWh인데 요금 차이는 37,410원입니다. 한전 앱(한전ON)에서 이달 누적 사용량을 확인하면 경계가 보입니다.","둘째, 냉난방 설정 온도를 1도만 조정해도 냉난방 전력이 5~7% 줄어듭니다. 셋째, 대기전력은 가구당 월 5~10kWh 수준이라 멀티탭을 끄는 효과는 생각보다 작습니다. 넷째, 10년 넘은 냉장고·에어컨은 신형보다 전력을 30~50% 더 쓰므로 교체가 가장 큰 절감입니다."]},
]

const ELECTRICITY_FAQ = [
  { q: '전기요금은 어떻게 계산되나요?', a: '기타계절 저압 누진 구간에 기본요금·기후환경요금·가정한 연료비조정액을 더한 뒤 부가세 10%와 기금 2.7%를 적용합니다. 하계·고압·할인·수신료는 미반영합니다.' },
  { q: '누진제가 무엇인가요?', a: '사용량이 많을수록 높은 단가가 적용되는 제도로, 주택용은 200kWh·400kWh를 경계로 3단계입니다.' },
  { q: '실제 고지서와 다를 수 있나요?', a: '한전 단가는 개정될 수 있고 계절·계약종별에 따라 달라집니다. 본 계산기는 주택용 저압 기준 추정치입니다.' },
  {"q":"여름 요금은 왜 이 계산기와 다른가요?","a":"7~8월 하계에는 누진 구간이 300kWh·450kWh로 넓어져 같은 사용량이면 기타계절보다 요금이 적게 나옵니다. 이 계산기는 기타계절 기준이므로 여름 고지서와 다를 수 있습니다."},
  {"q":"전기요금 복지할인은 어떤 게 있나요?","a":"기초생활수급자·장애인·국가유공자 월 1만 6천 원 한도, 다자녀(3자녀 이상)·대가족(5인 이상)·출산가구(3년 이내) 30%(월 1만 6천 원 한도) 할인이 있습니다. 한전에 신청해야 적용되며 중복은 안 됩니다."},
  {"q":"검침일이 달라서 사용량이 고지서와 안 맞아요.","a":"검침일에 따라 한 달의 기간이 다르고, 한전은 검침 기간이 한 달보다 길거나 짧으면 일수 비례로 누진 구간을 조정합니다. 고지서의 '사용 기간'과 '사용량'을 그대로 넣어 비교하세요."},
  {"q":"아파트 관리비 전기요금은 왜 다른가요?","a":"아파트는 단지 전체가 한전과 계약하고 세대별로 배분하는 방식이 많습니다. 공용 전기(엘리베이터·복도 조명)가 포함되고 계약 방식(단일·종합)에 따라 단가가 달라 개별 계산과 차이가 납니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/electricity' },
  title: '전기요금 계산기 - ontools',
  description:
    '한국전력 주택용 전기요금 누진제 기준. 사용량(kWh)으로 예상 요금 계산, 금액으로 사용량 역계산. 기본료, 전력량요금, 부가세, 전력산업기반기금 포함.',
  keywords: [
    '전기요금계산기',
    '전기요금',
    '전기세',
    '누진제',
    '전력량요금',
    '한국전력',
    'kWh',
    '전기요금누진',
  ],
  openGraph: {
    title: '전기요금 계산기 - ontools',
    description: '전기 사용량으로 예상 요금 계산, 금액으로 사용량 역계산.',
    url: 'https://ontools.co.kr/electricity',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ElectricityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
          {' > '}
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">전기요금 계산기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">전기요금 계산기</h1>
          <p className="text-muted-foreground">
            한국전력 주택용 누진제 기준. 사용량으로 요금 계산, 금액으로 사용량
            역계산을 지원합니다.
          </p>
        </div>

        <ElectricityCalculator />

        {/* Bottom Sections */}
        <div className="mt-12 space-y-10">
          <YouTubeSection category="electricity" />
        </div>
        <ToolGuide sections={ELECTRICITY_GUIDE} />
        <FaqSection items={ELECTRICITY_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/electricity-bill" className="text-sm font-semibold text-blue-700 hover:underline">전기요금 누진제 이해하고 여름 전기세 줄이기</Link>
        </div>
        <RelatedTools current="/electricity" />
      </main>

      <SiteFooter />
    </div>
  )
}
