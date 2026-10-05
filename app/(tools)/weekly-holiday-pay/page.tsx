
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { WeeklyHolidayPayCalculator } from './WeeklyHolidayPayCalculator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const WEEKLY_HOLIDAY_GUIDE = [
  { h: '주휴수당이란?', p: ['주휴수당은 1주 소정근로시간이 15시간 이상이고 약속한 근무일을 모두 개근한 근로자에게 주어지는 유급 주휴일에 대한 임금입니다. 정규직뿐 아니라 아르바이트·단시간 근로자도 조건을 충족하면 받을 수 있습니다.'] },
  { h: '계산 방법', p: ['주휴시간은 "(주 소정근로시간 ÷ 40) × 8"로 계산하며 최대 8시간입니다. 여기에 시급을 곱한 금액이 주휴수당입니다. 예를 들어 주 20시간 일하면 주휴시간은 4시간, 시급 1만원이면 주휴수당은 4만원입니다.'] },
  { h: '주의사항', p: ['주휴수당을 포함하면 실질 시급이 최저임금 이상이어야 합니다. 결근이 있으면 그 주의 주휴수당은 발생하지 않을 수 있습니다.'] },
  {"h":"계산 예시: 주 5일, 하루 4시간 알바","p":["주 20시간 근무는 주 15시간 이상이므로 주휴수당 대상입니다. 주 40시간 미만이라 비례 계산을 합니다. (20 ÷ 40) × 8시간 = 4시간이 주휴시간이고, 2026년 최저시급 10,320원이면 주당 41,280원입니다.","한 달은 약 4.345주이므로 월 주휴수당은 약 179,000원입니다. 근무시간 급여 월 약 897,000원에 더하면 월급은 약 1,076,000원이 되어, 주휴수당이 전체의 17%를 차지합니다.","같은 주 20시간이라도 주 2일 10시간씩 일하면 주휴수당은 같지만, 주 3일 중 하루를 결근하면 그 주는 받지 못합니다. 소정근로일 개근이 조건이기 때문입니다."]},
  {"h":"주휴수당이 생기지 않는 경우","p":["주 15시간 미만 근로자는 대상이 아닙니다. 다만 4주 평균으로 주 15시간 이상이면 대상이 되므로, 주마다 시간이 들쭉날쭉한 경우 4주 합계로 따져야 합니다.","결근한 주에는 주휴수당이 없습니다. 지각·조퇴는 결근이 아니라서 영향이 없고, 연차나 공휴일로 쉰 날은 출근한 것으로 봅니다. 회사 사정으로 쉰 휴업일도 마찬가지입니다.","주휴일 전에 퇴사하면 마지막 주의 주휴수당은 발생하지 않는 것이 고용노동부 해석입니다. 금요일까지 일하고 퇴사하면 그 주 일요일분은 없습니다."]},
  {"h":"'주휴수당 포함 시급'이 합법인지 확인하는 법","p":["시급에 주휴수당을 미리 얹어 주는 방식은 가능하지만, 나눠 봤을 때 기본 시급이 최저임금 이상이어야 합니다. 주 40시간 기준 주휴 포함 최저시급은 10,320 × 48 ÷ 40 = 12,384원입니다.","'주휴 포함 11,500원'처럼 이보다 낮으면 최저임금 위반입니다. 근로계약서에 기본 시급과 주휴수당이 따로 적혀 있는지 확인하고, 급여명세서에 주휴 항목이 구분돼 있는지 보세요."]},
  {"h":"못 받은 주휴수당 청구하기","p":["근로계약서, 출퇴근 기록(카톡·문자도 증거가 됩니다), 급여 입금 내역을 모아 사업장에 먼저 요청하세요. 해결되지 않으면 고용노동부 홈페이지나 관할 노동청에 임금체불 진정을 제기할 수 있습니다.","임금채권 소멸시효는 3년이므로 퇴사 후에도 3년 안에는 청구할 수 있습니다. 5인 미만 사업장도 주휴수당은 적용됩니다."]},
]

