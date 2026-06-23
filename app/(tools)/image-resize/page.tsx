import type { Metadata } from 'next'
import { ImageResize } from './ImageResize'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

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
]

export const metadata: Metadata = {
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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/mascot.png" alt="ontools" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold">ontools</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
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
                  <p>"가로 1000px 이하" 같은 업로드 규격에 맞춰 크기를 조절합니다.</p>
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
        <RelatedTools current="/image-resize" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
