import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기 - ontools',
  description: 'ontools 도구 오류 제보, 기능 제안, 제휴 문의는 이메일로 보내주세요.',
  openGraph: {
    title: '문의하기 - ontools',
    description: '도구 오류 제보, 기능 제안, 제휴 문의 안내.',
    url: 'https://ontools.co.kr/contact',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ContactPage() {
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground font-medium">문의하기</span>
        </div>

        <h1 className="text-3xl font-bold mb-3">문의하기</h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          ontools를 이용해 주셔서 감사합니다. 아래 내용은 이메일로 보내주시면 확인 후 답변드리겠습니다.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="font-bold text-gray-900 mb-1">이메일</h2>
            <a href="mailto:830508jo@gmail.com" className="text-blue-700 font-semibold hover:underline">
              830508jo@gmail.com
            </a>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 mb-2">이런 내용을 보내주세요</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px] leading-relaxed">
              <li>도구가 제대로 동작하지 않거나 결과가 이상할 때 (오류 제보)</li>
              <li>"이런 계산기·도구가 있으면 좋겠다" 같은 기능 제안</li>
              <li>광고·제휴·콘텐츠 관련 문의</li>
              <li>개인정보·저작권 관련 요청</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 mb-1">답변 안내</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              1인이 운영하는 사이트라 답변이 며칠 걸릴 수 있습니다. 오류 제보 시 어떤 도구에서 어떤 상황이었는지 함께 적어주시면 더 빠르게 확인할 수 있어요.
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-800 underline">개인정보처리방침</a>
          <span className="mx-2 text-gray-300">·</span>
          <a href="/terms" className="hover:text-gray-800 underline">이용약관</a>
          <span className="mx-2 text-gray-300">·</span>
          <a href="/about" className="hover:text-gray-800 underline">소개</a>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
