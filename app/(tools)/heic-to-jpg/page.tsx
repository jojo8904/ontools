import type { Metadata } from 'next'
import { HeicToJpg } from './HeicToJpg'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: 'HEIC가 뭔가요?',
    p: [
      'HEIC(HEIF)는 아이폰에서 사진을 저장하는 기본 형식입니다. 용량이 작은 대신 윈도우 PC나 일부 웹사이트·프로그램에서는 열리지 않는 경우가 많습니다.',
      '이 도구는 HEIC 사진을 어디서나 열리는 JPG(또는 PNG)로 바꿔줍니다. 변환은 브라우저 안에서만 이뤄지며 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '아이폰에서 받은 .heic 파일을 끌어다 놓거나 선택하면 자동으로 변환됩니다. 여러 장을 한 번에 올릴 수 있습니다.',
      '변환이 끝나면 각 파일을 개별 저장하거나 "전체 다운로드"로 한꺼번에 받을 수 있습니다.',
    ],
  },
  {
    h: '참고',
    p: [
      'JPG는 용량이 작아 제출·공유에 적합하고, PNG는 화질 손실이 없습니다.',
      '아이폰에서 "설정 > 카메라 > 포맷 > 높은 호환성"으로 바꾸면 처음부터 JPG로 촬영됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'HEIC → JPG 변환 (아이폰 사진) - ontools',
  description:
    '아이폰 HEIC/HEIF 사진을 JPG 또는 PNG로 변환합니다. 여러 장 일괄 변환 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    'heic jpg 변환',
    'heic 변환',
    '아이폰 사진 변환',
    'heic to jpg',
    'heic 안열림',
    'heif 변환',
    '아이폰 사진 jpg',
  ],
  openGraph: {
    title: 'HEIC → JPG 변환 (아이폰 사진) - ontools',
    description: '아이폰 HEIC 사진을 JPG/PNG로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/heic-to-jpg',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function HeicToJpgPage() {
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
          <span className="text-foreground font-medium">HEIC → JPG 변환</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">HEIC → JPG 변환</h1>
          <p className="text-muted-foreground">
            아이폰 HEIC 사진을 어디서나 열리는 JPG/PNG로 변환합니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <HeicToJpg />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">왜 필요한가요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">윈도우에서 안 열림</h3>
                  <p>HEIC는 윈도우 기본 뷰어에서 열리지 않는 경우가 많아 JPG로 바꿔야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">업로드 호환</h3>
                  <p>관공서·쇼핑몰·게시판 등 HEIC를 받지 않는 곳에 올릴 때 필요합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">공유·인쇄</h3>
                  <p>JPG는 거의 모든 기기·프로그램에서 바로 열려 공유와 인쇄가 편합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 변환됩니다. 업로드형 변환 사이트와 달리 사진이 외부에 저장되지 않습니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/heic-to-jpg" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
