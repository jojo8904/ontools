import type { Metadata } from 'next'
import { ImageSplit } from './ImageSplit'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '긴 이미지 분할이란?',
    p: [
      '세로로 긴 캡처나 가로로 긴 파노라마 사진을 여러 장으로 똑같이 나누는 도구입니다. 한 장으로는 올리기 어려운 긴 이미지를 조각내어 업로드할 때 사용합니다.',
      '모든 처리는 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '자르는 방향(위→아래 / 좌→우)과 조각 수(2~12개)를 정하고 "나누기"를 누르면, 똑같은 크기로 분할되어 미리보기로 표시됩니다.',
      '필요한 조각만 개별 저장하거나 "전체 ZIP 다운로드"로 한 번에 받을 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '인스타그램에 가로로 긴 사진을 여러 칸으로 이어 붙여 올리는 "파노라마 게시물"을 만들 때 좌→우 분할을 사용하세요.',
      '긴 세로 캡처(대화·웹페이지)는 위→아래로 나눠 여러 장으로 공유합니다.',
      '반대로 여러 장을 하나로 잇고 싶다면 "카톡 캡처 이어붙이기" 도구를 사용하세요.',
    ],
  },
]

export const metadata: Metadata = {
  title: '긴 이미지 분할 (여러 장으로 자르기) - ontools',
  description:
    '세로로 긴 캡처나 가로 파노라마를 똑같은 크기 여러 장으로 나눕니다. 인스타 파노라마 게시물 제작, 전체 ZIP 다운로드 지원. 서버로 전송되지 않습니다.',
  keywords: [
    '긴 사진 자르기',
    '이미지 분할',
    '긴 이미지 나누기',
    '인스타 파노라마',
    '사진 여러장으로 자르기',
    '긴 캡처 자르기',
    '이미지 등분',
    '사진 분할',
  ],
  openGraph: {
    title: '긴 이미지 분할 (여러 장으로 자르기) - ontools',
    description: '긴 캡처·파노라마를 여러 장으로 똑같이 분할. 인스타 파노라마 제작. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-split',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageSplitPage() {
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
          <span className="text-foreground font-medium">긴 이미지 분할</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">긴 이미지 분할</h1>
          <p className="text-muted-foreground">
            세로로 긴 캡처나 가로 파노라마를 똑같은 크기 여러 장으로 나눕니다. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageSplit />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">인스타 파노라마</h3>
                  <p>가로로 긴 사진을 여러 칸으로 나눠 이어지는 게시물로 올립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">긴 캡처 공유</h3>
                  <p>웹페이지·대화 긴 캡처를 여러 장으로 나눠 보기 좋게 공유합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">분할 인쇄</h3>
                  <p>큰 이미지를 여러 장으로 나눠 인쇄·편집에 활용합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 처리가 브라우저 안에서만 이뤄집니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/image-split" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
