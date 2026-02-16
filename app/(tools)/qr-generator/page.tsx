import type { Metadata } from 'next'
import { QrGenerator } from './QrGenerator'

export const metadata: Metadata = {
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
    url: 'https://ontools.com/qr-generator',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function QrGeneratorPage() {
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
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
