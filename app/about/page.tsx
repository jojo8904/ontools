import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TOOLS } from '@/lib/tools'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: '소개 - ontools',
  description:
    'ontools는 연봉·세금·금융·건강 계산기와 이미지·PDF 도구, 생활 가이드를 회원가입 없이 무료로 제공하는 한국어 유틸리티 사이트입니다. 운영 목적, 계산 근거, 파일 처리 방식, 업데이트 원칙을 안내합니다.',
  robots: { index: true, follow: true },
}

const COUNT = {
  finance: TOOLS.filter((t) => t.category === 'finance').length,
  salary: TOOLS.filter((t) => t.category === 'salary-tax').length,
  health: TOOLS.filter((t) => t.category === 'health').length,
  image: TOOLS.filter((t) => t.category === 'image').length,
  utility: TOOLS.filter((t) => t.category === 'utility').length,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf8fc' }}>
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-[#241a33]">ontools 소개</h1>
        <p className="text-[#6b6276] mb-8">검색해서 찾아 헤매던 계산과 파일 작업을, 설치 없이 브라우저에서 바로.</p>

        <div className="space-y-8 text-[#444] leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">왜 만들었나</h2>
            <p className="mb-3">
              연봉 실수령액이 얼마인지, 퇴직금이 어떻게 계산되는지, 아이폰 사진을 지원서 규격에 맞추려면 어떻게 해야 하는지. 이런 질문은
              한 번 검색하면 광고가 가득한 페이지, 설치를 요구하는 프로그램, 파일을 서버에 올리라는 사이트로 이어지기 일쑤였습니다.
            </p>
            <p>
              ontools는 그런 일을 <b>한 곳에서, 회원가입 없이, 파일을 내 컴퓨터 밖으로 보내지 않고</b> 끝내기 위해 만든 사이트입니다.
              2026년 현재 도구 {TOOLS.length}종과 가이드 {GUIDES.length}편을 운영하고 있으며, 모든 기능은 무료입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">무엇이 있나</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><b>연봉·세금 {COUNT.salary}종</b> — 연봉 실수령액, 퇴직금, 주휴수당, 연차, 실업급여, 종합소득세, 부가세, 4대보험, 프리랜서 세금 등. 2026년 상·하반기 보험료율과 세율을 구분해 적용합니다.</li>
              <li><b>금융 {COUNT.finance}종</b> — 환율, 대출이자, 예금·적금, 양도세, 증여세, 중고차 취득세, 자동차세, 중개수수료, 전세 vs 월세 비교 등.</li>
              <li><b>건강 {COUNT.health}종</b> — BMI, 일일 칼로리, 적정체중, 물 섭취량, 수면 시간, 출산예정일 등.</li>
              <li><b>이미지·PDF {COUNT.image}종</b> — 사진 용량 줄이기, HEIC 변환, 배경 제거, 민감정보 가리기, 증명사진 규격 맞추기, PDF 합치기·분할, 영수증 묶기, 표 사진을 엑셀로 등.</li>
              <li><b>생활 {COUNT.utility}종</b> — 단위 변환, D-day, 전기요금, 글자수 세기, 비밀번호 생성, QR 코드, 음력 변환, 사다리타기 등.</li>
              <li><b>가이드 {GUIDES.length}편</b> — 도구만으로 답이 안 나오는 질문(연말정산 준비, 2027년 최저임금 변화, 퇴사일 고르기, 가린 이미지에 원본이 남는지 등)을 글로 정리합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">계산 근거와 정확도</h2>
            <p className="mb-3">
              세금·보험 계산기는 국민연금공단, 국민건강보험공단, 고용노동부, 국세청이 공개한 요율과 한도를 사용하며, 각 계산기 하단에
              적용 기준과 출처 링크를 표시합니다. 요율이 바뀌면 적용 시기를 구분해 두 기간을 모두 선택할 수 있게 합니다.
            </p>
            <p className="mb-3">
              다만 계산기는 <b>월 예상치</b>입니다. 급여 계산기는 간이세액표 원천징수, 비과세 수당의 세부 종류, 연말정산의 모든 공제를
              재현하지 않습니다. 전기요금은 주택용 저압 기타계절 구간만 다룹니다. 이런 범위 제한은 각 도구 페이지의 「알아두기」에 적어 두었습니다.
            </p>
            <p>
              계산 로직은 단위 테스트로 경계값(보험료 상·하한, 세율 구간 경계, 0원·최대값)을 검증하고, 정책이 바뀌면 테스트와 함께 갱신합니다.
              틀린 값을 발견하시면 아래 문의로 알려 주세요. 확인 후 수정하고 변경 내역을 남깁니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">파일과 개인정보는 어떻게 다루나</h2>
            <p className="mb-3">
              이미지·PDF·OCR 도구는 <b>브라우저 안에서만</b> 동작합니다. 올린 파일은 서버로 전송되지 않고, 변환 결과도 내 컴퓨터에만 저장됩니다.
              인터넷을 끊고 변환해도 동작하며, 개발자 도구의 네트워크 탭으로 직접 확인할 수 있습니다. 방법은{' '}
              <Link href="/guide/does-free-tool-upload-files" className="text-[#2563eb] underline">무료 도구가 파일을 서버로 보내는지 확인하는 법</Link>에 정리했습니다.
            </p>
            <p>
              계산기에 입력한 급여·비밀번호·파일명은 방문 통계에 포함하지 않습니다. 통계(GA4)와 광고 스크립트가 외부와 통신하는 범위는{' '}
              <Link href="/privacy" className="text-[#2563eb] underline">개인정보처리방침</Link>에 적혀 있습니다. 회원가입과 로그인은 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">업데이트 원칙</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><b>정책 변경 반영</b> — 최저임금, 4대보험 요율, 세율 구간이 확정 고시되면 적용 시기에 맞춰 추가합니다. 2027년 최저임금(10,700원)과 국민연금 10% 인상은 하반기 요율 확정 후 함께 반영할 예정입니다.</li>
              <li><b>환율·영상 데이터</b> — 환율은 평일 1회 자동 갱신하며 기준 시각과 출처를 표시합니다. 36시간이 지난 데이터는 「오래된 데이터」로 구분합니다.</li>
              <li><b>도구 추가 기준</b> — 검색해도 쓸 만한 도구가 없거나, 파일을 서버로 보내야만 하는 작업을 우선 만듭니다. 이미 잘 만들어진 서비스가 있는 기능은 만들지 않습니다.</li>
              <li><b>기록</b> — 수정 내역과 운영 점검 결과는 저장소의 문서로 남깁니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">광고와 수익</h2>
            <p>
              사이트 운영비는 광고로 충당합니다. 광고는 콘텐츠와 구분되는 영역에만 두고, 광고를 클릭해야 결과가 나오는 식의 유도는 하지 않습니다.
              광고 차단 프로그램을 사용해도 모든 기능을 쓸 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">면책</h2>
            <p>
              모든 계산 결과는 참고용 추정치입니다. 세율·환율·요율은 수시로 바뀌고 개인 상황에 따라 실제 금액이 달라질 수 있으므로,
              계약·신고·진료처럼 중요한 결정은 관계 기관이나 전문가의 확인을 거치시기 바랍니다. 자세한 내용은{' '}
              <Link href="/terms" className="text-[#2563eb] underline">이용약관</Link>을 참고하세요.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#241a33]">운영자와 문의</h2>
            <p className="mb-3">
              ontools는 개인이 운영하는 사이트입니다. 오류 제보, 추가했으면 하는 도구, 제도 변경 알림을 보내 주시면 확인 후 답장드립니다.
              보통 2~3일 안에 회신합니다.
            </p>
            <a
              href="mailto:830508jo@gmail.com?subject=%5Bontools%5D%20%EB%AC%B8%EC%9D%98"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              ✉️ 문의 메일 보내기
            </a>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-[#2563eb] hover:underline">← 홈으로</Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
