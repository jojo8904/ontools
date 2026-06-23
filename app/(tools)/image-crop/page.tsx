import type { Metadata } from 'next'
import { ImageCrop } from './ImageCrop'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '이미지 자르기란?',
    p: [
      '사진에서 원하는 부분만 사각형으로 잘라내는 도구입니다. 불필요한 배경을 없애거나, 인스타·유튜브 규격에 맞춰 사진을 다듬을 때 사용합니다.',
      '모든 처리는 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: 'SNS 규격 비율',
    p: [
      '1:1(정사각)은 인스타 기본 피드, 4:5는 인스타 세로 피드, 9:16은 스토리·릴스, 16:9는 유튜브 썸네일에 맞는 비율입니다.',
      '비율을 고르고 드래그하면 그 비율로 고정되어, 규격에 딱 맞는 영역만 잘라낼 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '"자유"를 고르면 비율 제한 없이 원하는 모양으로 자를 수 있습니다.',
      '자른 뒤 크기까지 맞추고 싶다면 "이미지 크기 조절" 도구를 이어서 사용하세요.',
      'JPG 원본은 JPG로, PNG(투명) 원본은 PNG로 저장됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '이미지 자르기 (크롭 · 인스타/썸네일 규격) - ontools',
  description:
    '사진을 원하는 영역으로 자릅니다. 1:1 정사각, 4:5, 9:16 스토리, 16:9 유튜브 썸네일 비율 고정 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '사진 자르기',
    '이미지 크롭',
    '이미지 자르기',
    '인스타 정사각 자르기',
    '사진 비율 자르기',
    '유튜브 썸네일 크기',
    '사진 크롭',
    '이미지 비율 맞추기',
  ],
  openGraph: {
    title: '이미지 자르기 (크롭 · 인스타/썸네일 규격) - ontools',
    description: '원하는 영역만 자르기. 인스타·유튜브 규격 비율 고정. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-crop',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageCropPage() {
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
          <span className="text-foreground font-medium">이미지 자르기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 자르기</h1>
          <p className="text-muted-foreground">
            원하는 영역만 잘라냅니다. 인스타 정사각·유튜브 썸네일 등 규격 비율로 고정할 수 있어요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageCrop />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS 규격 맞추기</h3>
                  <p>인스타 정사각(1:1)·세로(4:5), 스토리(9:16), 유튜브 썸네일(16:9)에 맞춰 자릅니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">배경·여백 제거</h3>
                  <p>사진에서 필요 없는 주변부를 잘라내고 핵심만 남깁니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로필 사진</h3>
                  <p>얼굴 중심으로 정사각형으로 잘라 프로필용으로 씁니다.</p>
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
        <RelatedTools current="/image-crop" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
