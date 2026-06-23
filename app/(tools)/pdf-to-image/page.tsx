import type { Metadata } from 'next'
import { PdfToImage } from './PdfToImage'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: 'PDF를 이미지로 변환이란?',
    p: [
      'PDF 문서의 각 페이지를 JPG·PNG 이미지 파일로 바꾸는 도구입니다. PDF를 카톡·블로그에 그림으로 올리거나, 특정 페이지만 캡처처럼 저장할 때 사용합니다.',
      '모든 변환은 브라우저 안에서 이뤄지며, PDF가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      'PDF를 올리면 페이지마다 이미지로 변환되어 미리보기로 표시됩니다. 필요한 페이지만 개별 저장하거나, "전체 ZIP 다운로드"로 한 번에 받을 수 있습니다.',
      '글자가 또렷하게 필요하면 "고화질"을 켜세요. 변환은 조금 느려지지만 더 선명합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '반대로 사진 여러 장을 하나의 PDF로 묶고 싶다면 "이미지 PDF 변환" 도구를 사용하세요.',
      'JPG는 용량이 작아 공유에 좋고, PNG는 글자·도표가 더 또렷합니다.',
      '암호가 걸린 PDF는 변환되지 않을 수 있습니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'PDF를 이미지로 변환 (JPG·PNG) - ontools',
  description:
    'PDF 각 페이지를 JPG·PNG 이미지로 변환합니다. 페이지별 저장, 전체 ZIP 다운로드, 고화질 옵션 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    'pdf 이미지 변환',
    'pdf jpg 변환',
    'pdf png 변환',
    'pdf 그림으로',
    'pdf 사진 변환',
    'pdf 이미지로',
    'pdf 캡처',
    'pdf jpg',
  ],
  openGraph: {
    title: 'PDF를 이미지로 변환 (JPG·PNG) - ontools',
    description: 'PDF 페이지를 이미지로. 페이지별·전체 ZIP 저장. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/pdf-to-image',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function PdfToImagePage() {
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
          <span className="text-foreground font-medium">PDF를 이미지로</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF를 이미지로 변환</h1>
          <p className="text-muted-foreground">
            PDF 각 페이지를 JPG·PNG 이미지로 바꿉니다. 서버로 전송되지 않고 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PdfToImage />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS·블로그 공유</h3>
                  <p>PDF를 이미지로 바꿔 카톡·인스타·블로그에 그림처럼 올립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">특정 페이지만 저장</h3>
                  <p>필요한 페이지만 골라 이미지로 저장합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">자료 캡처 대용</h3>
                  <p>PDF 화면을 일일이 캡처하지 않고 페이지 전체를 또렷한 이미지로 받습니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  올린 PDF는 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 변환이 브라우저 안에서만 처리되므로 계약서·민감 문서도 안심하고 쓸 수 있습니다.
                </p>
                <p>창을 닫으면 파일은 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/pdf-to-image" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
