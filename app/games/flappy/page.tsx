import type { Metadata } from 'next'
import { GameFlappy } from './GameFlappy'

export const metadata: Metadata = {
  title: 'Flappy Bird - ontools',
  description: '탭해서 장애물을 피하며 날아가세요! 클래식 플래피 버드.',
  openGraph: {
    title: 'Flappy Bird - ontools',
    description: '탭해서 장애물을 피하며 날아가세요!',
    url: 'https://ontools.com/games/flappy',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function FlappyPage() {
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
          <span className="text-foreground font-medium">Flappy Bird</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flappy Bird</h1>
          <p className="text-muted-foreground">탭해서 장애물을 피하며 최대한 멀리 날아가세요!</p>
        </div>
        <GameFlappy />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
