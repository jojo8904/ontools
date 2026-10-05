
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { UsedCarTaxCalculator } from './UsedCarTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const USED_CAR_GUIDE = [
  { h: '중고차 취득세란?', p: ['자동차를 취득(구매)할 때 내는 지방세입니다. 승용차는 보통 취득가액의 7%이며, 경차·승합·화물차 등은 요율이 다릅니다.'] },
  { h: '과세표준', p: ['취득세는 실제 신고가액과 차령(연식)에 따른 기준시가 중 더 높은 금액을 기준으로 부과됩니다. 지나치게 낮은 금액으로 신고하면 기준시가로 과세될 수 있습니다.'] },
  { h: '주의사항', p: ['취득세 외에 공채 매입 비용 등이 추가될 수 있고, 장애인·국가유공자 등은 감면 대상이 될 수 있습니다. 본 계산기는 승용차 기준 추정치입니다.'] },
  {"h":"계산 예시: 2,000만 원 중고차 (서울, 2,000cc)","p":["취득세는 과세표준의 7%입니다. 실거래가 2,000만 원이 시가표준액보다 높다면 2,000만 × 7% = 140만 원입니다. 여기에 서울 기준 도시철도채권 매입(배기량별 차값의 일정 비율)을 할인매도하면 수만 원의 할인 비용이 들고, 번호판·등록 수수료 몇만 원이 더해집니다.","총 부대비용은 약 150만~160만 원으로 차값의 7.5~8%입니다. 1,000cc 이하 경차는 취득세 감면으로 수십만 원 수준까지 내려갑니다."]},
  {"h":"시가표준액이 실거래가보다 높을 때","p":["지방세법은 실거래가와 시가표준액 중 높은 금액을 과세표준으로 봅니다. 시가표준액은 차종별 기준가액에 차령별 잔가율을 곱한 값으로, 위택스나 차량등록사업소에서 조회할 수 있습니다.","친척에게 시세보다 싸게 샀거나 계약서를 낮게 썼더라도 시가표준액 기준으로 세금을 내므로 계약서 금액을 낮추는 것은 절세가 되지 않습니다."]},
  {"h":"이전등록 절차와 서류","p":["매도인의 자동차등록증, 매매계약서, 양도증명서, 매수인 신분증과 보험 가입 증명이 필요합니다. 책임보험에 먼저 가입해야 등록이 됩니다. 차량등록사업소나 구청 차량과에서 당일 처리됩니다.","매수 후 15일 안에 이전등록을 하지 않으면 과태료가 부과되고, 그 사이 발생한 과태료·사고 책임이 전 소유자 명의로 남아 분쟁이 생깁니다. 매매상사를 통하면 대행 수수료(보통 20만~30만 원)가 들지만 직접 가면 아낄 수 있습니다."]},
  {"h":"취득세 외에 매년 드는 세금","p":["등록 후에는 매년 배기량 기준 자동차세가 6월·12월에 나옵니다. 2,000cc면 신차 기준 연 52만 원이고, 차령 3년째부터 매년 5%씩 줄어 12년 이상은 절반입니다.","중고차는 이미 차령이 있어 자동차세가 신차보다 적습니다. 7년 된 2,000cc 차는 25% 감액되어 연 39만 원입니다. 자동차세 계산기에서 등록 연도를 넣어 확인하세요."]},
]

const EXTRA_FAQ = [
  {"q":"가족 간에 차를 넘길 때도 취득세를 내나요?","a":"네. 증여든 매매든 명의가 바뀌면 취득세가 발생합니다. 증여는 시가표준액 기준으로 7%를 내고, 별도로 증여세 대상이 될 수 있습니다."},
  {"q":"공채를 꼭 사야 하나요?","a":"등록 시 의무 매입이지만 바로 할인매도할 수 있어 실부담은 매입액의 일부(수만 원)입니다. 대행업체가 '공채 비용'으로 매입액 전체를 청구하면 할인매도 여부를 확인하세요."},
  {"q":"장애인·다자녀 감면이 있나요?","a":"장애인(1~3급 등 요건)은 1대에 한해 취득세·자동차세가 면제되고, 다자녀(미성년 2명 이상 등 지역별 기준)는 취득세 감면이 있습니다. 감면 요건은 매년 바뀌므로 등록 전 확인하세요."},
  {"q":"취득세 납부 기한은 언제인가요?","a":"취득일로부터 60일 안에 신고·납부해야 하며, 이전등록 시 함께 처리하는 것이 보통입니다. 기한을 넘기면 무신고 가산세 20%와 납부 지연 가산세가 붙습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/used-car-tax' },
  title: '중고차 취등록세 계산기 - ontools',
  description: '중고차 구매 시 취등록세를 계산하세요. 승용차 7%, 승합/화물 5%, 장애인 감면 지원.',
  keywords: ['중고차취등록세', '자동차취득세', '차량등록세', '중고차세금', '취등록세계산기'],
  openGraph: { title: '중고차 취등록세 계산기 - ontools', description: '중고차 취등록세를 계산하세요.', url: 'https://ontools.co.kr/used-car-tax', siteName: 'ontools', type: 'website' },
}

export default function UsedCarTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-foreground">홈</Link>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">중고차 취등록세 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">중고차 취등록세 계산기</h1><p className="text-muted-foreground">중고차 구매 시 필요한 취등록세를 간편하게 계산하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <UsedCarTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="used-car-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">취등록세 세율</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>승용차:</strong> 취득세 7%</p>
                <p><strong>승합차/화물차:</strong> 취득세 5%</p>
                <p><strong>경차 (1,000cc 이하):</strong> 취득세 4% (감면 적용 시 면제)</p>
                <p><strong>장애인:</strong> 취득세 면제 (2,000cc 이하 비영업용)</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">등록 시 필요 서류</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>매매계약서, 자동차등록증, 자동차세 완납증명서, 보험가입증명서, 신분증</p>
                <p>관할 구청 차량등록사업소에서 이전등록 진행</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={USED_CAR_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/used-car-tax" />
      </main>
      <SiteFooter />
    </div>
  )
}
