import type { Metadata } from 'next'
import { ImageWorkflowPage } from '@/components/ImageWorkflowPage'
import { ReceiptPdf } from './ReceiptPdf'

export const metadata: Metadata = {
  title: '영수증·증빙사진 PDF 묶기 - 민감정보 가리기 - ontools',
  description:
    '영수증과 증빙 사진의 민감정보를 가리고 순서를 정해 하나의 A4 PDF로 만듭니다. 브라우저에서만 처리.',
  alternates: { canonical: '/receipt-pdf' },
  keywords: ['영수증 PDF', '증빙사진 묶기', '경비 증빙 PDF', '개인정보 가리기 PDF'],
  openGraph: {
    title: '영수증·증빙사진 PDF 묶기 - ontools',
    url: 'https://ontools.co.kr/receipt-pdf',
    type: 'website',
  },
}

export default function Page() {
  return (
    <ImageWorkflowPage
      title="영수증·증빙사진 묶기"
      description="민감정보를 가린 증빙 사진을 한 개의 A4 PDF로."
      current="/receipt-pdf"
      notes={[
        '최대 12장, 장당 20MB, 원본 합계 80MB 이하.',
        'A4 세로 한 페이지에 사진 한 장. 긴 변은 최대 1600px로 처리합니다.',
        '원본의 작은 글씨와 가림 영역을 확인한 뒤 제출해 주세요.',
      ]}
      guide={[
        {
          h: '민감정보가 포함된 증빙',
          p: [
            '영수증에는 카드번호 일부, 주소, 주문번호 등 불필요한 개인정보가 포함될 수 있습니다. 제출기관에 필요한 정보까지 가리면 증빙이 반려될 수 있으므로 공개 범위를 확인해야 합니다.',
          ],
        },
        {
          h: '검은 가림과 원본',
          p: [
            '내보내는 PDF에는 검은 가림을 픽셀에 합성한 새 이미지만 포함됩니다. 원본 이미지, 숨겨진 텍스트, 가리기 전 레이어는 PDF에 넣지 않습니다. 화면의 원본 미리보기와 기기에 있던 원본 파일 자체는 삭제하지 않습니다.',
          ],
        },
      ]}
      faq={[
        {
          q: 'PDF 안에서 가린 내용을 다시 볼 수 있나요?',
          a: '검은 영역이 합성된 이미지만 삽입하므로 PDF의 레이어 제거로 복원되지 않습니다. 다만 선택 영역 밖에 남은 정보나 원본 파일은 보호되지 않습니다.',
        },
        {
          q: '기존 PDF도 추가할 수 있나요?',
          a: '이 도구는 사진 전용입니다. 기존 PDF 파일의 병합은 별도의 PDF 합치기·분할 도구에서 처리할 수 있습니다.',
        },
      ]}
    >
      <ReceiptPdf />
    </ImageWorkflowPage>
  )
}
