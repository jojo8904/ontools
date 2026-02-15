export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">ontools</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            필요한 계산, 관련 뉴스까지 한 번에
          </h2>
          <p className="text-xl text-muted-foreground">
            실생활 유틸리티 도구와 AI 자동 뉴스 포털
          </p>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">금융</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>연봉 실수령액 계산기</li>
              <li>환율 계산기</li>
              <li>퇴직금 계산기</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-4">💪</div>
            <h3 className="text-xl font-bold mb-2">건강</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>BMI 계산기</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-3xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-2">유틸리티</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>단위 변환기</li>
              <li>D-day 카운터</li>
              <li>전기요금 계산기</li>
            </ul>
          </div>
        </div>

        {/* Status */}
        <div className="text-center text-muted-foreground">
          <p>🚀 프로젝트 초기화 완료!</p>
          <p className="text-sm mt-2">
            다음 단계: npm install 후 npm run dev
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
