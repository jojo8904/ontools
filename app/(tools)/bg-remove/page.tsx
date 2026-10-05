
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { BgRemove } from './BgRemove'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '배경 제거(누끼)란?',
    p: [
      '사진에서 인물이나 물건만 남기고 배경을 투명하게 지우는 도구입니다. 흔히 "누끼 딴다"고 표현합니다. 상품 사진, 프로필, 합성용 이미지를 만들 때 사용합니다.',
      '핵심 처리는 브라우저(내 컴퓨터) 안에서 AI가 직접 수행하며, 사진이 서버로 전송되지 않습니다. AI 모델 파일만 처음 한 번 다운로드됩니다.',
    ],
  },
  {
    h: '처음 한 번은 조금 느려요',
    p: [
      '배경을 자동으로 인식하려면 AI 모델이 필요한데, 이 모델을 처음 사용할 때 한 번 내려받습니다(수십 초가 걸릴 수 있어요). 두 번째부터는 빠르게 처리됩니다.',
      '인터넷이 느리면 모델 다운로드가 오래 걸릴 수 있습니다. PC·와이파이 환경을 권장합니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '제거 후 배경을 투명(PNG)·흰색·원하는 색으로 바꿔 저장할 수 있습니다. 합성·로고용은 투명, 증명/상품용은 흰색이 편합니다.',
      '인물·물건과 배경의 경계가 뚜렷할수록 결과가 깔끔합니다. 머리카락·털처럼 복잡한 경계는 다소 거칠 수 있습니다.',
      '투명 배경을 유지하려면 반드시 PNG로 저장하세요. JPG는 투명을 지원하지 않습니다.',
    ],
  },
  {"h":"어떤 사진이 잘 되고 어떤 사진이 어려운가","p":["사람·동물·상품처럼 피사체가 뚜렷하고 배경과 색 대비가 있는 사진은 깔끔하게 분리됩니다. 머리카락 끝, 반투명한 유리·천, 배경과 비슷한 색의 옷, 역광으로 경계가 흐린 사진은 가장자리가 거칠어질 수 있습니다.","배경이 복잡해도 피사체 윤곽이 분명하면 문제없습니다. 결과가 아쉬우면 밝은 단색 배경에서 다시 찍는 것이 어떤 후보정보다 효과적입니다."]},
  {"h":"결과 파일 형식: PNG와 투명 배경","p":["배경을 제거한 결과는 투명 영역을 지원하는 PNG로 저장됩니다. JPG는 투명을 지원하지 않아 흰색이나 검은색으로 채워지므로, 누끼 이미지는 반드시 PNG(또는 WebP)로 보관하세요.","투명 PNG는 용량이 큽니다. 증명사진처럼 배경을 단색으로 채울 거라면 증명사진 만들기 도구에서 배경색을 지정해 JPG로 저장하면 용량이 1/5로 줄어듭니다."]},
  {"h":"처음 실행이 느린 이유","p":["배경 제거는 브라우저 안에서 AI 모델을 실행합니다. 처음 사용할 때 모델 파일(수십 MB)을 내려받아야 해서 몇 초에서 수십 초가 걸리고, 이후에는 브라우저에 저장되어 바로 실행됩니다.","사진은 서버로 전송되지 않습니다. 모델만 내려받고 처리는 내 기기에서 하므로, 신분증·계약서 같은 민감한 이미지도 외부에 나가지 않습니다. 오래된 기기나 메모리가 적은 휴대폰에서는 큰 사진을 처리하다 멈출 수 있으니 2,000px 이하로 줄여서 올리세요."]},
  {"h":"활용: 증명사진, 상품 사진, 합성","p":["증명사진은 배경 제거 후 흰색·파란색 배경을 채워 규격에 맞게 자르면 끝납니다. 쇼핑몰 상품 사진은 흰 배경으로 통일하면 목록 페이지가 깔끔해지고, 오픈마켓의 '흰 배경 권장' 기준에도 맞습니다.","누끼 이미지는 발표 자료·썸네일·합성에 바로 쓸 수 있습니다. 다만 다른 사람의 사진이나 상표가 있는 상품 이미지를 상업적으로 쓰려면 저작권·초상권 확인이 필요합니다."]},
]

const EXTRA_FAQ = [
  {"q":"가장자리가 지저분하게 나와요.","a":"머리카락이나 배경과 비슷한 색 영역에서 흔합니다. 밝은 단색 배경에서 다시 찍거나, 결과를 그림판·포토샵에서 지우개로 다듬으세요. 작은 썸네일로 쓸 거면 축소 시 거칠기가 거의 보이지 않습니다."},
  {"q":"사진 여러 장을 한 번에 할 수 있나요?","a":"한 장씩 처리하는 것이 기본입니다. 상품 사진을 대량으로 흰 배경에 맞춰야 한다면 쇼핑몰 사진 일괄 가공 도구에서 리사이즈·워터마크와 함께 처리하세요."},
  {"q":"결과 배경을 흰색으로 채울 수 있나요?","a":"배경 제거 후 배경색 채우기 옵션으로 흰색·파란색 등 단색을 넣어 JPG로 저장할 수 있습니다. 증명사진 규격 자르기까지 필요하면 증명사진 만들기 도구로 이어서 작업하세요."},
  {"q":"휴대폰에서도 되나요?","a":"됩니다. 다만 모델을 처음 내려받을 때 데이터가 수십 MB 들고, 메모리가 적은 기기는 큰 사진에서 멈출 수 있습니다. 와이파이에서 2,000px 이하 사진으로 시도하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/bg-remove' },
  title: '배경 제거 (누끼 따기) - ontools',
  description:
    '사진에서 인물·물건만 남기고 배경을 자동으로 지웁니다. 투명 PNG·흰 배경 저장 지원. 브라우저에서 AI가 처리해 사진이 서버로 전송되지 않습니다.',
  keywords: [
    '배경 제거',
    '누끼 따기',
    '사진 배경 지우기',
    '배경 투명',
    '누끼',
    '이미지 배경 제거',
    '사진 배경 제거',
    '투명 배경 만들기',
  ],
  openGraph: {
    title: '배경 제거 (누끼 따기) - ontools',
    description: '사진 배경을 자동으로 제거. 투명 PNG·흰 배경 저장. 브라우저에서 AI 처리, 서버 전송 없음.',
    url: 'https://ontools.co.kr/bg-remove',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function BgRemovePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">배경 제거</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">배경 제거 (누끼)</h1>
          <p className="text-muted-foreground">
            사진에서 인물·물건만 남기고 배경을 자동으로 지웁니다. 브라우저에서 AI가 처리해 사진이 서버로 전송되지 않아요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <BgRemove />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">상품·중고거래 사진</h3>
                  <p>물건만 깔끔하게 남겨 흰 배경 상세컷으로 만듭니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로필·합성</h3>
                  <p>인물만 오려내 다른 배경에 합성하거나 투명 PNG로 활용합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">로고·자료 제작</h3>
                  <p>투명 배경 이미지를 만들어 PPT·디자인 작업에 바로 씁니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> AI 배경 제거가 브라우저 안에서만 처리되며, 처음 한 번 AI 모델 파일만 내려받습니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <span className="text-sm text-gray-600">더 알아보기 — </span>
          <Link href="/guide/remove-background" className="text-sm font-semibold text-blue-700 hover:underline">사진 배경 제거(누끼) 무료로 하는 방법</Link>
        </div>
        <RelatedTools current="/bg-remove" />
      </main>

      <SiteFooter />
    </div>
  )
}
