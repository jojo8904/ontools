import type { Metadata } from 'next'
import Link from 'next/link'
import { RelatedTools } from '@/components/RelatedTools'

export const metadata: Metadata = {
  title: '증명사진 규격 정리 (여권·운전면허·이력서·비자) - ontools',
  description:
    '용도별 증명사진 규격을 cm·mm·픽셀(px)로 정리했습니다. 여권 35×45mm, 일반 증명사진 30×40mm, 미국 비자 51×51mm 등. 규격에 맞춰 바로 만들 수 있는 도구도 함께.',
  keywords: [
    '증명사진 규격',
    '여권사진 규격',
    '증명사진 크기',
    '반명함 사이즈',
    '여권사진 사이즈',
    '증명사진 픽셀',
    '비자사진 규격',
    '운전면허 사진 규격',
  ],
  openGraph: {
    title: '증명사진 규격 정리 (여권·운전면허·이력서·비자) - ontools',
    description: '용도별 증명사진 규격을 cm·mm·픽셀로 정리.',
    url: 'https://ontools.co.kr/id-photo-size',
    siteName: 'ontools',
    type: 'article',
  },
}

const SPECS = [
  { use: '일반 증명사진 (반명함)', cm: '3 × 4 cm', mm: '30 × 40 mm', px: '354 × 472 px', note: '이력서, 학생증, 각종 신청서' },
  { use: '여권', cm: '3.5 × 4.5 cm', mm: '35 × 45 mm', px: '413 × 531 px', note: '흰 배경, 최근 6개월 이내 촬영' },
  { use: '운전면허증', cm: '3.5 × 4.5 cm', mm: '35 × 45 mm', px: '413 × 531 px', note: '여권 사진과 동일 규격' },
  { use: '주민등록증', cm: '3.5 × 4.5 cm', mm: '35 × 45 mm', px: '413 × 531 px', note: '정면, 상반신' },
  { use: '미국 비자 / 영주권', cm: '5.1 × 5.1 cm', mm: '51 × 51 mm', px: '602 × 602 px', note: '2 × 2 inch 정사각형' },
  { use: '명함판', cm: '5 × 7 cm', mm: '50 × 70 mm', px: '591 × 827 px', note: '영정사진 등 큰 사진' },
]

export default function IdPhotoSizePage() {
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">홈</a>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">증명사진 규격</span>
        </div>

        <h1 className="text-3xl font-bold mb-3 leading-tight">증명사진 규격 정리</h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          용도별로 증명사진 규격이 다릅니다. 여권·운전면허·이력서·비자 등 자주 쓰는 규격을 cm·mm·픽셀(px)로 정리했습니다.
          픽셀 값은 인쇄 기준 300DPI로 환산한 값입니다.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">용도</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">cm</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">mm</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">픽셀(300DPI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SPECS.map((s) => (
                <tr key={s.use}>
                  <td className="px-3 py-3 whitespace-nowrap font-semibold text-gray-900">
                    {s.use}
                    {s.note && <span className="block text-xs font-normal text-gray-400">{s.note}</span>}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-gray-600">{s.cm}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-gray-600">{s.mm}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-blue-700">{s.px}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            규격에 맞춰 사진을 바로 만들고 싶다면{' '}
            <Link href="/id-photo" className="font-bold text-blue-700 hover:underline">증명사진 만들기 도구</Link>를 이용하세요. 사진은 서버로 전송되지 않습니다.
          </p>
        </div>

        <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-gray-700">
          <h2 className="text-xl font-bold text-[#241a33]">증명사진 촬영 시 주의할 점</h2>
          <p>
            여권·민원용 사진은 보통 <strong>흰색 또는 옅은 배경</strong>, <strong>정면 응시</strong>, <strong>최근 6개월 이내</strong> 촬영본을 요구합니다. 모자·컬러 렌즈·과한 보정은 거부될 수 있습니다.
          </p>
          <p>
            얼굴이 사진에서 차지하는 비율(머리 위 여백, 턱 아래 여백)도 규정이 있는 경우가 많으니, 여권 등 공식 서류는 발급 기관 안내를 함께 확인하세요.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-700">
          <h2 className="text-xl font-bold text-[#241a33]">픽셀(px)과 cm, 무엇으로 맞춰야 하나요?</h2>
          <p>
            온라인 제출은 보통 <strong>픽셀(px) 또는 파일 용량</strong> 기준이고, 인화(출력)는 <strong>cm·mm</strong> 기준입니다. 제출처 안내문에 적힌 단위에 맞추면 됩니다.
          </p>
          <p>
            용량 제한(예: 200KB 이하)이 함께 있다면, 규격을 맞춘 뒤{' '}
            <Link href="/image-compress" className="text-blue-700 hover:underline">사진 용량 줄이기</Link> 도구로 용량을 맞추면 됩니다.
          </p>
        </section>

        <div className="mt-10 rounded-xl border border-gray-200 bg-[#F2EEE6] p-6 text-center">
          <p className="text-gray-700 mb-3">규격에 맞는 증명사진을 무료로 만들어 보세요.</p>
          <Link
            href="/id-photo"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
          >
            증명사진 만들기 도구 열기
          </Link>
        </div>

        <RelatedTools current="/id-photo" />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; 2026 ontools. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
