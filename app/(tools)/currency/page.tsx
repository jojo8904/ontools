
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { CurrencyConverter } from './CurrencyConverter'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const CURRENCY_GUIDE = [
  { h: '환율 계산기란?', p: ['입력한 금액을 현재 환율 기준으로 원화↔외화로 환산해주는 도구입니다. 해외여행 예산, 해외직구 결제금액, 해외송금액을 가늠할 때 유용합니다.'] },
  { h: '매매기준율과 실제 환전 환율의 차이', p: ['본 계산기는 매매기준율(은행 간 거래 기준 환율)을 사용합니다. 실제로 은행·환전소에서 돈을 바꿀 때는 여기에 스프레드(수수료)가 붙어, 살 때는 더 비싸고 팔 때는 더 싸게 적용됩니다. 환전 우대를 받으면 이 차이를 줄일 수 있습니다.'] },
  { h: '엔화 표기 주의', p: ['일본 엔화는 은행 고시에서 100엔 단위로 표기되는 경우가 많습니다. 본 계산기는 1엔 기준으로 환산해 보여주므로 은행 고시 숫자와 달라 보일 수 있습니다.'] },
  { h: '활용 팁', p: ['환율은 평일에 수시로 변동하고 주말·공휴일에는 직전 영업일 기준이 유지됩니다. 큰 금액을 환전한다면 며칠간 환율 추이를 지켜보고, 주거래은행의 환전 우대를 활용하는 것이 유리합니다.'] },
  {"h":"계산 예시: 1,000달러를 원화로","p":["매매기준율이 1달러 1,353원이면 1,000달러는 1,353,000원입니다. 그러나 은행 창구에서 현찰을 사면 기준율에 약 1.75%의 스프레드가 붙어 1,376,700원 정도를 내고, 90% 환율 우대를 받으면 1,355,370원으로 내려갑니다.","반대로 여행에서 남은 1,000달러를 원화로 바꿀 때는 '현찰 살 때'가 아니라 '현찰 팔 때' 환율이 적용되어 기준율보다 1.75% 적게 받습니다. 살 때와 팔 때 환율 차이가 왕복 3.5%라서, 쓰지 않을 외화를 미리 바꾸는 것은 손해입니다.","이 계산기는 매매기준율로 계산합니다. 실제 환전 금액을 알려면 결과에 은행 스프레드(현찰 1.5~2%, 송금 1% 안팎)와 우대율을 적용하세요."]},
  {"h":"해외여행 환전, 어디서 얼마나 유리한가","p":["은행 앱 환전은 보통 달러·엔·유로에 80~100% 우대를 주고 공항에서 수령할 수 있습니다. 공항 환전소 창구는 우대가 거의 없어 같은 금액에서 2~3% 손해입니다.","환전 수수료가 없는 외화 체크카드(트래블카드)는 결제와 ATM 출금에서 매매기준율에 가까운 환율을 적용합니다. 다만 현지 ATM 운영사의 수수료는 별도이고, 카드 분실에 대비해 현금도 조금은 바꿔 가는 것이 안전합니다.","달러·엔·유로·위안 외 통화(동남아 등)는 국내 우대율이 낮습니다. 달러로 환전해 가서 현지에서 바꾸는 이중 환전이 유리한 경우가 있으니 현지 환율을 확인하세요."]},
  {"h":"해외 결제와 직구에서 환율","p":["해외 사이트에서 카드로 결제하면 '현지 통화로 결제'를 선택하세요. 원화로 결제하는 DCC(자국통화결제)를 고르면 3~8%의 추가 환전 수수료가 붙습니다.","카드사는 비자·마스터의 국제 환율에 해외 이용 수수료 약 1%를 더해 청구합니다. 결제일이 아니라 매입 접수일 환율이 적용되므로 청구 금액이 결제 당시 계산과 조금 다를 수 있습니다."]},
  {"h":"이 환율 데이터의 기준","p":["환율은 평일 하루 한 번 자동 갱신되며, 결과 옆에 제공기관의 기준 시각과 출처를 표시합니다. 주말·공휴일에는 직전 영업일 환율이 유지되고, 36시간이 지난 데이터는 '오래된 데이터'로 구분해 알립니다.","환율은 장중에도 계속 움직이므로 큰 금액을 환전하거나 송금할 때는 거래 시점의 은행 고시 환율을 다시 확인하세요."]},
]

