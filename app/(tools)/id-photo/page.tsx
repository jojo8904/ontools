
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { IdPhoto } from './IdPhoto'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"규격별 크기 한눈에 보기","p":["여권·비자 3.5×4.5cm(413×531px, 300dpi), 주민등록증·운전면허증 3.5×4.5cm, 일반 이력서 3×4cm(354×472px), 반명함 2.5×3cm(295×354px)입니다. 온라인 지원서는 보통 가로 300~600px의 3:4 비율에 200KB 이하를 요구합니다.","여권 사진은 머리 길이(정수리에서 턱까지)가 3.2~3.6cm, 배경은 흰색이어야 하고 귀와 눈썹이 보여야 합니다. 안경은 착용할 수 있지만 렌즈 반사나 색안경, 눈을 가리는 테는 안 됩니다."]},
  {"h":"스마트폰으로 찍을 때","p":["흰 벽 앞에서 1m 이상 떨어져 정면을 보고 찍습니다. 창가의 자연광을 얼굴 정면에서 받으면 그림자가 줄고, 배경이 완전히 흰색이 아니면 배경 제거 도구로 바꿀 수 있습니다.","셀카보다 다른 사람이 찍어 주는 뒷면 카메라가 왜곡이 적습니다. 머리 위와 어깨 아래에 여백을 넉넉히 두고 찍어야 규격에 맞게 자를 공간이 생깁니다."]},
  {"h":"픽셀, dpi, cm의 관계","p":["인쇄 크기(cm)와 픽셀은 dpi로 연결됩니다. 300dpi에서 3.5cm는 3.5 ÷ 2.54 × 300 = 413px입니다. 온라인 제출은 dpi가 의미 없고 픽셀과 비율만 봅니다.","사진관에서 받은 파일이 600dpi로 826×1,063px이라면 그대로 올려도 되지만 용량이 클 수 있습니다. 300dpi로 줄이면 픽셀이 절반, 용량은 1/4이 됩니다."]},
  {"h":"제출 전 체크리스트","p":["비율(3:4 또는 3.5:4.5), 픽셀 크기, 용량(KB), 파일 형식(JPG), 배경색, 얼굴 비율(머리가 세로의 70~80%), 최근 6개월 이내 촬영을 확인하세요.","사진 제출 도우미에 제출처의 요구 조건을 넣으면 비율 자르기·픽셀·용량·형식을 한 번에 맞춰 줍니다. 처리는 브라우저에서만 이뤄집니다."]},
]

const EXTRA_FAQ = [
  {"q":"여권 사진을 직접 찍어도 되나요?","a":"규격만 맞으면 됩니다. 흰 배경, 정면, 무표정(입 다물기), 머리 길이 3.2~3.6cm, 최근 6개월 이내 촬영, 보정 없음이 조건입니다. 외교부 여권 사진 규정 페이지의 예시와 비교하세요."},
  {"q":"증명사진 배경색은 뭐가 좋나요?","a":"여권·비자는 흰색만 허용됩니다. 이력서는 흰색이 기본이고 일부 회사가 파란색을 선호합니다. 요구가 없으면 흰색이 가장 무난합니다."},
  {"q":"사진관 사진과 차이가 있나요?","a":"조명과 보정 차이가 큽니다. 공식 서류는 직접 찍은 사진으로 충분하지만, 취업 이력서처럼 인상이 중요한 용도는 사진관 촬영이 유리할 수 있습니다."},
  {"q":"인쇄는 어디서 하나요?","a":"규격에 맞춘 파일을 편의점 사진 인쇄기나 온라인 인화 서비스에 올리면 됩니다. 4×6인치 한 장에 증명사진 8장을 배치해 인쇄하면 비용이 가장 적습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/id-photo' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/id-photo-size" className="text-sm font-semibold text-blue-700 hover:underline">증명사진 규격 정리 (여권·운전면허·이력서·비자)</Link>
        </div>
        <RelatedTools current="/id-photo" />
      </main>

      <SiteFooter />
    </div>
  )
}
