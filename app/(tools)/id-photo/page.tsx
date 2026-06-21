import type { Metadata } from 'next'
import { IdPhoto } from './IdPhoto'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '증명사진 메이커란?',
    p: [
      '가지고 있는 사진을 여권(3.5×4.5cm), 반명함(3×4cm), 미국 비자(2×2inch) 등 규격에 맞게 잘라 인쇄용으로 만들어주는 도구입니다. 결과물은 300dpi 인쇄 해상도로 저장됩니다.',
      '사진은 브라우저 안에서만 처리되며 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '사진을 올린 뒤 규격을 고르고, 프레임 안에서 얼굴 위치를 드래그로 맞춥니다. 슬라이더로 확대/축소해 구도를 잡은 다음 "증명사진 만들기"를 누르세요.',
      '얼굴이 프레임 중앙에 오도록, 머리 위 약간의 여백을 두면 자연스럽습니다.',
    ],
  },
  {
    h: '참고',
    p: [
      '이 도구는 규격에 맞춰 자르는 기능입니다. 배경을 흰색으로 바꾸는 합성은 포함되어 있지 않으니, 흰 배경이 필요하면 원본을 밝은 배경에서 촬영하세요.',
      '여권 등 공식 서류용은 기관별 세부 규정(얼굴 비율, 배경색 등)을 함께 확인하는 것이 안전합니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '증명사진 만들기 (여권·반명함 규격) - ontools',
  description:
    '가진 사진을 여권(3.5×4.5cm), 반명함(3×4cm), 미국비자(2×2inch) 규격에 맞게 자릅니다. 300dpi 인쇄용 저장. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '증명사진 만들기',
    '여권사진 규격',
    '반명함 사진',
    '증명사진 크기',
    '여권사진 만들기',
    '증명사진 사이즈',
    '비자사진',
  ],
  openGraph: {
    title: '증명사진 만들기 (여권·반명함 규격) - ontools',
    description: '사진을 규격에 맞게 잘라 300dpi 인쇄용으로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/id-photo',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function IdPhotoPage() {
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
          <span className="text-foreground font-medium">증명사진 만들기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">증명사진 만들기</h1>
          <p className="text-muted-foreground">
            사진을 여권·반명함 등 규격에 맞게 자르고 300dpi 인쇄용으로 저장합니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <IdPhoto />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">규격 안내</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">여권/운전면허</h3>
                  <p>3.5×4.5cm (413×531px). 여권, 운전면허증 등에 사용되는 가장 일반적인 규격입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">반명함</h3>
                  <p>3×4cm (354×472px). 이력서, 학생증 등에 자주 쓰입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">미국 비자</h3>
                  <p>2×2inch (600×600px). 미국 비자·그린카드 등 정사각형 규격입니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  얼굴 사진은 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서만 처리됩니다. 외부에 업로드되지 않아 안전합니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/id-photo" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
