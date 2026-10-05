
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { CharacterCounter } from './CharacterCounter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const CHARCOUNT_GUIDE = [
  { h: '글자수 세기란?', p: ['입력한 텍스트의 글자수(공백 포함/제외), 바이트수, 단어수 등을 실시간으로 세어주는 도구입니다. 자기소개서, 이력서, SNS 게시글의 글자 제한을 확인할 때 유용합니다.'] },
  { h: '바이트수가 중요한 이유', p: ['일부 입력란은 글자수가 아닌 바이트수로 제한합니다. 한글은 보통 글자당 2~3바이트, 영문·숫자는 1바이트로 계산되므로, 자소서 "2000바이트 이내" 같은 제한을 맞출 때 바이트수 확인이 필요합니다.'] },
  { h: '활용', p: ['공백 포함/제외 글자수가 함께 표시되어 다양한 제출처의 기준에 맞춰 글을 다듬을 수 있습니다.'] },
  {"h":"자기소개서 글자수 기준: 공백 포함인가 제외인가","p":["대부분의 채용 사이트(잡코리아·사람인·대기업 자체 채용 페이지)와 대학 입시 자기소개서는 공백 포함 기준입니다. 공고에 명시가 없으면 공백 포함으로 맞추는 것이 안전하며, 줄바꿈도 한 글자로 세는 시스템이 많습니다.","500자 기준 글에서 공백 포함과 제외의 차이는 보통 60~80자입니다. 공백 제외 500자를 써 놓고 공백 포함 500자 입력창에 넣으면 10% 넘게 잘립니다."]},
  {"h":"바이트로 제한하는 곳","p":["일부 공공기관·금융권 지원 시스템은 '2,000바이트 이내'처럼 바이트로 제한합니다. 영문·숫자·공백은 1바이트, 한글은 EUC-KR 기준 2바이트, UTF-8 기준 3바이트입니다. 2,000바이트는 EUC-KR이면 한글 약 1,000자, UTF-8이면 약 666자입니다.","어느 기준인지 안내가 없으면 실제 입력창에 붙여 넣어 남은 바이트를 확인하는 것이 확실합니다. 이 도구는 UTF-8 바이트를 표시하므로 보수적인(더 큰) 값입니다."]},
  {"h":"원고지 매수와 단어 수","p":["200자 원고지 매수는 공백과 문장부호를 각각 한 칸으로 세고, 문단이 바뀔 때마다 줄을 바꿔 첫 칸을 비우므로 글자수 ÷ 200보다 10% 정도 더 나옵니다. 논술·백일장 제한이 '원고지 10매'라면 글자수로는 1,800자 안팎입니다.","영문 단어 수(word count)는 공백으로 구분된 덩어리 수입니다. 영어 에세이 '500 words'는 글자수가 아니라 단어 수이며, 한국어 글에는 의미가 없습니다."]},
  {"h":"글자수가 안 맞는 흔한 원인","p":["워드에서 자동으로 바뀐 둥근 따옴표(“ ”), 말줄임표(…), 특수 공백은 입력창에서 2~3바이트로 세어지거나 깨집니다. 메모장에 한 번 붙여 넣어 서식을 없앤 뒤 옮기면 줄어듭니다.","이모지는 한 글자처럼 보여도 4바이트 이상이고 시스템에 따라 2글자로 세어집니다. 공식 서류에는 넣지 않는 것이 안전합니다."]},
]

