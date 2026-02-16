import type { Metadata } from 'next'
import { GameBlackjack } from './GameBlackjack'

export const metadata: Metadata = {
  title: '블랙잭 - ontools',
  description: '딜러와 21 카드 대결. 21에 가까이 가세요!',
  openGraph: {
    title: '블랙잭 - ontools',
    description: '딜러와 21 카드 대결.',
    url: 'https://ontools.com/games/blackjack',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BlackjackPage() {
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
          <span className="text-foreground font-medium">블랙잭</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">블랙잭</h1>
          <p className="text-muted-foreground">딜러와 대결! 21에 가까이 가되, 넘지 마세요.</p>
        </div>
        <GameBlackjack />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
