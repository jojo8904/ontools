
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageConvert } from './ImageConvert'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '이미지 형식 변환이란?',
    p: [
      'PNG·JPG·WEBP 등 이미지 파일 형식을 서로 바꾸는 도구입니다. "WEBP 파일이 안 열려요", "PNG를 JPG로 바꿔야 해요" 같은 상황에서 사용합니다.',
      '모든 변환은 브라우저 안에서 이뤄지며, 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '각 형식의 특징',
    p: [
      'JPG: 사진에 적합하고 용량이 작습니다. 단, 투명 배경은 지원하지 않습니다.',
      'PNG: 투명 배경을 지원하고 화질 손실이 없습니다. 로고·아이콘·캡처에 적합하지만 용량이 큽니다.',
      'WEBP: 구글이 만든 형식으로 같은 화질에 용량이 가장 작습니다. 다만 일부 오래된 프로그램에서는 안 열릴 수 있어, 그럴 때 JPG/PNG로 바꿔 쓰면 됩니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      'WEBP가 안 열린다면 JPG(사진) 또는 PNG(투명 필요 시)로 변환하세요.',
      '투명한 PNG를 JPG로 바꾸면 투명 부분이 흰색으로 채워집니다.',
      'JPG·WEBP로 저장할 때 화질 슬라이더를 낮추면 용량을 더 줄일 수 있습니다.',
    ],
  },
  {"h":"형식별 특징 비교","p":["JPG는 사진에 적합하고 어디서나 열리지만 투명을 지원하지 않습니다. PNG는 무손실이고 투명을 지원해 로고·스크린샷·아이콘에 맞지만 사진은 용량이 큽니다. WebP는 JPG보다 25~35% 작고 투명도 지원하지만 오래된 프로그램에서 안 열릴 수 있습니다.","GIF는 256색 제한이라 사진에는 부적합하고 단순 애니메이션용입니다. BMP·TIFF는 압축이 없거나 약해 용량이 매우 크며, 인쇄·스캔 원본 보관 외에는 쓸 일이 적습니다."]},
  {"h":"어느 방향으로 바꿔야 하나","p":["업로드가 거부되면 JPG로 바꾸는 것이 가장 확실합니다. 투명 배경이 필요하면 PNG, 웹사이트 속도가 중요하면 WebP입니다. PNG → JPG로 바꾸면 투명 영역은 흰색으로 채워집니다.","JPG → PNG로 바꿔도 화질은 좋아지지 않습니다. 이미 손실된 정보는 돌아오지 않고 용량만 커집니다. 확장자 이름만 바꾸는 것은 변환이 아니며 파일 내용은 그대로입니다."]},
  {"h":"변환 시 품질과 용량","p":["JPG·WebP로 저장할 때 품질 값을 정합니다. 85~90이면 화면에서 원본과 구분되지 않고 용량은 절반 이하입니다. 100은 용량만 크고 이득이 거의 없습니다.","같은 사진을 JPG 85와 WebP 85로 저장하면 WebP가 30% 정도 작습니다. 블로그·쇼핑몰에 올리는 사진은 WebP가 페이지 속도에 유리하지만, 카페·관공서 업로드는 JPG가 안전합니다."]},
  {"h":"변환과 보안","p":["변환은 브라우저 안에서 이뤄지고 파일은 서버로 전송되지 않습니다. 한 장씩 처리하며, 여러 장을 같은 형식·크기로 한 번에 바꾸려면 쇼핑몰 사진 일괄 가공 도구를 쓰세요.","변환 과정에서 EXIF(위치·촬영 정보)는 제거됩니다. 촬영 정보를 유지해야 한다면 변환 전 원본을 보관하세요."]},
]

const EXTRA_FAQ = [
  {"q":"HEIC는 왜 목록에 없나요?","a":"HEIC는 디코딩 방식이 달라 전용 도구(HEIC → JPG 변환)로 처리합니다. 변환 후 JPG를 다시 이 도구에서 PNG·WebP로 바꿀 수 있습니다."},
  {"q":"WebP로 바꿨는데 카카오톡에서 안 열려요.","a":"일부 메신저·오래된 뷰어는 WebP를 지원하지 않습니다. 공유용은 JPG로 두고, WebP는 내 웹사이트·블로그 게시용으로만 쓰세요."},
  {"q":"PDF로도 바꿀 수 있나요?","a":"이미지 → PDF는 이미지 PDF 변환 도구에서, PDF → 이미지는 PDF를 이미지로 변환 도구에서 처리합니다. 여러 장을 한 PDF로 묶는 것도 가능합니다."},
  {"q":"SVG(벡터)로 변환되나요?","a":"사진을 벡터로 바꾸는 것은 자동 변환으로는 품질이 낮아 지원하지 않습니다. 로고를 SVG로 만들려면 벡터 편집 프로그램에서 다시 그려야 합니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-convert' },
  title: '이미지 형식 변환 (PNG·JPG·WEBP) - ontools',
  description:
    'PNG, JPG, WEBP 이미지 형식을 서로 변환합니다. WEBP 안 열릴 때 JPG·PNG로 변환, 화질 조절 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    'webp jpg 변환',
    'webp 변환',
    'png jpg 변환',
    '이미지 형식 변환',
    'jpg png 변환',
    'webp 안열림',
    '사진 형식 변환',
    'webp png 변환',
  ],
  openGraph: {
    title: '이미지 형식 변환 (PNG·JPG·WEBP) - ontools',
    description: 'PNG·JPG·WEBP 서로 변환. WEBP 안 열릴 때 특히 유용. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-convert',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageConvertPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">이미지 형식 변환</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이미지 형식 변환</h1>
          <p className="text-muted-foreground">
            PNG·JPG·WEBP를 서로 변환합니다. WEBP가 안 열릴 때도 JPG·PNG로 바꿔 쓸 수 있어요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageConvert />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WEBP 안 열릴 때</h3>
                  <p>웹에서 저장한 WEBP 사진이 안 열리면 JPG·PNG로 바꿔 어디서나 열 수 있게 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제출용 형식 맞추기</h3>
                  <p>&quot;JPG만 업로드 가능&quot; 같은 제한에 맞춰 PNG·WEBP를 JPG로 변환합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">용량 줄이기</h3>
                  <p>같은 화질이라면 WEBP가 가장 가벼워, 웹 업로드용으로 변환합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 변환이 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-convert" />
      </main>

      <SiteFooter />
    </div>
  )
}
