
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageResize } from './ImageResize'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '이미지 크기 조절이란?',
    p: [
      '사진의 가로·세로 픽셀(px) 크기를 원하는 값으로 바꾸는 도구입니다. 블로그·쇼핑몰 업로드 규격, 프로필 사진, 발표자료 삽입 등 "정해진 크기"가 필요할 때 사용합니다.',
      '모든 처리는 브라우저(내 컴퓨터) 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '용량 줄이기와 무엇이 다른가요',
    p: [
      '용량(KB)을 줄이는 "사진 용량 줄이기"와 달리, 이 도구는 가로·세로 픽셀 크기 자체를 바꿉니다. 물론 크기를 줄이면 용량도 함께 작아집니다.',
      '정확한 KB 용량을 맞춰야 한다면 "사진 용량 줄이기" 도구가 더 적합합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '"비율 유지"를 켜두면 가로만 입력해도 세로가 자동 계산되어 사진이 찌그러지지 않습니다.',
      '원본보다 키우면(확대) 화질이 흐려질 수 있습니다. 되도록 줄이는 용도로 쓰는 것이 좋습니다.',
      '투명 배경(PNG)을 유지하려면 PNG로, 용량을 더 줄이려면 JPG로 저장하세요.',
    ],
  },
  {"h":"용도별 권장 픽셀 크기","p":["인스타그램 정사각 1,080×1,080, 세로 1,080×1,350, 스토리 1,080×1,920입니다. 유튜브 썸네일 1,280×720, 블로그 본문 사진 가로 800~1,200, 카카오톡 프로필 640×640, 이메일 첨부 가로 1,200~1,600이면 충분합니다.","인쇄는 300dpi 기준으로 A4 2,480×3,508, 4×6인치 사진 1,200×1,800, 명함 1,063×650입니다. 화면용보다 훨씬 큰 픽셀이 필요하므로 인쇄 예정이면 원본을 줄이지 마세요."]},
  {"h":"비율 유지와 왜곡","p":["가로·세로를 따로 바꾸면 사진이 늘어나거나 찌그러집니다. 비율 유지를 켜고 한쪽만 입력하면 다른 쪽이 자동으로 맞춰집니다. 비율 자체를 바꿔야 한다면(4:3 → 1:1) 크기 조절이 아니라 이미지 자르기를 먼저 하세요.","줄이는 것은 안전하지만 키우는 것(업스케일)은 없는 픽셀을 만들어 내므로 흐려집니다. 작은 사진을 2배 이상 키우면 눈에 띄게 뭉개집니다."]},
  {"h":"퍼센트 vs 픽셀 지정","p":["비율만 줄일 때는 퍼센트(50%, 25%)가 편하고, 제출 규격이 정해져 있으면 픽셀을 직접 넣습니다. 가로·세로 사진이 섞여 있다면 긴 쪽이 같은 값이 되도록 각각 입력하면 일관된 크기가 됩니다.","크기를 줄이면 용량도 함께 줄어듭니다. 4,000px 사진을 2,000px로 줄이면 용량은 약 1/4이 됩니다. 용량 목표가 KB 단위로 정해져 있으면 사진 용량 줄이기 도구를 쓰세요."]},
  {"h":"형식 선택","p":["줄인 결과는 원본 형식을 유지합니다. 투명 배경 PNG는 PNG로, 사진 JPG는 JPG로 저장됩니다. 웹용이면 WebP로 바꾸면 같은 화질에서 JPG보다 25~35% 작습니다.","처리는 브라우저에서만 이뤄지며 EXIF 방향 정보는 픽셀에 반영된 뒤 저장되어 결과가 눕지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"픽셀을 줄이면 화질이 나빠지나요?","a":"보는 화면보다 크게 유지하면 화질 차이를 느낄 수 없습니다. 휴대폰 화면은 가로 1,080~1,440px이므로 2,000px 사진은 화면에서 원본과 구분되지 않습니다."},
  {"q":"dpi는 어디서 바꾸나요?","a":"dpi는 인쇄 크기를 정하는 값이고 화면 표시에는 영향이 없습니다. 이 도구는 픽셀 기준이며, 인쇄가 목적이면 필요한 픽셀(cm ÷ 2.54 × 300)을 계산해 넣으세요."},
  {"q":"여러 장을 같은 크기로 맞출 수 있나요?","a":"이 도구는 한 장씩 처리합니다. 쇼핑몰 상품 사진처럼 여러 장을 같은 크기·비율로 한 번에 맞추려면 쇼핑몰 사진 일괄 가공 도구를 쓰세요."},
  {"q":"GIF도 크기를 줄일 수 있나요?","a":"움직이는 GIF는 첫 프레임만 처리됩니다. 움직임을 유지한 채 줄이려면 GIF 만들기 도구에서 크기를 지정해 다시 만드세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-resize' },
  title: '이미지 크기 조절 (가로세로 px 변경) - ontools',
  description:
    '사진의 가로·세로 픽셀 크기를 원하는 값으로 변경합니다. 비율 유지, 25/50/75% 배율, PNG·JPG 저장 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '이미지 크기 조절',
    '사진 크기 변경',
    '이미지 리사이즈',
    '사진 px 변경',
    '이미지 사이즈 조절',
    '사진 해상도 변경',
    '이미지 크기 줄이기',
    '사진 크기 조정',
  ],
  openGraph: {
    title: '이미지 크기 조절 (가로세로 px 변경) - ontools',
    description: '사진의 가로·세로 픽셀을 원하는 크기로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-resize',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageResizePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">이미지 크기 조절</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 크기 조절</h1>
          <p className="text-muted-foreground">
            사진의 가로·세로 픽셀 크기를 원하는 값으로 바꿉니다. 서버로 전송되지 않고 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageResize />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·쇼핑몰 업로드</h3>
                  <p>&quot;가로 1000px 이하&quot; 같은 업로드 규격에 맞춰 크기를 조절합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로필·썸네일</h3>
                  <p>정사각형이나 특정 픽셀의 프로필 이미지를 만들 때 사용합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">문서·발표자료</h3>
                  <p>너무 큰 사진을 적당한 크기로 줄여 문서에 가볍게 삽입합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 처리가 브라우저 안에서만 이뤄지므로 안심하고 사용할 수 있습니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-resize" />
      </main>

      <SiteFooter />
    </div>
  )
}
