
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { PdfMerge } from './PdfMerge'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"합치기: 순서와 방향","p":["여러 PDF를 올리면 올린 순서대로 이어 붙습니다. 순서를 바꾸려면 목록에서 위·아래로 옮기세요. 계약서 본문 → 별지 → 첨부 서류 순서처럼 제출처가 요구하는 순서가 있으면 미리 파일명 앞에 번호를 붙여 두면 편합니다.","가로·세로 페이지가 섞여 있어도 각 페이지 방향은 유지됩니다. 스캔 방향이 잘못된 페이지는 합치기 전에 원본에서 회전해 두세요."]},
  {"h":"분할: 페이지 범위 지정","p":["'1-3, 5, 8-10'처럼 범위를 쉼표로 구분해 지정하면 해당 페이지만 추출합니다. 각 페이지를 낱개 파일로 나누거나, N페이지씩 묶어 나눌 수도 있습니다.","계약서에서 서명 페이지만, 교재에서 특정 단원만, 영수증 묶음에서 특정 월만 뽑을 때 유용합니다. 추출한 파일은 원본 PDF의 글자·이미지 품질을 그대로 유지합니다."]},
  {"h":"용량이 커지는 경우","p":["합친 PDF의 용량은 원본들의 합과 비슷합니다. 스캔 PDF는 페이지당 1~3MB라 10장만 합쳐도 20MB를 넘을 수 있습니다. 제출 용량 제한(보통 10MB)에 걸리면 스캔 PDF를 이미지로 변환해 용량을 줄인 뒤 다시 PDF로 만드세요.","텍스트 PDF는 수십 장을 합쳐도 몇 MB에 그칩니다. 같은 글꼴이 중복 포함되어 조금 커질 수 있지만 문제 되는 수준은 아닙니다."]},
  {"h":"비밀번호·보안 PDF","p":["열람 비밀번호가 걸린 PDF는 먼저 비밀번호를 풀어야 합치거나 나눌 수 있습니다. 편집 제한만 걸린 PDF는 대부분 처리되지만 제한 설정에 따라 실패할 수 있습니다.","처리는 브라우저 안에서 이뤄지고 파일은 서버로 전송되지 않습니다. 계약서·의료 기록 같은 민감한 문서도 안전하게 처리할 수 있습니다. 파일 50MB, 50페이지 제한이 있습니다."]},
]

const EXTRA_FAQ = [
  {"q":"합친 PDF의 글자를 검색할 수 있나요?","a":"원본이 텍스트 PDF면 합친 뒤에도 검색·복사가 됩니다. 스캔 이미지 PDF는 원래 검색이 안 되며, 이 도구는 OCR을 하지 않습니다."},
  {"q":"페이지 순서를 바꾸고 싶어요.","a":"한 PDF 안에서 순서를 바꾸려면 필요한 페이지를 각각 추출한 뒤 원하는 순서로 다시 합치세요. 두 단계로 처리됩니다."},
  {"q":"PDF에 이미지를 추가할 수 있나요?","a":"이미지를 먼저 이미지 PDF 변환 도구로 PDF로 만든 뒤 합치면 됩니다. 영수증·사진을 묶는 용도라면 영수증·증빙사진 묶기 도구가 더 편합니다."},
  {"q":"합치면 품질이 떨어지나요?","a":"아니요. 페이지를 그대로 복사해 붙이므로 글자·이미지 품질이 유지됩니다. 재압축이나 해상도 변경은 하지 않습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/pdf-merge' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/pdf-merge" />
      </main>

      <SiteFooter />
    </div>
  )
}
