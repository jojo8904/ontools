
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { LoanCalculator } from './LoanCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { FaqSection } from '@/components/FaqSection'
import { ToolGuide } from '@/components/ToolGuide'
import { AdUnit } from '@/components/AdUnit'
import { ResponsiveAdFit } from '@/components/ResponsiveAdFit'

const LOAN_GUIDE = [
  { h: '대출이자 계산기란?', p: ['대출 원금, 금리, 기간을 입력하면 매달 갚을 금액과 총이자를 계산해주는 도구입니다. 주택담보대출·신용대출·전세자금대출의 상환 계획을 세울 때 유용합니다.'] },
  { h: '원리금균등 vs 원금균등', p: ['원리금균등상환은 매달 같은 금액(원금+이자)을 갚아 가계 계획을 세우기 쉽습니다. 원금균등상환은 매달 같은 원금에 이자가 점점 줄어 초기 부담은 크지만 총이자는 더 적습니다. 같은 조건이라면 보통 원금균등 방식의 총이자가 적습니다.'] },
  { h: '총이자를 줄이는 방법', p: ['상환기간을 줄이거나, 여윳돈이 생길 때 중도상환으로 원금을 빨리 갚으면 총이자가 줄어듭니다. 다만 중도상환수수료가 있는 상품은 수수료와 절감되는 이자를 비교해보는 것이 좋습니다.'] },
  { h: '주의사항', p: ['본 계산기는 고정금리 단순 계산입니다. 변동금리, 거치기간, 중도상환수수료, 보증료 등 실제 조건은 반영되지 않으므로 정확한 금액은 금융기관에 확인하세요.'] },
  {"h":"계산 예시: 3억 원, 연 4%, 30년","p":["원리금균등은 매달 약 1,432,000원을 360회 내고 총이자는 약 2억 1,560만 원입니다. 원금균등은 첫 달 약 1,833,000원에서 시작해 마지막 달 약 836,000원으로 줄고 총이자는 약 1억 8,050만 원입니다. 만기일시는 매달 이자 100만 원만 내다 만기에 3억 원을 갚으며 총이자가 3억 6,000만 원입니다.","같은 조건에서 기간을 20년으로 줄이면 원리금균등 월 상환액은 약 1,818,000원으로 늘지만 총이자는 약 1억 3,630만 원으로 8,000만 원 줄어듭니다. 금리가 0.1%포인트 오르면 30년 총이자는 약 630만 원 늘어납니다."]},
  {"h":"DSR과 LTV: 얼마까지 빌릴 수 있나","p":["LTV(담보인정비율)는 집값 대비 대출 한도입니다. 무주택자 기준 수도권 규제지역은 집값의 40~70% 선이며 지역·주택 수에 따라 다릅니다. DSR(총부채원리금상환비율)은 연 소득 대비 모든 대출의 연간 원리금 상환액 비율로, 은행권은 40%가 상한입니다.","연 소득 6,000만 원이면 연간 원리금 2,400만 원, 월 200만 원까지만 상환하는 대출이 가능합니다. 3억 원 30년 4% 대출의 월 상환액이 143만 원이므로 다른 대출이 없다면 가능하지만, 자동차 할부나 신용대출이 있으면 한도가 줄어듭니다. 스트레스 DSR이 적용되면 실제 금리보다 높은 금리로 한도를 계산해 더 줄어듭니다."]},
  {"h":"변동금리와 고정금리","p":["변동금리는 보통 6개월마다 기준금리(코픽스 등)에 따라 바뀌고, 고정금리는 약정 기간 동안 같습니다. 보통 고정금리가 변동보다 0.3~0.5%포인트 높게 시작하지만, 금리 상승기에는 고정이 유리합니다.","5년 고정 후 변동으로 바뀌는 혼합형이 주택담보대출의 주류입니다. 5년 뒤 금리 환경을 보고 대환(갈아타기)할 수 있으므로, 중도상환수수료 면제 시점과 맞춰 계획하세요."]},
  {"h":"대환과 중도상환 전략","p":["대출 후 3년이 지나면 대부분 중도상환수수료가 없어지므로, 이때 더 낮은 금리로 갈아타는 것이 총이자를 줄이는 가장 확실한 방법입니다. 온라인 대환대출 플랫폼에서 여러 은행 조건을 비교할 수 있습니다.","여윳돈이 생기면 금리가 높은 대출부터 갚고, 같은 금리라면 남은 기간이 긴 대출부터 갚으세요. 원리금균등 대출은 초반에 이자 비중이 크므로 초기 조기상환 효과가 가장 큽니다."]},
]

