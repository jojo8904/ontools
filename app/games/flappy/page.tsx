
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameFlappy } from './GameFlappy'

export const metadata: Metadata = {
  alternates: { canonical: '/games/flappy' },
  title: 'Flappy Bird - ontools',
  description: '탭해서 장애물을 피하며 날아가세요! 클래식 플래피 버드.',
  openGraph: {
    title: 'Flappy Bird - ontools',
    description: '탭해서 장애물을 피하며 날아가세요!',
    url: 'https://ontools.co.kr/games/flappy',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function FlappyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">Flappy Bird</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flappy Bird</h1>
          <p className="text-muted-foreground">탭해서 장애물을 피하며 최대한 멀리 날아가세요!</p>
        </div>
        <GameFlappy />
        <GameGuide slug="flappy" />
      </main>
      <SiteFooter />
    </div>
  )
}
