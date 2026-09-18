
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameTetris } from './GameTetris'

export const metadata: Metadata = {
  alternates: { canonical: '/games/tetris' },
  title: '테트리스 - ontools',
  description: '클래식 테트리스 게임. 블록을 쌓아 줄을 완성하세요.',
  openGraph: {
    title: '테트리스 - ontools',
    description: '클래식 테트리스 게임. 블록을 쌓아 줄을 완성하세요.',
    url: 'https://ontools.co.kr/games/tetris',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function TetrisPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
          {' > '}
          <Link href="/games" className="hover:text-foreground">
            게임
          </Link>
          {' > '}
          <span className="text-foreground font-medium">테트리스</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">테트리스</h1>
          <p className="text-muted-foreground">
            블록을 쌓아 줄을 완성하세요. 레벨업하면 속도가 빨라집니다.
          </p>
        </div>

        <GameTetris />
        <GameGuide slug="tetris" />
      </main>

      <SiteFooter />
    </div>
  )
}
