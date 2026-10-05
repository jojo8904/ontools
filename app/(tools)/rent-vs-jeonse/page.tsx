
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { RentVsJeonseCalculator } from './RentVsJeonseCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const RENT_JEONSE_GUIDE = [
  { h: '전세 vs 월세, 무엇이 유리할까?', p: ['전세는 큰 보증금을 맡기는 대신 월 임대료가 없고, 월세는 적은 보증금에 매달 임대료를 냅니다. 어느 쪽이 유리한지는 보증금을 다른 곳에 투자했을 때의 수익(기회비용)과 월세를 비교해 판단합니다.'] },
  { h: '비교 원리', p: ['전세는 "보증금 × 기대수익률(또는 대출이자율)"이 연간 비용이 되고, 월세는 "연 월세 + 월세보증금 × 기대수익률"이 연간 비용이 됩니다. 두 값을 비교해 더 적은 쪽이 유리합니다.'] },
  { h: '주의사항', p: ['결과는 가정한 금리·수익률에 따라 달라집니다. 전월세전환율, 대출 가능 여부, 보증금 안정성(전세사기 위험) 등도 함께 고려하세요.'] },
  {"h":"계산 예시: 전세 3억 vs 보증금 5천만·월세 100만","p":["전세 3억 원을 대출 없이 낼 수 있다면 그 돈의 기회비용이 비용입니다. 3억 원을 연 3.5% 예금에 넣으면 세후 약 888만 원, 월 74만 원의 이자를 포기하는 셈이므로 전세의 실질 주거비는 월 약 74만 원입니다.","월세 쪽은 보증금 5천만 원의 기회비용 월 약 12만 원에 월세 100만 원을 더해 월 112만 원입니다. 이 경우 전세가 월 38만 원 유리합니다. 다만 전세금 중 2억 원을 연 4% 전세대출로 마련한다면 이자 월 67만 원이 추가되어 전세 비용은 월 약 92만 원이 되고 차이가 20만 원으로 줄어듭니다."]},
  {"h":"전월세 전환율: 집주인이 제시하는 월세가 적정한가","p":["전세를 월세로 바꿀 때 법정 전환율 상한은 한국은행 기준금리 + 2%포인트입니다. 기준금리가 2.5%면 4.5%이고, 전세 1억 원을 월세로 돌리면 연 450만 원, 월 37만 5천 원이 상한입니다.","시장 전환율은 보통 법정 상한보다 높은 5~7% 수준이라, 전세 1억 원 감액에 월 50만 원 이상을 요구받으면 계산기로 전환율을 확인해 협상 근거로 쓰세요. 법정 상한은 계약 갱신 때 적용됩니다."]},
  {"h":"전세의 숨은 비용과 위험","p":["전세는 보증금을 돌려받지 못할 위험이 있습니다. 집값 대비 전세가율이 80%를 넘으면 위험 신호이고, 등기부등본의 근저당과 선순위 임차인을 확인해야 합니다. 전세보증금 반환보증(HUG·SGI) 보험료는 보증금 3억 원 기준 연 30만~60만 원입니다.","전세자금대출 이자는 월세와 달리 소득공제(연 400만 원 한도의 40%)가 되고, 월세는 세액공제(총급여 8천만 원 이하, 연 1,000만 원 한도의 15~17%)가 됩니다. 세금 혜택까지 넣어 비교하세요."]},
  {"h":"어떤 사람에게 월세가 맞는가","p":["목돈이 없거나 1~2년만 살 계획이면 월세가 유연합니다. 전세는 대출 실행·보증보험·확정일자 등 절차가 많고, 계약 중도 해지 시 보증금 반환이 다음 세입자에 달려 있습니다.","반대로 4년 이상 거주 예정이고 목돈이 있거나 저금리 전세대출(버팀목·청년 전세대출 등 연 2~3%)을 받을 수 있다면 전세가 거의 항상 유리합니다."]},
]

const EXTRA_FAQ = [
  {"q":"반전세는 어떻게 비교하나요?","a":"보증금과 월세를 둘 다 넣으면 됩니다. 보증금의 기회비용(또는 대출이자)과 월세를 합친 월 주거비로 전세와 비교합니다. 계산기는 두 항목을 모두 반영합니다."},
  {"q":"월세 세액공제 조건이 뭔가요?","a":"무주택 세대주, 총급여 8천만 원 이하, 기준시가 4억 원 이하 주택(오피스텔·고시원 포함), 전입신고가 조건입니다. 연 1,000만 원까지의 월세에 15%(총급여 5,500만 원 이하 17%)를 세액에서 뺍니다."},
  {"q":"전세대출 이자율이 몇 %면 월세보다 유리한가요?","a":"전세대출 이자율이 전월세 전환율보다 낮으면 전세가 유리합니다. 시장 전환율이 6%일 때 대출 이자가 4%라면 같은 돈을 빌려 전세로 사는 쪽이 월세보다 싸다는 뜻입니다."},
  {"q":"계약갱신청구권은 월세 인상에도 적용되나요?","a":"네. 갱신 시 보증금과 월세 인상은 합쳐서 5% 이내로 제한됩니다. 전세를 월세로 바꾸는 경우도 법정 전환율 범위 안에서만 가능합니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/rent-vs-jeonse' },
  title: '전세 vs 월세 비교 계산기 - ontools',
  description: '전세와 월세 중 어느 것이 유리한지 비교 계산하세요. 기회비용을 고려한 합리적인 주거 선택을 도와드립니다.',
  keywords: ['전세월세비교', '전세vs월세', '주거비계산', '전월세비교계산기', '기회비용'],
  openGraph: { title: '전세 vs 월세 비교 계산기 - ontools', description: '전세와 월세 비교 계산', url: 'https://ontools.co.kr/rent-vs-jeonse', siteName: 'ontools', type: 'website' },
}

export default function RentVsJeonsePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-foreground">홈</Link>{' > '}<span className="text-foreground">금융</span>{' > '}<span className="text-foreground font-medium">전세 vs 월세 비교 계산기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">전세 vs 월세 비교 계산기</h1><p className="text-muted-foreground">기회비용을 고려하여 전세와 월세 중 어느 것이 유리한지 비교하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <RentVsJeonseCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="rent-vs-jeonse" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">기회비용이란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>전세 보증금을 투자했을 때 얻을 수 있는 수익을 의미합니다. 전세가 월세보다 보증금이 크므로, 그 차액을 투자했을 때의 수익을 비교합니다.</p>
                <p>예: 3억 전세 보증금 × 연 3.5% = 연 1,050만원의 기회비용</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">월세 세액공제</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>총급여 7,000만원 이하 무주택 세대주는 월세의 15~17% 세액공제 가능 (연 최대 750만원 한도).</p>
                <p>총급여 5,500만원 이하: 17% 공제</p>
                <p>총급여 5,500만~7,000만원: 15% 공제</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={RENT_JEONSE_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/rent-vs-jeonse" className="text-sm font-semibold text-blue-700 hover:underline">월세 vs 전세, 무엇이 이득일까? (금리로 갈리는 계산)</Link>
        </div>
        <RelatedTools current="/rent-vs-jeonse" />
      </main>
      <SiteFooter />
    </div>
  )
}
