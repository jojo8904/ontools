import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용약관 - ontools',
  description: 'ontools 서비스 이용약관. 계산 결과의 참고용 안내, 책임의 한계, 저작권 등을 안내합니다.',
  robots: { index: true, follow: true },
}

const UPDATED = '2026년 6월 13일'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf8fc' }}>
      <header className="bg-white border-b border-[#eee]">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold text-[#111]">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-[#241a33]">이용약관</h1>
        <p className="text-sm text-[#999] mb-8">시행일: {UPDATED}</p>

        <div className="space-y-8 text-[#444] leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">1. 목적</h2>
            <p>
              본 약관은 ontools(이하 &lsquo;서비스&rsquo;)가 제공하는 계산기, 뉴스, 게임 등 콘텐츠 이용에
              관한 조건을 정합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">2. 계산 결과의 성격</h2>
            <p>
              서비스가 제공하는 모든 계산 결과(연봉 실수령액, 세금, 환율, 건강 지표 등)는
              <b> 참고용 추정치</b>이며 법적·재무적 효력을 가지지 않습니다. 세율·요율·환율 등은 수시로
              변동되며, 실제 금액은 개인 상황·관계 법령·금융기관 정책에 따라 달라질 수 있습니다. 중요한
              의사결정은 반드시 관련 기관·전문가의 확인을 거치시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">3. 책임의 한계</h2>
            <p>
              서비스는 정보의 정확성·완전성을 보장하기 위해 노력하지만, 이를 보증하지 않습니다. 이용자가
              본 서비스의 정보를 신뢰하여 내린 결정으로 발생한 손해에 대해 서비스는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">4. 외부 링크 및 광고</h2>
            <p>
              서비스에는 외부 사이트로 연결되는 링크와 제3자 광고(Google AdSense)가 포함될 수 있습니다.
              외부 사이트의 콘텐츠 및 광고에 대한 책임은 해당 사업자에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">5. 저작권</h2>
            <p>
              서비스의 디자인·콘텐츠에 대한 권리는 ontools에 있으며, 무단 복제·배포를 금합니다. 뉴스 콘텐츠의
              저작권은 각 언론사에 있으며, 서비스는 제목·요약과 원문 링크만 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">6. 약관의 변경</h2>
            <p>본 약관은 필요 시 변경될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.</p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-[#2563eb] hover:underline">← 홈으로</Link>
        </div>
      </main>

      <footer className="mt-auto border-t border-[#ece6f2]" style={{ backgroundColor: '#F7F3FB' }}>
        <div className="container mx-auto px-4 py-6 text-center text-sm text-[#8a8290]">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