const EXTRA_FAQ = [
  {"q":"주 15시간을 딱 맞춰 일하면 받나요?","a":"네, 15시간 이상이면 대상입니다. 14시간 59분은 해당되지 않습니다. 근로계약서상 소정근로시간 기준이며, 계약과 실제 근무가 다르면 실제 근무시간으로 판단합니다."},
  {"q":"월급제인데 주휴수당을 따로 받아야 하나요?","a":"월급제는 보통 209시간(주휴 포함) 기준이라 주휴수당이 월급에 이미 들어 있습니다. 월급 ÷ 209시간이 최저시급 이상이면 정상입니다. 시급제·일급제만 별도로 받습니다."},
  {"q":"주휴수당에도 세금이 붙나요?","a":"네. 주휴수당은 임금이므로 다른 급여와 합산해 소득세와 4대보험이 적용됩니다. 월 소득이 적으면 세금은 거의 없지만 고용보험료 0.9%는 붙을 수 있습니다."},
  {"q":"일주일에 6일 일하면 주휴수당이 더 많나요?","a":"아니요. 주휴수당은 하루치(최대 8시간분)가 상한입니다. 주 48시간을 일해도 주휴시간은 8시간이고, 40시간을 넘는 근로는 연장근로수당으로 따로 계산됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/weekly-holiday-pay' },
  title: '주휴수당 계산기 - ontools',
  description:
    '시급, 주 근무시간, 근무일수를 입력하면 주휴수당, 주급, 월 예상 급여를 자동 계산합니다. 2026년 최저시급 기준 주휴수당 계산.',
  keywords: [
    '주휴수당계산기',
    '주휴수당',
    '주휴수당계산',
    '알바주급',
    '최저시급',
    '주급계산',
    '알바급여',
    '주휴시간',
    '시급계산기',
  ],
  openGraph: {
    title: '주휴수당 계산기 - ontools',
    description: '주휴수당과 월 예상 급여를 계산하세요.',
    url: 'https://ontools.co.kr/weekly-holiday-pay',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function WeeklyHolidayPayPage() {
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
          <span className="text-foreground font-medium">주휴수당 계산기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">주휴수당 계산기</h1>
          <p className="text-muted-foreground">
            시급과 근무시간을 입력하면 주휴수당, 주급, 월 예상 급여를 계산합니다.
          </p>
        </div>

        {/* Calculator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <WeeklyHolidayPayCalculator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="weekly-holiday-pay" />
            </div>
          </div>

          <aside className="space-y-6">
            {/* 주휴수당 지급 조건 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">주휴수당 지급 조건</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">기본 요건</h3>
                  <p>주 15시간 이상 근무하는 근로자에게 유급 주휴일을 부여해야 합니다. 1주 소정근로일을 개근한 경우 주휴수당이 발생합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">적용 대상</h3>
                  <p>정규직, 계약직, 아르바이트 등 고용 형태에 관계없이 주 15시간 이상 근무하면 모두 해당됩니다. 5인 미만 사업장도 포함됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">지급하지 않는 경우</h3>
                  <p>주 15시간 미만 단시간 근로자, 해당 주 결근이 있는 경우(지각/조퇴 제외), 4주 이내의 단기 근로자는 제외됩니다.</p>
                </div>
              </div>
            </section>

            {/* 2026년 최저시급 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">2026년 최저시급</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-600 font-semibold mb-1">시간당</p>
                  <p className="text-2xl font-bold text-blue-900">10,320원</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-3 font-semibold">구분</th>
                        <th className="text-right py-1.5 font-semibold">금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-3">일급 (8시간)</td>
                        <td className="py-1.5 text-right font-medium">82,560원</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">주급 (40시간+주휴)</td>
                        <td className="py-1.5 text-right font-medium">481,440원</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">월급 (209시간)</td>
                        <td className="py-1.5 text-right font-medium">2,156,880원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>209시간 = (주 40시간 + 주휴 8시간) x 365일 / 7일 / 12개월</p>
              </div>
            </section>

            {/* 계산 공식 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">주휴수당 계산 공식</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">주휴시간</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    주휴시간 = 1주 소정근로시간 / 40 x 8
                  </p>
                  <p className="mt-1">주 40시간 이상 근무 시 최대 8시간. 주 20시간 근무 시 주휴시간 4시간.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">주휴수당</h3>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs">
                    주휴수당 = 시급 x 주휴시간
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">예시</h3>
                  <p>시급 10,320원, 주 40시간 근무 시:</p>
                  <p>주휴시간 = 40/40 x 8 = 8시간</p>
                  <p>주휴수당 = 10,320 x 8 = 82,560원/주</p>
                </div>
              </div>
            </section>

            {/* 알바 급여 팁 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">알바 급여 체크리스트</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">근로계약서 확인</h3>
                  <p>시급, 근무시간, 주휴수당 포함 여부를 반드시 근로계약서에 명시해야 합니다. 서면 미교부 시 500만원 이하 벌금.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">야간·연장·휴일 가산수당</h3>
                  <p>야간근로(22시~06시) 50% 가산, 연장근로(주 40시간 초과) 50% 가산, 휴일근로 50% 가산(8시간 초과 시 100%).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">4대보험</h3>
                  <p>주 15시간 이상, 1개월 이상 근무 시 4대보험 가입 대상입니다. 국민연금·건강보험은 사업주와 반반 부담합니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={WEEKLY_HOLIDAY_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/weekly-holiday-pay" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
