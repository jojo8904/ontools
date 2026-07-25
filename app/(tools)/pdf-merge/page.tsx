import type { Metadata } from 'next'
import { PdfMerge } from './PdfMerge'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: 'PDF 합치기·분할이란?',
    p: [
      '여러 개의 PDF 파일을 하나로 합치거나, 반대로 한 PDF에서 원하는 페이지만 뽑아내는 도구입니다. 계약서·과제·스캔 서류를 정리할 때 자주 필요합니다.',
      '모든 처리는 브라우저(내 컴퓨터) 안에서 이뤄지며, 파일이 서버로 전송되지 않습니다. 민감한 서류도 안심하고 다룰 수 있습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '합치기: PDF를 여러 개 올리고 순서를 조정한 뒤 "하나로 합치기"를 누르면 순서대로 이어진 새 PDF가 저장됩니다.',
      '분할·추출: PDF 한 개를 올리고 "1-3, 5"처럼 페이지를 입력해 추출하거나, 모든 페이지를 낱개 PDF로 나눠 ZIP으로 받을 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '스캔한 서류 여러 장을 하나의 제출용 PDF로 묶을 때 편리합니다.',
      '암호가 걸린 PDF는 처리되지 않을 수 있습니다.',
      '사진(JPG)을 PDF로 만들고 싶다면 "이미지 PDF 변환" 도구를, PDF를 사진으로 바꾸려면 "PDF를 이미지로" 도구를 사용하세요.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'PDF 합치기·분할 (무료, 서버 전송 없음) - ontools',
  description:
    '여러 PDF를 하나로 합치거나, 원하는 페이지만 추출·분할합니다. 파일이 서버로 전송되지 않고 브라우저에서 처리되어 계약서 등 민감한 서류도 안전합니다.',
  keywords: ['pdf 합치기', 'pdf 분할', 'pdf 병합', 'pdf 페이지 추출', 'pdf 나누기', 'pdf 합치기 무료', 'pdf 편집'],
  openGraph: {
    title: 'PDF 합치기·분할 (무료, 서버 전송 없음) - ontools',
    description: 'PDF 합치기·페이지 추출·낱개 분할. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/pdf-merge',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function PdfMergePage() {
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
          <span className="text-foreground font-medium">PDF 합치기·분할</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF 합치기·분할</h1>
          <p className="text-muted-foreground">
            여러 PDF를 하나로, 또는 원하는 페이지만 추출. 서버로 전송되지 않고 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PdfMerge />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">서류 제출</h3>
                  <p>스캔한 신분증·계약서·증빙 여러 개를 제출용 PDF 한 개로 묶습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">과제·보고서 정리</h3>
                  <p>표지·본문·부록을 각각 만든 뒤 하나로 합쳐 제출합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">필요한 부분만 공유</h3>
                  <p>긴 PDF에서 필요한 몇 페이지만 뽑아 가볍게 전달합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  올린 PDF는 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 합치기·분할 모두 브라우저 안에서만 처리되므로 계약서·급여명세서 같은 민감한 서류도 안심입니다.
                </p>
                <p>창을 닫으면 파일은 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/pdf-merge" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
