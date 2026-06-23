import type { Metadata } from 'next'
import { ImageConvert } from './ImageConvert'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '이미지 형식 변환이란?',
    p: [
      'PNG·JPG·WEBP 등 이미지 파일 형식을 서로 바꾸는 도구입니다. "WEBP 파일이 안 열려요", "PNG를 JPG로 바꿔야 해요" 같은 상황에서 사용합니다.',
      '모든 변환은 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '각 형식의 특징',
    p: [
      'JPG: 사진에 적합하고 용량이 작습니다. 단, 투명 배경은 지원하지 않습니다.',
      'PNG: 투명 배경을 지원하고 화질 손실이 없습니다. 로고·아이콘·캡처에 적합하지만 용량이 큽니다.',
      'WEBP: 구글이 만든 형식으로 같은 화질에 용량이 가장 작습니다. 다만 일부 오래된 프로그램에서는 안 열릴 수 있어, 그럴 때 JPG/PNG로 바꿔 쓰면 됩니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      'WEBP가 안 열린다면 JPG(사진) 또는 PNG(투명 필요 시)로 변환하세요.',
      '투명한 PNG를 JPG로 바꾸면 투명 부분이 흰색으로 채워집니다.',
      'JPG·WEBP로 저장할 때 화질 슬라이더를 낮추면 용량을 더 줄일 수 있습니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '이미지 형식 변환 (PNG·JPG·WEBP) - ontools',
  description:
    'PNG, JPG, WEBP 이미지 형식을 서로 변환합니다. WEBP 안 열릴 때 JPG·PNG로 변환, 화질 조절 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    'webp jpg 변환',
    'webp 변환',
    'png jpg 변환',
    '이미지 형식 변환',
    'jpg png 변환',
    'webp 안열림',
    '사진 형식 변환',
    'webp png 변환',
  ],
  openGraph: {
    title: '이미지 형식 변환 (PNG·JPG·WEBP) - ontools',
    description: 'PNG·JPG·WEBP 서로 변환. WEBP 안 열릴 때 특히 유용. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-convert',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageConvertPage() {
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
          <span className="text-foreground font-medium">이미지 형식 변환</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 형식 변환</h1>
          <p className="text-muted-foreground">
            PNG·JPG·WEBP를 서로 변환합니다. WEBP가 안 열릴 때도 JPG·PNG로 바꿔 쓸 수 있어요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageConvert />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WEBP 안 열릴 때</h3>
                  <p>웹에서 저장한 WEBP 사진이 안 열리면 JPG·PNG로 바꿔 어디서나 열 수 있게 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제출용 형식 맞추기</h3>
                  <p>"JPG만 업로드 가능" 같은 제한에 맞춰 PNG·WEBP를 JPG로 변환합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">용량 줄이기</h3>
                  <p>같은 화질이라면 WEBP가 가장 가벼워, 웹 업로드용으로 변환합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 변환이 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/image-convert" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
