
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { FreelancerTaxCalculator } from './FreelancerTaxCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'

const FREELANCER_GUIDE = [
  { h: '프리랜서 3.3% 원천징수란?', p: ['프리랜서·인적용역 사업소득자는 대금을 받을 때 소득세 3%와 지방소득세 0.3%(소득세의 10%)를 합한 3.3%를 떼고 받습니다. 이를 원천징수라고 합니다.'] },
  { h: '3.3% 떼면 끝일까?', p: ['아닙니다. 미리 떼인 3.3%는 일종의 선납이며, 다음 해 5월 종합소득세 신고로 최종 정산합니다. 경비가 많거나 소득이 적으면 환급받고, 소득이 크면 추가로 납부할 수 있습니다.'] },
  { h: '경비 처리와 절세', p: ['업무에 쓴 비용(필요경비)을 증빙과 함께 인정받으면 과세 대상 소득이 줄어 세금이 줄거나 환급이 늘어납니다. 영수증·계좌내역 등 증빙을 잘 보관하세요.'] },
  { h: '주의사항', p: ['본 계산기는 원천징수 금액 계산용입니다. 최종 세액은 연간 총소득·경비·공제에 따라 달라집니다.'] },
  {"h":"계산 예시: 월 300만 원씩 받는 프리랜서","p":["매달 300만 원을 받으면 3.3%(소득세 3% + 지방소득세 0.3%)인 99,000원이 떼이고 2,901,000원이 입금됩니다. 연간으로는 3,600만 원 수입에 1,188,000원이 미리 납부된 상태입니다.","5월 종합소득세 신고에서 경비 40%(1,440만 원)를 인정받으면 소득금액 2,160만 원, 기본공제 후 과세표준 약 2,000만 원, 세율 15% 적용 시 산출세액 약 174만 원입니다. 지방소득세를 더해 약 191만 원이 최종 세액이고, 이미 낸 1,188,000원을 빼면 약 72만 원을 추가로 냅니다.","경비를 60% 인정받으면 과세표준이 약 1,300만 원으로 내려가 6% 구간이 되고, 최종 세액 약 86만 원으로 오히려 33만 원을 환급받습니다. 경비 증빙이 세금을 가릅니다."]},
  {"h":"프리랜서가 챙겨야 할 경비 증빙","p":["노트북·소프트웨어 구독·휴대폰 요금·교통비·작업 공간 임차료·관련 도서와 교육비가 대표적입니다. 사업용 계좌와 카드를 따로 쓰면 증빙 정리가 쉽고, 홈택스에 사업용 신용카드를 등록하면 자동으로 집계됩니다.","세금계산서나 현금영수증(지출증빙용)을 받아야 경비로 확실히 인정됩니다. 간이영수증은 3만 원 이하만 인정되고, 개인 간 이체는 계약서와 함께 있어야 합니다."]},
  {"h":"4대보험과 건강보험료","p":["프리랜서는 직장가입자가 아니므로 국민연금은 지역가입자로 소득의 9.5%(2026년)를 전액 본인이 냅니다. 건강보험도 지역가입자로 소득과 재산 기준으로 부과되어 월 10만~30만 원이 흔합니다.","수입이 적은 초기에는 국민연금 납부예외를 신청할 수 있고, 배우자가 직장가입자면 피부양자로 올라 건강보험료를 내지 않을 수 있습니다(연 소득 2,000만 원 이하 등 조건)."]},
  {"h":"사업자등록을 하면 달라지는 것","p":["사업자등록 없이도 3.3% 원천징수로 일할 수 있지만, 거래처가 세금계산서를 요구하거나 연 수입이 커지면 사업자등록이 유리합니다. 등록하면 부가세를 받아 신고하고, 매입세액을 돌려받으며, 경비 처리가 명확해집니다.","연 매출 1억 400만 원 미만이면 간이과세자로 부가세 부담이 작습니다. 다만 4,800만 원 미만 간이과세자는 세금계산서를 발급할 수 없어 기업 거래처에는 불리할 수 있습니다."]},
]

