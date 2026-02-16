import type { Metadata } from 'next'
import { GameMemory } from './GameMemory'

export const metadata: Metadata = {
  title: '메모리 카드 - ontools',
  description: '카드를 뒤집어 같은 짝을 찾으세요! 기억력 테스트 게임.',
  openGraph: {
    title: '메모리 카드 - ontools',
    description: '카드를 뒤집어 같은 짝을 찾으세요!',
    url: 'https://ontools.com/games/memory',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function MemoryPage() {
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
          <span className="text-foreground font-medium">메모리 카드</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">메모리 카드</h1>
          <p className="text-muted-foreground">카드를 뒤집어 같은 짝을 찾으세요! 최소 이동으로 클리어하세요.</p>
        </div>
        <GameMemory />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">&copy; 2026 ontools. All rights reserved.</div>
      </footer>
    </div>
  )
}
