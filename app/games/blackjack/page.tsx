
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameBlackjack } from './GameBlackjack'

export const metadata: Metadata = {
  alternates: { canonical: '/games/blackjack' },
  title: '블랙잭 - ontools',
  description: '딜러와 21 카드 대결. 21에 가까이 가세요!',
  openGraph: {
    title: '블랙잭 - ontools',
    description: '딜러와 21 카드 대결.',
    url: 'https://ontools.co.kr/games/blackjack',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BlackjackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">블랙잭</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">블랙잭</h1>
          <p className="text-muted-foreground">딜러와 대결! 21에 가까이 가되, 넘지 마세요.</p>
        </div>
        <GameBlackjack />
        <GameGuide slug="blackjack" />
      </main>
      <SiteFooter />
    </div>
  )
}
