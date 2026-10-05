
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import type { Metadata } from 'next'
import { ExifRemove } from './ExifRemove'
import { RelatedTools } from '@/components/RelatedTools'
import { ToolGuide } from '@/components/ToolGuide'
import { FaqSection } from '@/components/FaqSection'

const GUIDE = [
  {
    h: '사진 위치정보(EXIF)란?',
    p: [
      '스마트폰으로 찍은 사진에는 EXIF라는 숨은 정보가 함께 저장됩니다. 여기에는 사진을 찍은 GPS 위치(위도·경도), 촬영 날짜·시각, 카메라 기종 등이 포함될 수 있습니다.',
      '이 도구는 사진을 다시 저장하면서 이런 정보를 모두 제거한 깨끗한 사본을 만들어 줍니다. 처리는 브라우저 안에서만 이뤄지며 사진이 서버로 전송되지 않습니다.',
    ],
  },
  {
    h: '왜 지워야 하나요',
    p: [
      '집·직장에서 찍은 사진을 그대로 중고거래·블로그·커뮤니티에 올리면, 사진에 박힌 GPS 좌표로 내 위치가 노출될 수 있습니다.',
      '특히 당근마켓 등 중고거래나 SNS에 올리기 전, 위치정보를 지우면 사생활을 보호할 수 있습니다.',
    ],
  },
  {
    h: '활용 팁',
    p: [
      '사진을 올리면 위치정보(GPS)가 들어 있는지 자동으로 확인해 알려드립니다.',
      '제거는 원본을 건드리지 않고 깨끗한 사본을 새로 저장합니다.',
      '카카오톡·일부 SNS는 업로드 시 자동으로 메타데이터를 지우기도 하지만, 원본 파일을 직접 주고받을 때는 직접 지우는 것이 안전합니다.',
    ],
  },
  {"h":"EXIF에 무엇이 들어 있나","p":["촬영 날짜와 시각, 카메라·휴대폰 기종, 렌즈·조리개·셔터 속도, GPS 위치(위도·경도·고도), 촬영 방향, 작은 미리보기 썸네일, 편집 프로그램 이름이 들어 있습니다. 휴대폰 사진은 위치 서비스가 켜져 있으면 집 주소 수준의 정확한 좌표가 기록됩니다.","윈도우에서 사진 우클릭 → 속성 → 자세히, 맥에서는 미리보기 → 도구 → 속성 보기 → GPS 탭에서 확인할 수 있습니다."]},
  {"h":"어디에 올릴 때 지워야 하나","p":["중고거래 앱, 블로그, 커뮤니티, 이메일 첨부, 지원서 사진은 EXIF가 그대로 전달됩니다. 집에서 찍은 중고 물건 사진에 집 좌표가 남는 것이 대표적인 위험입니다.","인스타그램·페이스북·카카오톡·X는 업로드 시 EXIF를 자동으로 지웁니다. 반면 구글 포토 공유 링크, 드라이브 공유, 원본 전송 옵션은 EXIF가 유지되므로 직접 지우는 것이 안전합니다."]},
  {"h":"지워도 남는 것과 지우면 사라지는 것","p":["EXIF를 지워도 사진 자체(화질·픽셀)는 그대로입니다. 반대로 촬영 방향 정보가 함께 지워지면 세로로 찍은 사진이 눕는 경우가 있는데, 이 도구는 방향을 픽셀에 반영한 뒤 저장해 이 문제를 막습니다.","촬영 날짜가 필요한 사진(보험 청구·증빙)은 지우기 전에 날짜를 따로 기록해 두세요. 사진을 증거로 제출할 때는 EXIF가 있는 원본이 유리합니다."]},
  {"h":"휴대폰에서 미리 막는 방법","p":["아이폰은 공유 시 '옵션 → 위치 끄기'로 그 사진만 위치를 뺄 수 있고, 설정 → 개인정보 보호 → 위치 서비스 → 카메라를 '안 함'으로 두면 처음부터 기록되지 않습니다.","안드로이드는 카메라 앱 설정의 '위치 태그'를 끄면 됩니다. 이미 찍은 사진은 갤러리의 상세 정보에서 위치를 삭제하거나 이 도구로 일괄 제거하세요."]},
]

