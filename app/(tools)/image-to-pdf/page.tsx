
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageToPdf } from './ImageToPdf'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"용지 크기와 방향 고르기","p":["제출용 서류는 A4 세로가 기본입니다. 영수증·신분증처럼 작은 이미지도 A4 페이지 가운데에 배치되어 인쇄했을 때 실제 크기와 비슷하게 나옵니다. 미국 기관에 보내는 서류는 Letter 크기를 요구하기도 합니다.","이미지 맞춤을 선택하면 이미지 크기 그대로 페이지가 만들어집니다. 화면에서만 볼 PDF나 가로로 긴 표·캡처는 이 옵션이 잘림 없이 깔끔합니다."]},
  {"h":"순서와 페이지 수","p":["올린 순서대로 페이지가 만들어지며 목록에서 순서를 바꿀 수 있습니다. 파일명 앞에 01, 02를 붙여 두면 올릴 때 자동 정렬됩니다.","한 페이지에 한 이미지가 들어갑니다. 여러 장을 한 페이지에 모으려면 먼저 카톡 캡처 이어붙이기로 세로로 합친 뒤 변환하세요."]},
  {"h":"용량과 화질","p":["스마트폰 사진 원본(장당 3~5MB)을 10장 넣으면 PDF가 30MB를 넘습니다. 제출 용량 제한(보통 10MB)이 있다면 사진 용량 줄이기로 장당 300~500KB로 줄인 뒤 변환하세요. 글자를 읽는 데는 충분합니다.","스캔 앱 대신 쓸 때는 밝은 곳에서 그림자 없이 정면으로 찍고, 민감정보 가리기로 불필요한 정보를 가린 뒤 변환하면 제출용으로 손색없습니다."]},
  {"h":"이미지 PDF의 한계","p":["이미지로 만든 PDF는 글자를 검색하거나 복사할 수 없습니다. 텍스트 검색이 필요하면 OCR을 거쳐야 하며, 표라면 표 사진 → 엑셀 변환 도구로 데이터를 뽑을 수 있습니다.","변환은 브라우저에서 이뤄지고 이미지는 서버로 전송되지 않습니다. 결과 PDF에 다른 PDF를 덧붙이려면 PDF 합치기 도구로 이어서 작업하세요."]},
]

const EXTRA_FAQ = [
  {"q":"HEIC 사진도 PDF로 만들 수 있나요?","a":"HEIC는 먼저 HEIC → JPG 변환 도구로 바꾼 뒤 올리세요. JPG·PNG·WebP는 바로 변환됩니다."},
  {"q":"PDF에 여백을 없앨 수 있나요?","a":"이미지 맞춤 옵션을 쓰면 여백 없이 이미지 크기 그대로 페이지가 됩니다. A4를 선택하면 비율 유지를 위해 여백이 생깁니다."},
  {"q":"PDF를 다시 이미지로 되돌릴 수 있나요?","a":"PDF를 이미지로 변환 도구를 쓰면 페이지별 JPG·PNG로 돌아옵니다. 다만 변환을 반복하면 화질이 조금씩 떨어지므로 원본 이미지를 보관하세요."},
  {"q":"비밀번호를 걸 수 있나요?","a":"이 도구는 비밀번호 설정을 지원하지 않습니다. 보안이 필요하면 생성한 PDF를 PDF 뷰어·편집 프로그램에서 암호화하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-to-pdf' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-to-pdf" />
      </main>

      <SiteFooter />
    </div>
  )
}
