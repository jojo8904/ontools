
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageStitch } from './ImageStitch'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '캡처 이어붙이기란?',
    p: [
      '카카오톡 대화, 긴 웹페이지, 여러 장의 캡처를 하나의 긴 이미지로 합쳐주는 도구입니다. 여러 장을 따로 보내는 대신 한 장으로 깔끔하게 정리할 수 있습니다.',
      '모든 처리는 브라우저 안에서만 이뤄지며, 이미지가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '이미지를 여러 장 올린 뒤, 화살표(↑↓)로 순서를 맞추고 "이어붙이기"를 누르면 됩니다.',
      '세로(↓)는 카톡 대화·긴 글 캡처에, 가로(→)는 나란히 비교할 때 적합합니다. 폭이 다른 이미지는 가장 넓은 폭에 맞춰 자동 정렬됩니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '캡처는 같은 기기에서 같은 너비로 찍으면 가장 깔끔하게 이어집니다.',
      '이미지 사이에 여백을 주고 싶으면 "간격(px)"과 "간격 색상"을 조절하세요.',
      '결과는 PNG로 저장되어 화질 손상 없이 그대로 보관됩니다.',
    ],
  },
  {"h":"카카오톡 대화 캡처 이어붙이기","p":["긴 대화를 여러 번 캡처하면 화면 상단 상태바와 하단 입력창이 매 장마다 반복됩니다. 겹치는 부분을 잘라내는 옵션을 쓰면 상단·하단을 일정 픽셀씩 제거해 자연스럽게 이어집니다.","캡처할 때 마지막 메시지가 다음 캡처의 첫 메시지와 한두 줄 겹치게 찍으면, 이어붙인 뒤 누락된 대화가 없는지 확인하기 쉽습니다. 겹친 줄은 자르기 값으로 제거합니다."]},
  {"h":"세로 이어붙이기와 가로 이어붙이기","p":["대화·웹페이지·영수증은 세로, 비교 사진(전후 사진, 상품 색상별)은 가로가 자연스럽습니다. 가로로 이을 때 높이가 다른 사진은 가장 작은 높이에 맞춰 축소되거나 여백이 생기므로 미리 같은 높이로 맞추면 깔끔합니다.","순서는 올린 순서이며 목록에서 바꿀 수 있습니다. 파일명이 IMG_001, IMG_002처럼 번호 순이면 올릴 때 자동으로 정렬됩니다."]},
  {"h":"결과 크기와 용량","p":["캡처 10장(각 1,080×2,400)을 세로로 이으면 높이 2만 px이 넘습니다. 일부 메신저·웹사이트는 긴 변 1만 px 이상을 거부하거나 자동 축소합니다. 너무 길면 두세 개로 나눠 만들거나 완성 후 긴 이미지 분할로 나누세요.","결과는 PNG 또는 JPG로 저장됩니다. 글자 위주 캡처는 PNG가 선명하고, 사진 위주는 JPG가 용량이 작습니다."]},
  {"h":"증거 자료로 쓸 때","p":["대화 캡처를 분쟁·신고 자료로 쓸 때는 날짜·시간·상대방 이름이 보이는 상태로 캡처하고, 이어붙인 결과와 함께 원본 캡처도 보관하세요. 이어붙인 이미지는 편집된 파일이므로 원본이 있어야 신뢰를 얻습니다.","상대방이나 제3자의 개인정보(전화번호·프로필 사진)는 민감정보 가리기로 가린 뒤 제출하세요. 처리는 브라우저에서만 이뤄집니다."]},
]

const EXTRA_FAQ = [
  {"q":"상단 상태바를 자동으로 없애 주나요?","a":"상단·하단 자르기 픽셀 값을 지정하면 모든 장에 같은 값이 적용됩니다. 기기마다 상태바 높이가 달라 첫 장에서 미리보기로 값을 맞추세요."},
  {"q":"가로 폭이 다른 사진도 이어지나요?","a":"세로 이어붙이기에서 폭이 다르면 가장 넓은 폭에 맞춰 정렬되거나 축소됩니다. 가능하면 같은 기기 캡처끼리 이으면 폭이 같아 깔끔합니다."},
  {"q":"몇 장까지 이을 수 있나요?","a":"제한은 없지만 결과 높이가 2만~3만 px을 넘으면 브라우저와 뷰어가 느려집니다. 20장 이상이면 나눠서 만드세요."},
  {"q":"이어붙인 이미지를 PDF로 만들 수 있나요?","a":"완성한 이미지를 이미지 PDF 변환 도구에 넣으면 됩니다. 긴 이미지는 '이미지 맞춤' 옵션을 써야 한 페이지에 잘림 없이 들어갑니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-stitch' },
  title: '카톡 캡처 이어붙이기 (이미지 합치기) - ontools',
  description:
    '여러 장의 캡처·이미지를 세로 또는 가로로 하나로 이어붙입니다. 카카오톡 대화 캡처, 긴 화면 합치기에 사용. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '캡처 이어붙이기',
    '이미지 합치기',
    '사진 합치기',
    '카톡 캡처 합치기',
    '스크린샷 합치기',
    '세로로 이어붙이기',
    '이미지 결합',
  ],
  openGraph: {
    title: '카톡 캡처 이어붙이기 (이미지 합치기) - ontools',
    description: '여러 캡처를 하나의 긴 이미지로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-stitch',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageStitchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">캡처 이어붙이기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">카톡 캡처 이어붙이기</h1>
          <p className="text-muted-foreground">
            여러 장의 캡처·이미지를 세로 또는 가로로 하나로 합칩니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageStitch />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">카카오톡 대화 보관</h3>
                  <p>여러 장으로 나뉜 대화 캡처를 하나로 이어 증빙·기록용으로 저장합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">긴 화면 캡처</h3>
                  <p>스크롤이 긴 웹페이지나 문서를 나눠 찍은 뒤 하나로 합칩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">비교 이미지</h3>
                  <p>가로로 이어붙여 전후 비교, 옵션 비교 등을 한눈에 보여줍니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  올린 이미지는 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 대화 캡처처럼 민감한 내용도 외부로 새어 나갈 걱정 없이 합칠 수 있습니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-stitch" />
      </main>

      <SiteFooter />
    </div>
  )
}
