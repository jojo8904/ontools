
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { PdfToImage } from './PdfToImage'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"JPG와 PNG 중 무엇으로","p":["사진·스캔 문서는 JPG가 용량이 작고, 글자·표·도형 위주의 페이지는 PNG가 경계가 선명합니다. 발표 자료에 넣거나 SNS에 올릴 때는 JPG, 다시 PDF로 만들거나 인쇄할 때는 PNG가 무난합니다.","PDF의 투명 배경은 JPG로 변환하면 흰색으로 채워집니다. 투명을 유지해야 하면 PNG를 선택하세요."]},
  {"h":"해상도와 용량","p":["화면용은 페이지당 1,200~1,600px 너비면 충분하고, 인쇄용은 A4 기준 2,480px(300dpi) 이상이 필요합니다. 해상도를 두 배로 올리면 용량은 약 네 배가 됩니다.","변환 제한은 파일 50MB, 50페이지, 페이지당 16MP, 전체 40MP입니다. 페이지가 많은 문서는 필요한 범위만 지정해 변환하고, 큰 도면은 해상도를 낮춰 나눠 변환하세요."]},
  {"h":"이렇게 쓰입니다","p":["PDF 한 페이지를 PPT·워드에 그림으로 넣을 때, 전자책·강의 자료의 특정 페이지를 메모 앱에 저장할 때, PDF 서류에서 민감정보를 가린 뒤 다시 PDF로 만들 때(가리기는 이미지 상태에서 해야 안전합니다), 카카오톡으로 PDF 대신 이미지로 보낼 때 쓰입니다.","PDF 안의 표 데이터가 필요하면 변환한 이미지를 표 사진 → 엑셀 변환 도구에 넣어 데이터를 뽑을 수 있습니다."]},
  {"h":"변환이 안 되는 경우","p":["열람 비밀번호가 걸린 PDF는 먼저 비밀번호를 풀어야 합니다. 특수 글꼴이 포함되지 않은 PDF는 글자가 다른 글꼴로 보일 수 있고, 양식(폼) 입력값은 저장 방식에 따라 비어 보일 수 있습니다.","변환은 브라우저 안에서 PDF.js로 처리되며 파일은 서버로 전송되지 않습니다. 계약서·의료 기록도 안전하게 변환할 수 있습니다."]},
]

const EXTRA_FAQ = [
  {"q":"변환한 이미지의 글자를 복사할 수 있나요?","a":"아니요. 이미지는 글자 정보가 없습니다. 글자가 필요하면 원본 PDF에서 복사하거나, 표라면 표 사진 → 엑셀 변환 도구의 OCR을 쓰세요."},
  {"q":"특정 페이지만 변환할 수 있나요?","a":"페이지 범위를 지정하면 해당 페이지만 변환됩니다. 50페이지가 넘는 문서는 범위를 나눠 변환하세요."},
  {"q":"변환하면 화질이 떨어지나요?","a":"해상도 설정에 따라 다릅니다. 글자 위주 문서는 1,600px 이상이면 선명하고, 원본이 스캔 이미지라면 원본 해상도 이상으로는 좋아지지 않습니다."},
  {"q":"여러 페이지를 한 장의 긴 이미지로 만들 수 있나요?","a":"페이지별로 변환한 뒤 카톡 캡처 이어붙이기 도구로 세로로 합치면 됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/pdf-to-image' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/pdf-to-image" />
      </main>

      <SiteFooter />
    </div>
  )
}
