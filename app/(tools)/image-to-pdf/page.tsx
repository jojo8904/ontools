import type { Metadata } from 'next'
import { ImageToPdf } from './ImageToPdf'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '이미지 PDF 변환이란?',
    p: [
      '여러 장의 사진·이미지를 한 개의 PDF 문서로 묶어주는 도구입니다. 서류 제출, 스캔본 정리, 과제 제출 등에 유용합니다.',
      '모든 변환은 브라우저 안에서 이뤄지며 이미지가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '이미지를 여러 장 올리고 화살표로 순서를 맞춘 뒤 "PDF로 저장"을 누르면 됩니다.',
      '페이지 크기는 A4, Letter, 또는 이미지 크기에 맞춤 중에서 고를 수 있고, 여백과 방향도 조절할 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '스캐너 없이 휴대폰으로 찍은 서류 사진들을 하나의 PDF로 묶어 제출할 수 있습니다.',
      '"이미지맞춤"을 고르면 여백 없이 사진 비율 그대로 페이지가 만들어집니다.',
      '페이지 순서가 곧 PDF 순서이니, 저장 전 순서를 확인하세요.',
    ],
  },
]

export const metadata: Metadata = {
  title: '이미지 PDF 변환 (사진 여러장 PDF로) - ontools',
  description:
    '사진·이미지 여러 장을 하나의 PDF로 묶습니다. A4·Letter·이미지맞춤, 순서 조정 지원. 서류 제출·스캔본 정리에 유용. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '이미지 pdf 변환',
    '사진 pdf 변환',
    'jpg pdf 변환',
    '사진 여러장 pdf',
    '이미지 합쳐서 pdf',
    'pdf 만들기',
    '사진 pdf로',
  ],
  openGraph: {
    title: '이미지 PDF 변환 (사진 여러장 PDF로) - ontools',
    description: '여러 사진을 하나의 PDF로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-to-pdf',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageToPdfPage() {
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
          <span className="text-foreground font-medium">이미지 PDF 변환</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 PDF 변환</h1>
          <p className="text-muted-foreground">
            여러 장의 사진을 하나의 PDF로 묶습니다. 서류 제출·스캔본 정리에 유용하며, 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageToPdf />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">서류 제출</h3>
                  <p>여러 장으로 찍은 계약서·증빙 사진을 한 PDF로 묶어 제출합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">스캔 대용</h3>
                  <p>스캐너 없이 휴대폰 사진을 PDF로 만들어 전자문서처럼 활용합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">과제·포트폴리오</h3>
                  <p>이미지 여러 장을 순서대로 묶어 하나의 문서로 제출합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  이미지는 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 PDF로 변환됩니다. 민감한 서류 사진도 안전합니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/image-to-pdf" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
