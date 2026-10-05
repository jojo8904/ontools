
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { TextImage } from './TextImage'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '텍스트 이미지 생성기란?',
    p: [
      '명언, 짧은 글, 코드 조각, 메모를 SNS에 올리기 좋은 예쁜 이미지로 만들어주는 도구입니다. 인스타그램 피드·스토리, 블로그 썸네일 등에 활용할 수 있습니다.',
      '모든 작업은 브라우저 안에서 이뤄지며 입력 내용이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '사용 방법',
    p: [
      '텍스트를 입력하고 배경·글자 크기·색상을 고르면 오른쪽 미리보기에 바로 반영됩니다. 마음에 들면 "PNG 다운로드"를 누르세요.',
      '"코드" 모드를 선택하면 개발자들이 쓰는 코드 카드 스타일(창 점 3개, 고정폭 글꼴)로 만들어집니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '인스타 피드는 정사각형, 스토리는 세로, 블로그 썸네일은 가로 크기를 추천합니다.',
      '줄바꿈을 활용하면 문장이 더 또렷하게 보입니다.',
      'SNS 공유는 그 자체로 사이트·브랜드 홍보가 됩니다.',
    ],
  },
  {"h":"어디에 쓰이나","p":["SNS에 글만 올리면 묻히는 긴 글을 이미지로 만들어 인스타·스레드에 올리는 용도가 가장 많습니다. 명언·공지·메뉴판·안내문을 카카오톡 프로필이나 채널에 올릴 때, 유튜브 썸네일의 글자 부분을 따로 만들 때도 쓰입니다.","글자를 복사하지 못하게 막아야 하는 경우(가격표·내부 공지)에도 이미지 형태가 유용합니다. 반대로 검색에 걸려야 하는 글은 이미지가 아니라 텍스트로 올려야 합니다."]},
  {"h":"읽히는 글자 이미지의 조건","p":["휴대폰 화면에서 읽히려면 1,080px 너비 기준 글자 크기 40px 이상, 한 줄 15~20자 이내가 편합니다. 배경과 글자의 명도 차이를 크게 두고, 얇은 글꼴보다 중간 두께 이상을 쓰세요.","줄바꿈은 의미 단위로 직접 넣는 것이 자동 줄바꿈보다 읽기 좋습니다. 여백은 사방 글자 크기의 1.5배 이상 두면 답답하지 않습니다."]},
  {"h":"글꼴과 저작권","p":["이 도구의 기본 글꼴은 무료로 쓸 수 있는 글꼴입니다. 다른 글꼴을 쓰고 싶다면 상업적 이용이 허용된 글꼴(눈누 등에서 라이선스 확인)인지 보세요. 유료 글꼴을 무단으로 쓴 이미지는 저작권 문제가 생길 수 있습니다.","명언·가사·책 문장을 이미지로 만들어 올릴 때는 출처를 함께 적는 것이 관례이며, 상업적 사용은 저작권자의 허락이 필요합니다."]},
  {"h":"저장 형식과 투명 배경","p":["배경색이 있는 이미지는 JPG, 투명 배경에 글자만 필요한 경우(다른 이미지 위에 얹을 때)는 PNG로 저장하세요. 투명 PNG는 썸네일·합성에 바로 쓸 수 있습니다.","생성은 브라우저에서 이뤄지며 입력한 글은 서버로 전송되지 않습니다. 결과 픽셀 크기를 용도에 맞게(인스타 1,080×1,080 또는 1,080×1,350) 지정하면 업로드 시 재압축이 줄어듭니다."]},
]

const EXTRA_FAQ = [
  {"q":"글자가 이미지 밖으로 넘쳐요.","a":"글자 크기를 줄이거나 캔버스 크기를 키우세요. 긴 글은 줄바꿈을 직접 넣고, 그래도 넘치면 두 장으로 나누는 것이 읽기 좋습니다."},
  {"q":"이모지도 들어가나요?","a":"들어갑니다. 다만 기기·브라우저마다 이모지 모양이 달라 생성한 기기의 이모지 디자인으로 고정됩니다."},
  {"q":"세로 글(세로쓰기)도 되나요?","a":"세로쓰기 옵션은 없습니다. 줄마다 한 글자씩 줄바꿈을 넣으면 비슷한 효과를 낼 수 있습니다."},
  {"q":"만든 이미지의 글자를 나중에 수정할 수 있나요?","a":"이미지는 글자 정보가 없어 수정할 수 없습니다. 원문을 메모에 보관했다가 다시 생성하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/text-image' },
  title: '텍스트 이미지 생성기 (명언·코드 카드) - ontools',
  description:
    '명언·글귀·코드·메모를 인스타·블로그용 예쁜 이미지로 만듭니다. 그라데이션 배경, 코드 카드 스타일 지원. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '명언 이미지 만들기',
    '글귀 이미지',
    '텍스트 이미지',
    '코드 이미지',
    '카드뉴스 만들기',
    '인스타 글귀',
    'carbon 코드 이미지',
  ],
  openGraph: {
    title: '텍스트 이미지 생성기 (명언·코드 카드) - ontools',
    description: '명언·코드·메모를 예쁜 이미지로. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/text-image',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function TextImagePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">텍스트 이미지 생성기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">텍스트 이미지 생성기</h1>
          <p className="text-muted-foreground">
            명언·코드·메모를 SNS에 올리기 좋은 예쁜 이미지로 만듭니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <TextImage />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">SNS 게시물</h3>
                  <p>명언·글귀를 카드 형태로 만들어 인스타·페이스북에 올립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">코드 공유</h3>
                  <p>짧은 코드 스니펫을 예쁜 카드로 만들어 블로그·트위터에 공유합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">썸네일</h3>
                  <p>블로그 글 제목을 이미지로 만들어 대표 이미지로 사용합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  입력한 내용은 <strong className="text-gray-900">서버로 전송되지 않고</strong> 브라우저 안에서 이미지로 만들어집니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/text-image" />
      </main>

      <SiteFooter />
    </div>
  )
}
