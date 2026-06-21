import type { Metadata } from 'next'
import { TextImage } from './TextImage'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '텍스트 이미지 생성기란?',
    p: [
      '명언, 짧은 글, 코드 조각, 메모를 SNS에 올리기 좋은 예쁜 이미지로 만들어주는 도구입니다. 인스타그램 피드·스토리, 블로그 썸네일 등에 활용할 수 있습니다.',
      '모든 작업은 브라우저 안에서 이뤄지며 입력 내용이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '텍스트를 입력하고 배경·글자 크기·색상을 고르면 오른쪽 미리보기에 바로 반영됩니다. 마음에 들면 "PNG 다운로드"를 누르세요.',
      '"코드" 모드를 선택하면 개발자들이 쓰는 코드 카드 스타일(창 점 3개, 고정폭 글꼴)로 만들어집니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '인스타 피드는 정사각형, 스토리는 세로, 블로그 썸네일은 가로 크기를 추천합니다.',
      '줄바꿈을 활용하면 문장이 더 또렷하게 보입니다.',
      'SNS 공유는 그 자체로 사이트·브랜드 홍보가 됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '텍스트 이미지 생성기 (명언·코드 카드) - ontools',
  description:
    '명언·글귀·코드·메모를 인스타·블로그용 예쁜 이미지로 만듭니다. 그라데이션 배경, 코드 카드 스타일 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '명언 이미지 만들기',
    '글귀 이미지',
    '텍스트 이미지',
    '코드 이미지',
    '카드뉴스 만들기',
    '인스타 글귀',
    'carbon 코드 이미지',
  ],
  openGraph: {
    title: '텍스트 이미지 생성기 (명언·코드 카드) - ontools',
    description: '명언·코드·메모를 예쁜 이미지로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/text-image',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function TextImagePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">텍스트 이미지 생성기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">텍스트 이미지 생성기</h1>
          <p className="text-muted-foreground">
            명언·코드·메모를 SNS에 올리기 좋은 예쁜 이미지로 만듭니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <TextImage />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS 게시물</h3>
                  <p>명언·글귀를 카드 형태로 만들어 인스타·페이스북에 올립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">코드 공유</h3>
                  <p>짧은 코드 스니펫을 예쁜 카드로 만들어 블로그·트위터에 공유합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">썸네일</h3>
                  <p>블로그 글 제목을 이미지로 만들어 대표 이미지로 사용합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  입력한 내용은 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 이미지로 만들어집니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/text-image" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
