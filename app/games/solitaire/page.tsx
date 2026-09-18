
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameSolitaire } from './GameSolitaire'

export const metadata: Metadata = {
  alternates: { canonical: '/games/solitaire' },
  title: '솔리테어 - ontools',
  description: '클론다이크 솔리테어 카드게임. 카드를 정리해 4개의 기둥을 완성하세요.',
  openGraph: {
    title: '솔리테어 - ontools',
    description: '클론다이크 솔리테어 카드게임.',
    url: 'https://ontools.co.kr/games/solitaire',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SolitairePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">솔리테어</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">솔리테어</h1>
          <p className="text-muted-foreground">클론다이크 카드게임. 모든 카드를 기둥으로 옮기세요.</p>
        </div>
        <GameSolitaire />
        <GameGuide slug="solitaire" />
      </main>
      <SiteFooter />
    </div>
  )
}
