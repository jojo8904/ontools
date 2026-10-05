
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { HeicToJpg } from './HeicToJpg'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: 'HEIC가 뭔가요?',
    p: [
      'HEIC(HEIF)는 아이폰에서 사진을 저장하는 기본 형식입니다. 용량이 작은 대신 윈도우 PC나 일부 웹사이트·프로그램에서는 열리지 않는 경우가 많습니다.',
      '이 도구는 HEIC 사진을 어디서나 열리는 JPG(또는 PNG)로 바꿔줍니다. 변환은 브라우저 안에서만 이뤄지며 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '아이폰에서 받은 .heic 파일을 끌어다 놓거나 선택하면 자동으로 변환됩니다. 여러 장을 한 번에 올릴 수 있습니다.',
      '변환이 끝나면 각 파일을 개별 저장하거나 "전체 다운로드"로 한꺼번에 받을 수 있습니다.',
    ],
  },
  {
    h: '참고',
    p: [
      'JPG는 용량이 작아 제출·공유에 적합하고, PNG는 화질 손실이 없습니다.',
      '아이폰에서 "설정 > 카메라 > 포맷 > 높은 호환성"으로 바꾸면 처음부터 JPG로 촬영됩니다.',
    ],
  },
  {"h":"HEIC와 JPG의 차이","p":["HEIC는 애플이 2017년 iOS 11부터 기본 사진 형식으로 채택한 고효율 이미지 형식입니다. 같은 화질을 JPG의 절반 용량으로 저장하고 라이브 포토, 심도 정보도 담습니다.","문제는 호환성입니다. 윈도우 10 기본 뷰어, 오래된 안드로이드, 많은 웹사이트 업로드 창, 관공서 시스템이 HEIC를 읽지 못합니다. JPG는 1992년부터 쓰인 형식이라 어디서나 열립니다."]},
  {"h":"변환하면 화질이 떨어지나","p":["HEIC에서 JPG로 변환할 때 미세한 손실은 있지만 화면에서 구분되지 않습니다. 변환 후 파일 크기가 원본보다 1.5~2배 커지는 것은 JPG가 덜 효율적이기 때문이지 화질이 좋아진 것은 아닙니다.","변환 품질을 90 이상으로 두면 인쇄용으로도 충분합니다. 용량이 문제면 변환 후 사진 용량 줄이기 도구로 조정하세요."]},
  {"h":"아이폰에서 아예 JPG로 찍는 설정","p":["설정 → 카메라 → 포맷 → '높은 호환성'을 선택하면 이후 사진이 JPG로 저장됩니다. '고효율'이 HEIC입니다. 저장 공간이 넉넉하고 변환이 번거롭다면 이 설정이 편합니다.","이미 찍은 사진은 바뀌지 않습니다. 또 설정 → 사진 → 'Mac 또는 PC로 전송'을 '자동'으로 두면 컴퓨터로 옮길 때 자동으로 JPG로 변환되지만, 에어드롭이나 클라우드로 옮기면 HEIC 그대로입니다."]},
  {"h":"위치정보와 촬영 정보","p":["HEIC에도 JPG와 같은 EXIF(촬영 시각·기기·위치)가 들어 있고 변환하면 대부분 그대로 옮겨집니다. 사진을 외부에 올릴 때 위치가 드러나는 것이 걱정되면 변환 후 위치정보(EXIF) 제거 도구를 거치세요.","이 도구는 브라우저 안에서 변환하므로 사진이 서버로 전송되지 않습니다. 변환이 끝나면 JPG가 바로 내려받아집니다."]},
]

const EXTRA_FAQ = [
  {"q":"윈도우에서 HEIC를 그냥 열 수는 없나요?","a":"마이크로소프트 스토어의 'HEIF 이미지 확장'을 설치하면 사진 앱에서 열립니다. 다만 다른 프로그램이나 웹사이트에 올릴 때는 여전히 JPG가 필요합니다."},
  {"q":"라이브 포토는 어떻게 되나요?","a":"라이브 포토의 정지 이미지만 JPG로 변환되고 움직임(동영상 부분)은 사라집니다. 움직이는 형태로 보관하려면 아이폰에서 동영상이나 GIF로 내보내세요."},
  {"q":"여러 장을 한 번에 변환할 수 있나요?","a":"여러 파일을 한꺼번에 올리면 순서대로 변환되어 ZIP으로 내려받을 수 있습니다. 수십 장 이상이면 브라우저 메모리를 위해 20~30장씩 나눠 올리는 것이 안정적입니다."},
  {"q":"HEIC를 PNG나 PDF로 바꿀 수 있나요?","a":"먼저 JPG로 변환한 뒤 이미지 형식 변환(PNG·WebP)이나 이미지 PDF 변환 도구를 이어서 쓰면 됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/heic-to-jpg' },
  title: 'HEIC → JPG 변환 (아이폰 사진) - ontools',
  description:
    '아이폰 HEIC/HEIF 사진을 JPG 또는 PNG로 변환합니다. 여러 장 일괄 변환 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    'heic jpg 변환',
    'heic 변환',
    '아이폰 사진 변환',
    'heic to jpg',
    'heic 안열림',
    'heif 변환',
    '아이폰 사진 jpg',
  ],
  openGraph: {
    title: 'HEIC → JPG 변환 (아이폰 사진) - ontools',
    description: '아이폰 HEIC 사진을 JPG/PNG로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/heic-to-jpg',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function HeicToJpgPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">HEIC → JPG 변환</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">HEIC → JPG 변환</h1>
          <p className="text-muted-foreground">
            아이폰 HEIC 사진을 어디서나 열리는 JPG/PNG로 변환합니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <HeicToJpg />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">왜 필요한가요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">윈도우에서 안 열림</h3>
                  <p>HEIC는 윈도우 기본 뷰어에서 열리지 않는 경우가 많아 JPG로 바꿔야 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">업로드 호환</h3>
                  <p>관공서·쇼핑몰·게시판 등 HEIC를 받지 않는 곳에 올릴 때 필요합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">공유·인쇄</h3>
                  <p>JPG는 거의 모든 기기·프로그램에서 바로 열려 공유와 인쇄가 편합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 변환됩니다. 업로드형 변환 사이트와 달리 사진이 외부에 저장되지 않습니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/heic-to-jpg" className="text-sm font-semibold text-blue-700 hover:underline">아이폰 HEIC 사진을 JPG로 바꾸는 방법</Link>
        </div>
        <RelatedTools current="/heic-to-jpg" />
      </main>

      <SiteFooter />
    </div>
  )
}
