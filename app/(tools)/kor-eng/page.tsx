import type { Metadata } from 'next'
import { KorEngConverter } from './KorEngConverter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'

const GUIDE = [
  {
    h: '한/영타 변환기란?',
    p: [
      '한/영 키를 잘못 놓고 입력한 문장을 원래 의도한 글자로 되돌리는 도구입니다. "dkssudgktpdy"를 "안녕하세요"로, "ㅗ디ㅣㅐ"를 "hello"로 바꿔 줍니다.',
      '두벌식 표준 자판 기준이며, 입력 내용은 서버로 전송되지 않고 브라우저 안에서만 변환됩니다.',
    ],
  },
  {
    h: '어떻게 동작하나요',
    p: [
      '영타→한글: 알파벳을 두벌식 자판의 자모(ㅂㅈㄷ…)로 바꾼 뒤, 초성·중성·종성 규칙에 따라 완성된 한글로 조합합니다. 쌍자음(Shift)과 겹받침(ㄳ·ㄺ 등)도 처리합니다.',
      '한글타→영어: 반대로 한글을 자모로 분해해 해당 위치의 영문 키로 되돌립니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '"자동 감지"로 두면 입력에 한글이 있는지에 따라 방향을 알아서 정합니다.',
      '채팅·메모에서 잘못 친 긴 문장을 통째로 붙여넣고 한 번에 변환하세요.',
      '숫자·기호·띄어쓰기는 그대로 유지됩니다.',
    ],
  },
]

export const metadata: Metadata = {
  title: '한/영타 변환기 (dkssud → 안녕) - ontools',
  description:
    '한/영 키를 잘못 놓고 친 문장을 되돌립니다. dkssudgktpdy→안녕하세요, ㅗ디ㅣㅐ→hello. 두벌식 기준, 자동 감지, 서버 전송 없음.',
  keywords: ['한영타 변환', '한영 변환기', 'dkssud', '영타 한글 변환', '한타 영타', '한영키 변환', '오타 변환'],
  openGraph: {
    title: '한/영타 변환기 (dkssud → 안녕) - ontools',
    description: '잘못 친 한/영타를 원래 문장으로. 자동 감지 지원.',
    url: 'https://ontools.co.kr/kor-eng',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function KorEngPage() {
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
          <span className="text-foreground">생활·유틸</span>
          {' > '}
          <span className="text-foreground font-medium">한/영타 변환기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">한/영타 변환기</h1>
          <p className="text-muted-foreground">
            한/영 키를 잘못 놓고 친 문장을 원래대로. dkssudgktpdy → 안녕하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <KorEngConverter />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">채팅 오타 복구</h3>
                  <p>한/영 키를 안 바꾸고 길게 친 메시지를 한 번에 되돌립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">비밀번호·아이디 확인</h3>
                  <p>영문으로 쳐야 할 것을 한글 상태로 쳤을 때 무엇이 입력됐는지 확인합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">문서 복구</h3>
                  <p>메모장에 잘못 친 긴 글을 통째로 변환해 다시 씁니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  입력한 내용은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 변환이 브라우저 안에서만 이뤄져 비밀번호처럼 민감한 내용도 안심입니다.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
        <RelatedTools current="/kor-eng" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