const EXTRA_FAQ = [
  {"q":"EXIF를 지우면 화질이 떨어지나요?","a":"아니요. 메타데이터만 제거하고 이미지 데이터는 다시 압축하지 않으므로 화질과 픽셀은 그대로입니다. 파일 크기는 몇 KB~수십 KB 줄어듭니다."},
  {"q":"스크린샷에도 EXIF가 있나요?","a":"스크린샷은 GPS가 없지만 기기 종류와 시각이 기록될 수 있습니다. 민감한 캡처라면 함께 제거하는 것이 깔끔합니다."},
  {"q":"PNG·HEIC도 되나요?","a":"JPG·PNG·WebP는 바로 처리됩니다. HEIC는 먼저 HEIC → JPG 변환 도구를 거치세요. 변환 과정에서 메타데이터가 함께 제거되므로 그 결과를 그대로 쓰면 됩니다."},
  {"q":"여러 장을 한 번에 지울 수 있나요?","a":"한 장씩 처리합니다. 모든 처리는 브라우저에서 이뤄지고 사진은 서버로 전송되지 않으므로, 장수가 많아도 보안 걱정 없이 반복하면 됩니다."},
]

export const metadata: Metadata = {
  alternates: { canonical: '/exif-remove' },
  title: '사진 위치정보(GPS·EXIF) 제거 - ontools',
  description:
    '사진에 숨어 있는 GPS 위치·촬영정보(EXIF)를 제거합니다. 위치정보 포함 여부 자동 확인. 브라우저에서 처리되어 사진이 서버로 전송되지 않습니다.',
  keywords: [
    '사진 위치정보 제거',
    'exif 제거',
    '사진 gps 제거',
    '메타데이터 제거',
    '사진 위치 지우기',
    '위치정보 삭제',
    'exif 삭제',
    '사진 개인정보 제거',
  ],
  openGraph: {
    title: '사진 위치정보(GPS·EXIF) 제거 - ontools',
    description: '사진 속 GPS·촬영정보 제거. 위치정보 포함 여부 자동 확인. 서버 전송 없이 브라우저에서 처리.',
    url: 'https://ontools.co.kr/exif-remove',
    siteName: 'ontools',
    type: 'website',
  },
}

export default function ExifRemovePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">홈</Link>
          {' > '}
          <span className="text-foreground">이미지·파일</span>
          {' > '}
          <span className="text-foreground font-medium">위치정보 제거</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">사진 위치정보(GPS·EXIF) 제거</h1>
          <p className="text-muted-foreground">
            사진에 숨은 GPS 위치·촬영정보를 지웁니다. 위치정보가 들어 있는지 자동으로 확인해드려요. 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ExifRemove />
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">이런 곳에 쓰여요</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">중고거래 사진</h3>
                  <p>당근마켓 등에 올리기 전 집 위치가 새지 않도록 위치정보를 지웁니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">블로그·SNS 업로드</h3>
                  <p>일상 사진을 공유하기 전 촬영 장소·기기 정보를 제거합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">파일 직접 전달</h3>
                  <p>이메일·메신저로 원본 파일을 보낼 때 메타데이터를 지워 보냅니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/70 bg-[#F2EEE6] p-6">
              <h2 className="text-xl font-bold mb-4">개인정보 안심</h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  사진은 <strong className="text-gray-900">서버로 전송되지 않습니다.</strong> 위치정보 확인과 제거 모두 브라우저 안에서만 처리됩니다.
                </p>
                <p>창을 닫으면 이미지는 메모리에서 사라집니다.</p>
              </div>
            </section>
          </aside>
        </div>

        <ToolGuide sections={GUIDE} />
      <FaqSection items={EXTRA_FAQ} />
        <RelatedTools current="/exif-remove" />
      </main>

      <SiteFooter />
    </div>
  )
}
