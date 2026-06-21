import type { Metadata } from 'next'
import { CharacterCounter } from './CharacterCounter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const CHARCOUNT_GUIDE = [
  { h: '글자수 세기란?', p: ['입력한 텍스트의 글자수(공백 포함/제외), 바이트수, 단어수 등을 실시간으로 세어주는 도구입니다. 자기소개서, 이력서, SNS 게시글의 글자 제한을 확인할 때 유용합니다.'] },
  { h: '바이트수가 중요한 이유', p: ['일부 입력란은 글자수가 아닌 바이트수로 제한합니다. 한글은 보통 글자당 2~3바이트, 영문·숫자는 1바이트로 계산되므로, 자소서 "2000바이트 이내" 같은 제한을 맞출 때 바이트수 확인이 필요합니다.'] },
  { h: '활용', p: ['공백 포함/제외 글자수가 함께 표시되어 다양한 제출처의 기준에 맞춰 글을 다듬을 수 있습니다.'] },
]

export const metadata: Metadata = {
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
    url: 'https://ontools.com/character-counter',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function CharacterCounterPage() {
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
        <RelatedTools current="/character-counter" />
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