const CURRENCY_FAQ = [
  {
    q: '환율은 어느 시점 기준인가요?',
    a: '평일 오전에 업데이트되는 매매기준율 근사치입니다. 주말·공휴일에는 직전 영업일의 환율이 적용됩니다.',
  },
  {
    q: '실제 환전 금액과 다른 이유는 무엇인가요?',
    a: '은행·환전소는 매매기준율에 스프레드(수수료)를 더하기 때문에 "살 때"와 "팔 때" 환율이 다릅니다. 본 계산기는 기준율 참고용입니다.',
  },
  {
    q: '엔화(JPY)는 100엔 기준인가요?',
    a: '본 계산기는 1엔 기준으로 환산해 보여줍니다. 은행 고시는 100엔 단위로 표기되는 경우가 많아 숫자가 달라 보일 수 있습니다.',
  },
  {
    q: '어떤 통화를 지원하나요?',
    a: '미국 달러(USD), 일본 엔(JPY), 유로(EUR), 중국 위안(CNY)과 원화(KRW) 간 변환을 지원합니다.',
  },
  {"q":"매매기준율과 은행 환전 환율은 왜 다른가요?","a":"매매기준율은 외환시장의 중간 가격이고, 은행은 여기에 현찰 1.75%, 송금 1% 안팎의 스프레드를 붙여 사고팝니다. 우대율 90%는 이 스프레드의 90%를 깎아준다는 뜻입니다."},
  {"q":"엔화 100엔이 왜 900원대로 나오나요?","a":"엔화는 관례상 100엔 단위로 고시합니다. 1엔은 약 8.6원이고 100엔이 약 863원입니다. 계산기에 엔화 금액을 넣을 때 100엔 단위인지 1엔 단위인지 확인하세요."},
  {"q":"환율이 오르면 유리한가요, 불리한가요?","a":"원/달러 환율이 오른다는 것은 원화 가치가 떨어진다는 뜻입니다. 달러를 사야 하는 여행자·수입업자에게는 불리하고, 달러를 받는 수출업자나 해외 자산 보유자에게는 유리합니다."},
  {"q":"환전은 미리 해두는 게 좋나요?","a":"환율 방향은 예측하기 어렵습니다. 여행 한두 달 전부터 나눠서 환전하면 평균 환율로 사게 되어 한 번에 바꾸는 위험을 줄일 수 있습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/currency' },
  title: '환율 계산기 - ontools',
  description:
    '최근 고시 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게 변환하세요. ExchangeRate-API 환율 기준, 최신 환율 뉴스 제공.',
  keywords: [
    '환율계산기',
    '환율변환',
    '원달러환율',
    '달러환율',
    '엔화환율',
    '유로환율',
    '위안화환율',
    '환율변환',
  ],
  openGraph: {
    title: '환율 계산기 - ontools',
    description: '최근 고시 환율로 통화를 간편하게 변환하세요.',
    url: 'https://ontools.co.kr/currency',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CurrencyPage() {
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
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">환율 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">환율 계산기</h1>
          <p className="text-muted-foreground">
            최근 고시 환율 정보로 원화, 달러, 엔화, 유로, 위안화를 간편하게
            변환하세요.
          </p>
        </div>

        {/* Converter + SEO Content */}
        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CurrencyConverter />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="currency" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            {/* 환전 수수료 절약 팁 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">환전 수수료 절약 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. 인터넷/모바일 환전 이용</h3>
                  <p>은행 창구 대비 최대 90% 우대율을 받을 수 있습니다. 대부분의 시중은행 앱에서 환전 예약 후 공항에서 수령 가능합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. 환율 우대 쿠폰 활용</h3>
                  <p>은행별로 환율 우대 쿠폰을 수시로 제공합니다. 여행 전 미리 쿠폰을 확보하면 추가 할인을 받을 수 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">3. 달러 강세/약세 시점 활용</h3>
                  <p>환율이 낮을 때(원화 강세) 미리 환전하면 유리합니다. 급하지 않다면 환율 추이를 지켜보며 분할 환전도 좋은 방법입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4. 해외 직접 인출 주의</h3>
                  <p>현지 ATM 인출 시 수수료가 2~3% 추가될 수 있습니다. 가능하면 국내에서 미리 환전하는 것이 유리합니다.</p>
                </div>
              </div>
            </section>

            {/* 통화별 특징 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">주요 통화별 특징</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">USD (미국 달러)</h3>
                  <p>세계 기축통화. 전 세계 외환거래의 약 88%에 관여합니다. 원/달러 환율은 한국 경제의 핵심 지표입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">JPY (일본 엔)</h3>
                  <p>안전자산 통화. 글로벌 위기 시 엔화 강세 경향이 있습니다. 100엔 단위로 고시됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">EUR (유로)</h3>
                  <p>유로존 20개국 공통 통화. 달러 다음으로 거래량이 많으며, 유럽 여행 시 필수 통화입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">CNY (중국 위안)</h3>
                  <p>중국 인민은행이 관리하는 관리변동환율제. 한중 교역 규모가 큰 만큼 원/위안 환율도 중요합니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={CURRENCY_GUIDE} hideAd />
        <FaqSection items={CURRENCY_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/exchange-rate" className="text-sm font-semibold text-blue-700 hover:underline">환율 계산기 보는 법과 환전 수수료 아끼는 팁</Link>
        </div>
        <RelatedTools current="/currency" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
