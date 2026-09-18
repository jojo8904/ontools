
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { GifMaker } from './GifMaker'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

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
        <RelatedTools current="/gif-maker" />
      </main>

      <SiteFooter />
    </div>
  )
}
