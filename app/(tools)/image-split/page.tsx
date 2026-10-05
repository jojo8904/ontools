
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageSplit } from './ImageSplit'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '긴 이미지 분할이란?',
    p: [
      '세로로 긴 캡처나 가로로 긴 파노라마 사진을 여러 장으로 똑같이 나누는 도구입니다. 한 장으로는 올리기 어려운 긴 이미지를 조각내어 업로드할 때 사용합니다.',
      '모든 처리는 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '자르는 방향(위→아래 / 좌→우)과 조각 수(2~12개)를 정하고 "나누기"를 누르면, 똑같은 크기로 분할되어 미리보기로 표시됩니다.',
      '필요한 조각만 개별 저장하거나 "전체 ZIP 다운로드"로 한 번에 받을 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '인스타그램에 가로로 긴 사진을 여러 칸으로 이어 붙여 올리는 "파노라마 게시물"을 만들 때 좌→우 분할을 사용하세요.',
      '긴 세로 캡처(대화·웹페이지)는 위→아래로 나눠 여러 장으로 공유합니다.',
      '반대로 여러 장을 하나로 잇고 싶다면 "카톡 캡처 이어붙이기" 도구를 사용하세요.',
    ],
  },
  {"h":"인스타그램 캐러셀용 분할","p":["긴 세로 이미지를 1,080×1,350(4:5) 높이로 나누면 캐러셀 슬라이드로 올릴 수 있습니다. 가로로 긴 파노라마는 1,080×1,080 정사각 여러 장으로 나누면 넘기면서 이어지는 효과가 납니다.","슬라이드는 최대 10장(최근 20장까지 지원)이며, 나눈 조각 수가 그보다 많으면 분할 높이를 늘려 장수를 줄이세요. 경계가 글자 중간을 지나지 않게 미리보기에서 위치를 확인합니다."]},
  {"h":"긴 캡처·웹페이지를 나눌 때","p":["카카오톡 대화 전체 캡처나 웹페이지 전체 캡처는 높이가 1만 px을 넘기도 합니다. 메신저로 보내면 자동 축소되어 글자가 뭉개지므로 2,000~3,000px 단위로 나눠 보내면 읽을 수 있습니다.","장수 기준으로 나누면 균등하게, 높이(px) 기준으로 나누면 마지막 조각만 짧게 나옵니다. 인쇄용이면 A4 비율(1:1.414)에 맞는 높이로 나누는 것이 잘림이 없습니다."]},
  {"h":"결과 파일과 순서","p":["조각은 위에서 아래로 번호가 붙어 ZIP으로 내려받습니다. 파일명 번호 순서대로 올리면 원래 순서가 유지됩니다. SNS 앱에서 여러 장 선택 시 순서가 뒤바뀌는 경우가 있으니 올리기 전 순서를 확인하세요.","분할은 원본 픽셀을 그대로 잘라내므로 화질 손실이 없습니다. 처리는 브라우저에서만 이뤄집니다."]},
  {"h":"분할 후 이어서","p":["조각마다 용량 제한이 있으면 사진 용량 줄이기로, 비율을 바꾸려면 이미지 자르기로 이어서 작업하세요. 반대로 조각을 다시 하나로 합치려면 카톡 캡처 이어붙이기를 쓰면 됩니다.","여러 조각에 같은 워터마크를 넣어야 한다면 쇼핑몰 사진 일괄 가공 도구에 ZIP을 풀어 넣으면 한 번에 처리됩니다."]},
]

const EXTRA_FAQ = [
  {"q":"가로로도 나눌 수 있나요?","a":"네. 분할 방향을 가로로 바꾸면 파노라마를 왼쪽에서 오른쪽으로 나눕니다. 정사각 조각으로 나누면 인스타 캐러셀에서 이어지는 한 장처럼 보입니다."},
  {"q":"조각 경계에 글자가 잘려요.","a":"분할 높이를 조금 바꾸거나 장수를 조정해 경계를 옮기세요. 미리보기의 분할선 위치를 보며 글자·사진 사이의 여백에 맞추면 됩니다."},
  {"q":"몇 장까지 나눌 수 있나요?","a":"제한은 없지만 수십 장을 넘으면 브라우저 메모리 부담이 커집니다. 매우 긴 이미지는 먼저 2~3개로 크게 나눈 뒤 각각 다시 나누세요."},
  {"q":"PDF를 나누고 싶어요.","a":"PDF는 PDF 합치기·분할 도구에서 페이지 단위로 나눕니다. 이 도구는 이미지 파일 전용입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-split' },
  title: '긴 이미지 분할 (여러 장으로 자르기) - ontools',
  description:
    '세로로 긴 캡처나 가로 파노라마를 똑같은 크기 여러 장으로 나눕니다. 인스타 파노라마 게시물 제작, 전체 ZIP 다운로드 지원. 서버로 전송되지 않습니다.',
  keywords: [
    '긴 사진 자르기',
    '이미지 분할',
    '긴 이미지 나누기',
    '인스타 파노라마',
    '사진 여러장으로 자르기',
    '긴 캡처 자르기',
    '이미지 등분',
    '사진 분할',
  ],
  openGraph: {
    title: '긴 이미지 분할 (여러 장으로 자르기) - ontools',
    description: '긴 캡처·파노라마를 여러 장으로 똑같이 분할. 인스타 파노라마 제작. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-split',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageSplitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">긴 이미지 분할</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">긴 이미지 분할</h1>
          <p className="text-muted-foreground">
            세로로 긴 캡처나 가로 파노라마를 똑같은 크기 여러 장으로 나눕니다. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageSplit />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">인스타 파노라마</h3>
                  <p>가로로 긴 사진을 여러 칸으로 나눠 이어지는 게시물로 올립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">긴 캡처 공유</h3>
                  <p>웹페이지·대화 긴 캡처를 여러 장으로 나눠 보기 좋게 공유합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">분할 인쇄</h3>
                  <p>큰 이미지를 여러 장으로 나눠 인쇄·편집에 활용합니다.</p>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-split" />
      </main>

      <SiteFooter />
    </div>
  )
}
