import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  alternates: { canonical: '/youth-savings' },
  robots: { index: false, follow: true },
  title: '청년내일채움공제 안내 - ontools',
  description: '신규 신청 중단 안내와 기존 가입자 공식 확인 경로입니다.',
}

export default function YouthSavingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-10 space-y-5">
        <h1 className="text-2xl font-bold">청년내일채움공제 안내</h1>
        <p>청년내일채움공제는 2024년부터 신규 신청이 중단되었습니다.</p>
        <p className="text-gray-600 leading-relaxed">
          기존 계산기는 가입연도별 지원 조건을 구분하지 않아 제공을 중단했습니다.
          기존 가입자의 만기금·중도해지금은 가입 약정과 납입 이력을 기준으로 운영기관에 확인해주세요.
        </p>
        <a className="block text-blue-700 underline" href="https://1350.moel.go.kr/rtmview.do?id=1000298780" target="_blank" rel="noopener noreferrer">고용노동부 공식 안내</a>
        <Link className="inline-block text-blue-700 underline" href="/savings">일반 적금·예금 계산기</Link>
      </main>
      <SiteFooter />
    </div>
  )
}
