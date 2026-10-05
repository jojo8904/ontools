
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { Watermark } from './Watermark'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '워터마크란?',
    p: [
      '사진이나 이미지 위에 글자나 로고를 겹쳐 넣어, 출처를 표시하고 무단 도용을 막는 표식입니다. 블로그·쇼핑몰 사진, 작품 이미지 등에 사용합니다.',
      '모든 작업은 브라우저 안에서 이뤄지며 이미지가 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '이미지를 올린 뒤 텍스트(또는 로고 이미지)를 정하고, 크기·투명도·위치를 조절하면 미리보기에 바로 반영됩니다.',
      '"한 곳"은 모서리 등 한 위치에, "전체 반복"은 이미지 전체에 사선으로 반복 표시합니다. 도용 방지에는 전체 반복이 효과적입니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '투명도를 낮추면 사진을 가리지 않으면서 표식만 은은하게 남길 수 있습니다.',
      '로고는 배경이 투명한 PNG를 사용하면 자연스럽게 얹힙니다.',
      '제출용 서류라면 "○○ 제출용"처럼 용도를 적어 다른 곳에 쓰이지 않도록 할 수 있습니다.',
    ],
  },
  {"h":"신분증 사본에는 반드시","p":["주민등록증·운전면허증 사본을 제출할 때는 '○○은행 대출 신청용, 2026.10.05' 같은 용도와 날짜를 사본 전체에 반복해 넣으세요. 유출되더라도 다른 용도로 재사용하기 어렵게 만드는 금융당국 권고 방식입니다.","워터마크는 사진 위에 겹쳐야 효과가 있습니다. 여백에만 작게 넣으면 잘라내면 그만입니다. 전체 반복(타일) 옵션과 30~50% 투명도로 글자가 읽히되 서류 내용도 보이게 하세요."]},
  {"h":"상품 사진·작품 사진","p":["쇼핑몰 상품 사진은 로고나 상호를 모서리에 작게 넣는 것이 보통이며 구매 전환에 방해되지 않게 투명도를 높입니다. 반면 무단 도용이 잦은 일러스트·사진 작품은 가운데 대각선으로 크게 넣어야 제거가 어렵습니다.","워터마크가 있어도 저작권 등록을 대신하지는 않습니다. 원본 파일과 작업 기록을 보관해 두면 분쟁 시 증거가 됩니다."]},
  {"h":"제거하기 어려운 워터마크의 조건","p":["반투명으로 이미지 전체에 반복 배치하고, 배경이 복잡한 영역 위에 걸치게 하며, 글자 크기를 이미지의 1/5 이상으로 하면 AI 제거 도구로도 흔적이 남습니다. 단색 배경 위의 작은 로고는 몇 초면 지워집니다.","완전히 막는 방법은 없습니다. 워터마크는 '쉽게 도용하지 못하게' 하는 장치이며, 고해상도 원본은 공개하지 않는 것이 더 근본적인 보호입니다."]},
  {"h":"이미지 워터마크와 텍스트 워터마크","p":["텍스트는 내용을 바로 바꿀 수 있어 용도·날짜 표시에 편하고, 로고 이미지는 브랜드 표시에 맞습니다. 로고는 투명 배경 PNG로 준비해야 사각형 테두리 없이 올라갑니다.","이 도구는 브라우저에서 처리하며 원본 사진과 로고는 서버로 전송되지 않습니다. 결과에는 EXIF가 제거되어 위치정보도 함께 사라집니다."]},
]

const EXTRA_FAQ = [
  {"q":"신분증 워터마크 문구는 뭐라고 쓰나요?","a":"'용도 + 제출처 + 날짜'가 기본입니다. 예: '통신 가입용 ○○텔레콤 제출 2026.10.05'. 주민번호 뒷자리는 민감정보 가리기로 가린 뒤 워터마크를 넣으면 더 안전합니다."},
  {"q":"투명도는 얼마가 적당한가요?","a":"서류는 30~40%, 상품 사진 로고는 20~30%, 도용 방지용 작품은 40~60%가 흔합니다. 글자가 읽히면서 아래 내용도 보이는 정도로 미리보기에서 조정하세요."},
  {"q":"여러 장에 같은 워터마크를 넣을 수 있나요?","a":"쇼핑몰 사진 일괄 가공 도구에서 리사이즈와 함께 워터마크를 여러 장에 한 번에 넣어 ZIP으로 받을 수 있습니다. 이 도구는 한 장씩 세밀하게 조정할 때 적합합니다."},
  {"q":"워터마크를 넣으면 화질이 떨어지나요?","a":"JPG로 다시 저장하면서 미세한 손실이 있지만 화면에서는 구분되지 않습니다. 원본 보관용이 아니라 배포용이므로 문제 되지 않습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/watermark' },
  title: '이미지 워터마크 넣기 (텍스트·로고) - ontools',
  description:
    '사진에 텍스트나 로고 워터마크를 넣습니다. 위치·크기·투명도 조절, 전체 반복 지원. 출처 표시·도용 방지에 사용. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '워터마크 넣기',
    '사진 워터마크',
    '이미지 워터마크',
    '로고 삽입',
    '저작권 표시',
    '워터마크 만들기',
    '사진 도용방지',
  ],
  openGraph: {
    title: '이미지 워터마크 넣기 (텍스트·로고) - ontools',
    description: '사진에 텍스트·로고 워터마크를. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/watermark',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function WatermarkPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">워터마크 넣기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 워터마크 넣기</h1>
          <p className="text-muted-foreground">
            사진에 텍스트나 로고 워터마크를 넣어 출처를 표시하고 도용을 막습니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Watermark />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·쇼핑몰 사진</h3>
                  <p>상품·콘텐츠 사진에 출처를 표시해 무단 사용을 줄입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">작품·포트폴리오</h3>
                  <p>일러스트·디자인 작업물에 서명처럼 로고를 넣습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제출용 사본</h3>
                  <p>&quot;○○ 제출용&quot; 표식을 넣어 사본이 다른 용도로 쓰이는 것을 예방합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  이미지는 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 처리됩니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/watermark" />
      </main>

      <SiteFooter />
    </div>
  )
}
