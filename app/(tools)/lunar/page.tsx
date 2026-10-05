
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { LunarConverter } from './LunarConverter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '음력 ↔ 양력 변환이란?',
    p: [
      '양력 날짜를 음력으로, 음력 날짜를 양력으로 바꾸는 도구입니다. 어르신 생신, 제사, 설·추석 같은 명절 날짜를 확인할 때 사용합니다.',
      '한국천문연구원 기준의 한국 음력 데이터를 사용하며, 1000년~2050년 범위를 지원합니다.',
    ],
  },
  {
    h: '윤달이란?',
    p: [
      '음력은 달의 주기를 기준으로 해서 1년이 약 354일입니다. 양력과의 차이를 맞추기 위해 몇 년에 한 번 같은 달을 한 번 더 넣는데, 이것이 윤달입니다.',
      '음력 → 양력으로 변환할 때 해당 날짜가 윤달이라면 "윤달"을 체크해야 정확한 양력 날짜가 나옵니다.',
    ],
  },
  {
    h: '간지(육십갑자)란?',
    p: [
      '갑을병정… 10개의 천간과 자축인묘… 12개의 지지를 조합해 60년 주기로 해·달·날에 이름을 붙이는 방식입니다. "갑진년", "을사년" 같은 표현이 여기서 나옵니다.',
      '변환 결과와 함께 해당 날짜의 간지도 보여드립니다. 사주·전통 기념일 확인에 참고하세요.',
    ],
  },
  {"h":"2026~2027년 주요 음력 명절의 양력 날짜","p":["2026년은 설날 2월 17일(화), 정월대보름 3월 3일, 부처님오신날 5월 24일(일), 추석 9월 25일(금)입니다. 2027년은 설날 2월 7일(일), 부처님오신날 5월 13일(목), 추석 9월 15일(수)입니다.","음력 날짜는 해마다 양력으로 10~11일씩 앞당겨지다가 윤달이 끼면 다시 늦춰집니다. 그래서 추석이 9월 중순에 오는 해도, 10월 초에 오는 해도 있습니다."]},
  {"h":"윤달은 왜 생기고 언제 오나","p":["음력 한 달은 29.5일이라 12달이면 354일로 양력보다 11일 짧습니다. 이 차이를 메우려고 19년에 7번 한 달을 더 넣는데 이것이 윤달입니다. 2025년에 윤6월이 있었고 다음 윤달은 2028년입니다.","윤달은 '덤으로 생긴 달'이라 손 없는 달로 여겨 이장·수의 장만을 하는 풍습이 있습니다. 윤달에 태어난 사람의 음력 생일은 평년에는 같은 달의 본달로 쇱니다."]},
  {"h":"띠는 설날 기준인가, 입춘 기준인가","p":["일상에서는 음력 설날을 기준으로 띠가 바뀝니다. 2026년 2월 17일 설날부터 병오년 말띠이고, 그 전에 태어나면 을사년 뱀띠입니다. 사주·명리에서는 입춘(2월 4일경)을 기준으로 삼아 설날과 입춘 사이에 태어난 사람은 두 기준이 다를 수 있습니다.","2026년은 병오년(丙午), 2027년은 정미년(丁未)입니다. 간지는 10간과 12지를 조합해 60년마다 돌아오며, 61세 생일을 환갑이라 부르는 이유입니다."]},
  {"h":"음력 생일·제사 날짜 찾기","p":["음력 생일은 해마다 양력 날짜가 달라집니다. 올해 양력 날짜를 알려면 변환기에 음력 월·일과 올해 연도를 넣으세요. 주민등록상 생년월일이 음력인 어르신은 양력 생일을 모르는 경우가 많아 서류 작성 때 변환이 필요합니다.","제사는 돌아가신 날의 음력 날짜로 지내며, 보통 전날 저녁에 올립니다. 변환기로 올해 양력 날짜를 확인한 뒤 D-day 계산기에 넣으면 남은 날을 셀 수 있습니다."]},
]

const EXTRA_FAQ = [
  {"q":"음력 1월 1일과 양력 1월 1일이 왜 다른가요?","a":"음력은 달의 차고 기움을, 양력은 지구의 공전을 기준으로 하기 때문입니다. 음력 1월 1일(설날)은 양력으로 1월 21일~2월 20일 사이에 옵니다."},
  {"q":"주민등록 생일이 음력인지 양력인지 어떻게 아나요?","a":"주민등록등본·초본에는 양력으로만 표기됩니다. 부모님이 음력으로 신고했다면 등본의 날짜가 실제 음력 생일을 양력 날짜처럼 적은 것일 수 있으니 가족에게 확인하세요."},
  {"q":"사주 볼 때 생시도 필요하나요?","a":"사주는 연·월·일·시 네 기둥으로 구성되어 태어난 시각(두 시간 단위)이 필요합니다. 이 변환기는 날짜의 간지(연주·일주)만 표시합니다."},
  {"q":"중국·베트남 음력과 같나요?","a":"원리는 같지만 기준 시간대가 달라 드물게 하루 차이가 납니다. 한국은 한국천문연구원 기준이며 이 변환기도 그 기준을 따릅니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/lunar' },
  title: '음력 양력 변환기 (윤달·간지 지원) - ontools',
  description:
    '양력↔음력 날짜를 서로 변환합니다. 어르신 생신·제사·명절 날짜 확인, 윤달 처리, 간지(육십갑자) 표시. 한국 음력 기준 1000~2050년 지원.',
  keywords: ['음력 변환', '양력 음력 변환', '음력 계산기', '음력 생일', '윤달', '음양력 변환', '간지', '육십갑자'],
  openGraph: {
    title: '음력 양력 변환기 (윤달·간지 지원) - ontools',
    description: '음력↔양력 변환, 윤달·간지까지. 한국 음력 기준.',
    url: 'https://ontools.co.kr/lunar',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function LunarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">생활·유틸</span>
          {' > '}
          <span className="text-foreground font-medium">음력 양력 변환기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">음력 ↔ 양력 변환기</h1>
          <p className="text-muted-foreground">
            어르신 생신·제사·명절 날짜 확인. 윤달과 간지(육십갑자)까지 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LunarConverter />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">어르신 생신 챙기기</h3>
                  <p>음력 생신이 올해 양력으로 며칠인지 확인합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">제사·기일</h3>
                  <p>음력 기일을 양력 달력에 표시할 날짜로 바꿉니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">전통 기념일</h3>
                  <p>내 음력 생일, 명절 관련 날짜를 확인합니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">함께 쓰면 좋아요</h2>
              <div className="space-y-2 text-sm leading-relaxed">
                <p><Link href="/age" className="font-semibold text-blue-700 hover:underline">만 나이 계산기</Link> — 생일로 만 나이 확인</p>
                <p><Link href="/d-day" className="font-semibold text-blue-700 hover:underline">D-day 계산기</Link> — 생신·기념일까지 며칠?</p>
                <p><Link href="/date-calc" className="font-semibold text-blue-700 hover:underline">날짜 계산기</Link></p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/lunar" />
      </main>

      <SiteFooter />
    </div>
  )
}