const EXTRA_FAQ = [
  {"q":"줄바꿈은 글자수에 들어가나요?","a":"시스템마다 다릅니다. 이 도구는 줄바꿈을 공백 포함 글자수에 넣습니다. 제출창이 줄바꿈을 세지 않으면 결과가 조금 줄어들 뿐이므로 보수적으로 맞출 수 있습니다."},
  {"q":"1,000자 자소서를 몇 분 안에 읽나요?","a":"한국어 성인 묵독 속도는 분당 500~700자 정도라 1,000자는 2분 안팎입니다. 채용 담당자는 더 빠르게 훑으므로 첫 두 문장에 핵심을 두세요."},
  {"q":"한글 한 글자가 왜 3바이트인가요?","a":"UTF-8 인코딩에서 한글은 3바이트로 저장됩니다. 오래된 시스템은 EUC-KR로 2바이트를 쓰므로 같은 글도 바이트 수가 다릅니다."},
  {"q":"입력한 글이 저장되나요?","a":"아니요. 글자수 계산은 브라우저 안에서만 이뤄지고 입력 내용은 서버로 전송되지 않습니다. 페이지를 닫으면 사라지므로 원문은 따로 보관하세요."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/character-counter' },
  title: '글자수 세기 - ontools',
  description:
    '텍스트의 글자수(공백 포함/제외), 바이트수, 단어수, 문장수를 실시간으로 세어줍니다. 자소서, SNS, 블로그 글자수 제한 확인에 유용.',
  keywords: [
    '글자수세기',
    '글자수계산',
    '바이트수',
    '단어수세기',
    '문자수세기',
    '자소서글자수',
    '텍스트카운터',
    'character counter',
  ],
  openGraph: {
    title: '글자수 세기 - ontools',
    description: '글자수, 바이트수, 단어수를 실시간으로 세어보세요.',
    url: 'https://ontools.co.kr/character-counter',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CharacterCounterPage() {
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
          <span className="text-foreground font-medium">글자수 세기</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">글자수 세기</h1>
          <p className="text-muted-foreground">
            텍스트의 글자수, 바이트수, 단어수, 문장수를 실시간으로 확인하세요.
          </p>
        </div>

        {/* Counter + SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CharacterCounter />
          </div>

          <aside className="space-y-6">
            {/* 자소서 글자수 가이드 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">자소서 글자수 제한</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-1.5 pr-3 font-semibold">기업/플랫폼</th>
                        <th className="text-right py-1.5 font-semibold">글자수</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-1.5 pr-3">삼성 (항목당)</td>
                        <td className="py-1.5 text-right font-medium">700자</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">LG (항목당)</td>
                        <td className="py-1.5 text-right font-medium">500~1,000자</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">SK (항목당)</td>
                        <td className="py-1.5 text-right font-medium">500~700자</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">현대차 (항목당)</td>
                        <td className="py-1.5 text-right font-medium">500자</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3">공기업 (NCS)</td>
                        <td className="py-1.5 text-right font-medium">500~1,000자</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>대부분 공백 포함 기준입니다. 지원 전 공고문의 기준(공백 포함/제외, 바이트)을 반드시 확인하세요.</p>
              </div>
            </section>

            {/* 플랫폼별 글자수 제한 */}
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">플랫폼별 글자수 제한</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">SNS</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-1.5 pr-3 font-semibold">플랫폼</th>
                          <th className="text-right py-1.5 font-semibold">제한</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">X (트위터)</td>
                          <td className="py-1.5 text-right font-medium">280자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">인스타그램 캡션</td>
                          <td className="py-1.5 text-right font-medium">2,200자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">페이스북 게시물</td>
                          <td className="py-1.5 text-right font-medium">63,206자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">유튜브 설명란</td>
                          <td className="py-1.5 text-right font-medium">5,000자</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">기타</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-1.5 pr-3">네이버 블로그 제목</td>
                          <td className="py-1.5 text-right font-medium">100자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">카카오톡 상태메시지</td>
                          <td className="py-1.5 text-right font-medium">60자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">구글 메타 디스크립션</td>
                          <td className="py-1.5 text-right font-medium">~160자</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">SMS 문자</td>
                          <td className="py-1.5 text-right font-medium">90 bytes</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3">LMS 문자</td>
                          <td className="py-1.5 text-right font-medium">2,000 bytes</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={CHARCOUNT_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/character-counter" />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
