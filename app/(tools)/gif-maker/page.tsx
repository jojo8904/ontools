
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GifMaker } from './GifMaker'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: 'GIF 만들기란?',
    p: [
      '사진 여러 장을 이어붙여 움직이는 GIF(움짤)를 만드는 도구입니다. 프로그램 설치 없이 브라우저에서 바로 만들 수 있습니다.',
      '모든 처리는 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '사진을 2장 이상 올리고 순서를 정한 뒤, 프레임 간격(한 장이 보이는 시간)과 가로 크기를 고르고 "GIF 만들기"를 누르세요.',
      '완성된 GIF는 미리보기로 확인한 뒤 다운로드할 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '프레임 간격 0.3~0.5초가 자연스러운 움짤에 적당합니다. 슬라이드쇼 느낌은 1초 이상으로 하세요.',
      '사진 크기가 다르면 첫 번째 사진의 비율에 맞춰지고 남는 부분은 흰 배경으로 채워집니다. 미리 같은 비율로 잘라두면 더 깔끔합니다("이미지 자르기" 도구).',
      '프레임 수와 크기가 클수록 용량이 커집니다. 카톡·커뮤니티 업로드용은 480px 이하를 권장해요.',
    ],
  },
  {"h":"프레임 간격과 재생 속도","p":["프레임 간격 100ms는 초당 10장으로 자연스러운 움직임, 500ms는 초당 2장으로 슬라이드쇼 느낌입니다. 연속 촬영 사진은 100~200ms, 전후 비교나 단계별 설명은 500~1,000ms가 적당합니다.","GIF는 최대 초당 50프레임까지 표현하지만 브라우저·메신저는 보통 초당 10~20프레임으로 재생합니다. 간격을 50ms 이하로 두어도 더 부드러워지지 않고 용량만 커집니다."]},
  {"h":"용량 줄이기","p":["GIF는 256색 제한에 압축 효율이 낮아 사진 10장만 넣어도 수 MB가 됩니다. 카카오톡은 GIF 용량 제한이 있고, 커뮤니티는 5~10MB 제한이 흔합니다. 가로 폭을 480~640px로 줄이고 프레임 수를 줄이는 것이 가장 효과적입니다.","비슷한 장면이 반복되는 프레임은 빼고, 꼭 필요한 장면 6~12장으로 구성하면 용량과 전달력 모두 좋아집니다."]},
  {"h":"GIF가 맞는 경우와 아닌 경우","p":["GIF는 짧은 반복 동작, 단계별 설명, 밈처럼 어디서나 자동 재생되어야 하는 용도에 맞습니다. 화질과 색이 중요하거나 10초가 넘는 영상은 MP4가 용량이 1/10 수준이라 훨씬 유리합니다.","인스타·틱톡은 GIF를 올려도 영상으로 변환되므로 처음부터 영상을 만드는 편이 낫습니다. 블로그·카카오톡·커뮤니티는 GIF가 그대로 움직입니다."]},
  {"h":"사진 준비 요령","p":["같은 위치에서 같은 구도로 찍은 사진이 움직임이 매끄럽습니다. 삼각대나 고정된 자리에서 연속 촬영을 쓰고, 크기가 다른 사진이 섞여 있으면 첫 장 크기에 맞춰 조정됩니다.","순서는 올린 순서이며 목록에서 바꿀 수 있습니다. 처리는 브라우저에서 이뤄지고 사진은 서버로 전송되지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"반복 재생을 끌 수 있나요?","a":"반복 옵션으로 무한 반복 또는 1회 재생을 선택할 수 있습니다. 설명용 GIF는 1회, 밈·배너는 무한 반복이 보통입니다."},
  {"q":"동영상에서 GIF를 만들 수 있나요?","a":"이 도구는 사진(이미지) 여러 장으로 GIF를 만듭니다. 동영상은 휴대폰 갤러리의 'GIF로 저장' 기능이나 영상 편집 앱에서 프레임을 추출한 뒤 올리세요."},
  {"q":"색이 이상하게 나와요.","a":"GIF는 256색만 표현해 그러데이션이나 사진에서 색 띠가 생길 수 있습니다. 색 수가 적은 그림·텍스트에서는 문제없고, 사진 위주면 MP4나 WebP 애니메이션이 낫습니다."},
  {"q":"만든 GIF가 카카오톡에서 안 움직여요.","a":"카카오톡은 '사진'으로 보내면 정지 이미지로 변환합니다. 파일로 보내거나 이모티콘처럼 보내는 방식을 쓰면 움직입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/gif-maker' },
  title: 'GIF 만들기 (사진으로 움짤 제작) - ontools',
  description:
    '사진 여러 장으로 움직이는 GIF(움짤)를 만듭니다. 프레임 순서·속도·크기 조절, 설치 없이 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: ['gif 만들기', '움짤 만들기', '사진 gif 변환', 'gif 제작', '움짤 제작', '이미지 gif', '무료 gif'],
  openGraph: {
    title: 'GIF 만들기 (사진으로 움짤 제작) - ontools',
    description: '사진 여러 장 → 움짤. 속도·크기 조절, 서버 전송 없음.',
    url: 'https://ontools.co.kr/gif-maker',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function GifMakerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">GIF 만들기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">GIF 만들기</h1>
          <p className="text-muted-foreground">
            사진 여러 장으로 움직이는 움짤을 만듭니다. 서버로 전송되지 않고 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <GifMaker />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">반려동물·아기 움짤</h3>
                  <p>연속 촬영한 사진을 움짤로 만들어 공유합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">상품·작품 소개</h3>
                  <p>여러 각도 사진을 한 장의 움직이는 이미지로 보여줍니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">간단한 애니메이션</h3>
                  <p>그림·짤 프레임을 이어 움직이는 밈을 만듭니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  올린 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> GIF 생성이 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 사진은 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/gif-maker" />
      </main>

      <SiteFooter />
    </div>
  )
}
