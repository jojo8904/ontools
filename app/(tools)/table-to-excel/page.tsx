import type { Metadata } from 'next'
import { ImageWorkflowPage } from '@/components/ImageWorkflowPage'
import { TableToExcel } from './TableToExcel'

export const metadata: Metadata = {
  title: '표 사진 엑셀 변환 - OCR 표 인식·CSV·TSV - ontools',
  description:
    '한국어·영어 표 사진에서 글자를 인식하고 셀을 수정한 뒤 엑셀용 CSV·TSV로 다운로드. 사진은 서버 전송 없이 처리.',
  alternates: { canonical: '/table-to-excel' },
  keywords: ['표 사진 엑셀', '표 OCR', '이미지 엑셀 변환', '사진 CSV 변환'],
  openGraph: {
    title: '표 사진 엑셀 변환 - ontools',
    url: 'https://ontools.co.kr/table-to-excel',
    type: 'website',
  },
}

export default function Page() {
  return (
    <ImageWorkflowPage
      title="표 사진 → 엑셀 변환"
      description="표 사진의 한국어·영어 문자를 인식해 편집 가능한 CSV·TSV로."
      current="/table-to-excel"
      notes={[
        '최대 20MB·4,000만 픽셀의 사진 한 장. 긴 변은 2400px 이하로 처리합니다.',
        '최대 200행·12열. 병합 셀과 복잡한 다중 행 구조를 완벽히 재현하지 않습니다.',
        'Tesseract 엔진은 이 사이트에서, 언어 데이터는 jsDelivr에서 내려받습니다. 외부 서비스로 사진을 업로드하지 않습니다.',
      ]}
      guide={[
        {
          h: 'OCR 정확도',
          p: [
            '선명한 인쇄체와 수평으로 촬영된 표가 유리합니다. 작은 글씨, 그림자, 기울기, 테두리와 겹친 문자, 병합 셀은 인식 오류를 늘립니다. 숫자·단위·소수점·금액은 원본과 반드시 대조해야 합니다.',
          ],
        },
        {
          h: '엑셀과 텍스트 파일',
          p: [
            'CSV와 TSV는 값만 포함하며 셀 서식이나 수식을 보존하지 않습니다. UTF-8 형식이며, 엑셀의 텍스트 가져오기에서 열 형식을 텍스트로 지정하면 계좌번호의 앞자리 0 같은 값을 보존하기 좋습니다. 수식처럼 보이는 셀은 안전을 위해 문자로 내보냅니다.',
          ],
        },
      ]}
      faq={[
        {
          q: 'xlsx 파일로 만들어지나요?',
          a: '현재 출력은 엑셀에서 열 수 있는 CSV·TSV입니다. 표 복사는 탭으로 구분된 텍스트이며, 원본 사진의 서식이나 병합 셀은 유지되지 않습니다.',
        },
        {
          q: '오프라인에서 작동하나요?',
          a: '처음에는 엔진과 언어 데이터 다운로드를 위한 인터넷 연결이 필요합니다. 사진 인식 자체는 기기에서 수행되지만 완전한 오프라인 동작은 보장하지 않습니다.',
        },
      ]}
    >
      <TableToExcel />
    </ImageWorkflowPage>
  )
}
