
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { SpecialChars } from './SpecialChars'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"자주 찾는 특수문자","p":["화살표 → ← ↑ ↓ ⇒, 체크 ✓ ✔ ☑, 별 ★ ☆, 하트 ♥ ♡, 원 ● ○ ◎, 네모 ■ □, 세모 ▲ △ ▼, 점 · ‥ …, 괄호 「」『』【】〈〉, 단위 ℃ ℉ ㎡ ㎞ ㎏, 수학 ± × ÷ ≠ ≤ ≥ ∞ √ ∑, 통화 ₩ $ € ¥ £, 기타 ※ ☎ ✉ ☞ ♪ ♬ 가 많이 쓰입니다.","원 숫자 ①②③, 로마 숫자 ⅠⅡⅢ, 분수 ½ ⅓ ¼, 위첨자 ² ³ 도 문서 작성에 자주 필요합니다. 항목을 누르면 복사됩니다."]},
  {"h":"키보드로 입력하는 방법","p":["윈도우 한글 입력 상태에서 자음(ㅁ·ㄴ·ㅇ 등)을 친 뒤 한자 키를 누르면 특수문자 표가 뜹니다. ㅁ은 도형·괄호, ㄴ은 괄호·따옴표, ㅇ은 원 숫자, ㄹ은 단위, ㅎ은 그리스 문자입니다.","맥은 Control + Command + Space로 문자 뷰어를 열고, 윈도우는 Win + . (마침표)로 이모지·기호 패널을 엽니다. 자주 쓰는 기호는 복사해 두는 것이 가장 빠릅니다."]},
  {"h":"깨지는 문자와 안 깨지는 문자","p":["유니코드 기본 영역의 기호(★ ※ → ℃ 등)는 거의 모든 기기에서 표시됩니다. 이모지(😀 🎉)는 기기·OS마다 모양이 다르고 오래된 시스템에서는 네모로 깨집니다.","공식 서류·공공기관 입력창은 EUC-KR 기반이라 일부 유니코드 기호를 '?'로 바꿉니다. 제출용 문서에는 한자 키로 입력되는 기본 기호만 쓰는 것이 안전합니다."]},
  {"h":"SNS 이름·닉네임 꾸미기","p":["인스타·카톡 이름에 ★ ♡ ✿ 같은 기호를 넣는 것은 대부분 허용되지만, 일부 서비스는 특정 기호를 금지하거나 검색에서 제외합니다. 기호가 많으면 검색으로 찾기 어려워지니 한두 개만 쓰세요.","특수문자로 꾸민 글꼴 모양 문자(𝓗𝓮𝓵𝓵𝓸 등)는 스크린리더가 읽지 못하고 검색에도 걸리지 않습니다. 접근성이 필요한 곳에는 피하세요."]},
]

const EXTRA_FAQ = [
  {"q":"복사했는데 붙여넣으면 네모로 나와요.","a":"붙여 넣는 프로그램이 그 문자를 지원하는 글꼴이 없을 때 생깁니다. 다른 글꼴로 바꾸거나 더 기본적인 기호(한자 키 입력 가능 기호)로 대체하세요."},
  {"q":"엑셀에서 특수문자를 수식에 쓸 수 있나요?","a":"텍스트로는 가능하지만 수식 연산자는 반각 기호(* / + -)만 인식합니다. 전각 ×나 ÷를 수식에 넣으면 오류가 납니다."},
  {"q":"한자 키가 없는 노트북은요?","a":"오른쪽 Ctrl 또는 Alt + 한자 조합, 또는 Win + . 이모지 패널을 쓰세요. 이 페이지에서 복사하는 것이 가장 간단합니다."},
  {"q":"기호에도 저작권이 있나요?","a":"유니코드 기호 자체는 자유롭게 쓸 수 있습니다. 다만 특정 회사 로고 모양 기호(Apple 로고 등)는 상표권이 있어 상업적 사용에 주의하세요."},
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/special-chars" />
      </main>

      <SiteFooter />
    </div>
  )
}
