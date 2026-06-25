import type { Metadata } from 'next'
import { BgRemove } from './BgRemove'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '배경 제거(누끼)란?',
    p: [
      '사진에서 인물이나 물건만 남기고 배경을 투명하게 지우는 도구입니다. 흔히 "누끼 딴다"고 표현합니다. 상품 사진, 프로필, 합성용 이미지를 만들 때 사용합니다.',
      '핵심 처리는 브라우저(내 컴퓨터) 안에서 AI가 직접 수행하며, 사진이 서버로 전송되지 않습니다. AI 모델 파일만 처음 한 번 다운로드됩니다.',
    ],
  },
  {
    h: '처음 한 번은 조금 느려요',
    p: [
      '배경을 자동으로 인식하려면 AI 모델이 필요한데, 이 모델을 처음 사용할 때 한 번 내려받습니다(수십 초가 걸릴 수 있어요). 두 번째부터는 빠르게 처리됩니다.',
      '인터넷이 느리면 모델 다운로드가 오래 걸릴 수 있습니다. PC·와이파이 환경을 권장합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '제거 후 배경을 투명(PNG)·흰색·원하는 색으로 바꿔 저장할 수 있습니다. 합성·로고용은 투명, 증명/상품용은 흰색이 편합니다.',
      '인물·물건과 배경의 경계가 뚜렷할수록 결과가 깔끔합니다. 머리카락·털처럼 복잡한 경계는 다소 거칠 수 있습니다.',
      '투명 배경을 유지하려면 반드시 PNG로 저장하세요. JPG는 투명을 지원하지 않습니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '배경 제거 (누끼 따기) - ontools',
  description:
    '사진에서 인물·물건만 남기고 배경을 자동으로 지웁니다. 투명 PNG·흰 배경 저장 지원. 브라우저에서 AI가 처리해 사진이 서버로 전송되지 않습니다.',
  keywords: [
    '배경 제거',
    '누끼 따기',
    '사진 배경 지우기',
    '배경 투명',
    '누끼',
    '이미지 배경 제거',
    '사진 배경 제거',
    '투명 배경 만들기',
  ],
  openGraph: {
    title: '배경 제거 (누끼 따기) - ontools',
    description: '사진 배경을 자동으로 제거. 투명 PNG·흰 배경 저장. 브라우저에서 AI 처리, 서버 전송 없음.',
    url: 'https://ontools.co.kr/bg-remove',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BgRemovePage() {
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
          <span className="text-foreground font-medium">배경 제거</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">배경 제거 (누끼)</h1>
          <p className="text-muted-foreground">
            사진에서 인물·물건만 남기고 배경을 자동으로 지웁니다. 브라우저에서 AI가 처리해 사진이 서버로 전송되지 않아요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <BgRemove />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">상품·중고거래 사진</h3>
                  <p>물건만 깔끔하게 남겨 흰 배경 상세컷으로 만듭니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로필·합성</h3>
                  <p>인물만 오려내 다른 배경에 합성하거나 투명 PNG로 활용합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">로고·자료 제작</h3>
                  <p>투명 배경 이미지를 만들어 PPT·디자인 작업에 바로 씁니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> AI 배경 제거가 브라우저 안에서만 처리되며, 처음 한 번 AI 모델 파일만 내려받습니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/bg-remove" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
