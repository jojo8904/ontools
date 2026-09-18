import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import Link from 'next/link'
import { calculateSalaryTakeHome } from '@/features/salary/utils'
import { RelatedTools } from '@/components/RelatedTools'

export const metadata: Metadata = {
  alternates: { canonical: '/salary-table' },
  title: '2026 연봉 실수령액 표 (2,500만~1억원) - ontools',
  description:
    '2026년 기준 연봉별 월 실수령액 표. 연봉 2,500만원부터 1억원까지 100만원 단위로 4대보험·세금 공제 후 실수령액을 정리했습니다. 1인 가구(부양가족 0명) 기준.',
  keywords: [
    '연봉 실수령액 표',
    '연봉별 실수령액',
    '2026 실수령액',
    '월급 실수령액 표',
    '연봉 실수령액',
    '3000만원 실수령액',
    '5000만원 실수령액',
    '연봉 4000 실수령액',
  ],
  openGraph: {
    title: '2026 연봉 실수령액 표 (2,500만~1억원) - ontools',
    description: '연봉 2,500만~1억원 월 실수령액을 100만원 단위로 정리한 표.',
    url: 'https://ontools.co.kr/salary-table',
    siteName: 'ontools',
    type: 'article',
  },
}

const won = (n: number) => n.toLocaleString('ko-KR')

export default function SalaryTablePage() {
  const rows = []
  for (let man = 2500; man <= 10000; man += 100) {
    const annual = man * 10000
    const r = calculateSalaryTakeHome({ annualSalary: annual, dependents: 0, hasDisability: false })
    const deduction = r.monthlySalary - r.monthlyTakeHome
    rows.push({
      man,
      monthlySalary: r.monthlySalary,
      deduction,
      monthlyTakeHome: r.monthlyTakeHome,
      yearlyTakeHome: r.yearlyTakeHome,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">연봉·세금</span>
          {' > '}
          <span className="text-foreground font-medium">연봉 실수령액 표</span>
        </div>

        <h1 className="text-3xl font-bold mb-3 leading-tight">2026 연봉 실수령액 표</h1>
        <p className="text-gray-600 leading-relaxed mb-5">
          연봉 2,500만원부터 1억원까지, 4대보험과 세금을 뺀 <strong>월 실수령액</strong>을 100만원 단위로 정리했습니다.
          2026년 세율·보험요율 기준이며, <strong>1인 가구(부양가족 0명, 비과세 수당 없음)</strong>를 가정했습니다.
        </p>

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            부양가족·비과세 수당에 따라 실제 금액이 달라집니다. 내 조건으로 예상액을 보려면{' '}
            <Link href="/salary" className="font-bold text-blue-700 hover:underline">연봉 실수령액 계산기</Link>를 이용하세요.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">연봉</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">세전 월급</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">공제 합계(월)</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap text-blue-700">월 실수령액</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">연 실수령액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const highlight = row.man % 500 === 0
                return (
                  <tr key={row.man} className={highlight ? 'bg-[#FBF8F2] font-medium' : ''}>
                    <td className="px-3 py-2.5 whitespace-nowrap font-semibold text-gray-900">{won(row.man)}만원</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-gray-600">{won(row.monthlySalary)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-gray-500">-{won(row.deduction)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap font-bold text-blue-700">{won(row.monthlyTakeHome)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-gray-600">{won(row.yearlyTakeHome)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">2026년 7~12월 기준, 단위: 원. 사회보험 및 연간 예상 세액을 월로 나눈 추정치로 실제 간이세액표 원천징수와 다릅니다.</p>

        {/* 설명 */}
        <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-gray-700">
          <h2 className="text-xl font-bold text-[#241a33]">왜 연봉과 실수령액이 다른가요?</h2>
          <p>
            연봉을 12로 나눈 세전 월급에서 <strong>4대보험(국민연금 4.75%, 건강보험 3.595%, 장기요양보험, 고용보험 0.9%)</strong>과
            <strong> 소득세·지방소득세</strong>가 매달 공제됩니다. 그래서 통장에 들어오는 실수령액은 세전 월급보다 적습니다.
          </p>
          <p>
            연봉이 높을수록 소득세 누진세율(6~45%)이 올라가, 실수령률(연봉 대비 실수령 비율)은 조금씩 낮아집니다.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-700">
          <h2 className="text-xl font-bold text-[#241a33]">이 표를 볼 때 주의할 점</h2>
          <p>
            이 표는 <strong>부양가족이 없는 1인 가구</strong> 기준입니다. 부양가족이 있으면 인적공제로 소득세가 줄어 실수령액이 늘어납니다.
          </p>
          <p>
            식대 등 <strong>비과세 수당</strong>이 있으면 과세 대상이 줄어 실수령액이 더 많아질 수 있습니다. 회사 급여 규정과 상여금 지급 방식에 따라서도 달라지니, 계산기에서도 예상액을 확인할 수 있습니다.
          </p>
        </section>

        <div className="mt-10 rounded-xl border border-gray-200 bg-[#F2EEE6] p-6 text-center">
          <p className="text-gray-700 mb-3">내 연봉·부양가족 수로 예상 실수령액을 확인해 보세요.</p>
          <Link
            href="/salary"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
          >
            연봉 실수령액 계산기 열기
          </Link>
        </div>

        <RelatedTools current="/salary" />
      </main>

      <SiteFooter />
    </div>
  )
}
