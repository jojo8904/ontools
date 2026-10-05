
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { FaviconMaker } from './FaviconMaker'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"필요한 크기와 파일","p":["브라우저 탭용 favicon.ico(16×16, 32×32 포함), 아이폰 홈 화면용 apple-touch-icon.png(180×180), 안드로이드·PWA용 192×192와 512×512 PNG, 그리고 이들을 연결하는 manifest 파일이 기본 세트입니다.","이 도구는 정사각 이미지 하나에서 이 세트를 한 번에 만들어 ZIP으로 내려받게 해 줍니다. HTML head에 넣을 link 태그도 함께 제공됩니다."]},
  {"h":"원본 이미지 준비","p":["512×512 이상의 정사각 PNG가 좋습니다. 16×16으로 줄여도 알아볼 수 있게 단순한 형태, 굵은 선, 높은 대비로 디자인하세요. 글자가 세 자 이상이거나 가는 선은 탭에서 뭉개집니다.","투명 배경은 탭에서는 자연스럽지만 iOS 홈 화면 아이콘은 투명을 검은색으로 채우므로 apple-touch-icon용은 배경색이 있는 편이 낫습니다."]},
  {"h":"HTML에 넣는 법","p":["생성된 파일을 사이트 루트(/)에 올리고 head 안에 link rel=\"icon\", link rel=\"apple-touch-icon\", link rel=\"manifest\" 태그를 넣습니다. 루트의 favicon.ico는 태그가 없어도 대부분의 브라우저가 자동으로 찾습니다.","Next.js·Nuxt 같은 프레임워크는 app 폴더에 icon.png, apple-icon.png를 두면 자동 연결됩니다. 워드프레스는 외모 → 사용자 정의 → 사이트 아이콘에서 512px PNG 하나만 올리면 됩니다."]},
  {"h":"바뀐 파비콘이 안 보일 때","p":["브라우저가 이전 파비콘을 강하게 캐시합니다. 시크릿 창에서 열어 보거나, 파일명에 버전을 붙여(favicon.ico?v=2) 링크하면 즉시 반영됩니다. 구글 검색 결과의 파비콘은 재크롤링 후 며칠~몇 주 뒤에 바뀝니다.","구글 검색 결과용 파비콘은 48×48의 배수(96×96 권장)이고 크롤링이 허용된 경로에 있어야 합니다. 생성은 브라우저에서 이뤄지며 이미지는 서버로 전송되지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"ICO 파일이 꼭 필요한가요?","a":"최신 브라우저는 PNG·SVG 파비콘을 지원하지만 오래된 브라우저와 일부 북마크 기능은 ICO만 읽습니다. 호환성을 위해 ICO를 함께 두는 것이 안전합니다."},
  {"q":"SVG 파비콘은 안 만들어 주나요?","a":"이 도구는 비트맵(PNG·ICO) 세트를 만듭니다. SVG 원본이 있다면 link rel=\"icon\" type=\"image/svg+xml\"로 직접 연결하고, 이 도구로 만든 PNG를 대체용으로 두세요."},
  {"q":"로고가 정사각이 아니에요.","a":"먼저 이미지 자르기로 1:1로 자르거나 여백을 넣어 정사각으로 만든 뒤 올리세요. 가로로 긴 로고는 심볼 부분만 잘라 쓰는 것이 보통입니다."},
  {"q":"다크 모드에서 안 보여요.","a":"검은 로고는 다크 모드 탭에서 사라집니다. 배경을 넣거나 흰 테두리를 두르고, SVG를 쓴다면 prefers-color-scheme 미디어 쿼리로 색을 바꿀 수 있습니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/favicon' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/favicon" />
      </main>

      <SiteFooter />
    </div>
  )
}
