import type { Metadata } from 'next'
import { ImageWorkflowPage } from '@/components/ImageWorkflowPage'
import { ProductPhotoBatch } from './ProductPhotoBatch'

export const metadata: Metadata = {
  title: '쇼핑몰 사진 일괄 가공 - 규격·워터마크·ZIP - ontools',
  description:
    '상품 사진 여러 장을 같은 가로·세로 크기, 최대 KB, 워터마크 조건으로 일괄 변환하고 ZIP으로 다운로드.',
  alternates: { canonical: '/product-photo-batch' },
  keywords: ['쇼핑몰 사진 일괄', '상품 이미지 크기', '사진 일괄 워터마크', '이미지 일괄 압축'],
  openGraph: {
    title: '쇼핑몰 사진 일괄 가공 - ontools',
    url: 'https://ontools.co.kr/product-photo-batch',
    type: 'website',
  },
}

export default function Page() {
  return (
    <ImageWorkflowPage
      title="쇼핑몰 사진 일괄 가공"
      description="상품 사진의 출력 규격과 워터마크를 한 번에."
      current="/product-photo-batch"
      notes={[
        '최대 20장, 장당 20MB, 원본 합계 80MB 이하.',
        '출력은 장당 최대 2000KB, 가로·세로 각각 최대 4096px, 전체 1,600만 픽셀 이하.',
        '오류가 난 사진은 ZIP에서 제외됩니다. 원본 EXIF는 복사하지 않으며 투명 배경은 흰색이 됩니다.',
      ]}
      guide={[
        {
          h: '상품 사진의 비율',
          p: [
            '서로 다른 비율의 원본을 같은 규격으로 만들 때 여백 방식은 상품 전체를 보존하지만 빈 공간이 생깁니다. 가운데 자르기 방식은 규격을 채우지만 상품의 가장자리나 설명 문구가 잘릴 수 있습니다.',
          ],
        },
        {
          h: '워터마크와 판매 채널',
          p: [
            '워터마크 허용 여부와 글자·테두리·추가 문구 기준은 판매 채널마다 다릅니다. 특정 플랫폼의 등록 적합성을 자동 판정하지 않습니다. 원본보다 크게 확대하면 화질이 떨어질 수 있습니다.',
          ],
        },
      ]}
      faq={[
        {
          q: '같은 이름의 사진이 있으면 덮어쓰나요?',
          a: 'ZIP 내부 파일에는 01-product, 02-product처럼 순번을 부여하므로 원본 파일명이 같아도 서로 덮어쓰지 않습니다.',
        },
        {
          q: '한 장이 실패하면 나머지도 취소되나요?',
          a: '아니요. 사진별로 처리 결과를 표시하고 성공한 사진만 ZIP에 담습니다. 작업 취소 시에는 완료 ZIP을 만들지 않습니다.',
        },
      ]}
    >
      <ProductPhotoBatch />
    </ImageWorkflowPage>
  )
}
