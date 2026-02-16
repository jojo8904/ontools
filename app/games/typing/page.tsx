import type { Metadata } from 'next'
import { GameTyping } from './GameTyping'

export const metadata: Metadata = {
  title: '타자연습 - ontools',
  description: '떨어지는 한글/영어 단어를 빠르게 타이핑하세요! 타자 속도 향상 게임.',
  openGraph: {
    title: '타자연습 - ontools',
    description: '떨어지는 단어를 빠르게 타이핑하세요!',
    url: 'https://ontools.com/games/typing',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function TypingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>{' > '}
          <a href="/games" className="hover:text-foreground">게임</a>{' > '}
          <span className="text-foreground font-medium">타자연습</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">타자연습</h1>
          <p className="text-muted-foreground">떨어지는 한글/영어 단어를 빠르게 타이핑하세요! 레벨이 올라갈수록 빨라집니다.</p>
        </div>
        <GameTyping />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
