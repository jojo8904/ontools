
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { SpecialChars } from './SpecialChars'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '특수문자 모음이란?',
    p: [
      '별(★), 하트(♥), 화살표(→), 원문자(①) 등 자주 쓰는 특수문자를 한곳에 모아 클릭 한 번으로 복사할 수 있는 페이지입니다.',
      '키보드로 입력하기 번거로운 문자를 빠르게 가져다 쓸 수 있습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '원하는 문자를 클릭하면 즉시 클립보드에 복사됩니다. 문서·채팅·SNS에 붙여넣기(Ctrl+V)만 하면 됩니다.',
      '최근 복사한 문자는 위쪽 "최근 복사" 칸에 모여 다시 쓰기 편합니다.',
    ],
  },
  {
    h: '알아두면 좋은 것',
    p: [
      '특수문자는 유니코드 문자라 대부분의 프로그램·사이트에서 그대로 표시됩니다. 다만 아주 오래된 시스템이나 일부 폰트에서는 □로 보일 수 있습니다.',
      '한글 자음 + 한자 키(예: ㅁ+한자)로도 일부 특수문자를 입력할 수 있지만, 여기서 복사하는 것이 훨씬 빠릅니다.',
    ],
  },
]

export const metadata: Metadata = {
  alternates: { canonical: '/special-chars' },
  title: '특수문자 모음 (클릭 복사) - ontools',
  description:
    '별·하트·화살표·도형·원문자·수학기호 등 자주 쓰는 특수문자 모음. 클릭 한 번으로 복사해서 바로 붙여넣으세요.',
  keywords: ['특수문자 모음', '특수문자', '별 특수문자', '하트 특수문자', '화살표 특수문자', '원문자', '특수기호'],
  openGraph: {
    title: '특수문자 모음 (클릭 복사) - ontools',
    description: '자주 쓰는 특수문자를 클릭 한 번에 복사.',
    url: 'https://ontools.co.kr/special-chars',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function SpecialCharsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">생활·유틸</span>
          {' > '}
          <span className="text-foreground font-medium">특수문자 모음</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">특수문자 모음</h1>
          <p className="text-muted-foreground">
            별·하트·화살표·원문자… 자주 쓰는 특수문자를 클릭 한 번으로 복사하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SpecialChars />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">문서·보고서</h3>
                  <p>①②③ 원문자, ※·§ 기호로 목록과 주석을 깔끔하게 만듭니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS·닉네임 꾸미기</h3>
                  <p>★♥✿ 같은 문자로 프로필·게시글을 꾸밉니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·상세페이지</h3>
                  <p>→ 화살표, ✓ 체크로 설명을 읽기 쉽게 정리합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">함께 쓰면 좋아요</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p><Link href="/character-counter" className="font-semibold text-blue-700 hover:underline">글자수 세기</Link> — 자소서·트윗 글자 수 확인</p>
                <p><Link href="/text-image" className="font-semibold text-blue-700 hover:underline">텍스트 이미지 생성기</Link> — 글귀를 이미지로</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/special-chars" />
      </main>

      <SiteFooter />
    </div>
  )
}
