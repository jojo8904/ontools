import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '소개 - ontools',
  description: 'ontools는 한국 실생활에 필요한 30여 종 계산기와 AI가 정리한 최신 뉴스를 무료로 제공하는 유틸리티 포털입니다.',
  robots: { index: true, follow: true },
}

export default function AboutPage() {
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
        <h1 className="text-3xl font-bold mb-2 text-[#241a33]">ontools 소개</h1>
        <p className="text-[#6b6276] mb-8">실생활에 필요한 계산, 여기서 한 번에.</p>

        <div className="space-y-8 text-[#444] leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">우리가 하는 일</h2>
            <p>
              ontools는 한국 실생활에 자주 필요한 <b>30여 종의 계산기</b>와 도구 관련 <b>최신 뉴스</b>를
              무료로 제공하는 유틸리티 포털입니다. 연봉 실수령액, 퇴직금, 종합소득세 같은 세금·노무 계산부터
              환율·대출·적금 등 금융, BMI·칼로리 같은 건강, 단위 변환·D-day 같은 생활 도구까지 한 곳에 모았습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">어떻게 만들어지나요</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><b>정확성</b> — 계산기는 2026년 기준 세율·요율 등 한국 제도를 반영해 설계했고, 각 계산기마다 계산 방법과 주의사항을 함께 설명합니다.</li>
              <li><b>최신 뉴스</b> — 도구와 관련된 뉴스를 정기적으로 자동 수집하고 AI로 핵심만 요약해 제공합니다. 원문은 각 언론사 링크로 연결됩니다.</li>
              <li><b>개인정보 보호</b> — 회원가입이 없으며, 계산기에 입력한 값은 서버로 전송되지 않고 이용자의 브라우저에서만 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">정확성과 면책</h2>
            <p>
              모든 계산 결과는 참고용 추정치입니다. 세율·환율·요율 등은 수시로 바뀌고 개인 상황에 따라 실제
              금액이 달라질 수 있으므로, 중요한 의사결정은 관계 기관이나 전문가의 확인을 거치시기 바랍니다.
              자세한 내용은 <Link href="/terms" className="text-[#2563eb] underline">이용약관</Link>과{' '}
              <Link href="/privacy" className="text-[#2563eb] underline">개인정보처리방침</Link>을 참고하세요.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">문의</h2>
            <p className="mb-3">서비스 개선 제안, 오류 제보, 기타 문의를 환영합니다.</p>
            <a
              href="mailto:830508jo@gmail.com?subject=%5Bontools%5D%20%EB%AC%B8%EC%9D%98"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              ✉️ 문의 메일 보내기
            </a>
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
