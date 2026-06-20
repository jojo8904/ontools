import type { Metadata } from 'next'
import { ImageMask } from './ImageMask'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '민감정보 마스킹이란?',
    p: [
      '신분증, 통장 사본, 계약서 등을 제출할 때 주민등록번호·계좌번호·주소 같은 민감한 정보를 가려주는 도구입니다. 가릴 부분을 드래그하면 검은칠 또는 모자이크로 처리됩니다.',
      '모든 작업은 브라우저 안에서만 이뤄집니다. 신분증 같은 민감 이미지가 서버로 전송되지 않으므로 안심하고 사용할 수 있습니다.',
    ],
  },
  {
    h: '위치정보(EXIF)도 함께 제거',
    p: [
      '스마트폰으로 찍은 사진에는 촬영 위치(GPS), 기기 정보 등이 EXIF 메타데이터로 숨어 있을 수 있습니다.',
      '이 도구로 내보내면 이미지가 새로 그려지면서 이런 메타데이터가 모두 제거됩니다. 가린 정보뿐 아니라 위치정보까지 안전하게 지워집니다.',
    ],
  },
  {
    h: '사용 팁',
    p: [
      '검은칠은 확실하게 가려야 할 때, 모자이크는 가렸다는 표시를 남기되 형태를 흐릴 때 적합합니다.',
      '"○○은행 제출용"처럼 워터마크를 넣으면 사진이 다른 곳에 도용되는 것을 예방할 수 있습니다.',
      '가린 부분은 복원되지 않습니다. 원본은 따로 보관하세요.',
    ],
  },
]

export const metadata: Metadata = {
  title: '신분증·통장 민감정보 가리기 (모자이크·마스킹) - ontools',
  description:
    '신분증, 통장사본, 계약서의 주민번호·계좌번호를 검은칠·모자이크로 가립니다. 워터마크 추가, 사진 위치정보(EXIF) 제거까지. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '신분증 가리기',
    '주민번호 가리기',
    '통장 모자이크',
    '민감정보 마스킹',
    '사진 모자이크',
    '계좌번호 가리기',
    'exif 제거',
    '제출용 사진',
  ],
  openGraph: {
    title: '신분증·통장 민감정보 가리기 - ontools',
    description: '주민번호·계좌번호 모자이크 + 워터마크 + 위치정보 제거. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-mask',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageMaskPage() {
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
          <span className="text-foreground font-medium">민감정보 가리기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">신분증·통장 민감정보 가리기</h1>
          <p className="text-muted-foreground">
            주민번호·계좌번호를 검은칠·모자이크로 가리고, 위치정보(EXIF)까지 제거합니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageMask />
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">신분증 사본 제출</h3>
                  <p>본인확인용으로 신분증을 낼 때 주민번호 뒷자리를 가립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">통장 사본</h3>
                  <p>계좌번호 일부나 잔액 등 불필요한 정보를 가린 뒤 제출합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">계약서·서류</h3>
                  <p>주소, 연락처 등 노출하면 안 되는 항목을 마스킹합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">왜 안전한가요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  이미지는 <strong className="text-gray-900">서버로 전송되지 않고</strong> 사용자의 브라우저 안에서만 처리됩니다. 외부 업로드형 사이트와 달리, 민감한 신분증·통장 이미지가 어디에도 저장되지 않습니다.
                </p>
                <p>내보낼 때 사진 속 위치정보(EXIF)도 함께 제거됩니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/image-mask" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
