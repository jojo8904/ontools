
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { PasswordGenerator } from './PasswordGenerator'
import { YouTubeSection } from '@/features/youtube/components/YouTubeSection'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const PASSWORD_GUIDE = [
  { h: '안전한 비밀번호의 조건', p: ['비밀번호는 길이가 길수록, 대문자·소문자·숫자·특수문자를 고루 섞을수록 안전합니다. 최소 12자 이상을 권장하며, 생일·전화번호·연속된 숫자 등 추측하기 쉬운 조합은 피해야 합니다.'] },
  { h: '어떻게 생성되나요', p: ['본 생성기는 이용자의 브라우저에서 무작위로 비밀번호를 만들며, 생성된 값은 서버로 전송되지 않습니다. 길이와 포함할 문자 종류를 선택할 수 있습니다.'] },
  { h: '보관 팁', p: ['사이트마다 다른 비밀번호를 사용하고, 비밀번호 관리자(패스워드 매니저)를 이용하면 안전하게 관리할 수 있습니다. 2단계 인증을 함께 설정하면 더욱 안전합니다.'] },
  {"h":"길이가 가장 중요합니다","p":["소문자만 8자인 비밀번호는 경우의 수가 약 2,000억 개로 현대 그래픽카드로 몇 시간이면 전부 시도할 수 있습니다. 대소문자·숫자·특수문자를 섞은 12자는 약 5×10²³개로 같은 장비로 수백만 년이 걸립니다.","글자 종류를 늘리는 것보다 길이를 늘리는 효과가 큽니다. 특수문자 없는 16자가 특수문자 포함 10자보다 훨씬 안전합니다. 이 도구는 기본 16자 이상을 권장합니다."]},
  {"h":"기억해야 한다면 패스프레이즈","p":["무작위 문자열은 기억하기 어렵습니다. 관련 없는 단어 4~5개를 이은 '커피-달력-바람-종이' 같은 패스프레이즈는 20자가 넘으면서 외우기 쉽습니다. 사전 단어라도 4개 이상 무작위 조합이면 무차별 대입이 사실상 불가능합니다.","'사이트 이름 + 공통 비밀번호' 방식은 한 곳이 유출되면 규칙이 드러나 전부 위험해집니다. 사이트마다 완전히 다른 비밀번호를 쓰되 기억은 비밀번호 관리자에 맡기는 것이 현실적입니다."]},
  {"h":"비밀번호 관리자와 2단계 인증","p":["브라우저 내장 관리자(크롬·사파리)나 전용 앱(Bitwarden·1Password 등)은 사이트마다 다른 긴 비밀번호를 생성·저장하고 자동 입력합니다. 마스터 비밀번호 하나만 외우면 됩니다.","2단계 인증(OTP 앱·보안키)을 켜면 비밀번호가 유출돼도 로그인이 막힙니다. 이메일·금융·클라우드처럼 다른 계정을 복구할 수 있는 핵심 계정부터 켜세요. 문자(SMS) 인증은 OTP 앱보다 약하지만 없는 것보다는 낫습니다."]},
  {"h":"유출됐는지 확인하고 바꾸기","p":["주기적으로 바꾸는 것보다 유출됐을 때 바꾸는 것이 중요합니다. 90일마다 강제 변경하면 사람들은 끝자리 숫자만 바꾸게 되어 오히려 약해집니다. 현재 보안 지침도 '유출 시 변경'을 권고합니다.","내 이메일이 유출 사고에 포함됐는지는 haveibeenpwned.com 같은 서비스에서 확인할 수 있습니다. 포함돼 있다면 그 사이트와 같은 비밀번호를 쓴 모든 곳을 바꾸세요. 이 도구는 브라우저에서 생성하며 만든 비밀번호를 어디에도 전송하지 않습니다."]},
]

const EXTRA_FAQ = [
  {"q":"특수문자를 못 쓰는 사이트는 어떻게 하나요?","a":"특수문자 옵션을 끄고 길이를 4자 이상 늘리세요. 대소문자·숫자 16자는 특수문자 포함 12자보다 안전합니다."},
  {"q":"비밀번호에 생일이나 이름을 넣으면 안 되나요?","a":"공격자는 SNS에서 수집한 생일·이름·반려동물 이름을 먼저 시도합니다. 개인정보가 들어간 비밀번호는 길어도 약합니다."},
  {"q":"생성한 비밀번호를 어디에 저장하나요?","a":"비밀번호 관리자에 저장하는 것이 가장 안전합니다. 메모장·카톡 나에게 보내기·사진은 기기를 잃어버리면 그대로 노출됩니다. 종이에 적어 집 안에 보관하는 것은 온라인 유출보다 안전한 편입니다."},
  {"q":"비밀번호 힌트 질문은 안전한가요?","a":"'어머니 성함', '출신 학교'는 쉽게 알아낼 수 있습니다. 힌트 질문 답도 무작위 문자열로 만들어 관리자에 저장하는 것이 안전합니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/password-generator' },
  title: '비밀번호 생성기 - ontools',
  description: '안전한 랜덤 비밀번호를 생성하세요. 길이 조절, 대문자/숫자/특수문자 포함 여부 선택 가능.',
  keywords: ['비밀번호생성기', '패스워드생성', '랜덤비밀번호', '안전한비밀번호', '비밀번호만들기'],
  openGraph: { title: '비밀번호 생성기 - ontools', description: '안전한 랜덤 비밀번호를 생성하세요.', url: 'https://ontools.co.kr/password-generator', siteName: 'ontools', type: 'website' },
}

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-foreground">홈</Link>{' > '}<span className="text-foreground">유틸리티</span>{' > '}<span className="text-foreground font-medium">비밀번호 생성기</span></div>
        <div className="mb-8"><h1 className="text-3xl font-bold mb-2">비밀번호 생성기</h1><p className="text-muted-foreground">안전한 랜덤 비밀번호를 간편하게 생성하세요.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PasswordGenerator />
            <div className="mt-10 space-y-10">
              <YouTubeSection category="password-generator" />
            </div>
          </div>
          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">안전한 비밀번호 가이드</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p><strong>12자 이상</strong>을 권장합니다. 길이가 길수록 무차별 대입 공격에 강합니다.</p>
                <p>대소문자, 숫자, 특수문자를 조합하면 보안이 크게 강화됩니다.</p>
                <p>개인정보(이름, 생년월일, 전화번호)는 절대 비밀번호에 사용하지 마세요.</p>
              </div>
            </section>
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">비밀번호 관리 팁</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>사이트마다 서로 다른 비밀번호를 사용하세요.</p>
                <p>비밀번호 관리자(1Password, Bitwarden 등)를 활용하면 편리합니다.</p>
                <p>가능하면 2단계 인증(2FA)을 함께 설정하세요.</p>
              </div>
            </section>
          </aside>
        </div>
        <ToolGuide sections={PASSWORD_GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/password-generator" />
      </main>
      <SiteFooter />
    </div>
  )
}
