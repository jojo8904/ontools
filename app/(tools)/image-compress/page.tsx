
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageCompress } from './ImageCompress'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '사진 용량 줄이기란?',
    p: [
      '관공서 민원, 자격증 신청, 온라인 지원서 등에서 "200KB 이하", "1MB 이하"처럼 사진 용량 제한을 두는 경우가 많습니다. 이 도구는 목표 용량을 입력하면 그 이하가 되도록 이미지를 자동으로 압축합니다.',
      '모든 처리는 브라우저(내 컴퓨터) 안에서만 이뤄지며, 사진이 서버로 전송되지 않습니다. 민감한 사진도 안심하고 줄일 수 있습니다.',
    ],
  },
  {
    h: '어떻게 목표 용량에 맞추나요',
    p: [
      '먼저 이미지 화질(JPEG 품질)을 단계적으로 조절해 목표 용량 이하가 되는 가장 좋은 화질을 찾습니다. 화질을 최저로 낮춰도 목표를 넘으면, 이미지 크기(해상도)를 조금씩 줄여가며 다시 시도합니다.',
      '그래서 "정확히 그 용량 이하"로 맞추면서도 가능한 한 화질을 유지합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '제출처에서 용량과 함께 "가로 세로 픽셀"도 요구하는 경우가 있으니 안내문을 확인하세요.',
      '결과는 JPG로 저장됩니다. 투명 배경이 필요한 경우(로고 등)에는 적합하지 않을 수 있습니다.',
      '너무 작은 목표(예: 큰 사진을 10KB)로는 화질 손상이 큽니다. 제출 기준에 맞는 적당한 용량을 선택하세요.',
    ],
  },
  {"h":"용량이 줄어드는 원리","p":["JPG는 사람 눈이 둔감한 색 정보와 미세한 질감을 버리는 손실 압축입니다. 품질 90에서 70으로 낮추면 용량은 보통 절반 이하로 줄지만 화면에서 구분하기 어렵습니다. 품질 50 아래로 내려가면 경계가 뭉개지고 색 띠가 보이기 시작합니다.","픽셀 크기를 줄이는 것이 품질을 낮추는 것보다 효과가 큽니다. 4,000×3,000 사진을 2,000×1,500으로 줄이면 픽셀 수가 1/4이 되어 용량도 그 근처로 떨어집니다. 모니터·휴대폰 화면은 2,000px이면 충분합니다."]},
  {"h":"목표 용량 맞추기: 200KB, 1MB, 5MB","p":["증명사진·지원서용 200KB는 픽셀을 800~1,200px로 줄이고 품질 80 정도면 대부분 맞습니다. 카페·커뮤니티 업로드 1MB는 2,000px에 품질 85, 이메일 첨부 5MB는 원본 픽셀에 품질 75로 충분합니다.","이 도구는 목표 KB를 입력하면 품질을 단계적으로 낮춰 가장 높은 품질로 목표 안에 들어오는 값을 찾습니다. 픽셀을 함께 줄여야 목표에 도달하는 경우에는 결과 화면에 안내가 나옵니다."]},
  {"h":"PNG는 왜 안 줄어드나","p":["PNG는 무손실 형식이라 품질을 낮추는 개념이 없습니다. 스크린샷·로고·투명 배경처럼 색 수가 적은 이미지는 PNG가 작지만, 사진은 PNG로 저장하면 JPG의 5~10배가 됩니다.","사진인데 PNG라면 JPG나 WebP로 바꾸는 것이 가장 큰 절감입니다. 투명 배경이 필요 없다면 변환해도 손해가 없습니다. 형식 변환은 이미지 형식 변환 도구로 할 수 있습니다."]},
  {"h":"줄이기 전에 확인할 것","p":["용량을 줄이면 원본으로 되돌릴 수 없으므로 원본은 따로 보관하세요. 인쇄용(300dpi)이라면 A4 기준 2,480×3,508px이 필요하니 픽셀을 그 아래로 줄이면 안 됩니다.","제출처가 '픽셀'과 '용량'을 모두 지정하면 픽셀을 먼저 맞추고 용량을 맞추는 순서가 맞습니다. 처리는 브라우저 안에서만 이뤄지고 사진은 서버로 전송되지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"화질 손상 없이 용량만 줄일 수 있나요?","a":"JPG는 다시 저장할 때마다 조금씩 손실이 생깁니다. 품질 85 이상이면 화면에서는 구분이 어렵지만 수치상 손실은 있습니다. 완전 무손실은 PNG·WebP 무손실 모드뿐이며 용량 절감이 작습니다."},
  {"q":"여러 장을 한 번에 줄일 수 있나요?","a":"이 도구는 한 장씩 처리합니다. 상품 사진처럼 여러 장을 같은 규격과 용량으로 맞춰 ZIP으로 받으려면 쇼핑몰 사진 일괄 가공 도구를 쓰세요."},
  {"q":"카톡으로 보내면 왜 화질이 떨어지나요?","a":"메신저는 전송 시 자동으로 픽셀과 품질을 줄입니다. 원본 화질로 보내려면 '원본' 옵션을 선택하거나 파일로 첨부하세요. 미리 적당한 용량으로 줄여 보내면 자동 압축을 피할 수 있습니다."},
  {"q":"HEIC 파일도 줄일 수 있나요?","a":"HEIC는 먼저 JPG로 변환해야 합니다. HEIC → JPG 변환 도구를 거친 뒤 용량을 줄이세요. HEIC 자체가 이미 효율적인 형식이라 변환 후 용량이 비슷하거나 조금 커지는 것이 정상입니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-compress' },
  title: '사진 용량 줄이기 (KB 맞추기) - ontools',
  description:
    '200KB, 1MB 등 원하는 용량 이하로 사진을 자동 압축합니다. 관공서·자격증·온라인 제출용 사진 용량 맞추기. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '사진 용량 줄이기',
    '이미지 용량 줄이기',
    '사진 용량 맞추기',
    '200kb 이하',
    '1mb 이하',
    '이미지 압축',
    'jpg 용량 줄이기',
    '사진 kb 줄이기',
  ],
  openGraph: {
    title: '사진 용량 줄이기 (KB 맞추기) - ontools',
    description: '원하는 용량 이하로 사진을 자동 압축. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-compress',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageCompressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">사진 용량 줄이기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">사진 용량 줄이기</h1>
          <p className="text-muted-foreground">
            원하는 용량(예: 200KB, 1MB) 이하로 사진을 자동 압축합니다. 서버로 전송되지 않고 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        {/* Tool + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageCompress />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">관공서·민원 제출</h3>
                  <p>정부24, 민원24 등에서 첨부파일 용량이 제한될 때 기준 이하로 맞춰 업로드합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">자격증·시험 원서접수</h3>
                  <p>증명사진이나 첨부 서류가 &quot;300KB 이하&quot; 등으로 제한될 때 사용합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">온라인 지원·게시판</h3>
                  <p>채용 지원서, 카페·커뮤니티 업로드 제한에 맞춰 용량을 줄입니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 압축이 사용자의 브라우저 안에서만 처리되므로, 신분증·증명사진 같은 민감한 이미지도 외부로 새어 나갈 걱정이 없습니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} muted />
      <FaqSection items={EXTRA_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/photo-size-reduce" className="text-sm font-semibold text-blue-700 hover:underline">사진 용량을 200KB·1MB 이하로 줄이는 방법</Link>
        </div>
        <RelatedTools current="/image-compress" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
