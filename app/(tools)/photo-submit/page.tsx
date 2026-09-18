import type { Metadata } from 'next'
import { ImageWorkflowPage } from '@/components/ImageWorkflowPage'
import { PhotoSubmit } from './PhotoSubmit'

export const metadata: Metadata = {
  title: '사진 제출 도우미 - 픽셀·KB·형식 맞추기 - ontools',
  description:
    '제출 사진의 가로·세로 픽셀, JPG·PNG·WebP 형식과 최대 KB를 함께 맞춥니다. 서버 전송 없는 로컬 처리.',
  alternates: { canonical: '/photo-submit' },
  keywords: ['사진 제출', '사진 200kb', '사진 픽셀 용량', '지원서 사진 규격'],
  openGraph: {
    title: '사진 제출 도우미 - ontools',
    url: 'https://ontools.co.kr/photo-submit',
    type: 'website',
  },
}

export default function Page() {
  return (
    <ImageWorkflowPage
      title="사진 제출 도우미"
      description="제출 규격에 맞춘 픽셀 크기·파일 형식·최대 용량."
      current="/photo-submit"
      notes={[
        '원본: JPG·PNG·WebP, 20MB·4,000만 픽셀 이하.',
        '출력: 가로·세로 각각 최대 4096px, 전체 1,600만 픽셀 이하. 1KB는 1024바이트입니다.',
        '투명 영역은 흰색으로 저장됩니다. 애니메이션은 정지 사진 한 장으로 처리합니다.',
      ]}
      guide={[
        {
          h: '픽셀과 파일 크기는 다른 기준',
          p: [
            '픽셀은 이미지의 가로·세로 크기이고 KB는 저장된 파일의 크기입니다. 같은 픽셀이어도 사진의 복잡도와 저장 형식에 따라 파일 크기가 달라집니다. 손실 압축으로도 제한 용량에 도달하지 못하면 픽셀 크기를 몰래 변경하지 않고 오류로 표시합니다.',
          ],
        },
        {
          h: '제출기관의 별도 심사',
          p: [
            '여권·신분증·지원서 사진은 얼굴 비율, 배경, 촬영 시기 등 별도 기준이 있을 수 있습니다. 픽셀과 파일 용량 충족은 제출 승인이나 신분증 사진 적합성 보장이 아닙니다.',
          ],
        },
      ]}
      faq={[
        {
          q: 'PNG 용량이 줄지 않는 이유는 무엇인가요?',
          a: 'PNG는 JPG와 같은 품질 슬라이더 방식의 손실 압축을 쓰지 않습니다. 픽셀 수가 크면 작은 KB 제한을 만족하지 못할 수 있습니다.',
        },
        {
          q: '위치정보가 남나요?',
          a: '출력은 캔버스 픽셀로 새로 인코딩하며 원본 EXIF 정보를 복사하지 않습니다. 사진에 직접 찍힌 주소나 글자는 그대로 남습니다.',
        },
      ]}
    >
      <PhotoSubmit />
    </ImageWorkflowPage>
  )
}