const FREELANCER_FAQ = [
  { q: '3.3%는 무엇인가요?', a: '사업소득 원천징수로, 소득세 3% + 지방소득세 0.3%(소득세의 10%)를 합한 비율입니다.' },
  { q: '3.3% 떼고 끝인가요?', a: '아닙니다. 다음해 5월 종합소득세 신고로 정산하며, 경비·공제에 따라 환급받거나 추가 납부할 수 있습니다.' },
  { q: '누가 3.3% 대상인가요?', a: '프리랜서·인적용역 사업소득자입니다. 4대보험에 가입하는 근로소득과는 과세 방식이 다릅니다.' },
  {"q":"3.3% 떼는 게 맞나요, 8.8%도 있던데요?","a":"계속적·반복적 용역이면 사업소득으로 3.3%, 일시적 강연·원고료 같은 기타소득이면 8.8%(필요경비 60% 인정 후 22%)입니다. 같은 일이라도 반복 여부로 구분이 달라집니다."},
  {"q":"프리랜서도 연말정산을 하나요?","a":"아니요. 연말정산은 근로소득자용이고, 프리랜서(사업소득)는 다음 해 5월 종합소득세 신고로 정산합니다. 보험모집인·방문판매원 등 일부 업종만 회사가 연말정산해 줍니다."},
  {"q":"소득이 적으면 신고 안 해도 되나요?","a":"원천징수된 세금이 있다면 신고해야 환급받습니다. 신고를 안 하면 환급도 없고, 소득이 있는데 무신고로 남으면 나중에 가산세와 건강보험료 추징 문제가 생깁니다."},
  {"q":"노란우산공제가 뭔가요?","a":"소상공인·프리랜서용 퇴직금 성격의 공제로, 납입액을 소득 구간에 따라 연 200만~600만 원까지 소득공제 받습니다. 과세표준 15% 구간이라면 500만 원 공제 시 세금이 약 80만 원 줄어듭니다. 한도는 해마다 조정되므로 가입 전 중소기업중앙회 안내를 확인하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/freelancer-tax' },
  title: '프리랜서 세금 계산기 (3.3%) - ontools',
  description: '프리랜서 원천징수 3.3% 세금을 계산하세요. 계약 금액에서 소득세 3%와 지방소득세 0.3%를 자동 계산합니다.',
  keywords: ['프리랜서세금', '3.3%계산기', '원천징수', '프리랜서소득세', '사업소득세'],
  openGraph: {
    title: '프리랜서 세금 계산기 (3.3%) - ontools',
    description: '프리랜서 원천징수 3.3% 세금을 계산하세요.',
    url: 'https://ontools.co.kr/freelancer-tax',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function FreelancerTaxPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <span className="text-foreground">급여/세금</span>{' > '}
          <span className="text-foreground font-medium">프리랜서 세금 계산기 (3.3%)</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">프리랜서 세금 계산기 (3.3%)</h1>
          <p className="text-muted-foreground">계약 금액에서 원천징수 3.3%를 자동 계산하여 실수령액을 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <FreelancerTaxCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="freelancer-tax" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">3.3% 원천징수란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서(사업소득자)에게 대가를 지급할 때, 지급자가 소득세 3%와 지방소득세 0.3%를 미리 원천징수하여 국세청에 납부하는 제도입니다.</p>
                <p>프리랜서는 다음 해 5월 종합소득세 신고 시 이미 납부한 3.3%를 기납부세액으로 공제받을 수 있습니다.</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">종합소득세 신고</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>프리랜서 수입이 연 2,400만원 이하이면 단순경비율 적용 가능. 필요경비를 공제하면 실제 세금이 줄어들거나 환급받을 수 있습니다.</p>
                <p>신고 기간: 매년 5월 1일 ~ 5월 31일 (성실신고 대상자는 6월 30일까지)</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={FREELANCER_GUIDE} />
        <FaqSection items={FREELANCER_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/freelancer-tax-refund" className="text-sm font-semibold text-blue-700 hover:underline">프리랜서 3.3%, 세금 다 낸 게 아니에요 (환급받는 법)</Link>
        </div>
        <RelatedTools current="/freelancer-tax" />
      </main>
      <SiteFooter />
    </div>
  )
}