const LOAN_FAQ = [
  {
    q: '원리금균등과 원금균등 상환의 차이는?',
    a: '원리금균등은 매달 같은 금액(원금+이자)을 갚아 초기 부담이 일정합니다. 원금균등은 매달 같은 원금에 이자가 점점 줄어 초기 부담은 크지만 총이자는 더 적습니다.',
  },
  {
    q: '총이자를 줄이는 방법은?',
    a: '상환기간을 줄이거나, 원금균등 방식을 선택하거나, 여윳돈으로 중도상환해 원금을 빨리 줄이면 총이자가 감소합니다.',
  },
  {
    q: '거치기간이 무엇인가요?',
    a: '원금 상환 없이 이자만 내는 기간입니다. 거치 중에는 월 납입액이 적지만, 그만큼 원금이 안 줄어 총이자는 늘어납니다.',
  },
  {
    q: '실제 대출 이자와 다를 수 있나요?',
    a: '본 계산기는 고정금리 단순 계산입니다. 변동금리, 중도상환수수료, 보증료 등은 반영되지 않으므로 참고용으로 활용하세요.',
  },
  {"q":"원리금균등과 원금균등 중 뭐가 좋나요?","a":"총이자는 원금균등이 적지만 초반 월 상환액이 큽니다. 초기 부담을 감당할 수 있으면 원금균등, 매달 일정한 금액이 중요하면 원리금균등이 맞습니다. 3억 30년 4% 기준 차이는 약 3,500만 원입니다."},
  {"q":"거치기간이 뭔가요?","a":"원금을 갚지 않고 이자만 내는 기간입니다. 거치 2년이면 2년간 이자만 내고 이후 28년간 원리금을 갚습니다. 월 부담은 줄지만 총이자는 늘어납니다."},
  {"q":"금리 인하 요구권은 어떻게 쓰나요?","a":"승진·연봉 인상·신용점수 상승 등으로 신용 상태가 좋아지면 은행에 금리 인하를 요구할 수 있는 법적 권리입니다. 은행 앱에서 신청하면 보통 10영업일 안에 결과가 나옵니다."},
  {"q":"신용대출 금리는 왜 주담대보다 높나요?","a":"담보가 없어 은행의 손실 위험이 크기 때문입니다. 신용점수가 높아도 주담대보다 1~3%포인트 높게 형성되며, 한도는 연 소득 범위 안에서 정해집니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/loan' },
  title: '대출이자 계산기 - ontools',
  description:
    '대출금액, 이자율, 대출기간을 입력하면 원리금균등, 원금균등, 만기일시 세 가지 방식의 월 상환금과 총 이자를 계산합니다.',
  keywords: [
    '대출이자계산기',
    '대출계산기',
    '원리금균등',
    '원금균등',
    '만기일시',
    '주택담보대출',
    '대출금리',
    '대출상환',
    'LTV',
    'DTI',
  ],
  openGraph: {
    title: '대출이자 계산기 - ontools',
    description: '대출 상환방식별 월 상환금과 총 이자를 간편하게 계산하세요.',
    url: 'https://ontools.co.kr/loan',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function LoanPage() {
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
          <span className="text-foreground">금융</span>
          {' > '}
          <span className="text-foreground font-medium">대출이자 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대출이자 계산기</h1>
          <p className="text-muted-foreground">
            대출금액, 이자율, 기간을 입력하면 원리금균등/원금균등/만기일시 방식별 월 상환금과 총 이자를 계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        {/* 제목 밑 광고 (카카오 애드핏) */}
        <ResponsiveAdFit />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LoanCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="loan" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 사이드바 고정 광고 (PC 전용) */}
            <div className="hidden lg:block sticky top-20">
              <AdUnit placement="tool" />
            </div>
            {/* 대출 상환방식 비교 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">대출 상환방식 비교</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">원리금균등상환</h3>
                  <p>매달 동일한 금액을 상환합니다. 초기에는 이자 비중이 높고 후반으로 갈수록 원금 비중이 커집니다. 매달 같은 금액이라 가계 관리가 편합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">원금균등상환</h3>
                  <p>매달 동일한 원금을 상환하며 이자는 잔액에 따라 줄어듭니다. 초기 부담이 크지만 총 이자가 가장 적습니다. 장기 대출에 유리합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">만기일시상환</h3>
                  <p>매달 이자만 내고 만기에 원금 전액을 상환합니다. 월 부담은 적지만 총 이자가 가장 많고 만기에 목돈이 필요합니다.</p>
                </div>
              </div>
            </section>

            {/* 주택담보대출 금리 안내 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">주택담보대출 금리 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">고정금리 vs 변동금리</h3>
                  <p>고정금리는 대출 기간 내내 동일한 이율이 적용되어 안정적입니다. 변동금리는 기준금리에 따라 변동하며, 초기 금리가 낮은 편입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">혼합형 금리</h3>
                  <p>초기 일정 기간(보통 5년)은 고정금리, 이후 변동금리가 적용됩니다. 두 방식의 장점을 결합한 구조입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">금리 결정 요소</h3>
                  <p>한국은행 기준금리, COFIX(자금조달비용지수), 신용등급, LTV/DTI 비율 등에 따라 개인별 적용 금리가 달라집니다.</p>
                </div>
              </div>
            </section>

            {/* LTV/DTI 설명 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">LTV / DTI / DSR 이란?</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">LTV (담보인정비율)</h3>
                  <p>주택 가격 대비 대출 가능 비율. 투기지역 40%, 조정대상지역 50%, 기타 70%가 기준입니다. 예: 5억 주택, LTV 50%이면 최대 2.5억 대출 가능.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">DTI (총부채상환비율)</h3>
                  <p>연 소득 대비 연간 대출 원리금 상환액 비율. 주택담보대출 원리금 + 기타 대출 이자를 합산합니다. 보통 40~60% 이내로 제한됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">DSR (총부채원리금상환비율)</h3>
                  <p>모든 대출의 원리금 상환액을 연 소득으로 나눈 비율. DTI보다 엄격한 기준으로, 현재 40% 규제가 적용됩니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={LOAN_GUIDE} hideAd />
        <FaqSection items={LOAN_FAQ} />
        <RelatedTools current="/loan" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
