import type { Metadata } from 'next'
import { Watermark } from './Watermark'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '워터마크란?',
    p: [
      '사진이나 이미지 위에 글자나 로고를 겹쳐 넣어, 출처를 표시하고 무단 도용을 막는 표식입니다. 블로그·쇼핑몰 사진, 작품 이미지 등에 사용합니다.',
      '모든 작업은 브라우저 안에서 이뤄지며 이미지가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '이미지를 올린 뒤 텍스트(또는 로고 이미지)를 정하고, 크기·투명도·위치를 조절하면 미리보기에 바로 반영됩니다.',
      '"한 곳"은 모서리 등 한 위치에, "전체 반복"은 이미지 전체에 사선으로 반복 표시합니다. 도용 방지에는 전체 반복이 효과적입니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '투명도를 낮추면 사진을 가리지 않으면서 표식만 은은하게 남길 수 있습니다.',
      '로고는 배경이 투명한 PNG를 사용하면 자연스럽게 얹힙니다.',
      '제출용 서류라면 "○○ 제출용"처럼 용도를 적어 다른 곳에 쓰이지 않도록 할 수 있습니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '이미지 워터마크 넣기 (텍스트·로고) - ontools',
  description:
    '사진에 텍스트나 로고 워터마크를 넣습니다. 위치·크기·투명도 조절, 전체 반복 지원. 출처 표시·도용 방지에 사용. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '워터마크 넣기',
    '사진 워터마크',
    '이미지 워터마크',
    '로고 삽입',
    '저작권 표시',
    '워터마크 만들기',
    '사진 도용방지',
  ],
  openGraph: {
    title: '이미지 워터마크 넣기 (텍스트·로고) - ontools',
    description: '사진에 텍스트·로고 워터마크를. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/watermark',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function WatermarkPage() {
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
          <span className="text-foreground font-medium">워터마크 넣기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 워터마크 넣기</h1>
          <p className="text-muted-foreground">
            사진에 텍스트나 로고 워터마크를 넣어 출처를 표시하고 도용을 막습니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Watermark />
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·쇼핑몰 사진</h3>
                  <p>상품·콘텐츠 사진에 출처를 표시해 무단 사용을 줄입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">작품·포트폴리오</h3>
                  <p>일러스트·디자인 작업물에 서명처럼 로고를 넣습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제출용 사본</h3>
                  <p>"○○ 제출용" 표식을 넣어 사본이 다른 용도로 쓰이는 것을 예방합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  이미지는 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 처리됩니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/watermark" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
