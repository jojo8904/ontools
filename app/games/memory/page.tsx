
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GameGuide } from '@/components/GameGuide'
import { GameMemory } from './GameMemory'

export const metadata: Metadata = {
  alternates: { canonical: '/games/memory' },
  title: '메모리 카드 - ontools',
  description: '카드를 뒤집어 같은 짝을 찾으세요! 기억력 테스트 게임.',
  openGraph: {
    title: '메모리 카드 - ontools',
    description: '카드를 뒤집어 같은 짝을 찾으세요!',
    url: 'https://ontools.co.kr/games/memory',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function MemoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>{' > '}
          <Link href="/games" className="hover:text-foreground">게임</Link>{' > '}
          <span className="text-foreground font-medium">메모리 카드</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">메모리 카드</h1>
          <p className="text-muted-foreground">카드를 뒤집어 같은 짝을 찾으세요! 최소 이동으로 클리어하세요.</p>
        </div>
        <GameMemory />
        <GameGuide slug="memory" />
      </main>
      <SiteFooter />
    </div>
  )
}
