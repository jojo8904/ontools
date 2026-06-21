import type { Metadata } from 'next'
import { ImageStitch } from './ImageStitch'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '캡처 이어붙이기란?',
    p: [
      '카카오톡 대화, 긴 웹페이지, 여러 장의 캡처를 하나의 긴 이미지로 합쳐주는 도구입니다. 여러 장을 따로 보내는 대신 한 장으로 깔끔하게 정리할 수 있습니다.',
      '모든 처리는 브라우저 안에서만 이뤄지며, 이미지가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '이미지를 여러 장 올린 뒤, 화살표(↑↓)로 순서를 맞추고 "이어붙이기"를 누르면 됩니다.',
      '세로(↓)는 카톡 대화·긴 글 캡처에, 가로(→)는 나란히 비교할 때 적합합니다. 폭이 다른 이미지는 가장 넓은 폭에 맞춰 자동 정렬됩니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '캡처는 같은 기기에서 같은 너비로 찍으면 가장 깔끔하게 이어집니다.',
      '이미지 사이에 여백을 주고 싶으면 "간격(px)"과 "간격 색상"을 조절하세요.',
      '결과는 PNG로 저장되어 화질 손상 없이 그대로 보관됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '카톡 캡처 이어붙이기 (이미지 합치기) - ontools',
  description:
    '여러 장의 캡처·이미지를 세로 또는 가로로 하나로 이어붙입니다. 카카오톡 대화 캡처, 긴 화면 합치기에 사용. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '캡처 이어붙이기',
    '이미지 합치기',
    '사진 합치기',
    '카톡 캡처 합치기',
    '스크린샷 합치기',
    '세로로 이어붙이기',
    '이미지 결합',
  ],
  openGraph: {
    title: '카톡 캡처 이어붙이기 (이미지 합치기) - ontools',
    description: '여러 캡처를 하나의 긴 이미지로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-stitch',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageStitchPage() {
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
          <span className="text-foreground font-medium">캡처 이어붙이기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">카톡 캡처 이어붙이기</h1>
          <p className="text-muted-foreground">
            여러 장의 캡처·이미지를 세로 또는 가로로 하나로 합칩니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageStitch />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">카카오톡 대화 보관</h3>
                  <p>여러 장으로 나뉜 대화 캡처를 하나로 이어 증빙·기록용으로 저장합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">긴 화면 캡처</h3>
                  <p>스크롤이 긴 웹페이지나 문서를 나눠 찍은 뒤 하나로 합칩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">비교 이미지</h3>
                  <p>가로로 이어붙여 전후 비교, 옵션 비교 등을 한눈에 보여줍니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  올린 이미지는 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 대화 캡처처럼 민감한 내용도 외부로 새어 나갈 걱정 없이 합칠 수 있습니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/image-stitch" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
