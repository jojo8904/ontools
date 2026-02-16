import type { Metadata } from 'next'
import { GameMinesweeper } from './GameMinesweeper'

export const metadata: Metadata = {
  title: '지뢰찾기 - ontools',
  description: '클래식 지뢰찾기 게임. 지뢰를 피해 모든 칸을 열어보세요.',
  openGraph: {
    title: '지뢰찾기 - ontools',
    description: '클래식 지뢰찾기 게임.',
    url: 'https://ontools.com/games/minesweeper',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function MinesweeperPage() {
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
          <span className="text-foreground font-medium">지뢰찾기</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">지뢰찾기</h1>
          <p className="text-muted-foreground">지뢰를 피해 모든 칸을 열어보세요. 9x9, 지뢰 10개.</p>
        </div>
        <GameMinesweeper />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
