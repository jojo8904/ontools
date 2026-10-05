
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ImageMask } from './ImageMask'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '민감정보 마스킹이란?',
    p: [
      '신분증, 통장 사본, 계약서 등을 제출할 때 주민등록번호·계좌번호·주소 같은 민감한 정보를 가려주는 도구입니다. 가릴 부분을 드래그하면 검은칠 또는 모자이크로 처리됩니다.',
      '모든 작업은 브라우저 안에서만 이뤄집니다. 신분증 같은 민감 이미지가 서버로 전송되지 않으므로 안심하고 사용할 수 있습니다.',
    ],
  },
  {
    h: '위치정보(EXIF)도 함께 제거',
    p: [
      '스마트폰으로 찍은 사진에는 촬영 위치(GPS), 기기 정보 등이 EXIF 메타데이터로 숨어 있을 수 있습니다.',
      '이 도구로 내보내면 이미지가 새로 그려지면서 이런 메타데이터가 모두 제거됩니다. 가린 정보뿐 아니라 위치정보까지 안전하게 지워집니다.',
    ],
  },
  {
    h: '사용 팁',
    p: [
      '검은칠은 확실하게 가려야 할 때, 모자이크는 가렸다는 표시를 남기되 형태를 흐릴 때 적합합니다.',
      '"○○은행 제출용"처럼 워터마크를 넣으면 사진이 다른 곳에 도용되는 것을 예방할 수 있습니다.',
      '가린 부분은 복원되지 않습니다. 원본은 따로 보관하세요.',
    ],
  },
  {"h":"검은칠과 모자이크, 언제 무엇을","p":["주민번호·계좌번호·전화번호·주소처럼 글자와 숫자는 검은칠(완전 덮기)이 안전합니다. 모자이크나 블러는 블록이 작으면 후보 글자를 대조해 복원할 가능성이 있습니다.","얼굴·차량 번호판처럼 '무엇이 있었는지'는 보이되 식별만 막으면 되는 경우에는 블록이 큰 모자이크가 자연스럽습니다. 어느 쪽이든 결과를 확대해 내용이 추정되지 않는지 확인하세요."]},
  {"h":"가린 뒤에도 남을 수 있는 것","p":["사진 파일의 EXIF에는 촬영 위치·기기·시각과 함께 작은 미리보기 썸네일이 들어 있을 수 있습니다. 일부 편집 프로그램은 픽셀만 바꾸고 썸네일은 원본 그대로 두어, 가리기 전 모습이 썸네일에 남습니다.","이 도구는 캔버스에서 픽셀을 바꾼 뒤 새 파일로 내보내므로 EXIF와 썸네일이 함께 제거됩니다. 다른 프로그램으로 가렸다면 위치정보(EXIF) 제거 도구를 한 번 더 거치세요."]},
  {"h":"자주 가리는 서류별 포인트","p":["신분증 사본은 주민번호 뒷자리 7자리를 가리고, 금융기관 제출용은 '○○은행 제출용'이라고 적어 두면 재사용을 막습니다. 통장 사본은 계좌번호 외의 잔액·거래 내역을, 등기부등본은 주민번호 뒷자리를 가립니다.","카카오톡·메신저 캡처는 상대방 이름·프로필·전화번호를, 영수증은 카드번호 중간 자리를 가립니다. 승인번호·금액·날짜는 증빙에 필요하므로 남깁니다."]},
  {"h":"PDF 서류를 가려야 한다면","p":["PDF 편집기에서 검은 사각형을 올리는 방식은 아래 텍스트가 그대로 남아 드래그로 읽힙니다. 안전하게 하려면 PDF를 이미지로 변환한 뒤 이 도구로 가리고 다시 PDF로 만들거나, '교정(redact)' 기능이 있는 프로그램을 쓰세요.","ontools에서는 PDF를 이미지로 → 민감정보 가리기 → 이미지 PDF 변환 순서로 이어서 처리할 수 있고, 모든 단계가 브라우저 안에서 끝납니다."]},
]

const EXTRA_FAQ = [
  {"q":"모자이크 블록 크기는 어느 정도가 안전한가요?","a":"글자 하나가 블록 하나 이하가 되도록 크게 잡으세요. 글자 높이의 절반보다 작은 블록은 복원 시도가 가능합니다. 숫자·글자는 모자이크보다 검은칠을 권합니다."},
  {"q":"가린 영역을 다시 되돌릴 수 있나요?","a":"저장한 파일에서는 되돌릴 수 없습니다. 작업 중에는 실행 취소가 되므로 저장 전에 확인하고, 원본은 따로 보관하세요."},
  {"q":"여러 장을 같은 위치로 가릴 수 있나요?","a":"한 장씩 처리합니다. 같은 양식의 서류가 여러 장이면 가릴 위치를 기억해 두고 장마다 같은 영역을 지정하세요. 영수증 여러 장을 가리면서 PDF로 묶을 때는 영수증·증빙사진 묶기 도구가 편합니다."},
  {"q":"가린 사진을 보냈는데 상대가 복원할 수 있나요?","a":"검은칠이나 큰 블록 모자이크로 가리고 이 도구로 내보냈다면 픽셀 정보가 없어 복원할 수 없습니다. 복원 사례는 약한 블러, 도형으로 덮은 PDF, 썸네일이 남은 파일에서 생깁니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/image-mask' },
  title: '신분증·통장 민감정보 가리기 (모자이크·마스킹) - ontools',
  description:
    '신분증, 통장사본, 계약서의 주민번호·계좌번호를 검은칠·모자이크로 가립니다. 워터마크 추가, 사진 위치정보(EXIF) 제거까지. 브라우저에서 처리되어 서버로 전송되지 않습니다.',
  keywords: [
    '신분증 가리기',
    '주민번호 가리기',
    '통장 모자이크',
    '민감정보 마스킹',
    '사진 모자이크',
    '계좌번호 가리기',
    'exif 제거',
    '제출용 사진',
  ],
  openGraph: {
    title: '신분증·통장 민감정보 가리기 - ontools',
    description: '주민번호·계좌번호 모자이크 + 워터마크 + 위치정보 제거. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/image-mask',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ImageMaskPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">민감정보 가리기</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">신분증·통장 민감정보 가리기</h1>
          <p className="text-muted-foreground">
            주민번호·계좌번호를 검은칠·모자이크로 가리고, 위치정보(EXIF)까지 제거합니다. 서버 전송 없이 브라우저에서 바로 처리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ImageMask />
          </div>

          <aside className="space-y-6">
            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">신분증 사본 제출</h3>
                  <p>본인확인용으로 신분증을 낼 때 주민번호 뒷자리를 가립니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">통장 사본</h3>
                  <p>계좌번호 일부나 잔액 등 불필요한 정보를 가린 뒤 제출합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">계약서·서류</h3>
                  <p>주소, 연락처 등 노출하면 안 되는 항목을 마스킹합니다.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#F2EEE6] rounded-xl border border-gray-200/70 p-6">
              <h2 className="text-xl font-bold mb-4">왜 안전한가요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  이미지는 <strong className="text-gray-900">서버로 전송되지 않고</strong> 사용자의 브라우저 안에서만 처리됩니다. 외부 업로드형 사이트와 달리, 민감한 신분증·통장 이미지가 어디에도 저장되지 않습니다.
                </p>
                <p>내보낼 때 사진 속 위치정보(EXIF)도 함께 제거됩니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/image-mask" />
      </main>

      <SiteFooter />
    </div>
  )
}
