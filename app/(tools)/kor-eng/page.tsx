
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { KorEngConverter } from './KorEngConverter'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

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
  {"h":"왜 'dkssud'가 '안녕'이 되나","p":["한글 키보드(두벌식)에서 ㅇ은 d, ㅏ는 k, ㄴ은 s, ㅕ는 u, ㅇ은 d 자리에 있습니다. 한/영 전환을 잊고 치면 자판 위치는 같은데 영문이 나오므로, 글자를 자판 위치로 되돌리면 원래 한글을 복원할 수 있습니다.","반대로 한글 상태에서 영문을 치면 'hello'가 'ㅗ디ㅣㅐ'가 됩니다. 이 변환기는 양방향을 지원하고 입력 내용을 보고 방향을 자동으로 판단합니다."]},
  {"h":"복원이 안 되는 경우","p":["쌍자음(ㄲ·ㄸ·ㅃ·ㅆ·ㅉ)은 Shift를 눌러 치므로 영문 대문자(R·E·Q·T·W)로 나타납니다. 소문자로 쳤다면 'ㄱ'과 'ㄲ'을 구분할 수 없어 다른 글자로 복원될 수 있습니다.","영문 단어와 한글 오타가 섞인 문장은 자동 판단이 틀릴 수 있습니다. 이때는 변환 방향을 직접 지정하고, 영문으로 남겨야 할 부분은 따로 처리하세요."]},
  {"h":"세벌식·다른 자판","p":["이 변환기는 표준 두벌식 기준입니다. 세벌식 최종·390 자판으로 친 오타는 복원되지 않습니다. 맥의 '두벌식 표준'과 윈도우 '한국어 Microsoft IME'는 자판 배열이 같아 그대로 쓸 수 있습니다.","휴대폰 천지인·나랏글 자판은 자판 구조가 달라 한/영 오타 자체가 거의 생기지 않으며 이 변환기 대상이 아닙니다."]},
  {"h":"비밀번호·아이디 오타에 활용","p":["로그인이 계속 실패할 때 한/영 상태를 착각한 경우가 흔합니다. 입력한 글자를 변환기에 넣어 보면 실제로 무엇을 쳤는지 확인할 수 있습니다. 변환은 브라우저에서만 이뤄지고 입력 내용은 서버로 전송되지 않지만, 비밀번호는 확인 후 바로 지우세요.","검색창에 'dkssud'처럼 잘못 친 검색어도 변환해 다시 검색하면 됩니다. 구글·네이버는 일부 오타를 자동 교정하지만 긴 문장은 교정하지 못합니다."]},
]

const EXTRA_FAQ = [
  {"q":"'rkskekfk'는 무슨 뜻인가요?","a":"'가나다라'입니다. r=ㄱ, k=ㅏ, s=ㄴ, e=ㄷ, f=ㄹ 자리입니다."},
  {"q":"영문 대문자가 섞여 있으면요?","a":"대문자는 Shift를 누른 것으로 보아 쌍자음·쌍모음(ㄲ·ㅒ·ㅖ 등)으로 복원됩니다. 의도치 않은 대문자가 있으면 소문자로 바꾼 뒤 변환하세요."},
  {"q":"숫자와 기호는 어떻게 되나요?","a":"숫자와 대부분의 기호는 한/영 상태와 관계없이 같은 글자가 나오므로 그대로 유지됩니다."},
  {"q":"일본어·중국어 자판 오타도 되나요?","a":"아니요. 한글 두벌식과 영문 QWERTY 사이의 변환만 지원합니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/kor-eng' },
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
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
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
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/kor-eng" />
      </main>

      <SiteFooter />
    </div>
  )
}
