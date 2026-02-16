import type { Metadata } from 'next'
import { GameGomoku } from './GameGomoku'

export const metadata: Metadata = {
  title: '오목 - ontools',
  description: 'AI와 대결하는 오목 게임. 먼저 다섯 개를 연속으로 놓으세요!',
  openGraph: {
    title: '오목 - ontools',
    description: 'AI와 대결하는 오목 게임.',
    url: 'https://ontools.com/games/gomoku',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function GomokuPage() {
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
          <span className="text-foreground font-medium">오목</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">오목</h1>
          <p className="text-muted-foreground">AI와 대결! 먼저 돌 다섯 개를 연속으로 놓으면 승리합니다.</p>
        </div>
        <GameGomoku />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
