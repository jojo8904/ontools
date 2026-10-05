
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { QrGenerator } from './QrGenerator'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const QR_GUIDE = [
  { h: 'QR코드란?', p: ['QR코드는 URL·텍스트 등의 정보를 담는 2차원 바코드로, 스마트폰 카메라로 비추면 즉시 인식됩니다. 본 생성기는 입력한 내용으로 QR코드를 만들고 이미지로 내려받을 수 있습니다.'] },
  { h: '어디에 활용하나요', p: ['명함, 홍보 전단, 식당 메뉴판, 행사 안내, 결제·송금 링크, SNS·웹사이트 연결 등 다양하게 쓰입니다.'] },
  { h: '활용 팁', p: ['인쇄해서 쓸 때는 충분한 크기와 여백을 확보해야 인식이 잘 됩니다. 생성한 QR코드는 사용 전 직접 스캔해 정상 작동하는지 확인하세요.'] },
  {"h":"무엇을 QR로 만들 수 있나","p":["웹사이트 주소, 전화번호(스캔하면 바로 통화), 문자 메시지, 이메일 주소, 와이파이 접속 정보(이름·비밀번호·보안 방식), 연락처(vCard), 지도 위치, 단순 텍스트를 담을 수 있습니다.","와이파이 QR은 매장·사무실·에어비앤비에서 손님이 비밀번호를 입력하지 않고 스캔만으로 접속하게 해 줍니다. 카메라 앱으로 스캔하면 접속 버튼이 뜹니다."]},
  {"h":"인쇄 크기와 오류 복원","p":["QR 코드는 최소 2×2cm, 스캔 거리의 1/10 크기가 권장됩니다. 1m 떨어져 스캔하면 10cm는 되어야 합니다. 메뉴판·명함은 2~3cm, 포스터는 5cm 이상이 안전합니다.","QR 코드에는 일부가 가려지거나 손상돼도 읽히는 오류 복원 기능이 내장돼 있습니다. 이 도구는 일반 인쇄와 화면 표시에 충분한 복원 수준으로 생성하므로, 코드 위에 로고를 덮거나 훼손되기 쉬운 곳에 붙일 때는 크기를 넉넉히 키우세요."]},
  {"h":"내용이 길수록 스캔이 어려워집니다","p":["URL이 길면 QR이 복잡해져 작은 크기에서 스캔 실패가 늘어납니다. 긴 주소는 단축 URL로 줄이거나, 추적 파라미터(utm 등)를 빼고 만드세요.","URL은 반드시 https://를 포함한 전체 주소로 넣어야 스캔 앱이 링크로 인식합니다. 'ontools.co.kr'처럼 프로토콜 없이 넣으면 일부 앱에서 텍스트로만 표시됩니다."]},
  {"h":"QR 코드와 개인정보","p":["이 도구로 만든 QR은 내용이 코드 안에 직접 들어가는 정적 QR입니다. 서버를 거치지 않으므로 스캔 횟수 추적은 안 되지만, 만료되거나 외부 서비스가 중단될 걱정이 없고 영구적으로 동작합니다.","연락처·와이파이 QR을 공개된 곳에 붙일 때는 그 정보가 누구나 읽을 수 있는 상태가 된다는 점을 감안하세요. 생성은 브라우저 안에서 이뤄지고 입력한 내용은 서버로 전송되지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"QR 코드에 유효기간이 있나요?","a":"정적 QR은 없습니다. 내용이 코드 자체에 들어 있어 10년 뒤에도 읽힙니다. 단, 링크한 웹페이지가 사라지면 스캔은 되어도 연결이 안 됩니다."},
  {"q":"QR 색을 바꿔도 되나요?","a":"어두운 코드에 밝은 배경이 기본이며 대비가 충분하면 색을 바꿔도 읽힙니다. 반전(밝은 코드·어두운 배경)이나 노란색·연한 색은 스캔 실패가 잦습니다."},
  {"q":"인쇄용으로 어떤 형식이 좋나요?","a":"SVG로 받으면 벡터라 어떤 크기로 인쇄해도 선명합니다. PNG로 받을 때는 필요한 인쇄 크기의 2~3배 픽셀로 생성하세요. 300dpi 5cm면 약 600px입니다."},
  {"q":"명함에 넣을 연락처 QR은 어떻게 만드나요?","a":"연락처(vCard) 형식을 선택하고 이름·전화·이메일·회사를 입력하면 스캔 시 주소록에 바로 저장되는 QR이 됩니다. 정보가 많으면 코드가 복잡해지니 핵심 항목만 넣으세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/qr-generator' },
  title: 'QR코드 생성기 - ontools',
  description:
    'URL이나 텍스트를 입력하면 QR코드를 즉시 생성합니다. 다양한 크기 선택, PNG 다운로드 지원. 명함, 홍보물, 결제 등에 활용.',
  keywords: [
    'QR코드생성기',
    'QR코드만들기',
    'QR코드',
    'QR생성',
    'QR코드다운로드',
    'qrcode generator',
    '큐알코드',
  ],
  openGraph: {
    title: 'QR코드 생성기 - ontools',
    description: 'QR코드를 무료로 생성하고 다운로드하세요.',
    url: 'https://ontools.co.kr/qr-generator',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function QrGeneratorPage() {
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
          <span className="text-foreground">유틸리티</span>
          {' > '}
          <span className="text-foreground font-medium">QR코드 생성기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">QR코드 생성기</h1>
          <p className="text-muted-foreground">
            URL이나 텍스트를 입력하면 QR코드를 즉시 생성하고 PNG로 다운로드할 수 있습니다.
          </p>
        </div>

        {/* Generator + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <QrGenerator />
          </div>

          <aside className="space-y-6">
            {/* QR코드 활용 방법 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">QR코드 활용 방법</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">웹사이트 링크</h3>
                  <p>홈페이지, 블로그, 소셜 미디어 프로필 URL을 QR코드로 만들어 오프라인에서 쉽게 접근할 수 있게 합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Wi-Fi 접속 정보</h3>
                  <p>형식: WIFI:T:WPA;S:네트워크명;P:비밀번호;; 으로 입력하면 스마트폰으로 스캔 시 자동 접속됩니다.</p>
                  <p className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs mt-1">
                    WIFI:T:WPA;S:MyWiFi;P:password123;;
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">연락처 정보</h3>
                  <p>vCard 형식으로 이름, 전화번호, 이메일을 QR코드에 담아 명함 대체로 활용할 수 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">결제 정보</h3>
                  <p>카카오페이, 네이버페이 등 간편결제 링크를 QR코드로 만들어 매장이나 행사에서 활용합니다.</p>
                </div>
              </div>
            </section>

            {/* 명함/홍보물 팁 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">명함/홍보물 활용 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">적정 크기</h3>
                  <p>명함: 최소 2x2cm. 전단지: 3x3cm 이상. 포스터: 5x5cm 이상 권장. 너무 작으면 스캔이 어렵습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">인쇄 해상도</h3>
                  <p>300dpi 이상 권장. 512x512px QR코드는 약 4.3cm(300dpi) 크기로 인쇄됩니다. 대형 출력물은 더 큰 이미지를 사용하세요.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">여백 확보</h3>
                  <p>QR코드 주변에 최소 모듈 4개 크기의 여백(quiet zone)을 확보해야 정상 스캔됩니다. 배경과 겹치지 않도록 주의하세요.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">색상 주의</h3>
                  <p>전경(검정)과 배경(흰색)의 명도 대비가 충분해야 합니다. 밝은 색 전경이나 어두운 배경은 인식률이 떨어집니다.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={QR_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/qr-generator" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
