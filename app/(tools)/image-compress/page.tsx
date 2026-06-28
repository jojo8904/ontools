import type { Metadata } from 'next'
import { ImageCompress } from './ImageCompress'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

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
]

export const metadata: Metadata = {
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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
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
                  <p>증명사진이나 첨부 서류가 "300KB 이하" 등으로 제한될 때 사용합니다.</p>
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
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <a href="/guide/photo-size-reduce" className="text-sm font-semibold text-blue-700 hover:underline">사진 용량을 200KB·1MB 이하로 줄이는 방법</a>
        </div>
        <RelatedTools current="/image-compress" />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
