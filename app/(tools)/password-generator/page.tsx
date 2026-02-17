import type { Metadata } from 'next'
import { PasswordGenerator } from './PasswordGenerator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'

export const metadata: Metadata = {
  title: '비밀번호 생성기 - ontools',
  description: '안전한 랜덤 비밀번호를 생성하세요. 길이 조절, 대문자/숫자/특수문자 포함 여부 선택 가능.',
  keywords: ['비밀번호생성기', '패스워드생성', '랜덤비밀번호', '안전한비밀번호', '비밀번호만들기'],
  openGraph: { title: '비밀번호 생성기 - ontools', description: '안전한 랜덤 비밀번호를 생성하세요.', url: 'https://ontools.co.kr/password-generator', siteName: 'ontools', type: 'website' },
}

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b"><div className="container mx-auto px-4 py-4"><a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"><img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold">ontools</span></a></div></header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><a href="/" className="hover:text-foreground">홈</a>{' > '}<span className="text-foreground">유틸리티</span>{' > '}<span className="text-foreground font-medium">비밀번호 생성기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">비밀번호 생성기</h1><p className="text-muted-foreground">안전한 랜덤 비밀번호를 간편하게 생성하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PasswordGenerator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="password-generator" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">안전한 비밀번호 가이드</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>12자 이상</strong>을 권장합니다. 길이가 길수록 무차별 대입 공격에 강합니다.</p>
                <p>대소문자, 숫자, 특수문자를 조합하면 보안이 크게 강화됩니다.</p>
                <p>개인정보(이름, 생년월일, 전화번호)는 절대 비밀번호에 사용하지 마세요.</p>
              </div>
            </section>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">비밀번호 관리 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>사이트마다 서로 다른 비밀번호를 사용하세요.</p>
                <p>비밀번호 관리자(1Password, Bitwarden 등)를 활용하면 편리합니다.</p>
                <p>가능하면 2단계 인증(2FA)을 함께 설정하세요.</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <footer className="border-t mt-auto"><div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div></footer>
    </div>
  )
}
