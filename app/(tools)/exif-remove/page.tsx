import type { Metadata } from 'next'
import { ExifRemove } from './ExifRemove'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '사진 위치정보(EXIF)란?',
    p: [
      '스마트폰으로 찍은 사진에는 EXIF라는 숨은 정보가 함께 저장됩니다. 여기에는 사진을 찍은 GPS 위치(위도·경도), 촬영 날짜·시각, 카메라 기종 등이 포함될 수 있습니다.',
      '이 도구는 사진을 다시 저장하면서 이런 정보를 모두 제거한 깨끗한 사본을 만들어 줍니다. 처리는 브라우저 안에서만 이뤄지며 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '왜 지워야 하나요',
    p: [
      '집·직장에서 찍은 사진을 그대로 중고거래·블로그·커뮤니티에 올리면, 사진에 박힌 GPS 좌표로 내 위치가 노출될 수 있습니다.',
      '특히 당근마켓 등 중고거래나 SNS에 올리기 전, 위치정보를 지우면 사생활을 보호할 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '사진을 올리면 위치정보(GPS)가 들어 있는지 자동으로 확인해 알려드립니다.',
      '제거는 원본을 건드리지 않고 깨끗한 사본을 새로 저장합니다.',
      '카카오톡·일부 SNS는 업로드 시 자동으로 메타데이터를 지우기도 하지만, 원본 파일을 직접 주고받을 때는 직접 지우는 것이 안전합니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '사진 위치정보(GPS·EXIF) 제거 - ontools',
  description:
    '사진에 숨어 있는 GPS 위치·촬영정보(EXIF)를 제거합니다. 위치정보 포함 여부 자동 확인. 브라우저에서 처리되어 사진이 서버로 전송되지 않습니다.',
  keywords: [
    '사진 위치정보 제거',
    'exif 제거',
    '사진 gps 제거',
    '메타데이터 제거',
    '사진 위치 지우기',
    '위치정보 삭제',
    'exif 삭제',
    '사진 개인정보 제거',
  ],
  openGraph: {
    title: '사진 위치정보(GPS·EXIF) 제거 - ontools',
    description: '사진 속 GPS·촬영정보 제거. 위치정보 포함 여부 자동 확인. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/exif-remove',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ExifRemovePage() {
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
          <span className="text-foreground font-medium">위치정보 제거</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">사진 위치정보(GPS·EXIF) 제거</h1>
          <p className="text-muted-foreground">
            사진에 숨은 GPS 위치·촬영정보를 지웁니다. 위치정보가 들어 있는지 자동으로 확인해드려요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ExifRemove />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">중고거래 사진</h3>
                  <p>당근마켓 등에 올리기 전 집 위치가 새지 않도록 위치정보를 지웁니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·SNS 업로드</h3>
                  <p>일상 사진을 공유하기 전 촬영 장소·기기 정보를 제거합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">파일 직접 전달</h3>
                  <p>이메일·메신저로 원본 파일을 보낼 때 메타데이터를 지워 보냅니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 위치정보 확인과 제거 모두 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/exif-remove" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
