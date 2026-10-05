
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageCrop } from './ImageCrop'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '이미지 자르기란?',
    p: [
      '사진에서 원하는 부분만 사각형으로 잘라내는 도구입니다. 불필요한 배경을 없애거나, 인스타·유튜브 규격에 맞춰 사진을 다듬을 때 사용합니다.',
      '모든 처리는 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: 'SNS 규격 비율',
    p: [
      '1:1(정사각)은 인스타 기본 피드, 4:5는 인스타 세로 피드, 9:16은 스토리·릴스, 16:9는 유튜브 썸네일에 맞는 비율입니다.',
      '비율을 고르고 드래그하면 그 비율로 고정되어, 규격에 딱 맞는 영역만 잘라낼 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '"자유"를 고르면 비율 제한 없이 원하는 모양으로 자를 수 있습니다.',
      '자른 뒤 크기까지 맞추고 싶다면 "이미지 크기 조절" 도구를 이어서 사용하세요.',
      'JPG 원본은 JPG로, PNG(투명) 원본은 PNG로 저장됩니다.',
    ],
  },
  {"h":"플랫폼별 권장 비율과 픽셀","p":["인스타그램 피드는 1:1(1,080×1,080) 또는 4:5(1,080×1,350), 스토리·릴스는 9:16(1,080×1,920)입니다. 유튜브 썸네일은 16:9(1,280×720), 페이스북 커버는 약 2.7:1, 카카오톡 프로필은 1:1입니다.","증명사진은 3:4, 여권 사진은 3.5:4.5, 명함은 9:5(90×50mm)입니다. 비율을 먼저 맞추고 나서 크기를 줄이는 순서가 맞습니다."]},
  {"h":"안전 영역: 글자와 얼굴이 가려지는 곳","p":["스토리·릴스는 위아래 약 250px에 계정 이름·버튼이 겹칩니다. 중요한 내용은 가운데 1,080×1,420 영역 안에 두세요. 유튜브 썸네일은 오른쪽 아래에 재생 시간이 표시되므로 그 자리를 비워 둡니다.","피드 미리보기는 1:1로 잘려 보입니다. 4:5로 올리더라도 가운데 정사각 안에 핵심이 들어오게 자르면 목록에서도 잘립니다."]},
  {"h":"자르면 픽셀이 줄어듭니다","p":["4,000×3,000 사진에서 1:1로 가운데를 자르면 3,000×3,000이 됩니다. 작은 영역을 확대해 자르면 픽셀이 그만큼 줄어 화질이 떨어지므로, 썸네일처럼 작게 쓸 용도가 아니면 너무 좁게 자르지 마세요.","자르기는 되돌릴 수 없습니다. 원본은 보관하고 자른 결과는 다른 이름으로 저장하세요. 이 도구는 브라우저에서 처리하며 사진을 서버로 보내지 않습니다."]},
  {"h":"자르기 다음 단계","p":["비율을 맞춘 뒤 픽셀 크기를 맞추려면 이미지 크기 조절, 용량(KB)을 맞추려면 사진 용량 줄이기, 배경을 바꾸려면 배경 제거 도구로 이어서 작업하세요.","지원서용 증명사진이라면 사진 제출 도우미가 비율 자르기·픽셀·용량·형식을 한 번에 처리합니다."]},
]

const EXTRA_FAQ = [
  {"q":"자유 비율로 자를 수 있나요?","a":"네. 비율 고정을 해제하면 원하는 영역을 자유롭게 지정할 수 있습니다. 비율 버튼을 누르면 그 비율로 고정됩니다."},
  {"q":"회전은 어떻게 하나요?","a":"스마트폰 사진의 방향 정보는 자동으로 반영됩니다. 임의 각도 회전이 필요하면 휴대폰 사진 앱에서 회전해 저장한 뒤 올리세요."},
  {"q":"정확히 몇 픽셀로 자를 수 있나요?","a":"자르기 영역의 픽셀 크기가 표시되며 원하는 숫자에 맞춰 조정할 수 있습니다. 정확한 픽셀이 필요하면 자른 뒤 이미지 크기 조절에서 값을 입력하세요."},
  {"q":"여러 장을 같은 비율로 자를 수 있나요?","a":"한 장씩 처리합니다. 상품 사진처럼 여러 장을 같은 비율로 맞추려면 쇼핑몰 사진 일괄 가공 도구를 쓰세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-crop' },
  title: '이미지 자르기 (크롭 · 인스타/썸네일 규격) - ontools',
  description:
    '사진을 원하는 영역으로 자릅니다. 1:1 정사각, 4:5, 9:16 스토리, 16:9 유튜브 썸네일 비율 고정 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '사진 자르기',
    '이미지 크롭',
    '이미지 자르기',
    '인스타 정사각 자르기',
    '사진 비율 자르기',
    '유튜브 썸네일 크기',
    '사진 크롭',
    '이미지 비율 맞추기',
  ],
  openGraph: {
    title: '이미지 자르기 (크롭 · 인스타/썸네일 규격) - ontools',
    description: '원하는 영역만 자르기. 인스타·유튜브 규격 비율 고정. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-crop',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageCropPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">이미지 자르기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 자르기</h1>
          <p className="text-muted-foreground">
            원하는 영역만 잘라냅니다. 인스타 정사각·유튜브 썸네일 등 규격 비율로 고정할 수 있어요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageCrop />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS 규격 맞추기</h3>
                  <p>인스타 정사각(1:1)·세로(4:5), 스토리(9:16), 유튜브 썸네일(16:9)에 맞춰 자릅니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">배경·여백 제거</h3>
                  <p>사진에서 필요 없는 주변부를 잘라내고 핵심만 남깁니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로필 사진</h3>
                  <p>얼굴 중심으로 정사각형으로 잘라 프로필용으로 씁니다.</p>
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
        <RelatedTools current="/image-crop" />
      </main>

      <SiteFooter />
    </div>
  )
}
