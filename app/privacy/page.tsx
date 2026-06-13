import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보처리방침 - ontools',
  description: 'ontools 개인정보처리방침. 수집하는 정보, 쿠키 및 광고, 제3자 서비스, 이용자 권리를 안내합니다.',
  robots: { index: true, follow: true },
}

const UPDATED = '2026년 6월 13일'
const CONTACT = '[연락처 이메일을 입력하세요]' // TODO: 실제 문의 이메일로 교체

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-2 text-[#241a33]">개인정보처리방침</h1>
        <p className="text-sm text-[#999] mb-8">시행일: {UPDATED}</p>

        <div className="space-y-8 text-[#444] leading-relaxed text-[15px]">
          <section>
            <p>
              ontools(이하 &lsquo;서비스&rsquo;)는 이용자의 개인정보를 중요하게 생각하며, 관련 법령을 준수합니다.
              본 방침은 서비스가 어떤 정보를 다루는지, 광고·쿠키가 어떻게 사용되는지를 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">1. 수집하는 개인정보</h2>
            <p>
              본 서비스는 <b>회원가입·로그인 기능이 없으며</b>, 계산기 이용을 위해 이름·연락처 등
              개인정보를 수집하거나 서버에 저장하지 않습니다. 계산기에 입력하는 값(연봉, 키·몸무게 등)은
              이용자의 브라우저에서만 처리되며 서버로 전송·저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">2. 브라우저 로컬 저장(localStorage)</h2>
            <p>
              &lsquo;즐겨찾기&rsquo;, &lsquo;최근 본 계산기&rsquo; 기능은 편의를 위해 이용자
              <b> 기기(브라우저)에만</b> 저장되며 서버로 전송되지 않습니다. 브라우저 설정에서 언제든
              삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">3. 쿠키 및 광고</h2>
            <p>
              본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google 등 제3자 광고 사업자는 쿠키를
              사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li>
                Google의 광고 쿠키 사용 방식은{' '}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] underline">
                  Google 광고 정책
                </a>
                에서 확인할 수 있습니다.
              </li>
              <li>
                맞춤형 광고는{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] underline">
                  Google 광고 설정
                </a>
                에서 비활성화할 수 있습니다.
              </li>
              <li>브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">4. 제3자 서비스</h2>
            <p>본 서비스는 다음의 외부 서비스를 이용합니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li><b>Google AdSense</b> — 광고 게재 (쿠키 사용)</li>
              <li><b>Vercel</b> — 웹사이트 호스팅</li>
              <li><b>Supabase</b> — 뉴스·환율 등 공개 데이터 제공 (개인정보 미포함)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">5. 이용자의 권리</h2>
            <p>
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나, 위 Google 광고 설정에서 맞춤형 광고를
              비활성화할 수 있습니다. 본 서비스는 개인정보를 별도로 보관하지 않으므로 열람·정정·삭제 대상이 되는
              서버 저장 정보가 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">6. 문의</h2>
            <p>개인정보 관련 문의: {CONTACT}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">7. 방침의 변경</h2>
            <p>
              본 방침은 법령·서비스 변경에 따라 수정될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
            </p>
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
