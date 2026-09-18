
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameGomoku } from './GameGomoku'

export const metadata: Metadata = {
  alternates: { canonical: '/games/gomoku' },
  title: '오목 - ontools',
  description: 'AI와 대결하는 오목 게임. 먼저 다섯 개를 연속으로 놓으세요!',
  openGraph: {
    title: '오목 - ontools',
    description: 'AI와 대결하는 오목 게임.',
    url: 'https://ontools.co.kr/games/gomoku',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function GomokuPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">오목</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">오목</h1>
          <p className="text-muted-foreground">AI와 대결! 먼저 돌 다섯 개를 연속으로 놓으면 승리합니다.</p>
        </div>
        <GameGomoku />
        <GameGuide slug="gomoku" />
      </main>
      <SiteFooter />
    </div>
  )
}
