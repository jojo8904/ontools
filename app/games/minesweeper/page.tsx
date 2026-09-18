
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameMinesweeper } from './GameMinesweeper'

export const metadata: Metadata = {
  alternates: { canonical: '/games/minesweeper' },
  title: '지뢰찾기 - ontools',
  description: '클래식 지뢰찾기 게임. 지뢰를 피해 모든 칸을 열어보세요.',
  openGraph: {
    title: '지뢰찾기 - ontools',
    description: '클래식 지뢰찾기 게임.',
    url: 'https://ontools.co.kr/games/minesweeper',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function MinesweeperPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">지뢰찾기</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">지뢰찾기</h1>
          <p className="text-muted-foreground">지뢰를 피해 모든 칸을 열어보세요. 9x9, 지뢰 10개.</p>
        </div>
        <GameMinesweeper />
        <GameGuide slug="minesweeper" />
      </main>
      <SiteFooter />
    </div>
  )
}
