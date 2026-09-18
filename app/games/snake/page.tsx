
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameSnake } from './GameSnake'

export const metadata: Metadata = {
  alternates: { canonical: '/games/snake' },
  title: '스네이크 게임 - ontools',
  description: '클래식 스네이크 게임. 먹이를 먹고 점점 길어지는 뱀을 조종하세요.',
  openGraph: {
    title: '스네이크 게임 - ontools',
    description: '클래식 스네이크 게임.',
    url: 'https://ontools.co.kr/games/snake',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SnakePage() {
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
          <span className="text-foreground font-medium">스네이크</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">스네이크</h1>
          <p className="text-muted-foreground">
            먹이를 먹고 점점 길어지는 뱀을 조종하세요. 벽이나 몸에 부딪히면
            게임오버!
          </p>
        </div>

        <GameSnake />
        <GameGuide slug="snake" />
      </main>

      <SiteFooter />
    </div>
  )
}
