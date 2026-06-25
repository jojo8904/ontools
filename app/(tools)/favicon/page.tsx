import type { Metadata } from 'next'
import { FaviconMaker } from './FaviconMaker'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '파비콘(favicon)이란?',
    p: [
      '브라우저 탭이나 즐겨찾기에 표시되는 작은 사이트 아이콘입니다. 보통 favicon.ico 파일로 만들어 웹사이트에 넣습니다.',
      '이 도구는 로고·이미지를 올리면 16·32·48·64px가 한 파일에 담긴 favicon.ico를 만들어 줍니다. 처리는 브라우저 안에서만 이뤄지며 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '정사각형에 가까운 로고·이미지를 올리면 실제 표시 크기(16·32·64px) 미리보기가 나옵니다. 16px(탭 크기)에서도 알아볼 수 있는지 확인하세요.',
      '"favicon.ico 다운로드"로 멀티사이즈 아이콘을 받고, 필요하면 32px PNG나 애플 터치 아이콘(180px)도 따로 받을 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      'favicon.ico 파일을 웹사이트 최상위 폴더에 넣으면 대부분의 브라우저가 자동으로 인식합니다.',
      '작은 크기에서는 디테일이 뭉개지므로, 글자가 많은 로고보다 단순한 심볼이 잘 보입니다.',
      '투명 배경 PNG를 올리면 투명도가 유지된 아이콘이 만들어집니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '파비콘 만들기 (favicon.ico 생성) - ontools',
  description:
    '로고·이미지로 favicon.ico를 만듭니다. 16·32·48·64px 멀티사이즈, 애플 터치 아이콘, PNG 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '파비콘 만들기',
    'favicon 만들기',
    'ico 변환',
    'favicon ico',
    '파비콘 생성',
    '사이트 아이콘 만들기',
    'png ico 변환',
    'favicon generator',
  ],
  openGraph: {
    title: '파비콘 만들기 (favicon.ico 생성) - ontools',
    description: '로고로 favicon.ico 생성. 멀티사이즈·애플 터치 아이콘 지원. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/favicon',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function FaviconPage() {
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
          <span className="text-foreground font-medium">파비콘 만들기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">파비콘 만들기</h1>
          <p className="text-muted-foreground">
            로고·이미지로 favicon.ico를 만듭니다. 16·32·48·64px가 한 파일에 담겨요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <FaviconMaker />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">웹사이트·블로그</h3>
                  <p>브라우저 탭·즐겨찾기에 표시될 사이트 아이콘을 만듭니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">개인 프로젝트</h3>
                  <p>포트폴리오·토이 프로젝트에 빠르게 파비콘을 붙입니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">모바일 홈 화면</h3>
                  <p>애플 터치 아이콘(180px)으로 홈 화면 추가용 아이콘을 만듭니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  업로드한 이미지는 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 모든 변환이 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/favicon" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
