
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { Game2048 } from './Game2048'

export const metadata: Metadata = {
  alternates: { canonical: '/games/2048' },
  title: '2048 게임 - ontools',
  description: '숫자 타일을 합쳐 2048을 만들어보세요. 방향키/스와이프로 조작.',
  openGraph: {
    title: '2048 게임 - ontools',
    description: '숫자 타일을 합쳐 2048을 만들어보세요.',
    url: 'https://ontools.co.kr/games/2048',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function Game2048Page() {
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
          <span className="text-foreground font-medium">2048</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">2048</h1>
          <p className="text-muted-foreground">
            같은 숫자 타일을 합쳐서 2048을 만들어보세요.
          </p>
        </div>

        <Game2048 />
        <GameGuide slug="2048" />
      </main>

      <SiteFooter />
    </div>
  )
}
