/**
 * 전체 도구 레지스트리 — 검색, 관련 도구 추천, 사이트맵 등에서 공통 사용
 */
export type ToolCategory = 'salary-tax' | 'finance' | 'health' | 'utility' | 'image'

export interface ToolMeta {
  href: string
  label: string
  category: ToolCategory
  keywords?: string[]
  badge?: 'NEW' | 'HOT'
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  'salary-tax': '연봉·세금',
  finance: '금융',
  health: '건강',
  utility: '생활·유틸',
  image: '이미지·파일',
}

export const TOOLS: ToolMeta[] = [
  // 연봉·세금
  { href: '/salary', label: '연봉 실수령액 계산기', category: 'salary-tax', badge: 'HOT', keywords: ['월급', '실수령', '세후'] },
  { href: '/severance-pay', label: '퇴직금 계산기', category: 'salary-tax', keywords: ['퇴직', '근속'] },
  { href: '/weekly-holiday-pay', label: '주휴수당 계산기', category: 'salary-tax', keywords: ['주휴', '알바'] },
  { href: '/annual-leave-pay', label: '연차 수당 계산기', category: 'salary-tax', keywords: ['연차', '미사용'] },
  { href: '/unemployment', label: '실업급여 계산기', category: 'salary-tax', keywords: ['실업', '구직급여'] },
  { href: '/income-tax', label: '종합소득세 계산기', category: 'salary-tax', keywords: ['종소세', '소득세'] },
  { href: '/vat', label: '부가세(VAT) 계산기', category: 'salary-tax', keywords: ['부가가치세', '세금계산서'] },
  { href: '/freelancer-tax', label: '프리랜서 세금 계산기 (3.3%)', category: 'salary-tax', keywords: ['프리랜서', '원천징수', '3.3'] },

  // 금융
  { href: '/currency', label: '환율 계산기', category: 'finance', badge: 'HOT', keywords: ['달러', '엔화', '유로'] },
  { href: '/loan', label: '대출이자 계산기', category: 'finance', keywords: ['대출', '원리금', '이자'] },
  { href: '/savings', label: '적금/예금 이자 계산기', category: 'finance', keywords: ['적금', '예금', '이자'] },
  { href: '/capital-gains-tax', label: '양도소득세 계산기', category: 'finance', keywords: ['양도세', '부동산', '주식'] },
  { href: '/used-car-tax', label: '중고차 취등록세 계산기', category: 'finance', keywords: ['취득세', '자동차'] },
  { href: '/rent-vs-jeonse', label: '전세 vs 월세 비교 계산기', category: 'finance', keywords: ['전세', '월세', '보증금'] },

  // 건강
  { href: '/bmi', label: 'BMI 계산기', category: 'health', keywords: ['비만', '체질량'] },
  { href: '/calorie', label: '일일 칼로리(TDEE) 계산기', category: 'health', badge: 'HOT', keywords: ['칼로리', '기초대사량', '다이어트'] },
  { href: '/water-intake', label: '물 섭취량 계산기', category: 'health', keywords: ['수분', '하루'] },
  { href: '/ideal-weight', label: '적정체중 계산기', category: 'health', badge: 'NEW', keywords: ['표준체중', '정상체중', '비만도'] },
  { href: '/sleep', label: '수면 시간 계산기', category: 'health', badge: 'NEW', keywords: ['취침시간', '기상시간', '수면주기', '꿀잠'] },
  { href: '/alcohol', label: '음주 알코올 분해 계산기', category: 'health', badge: 'NEW', keywords: ['술 깨는 시간', '혈중알코올', '위드마크', '음주운전'] },

  // 생활·유틸
  { href: '/unit-converter', label: '단위 변환기', category: 'utility', keywords: ['단위', '변환', '길이', '무게'] },
  { href: '/d-day', label: 'D-day 계산기', category: 'utility', keywords: ['디데이', '날짜'] },
  { href: '/electricity', label: '전기요금 계산기', category: 'utility', keywords: ['전기세', '누진제'] },
  { href: '/character-counter', label: '글자수 세기', category: 'utility', keywords: ['글자', '바이트', '자소서'] },
  { href: '/password-generator', label: '비밀번호 생성기', category: 'utility', keywords: ['패스워드', '보안'] },
  { href: '/qr-generator', label: 'QR 코드 생성기', category: 'utility', keywords: ['큐알', 'QR'] },

  // 생활·유틸 (신규)
  { href: '/age', label: '만 나이 계산기', category: 'utility', badge: 'NEW', keywords: ['나이', '만나이', '연령'] },
  { href: '/pyeong', label: '평수 ↔ ㎡ 변환기', category: 'utility', badge: 'NEW', keywords: ['평', '제곱미터', '면적'] },
  { href: '/hourly-wage', label: '시급 ↔ 월급 환산기', category: 'salary-tax', badge: 'NEW', keywords: ['시급', '월급', '연봉환산'] },
  { href: '/discount', label: '할인율 계산기', category: 'utility', badge: 'NEW', keywords: ['할인', '세일', '퍼센트'] },
  { href: '/brokerage-fee', label: '부동산 중개수수료 계산기', category: 'finance', badge: 'NEW', keywords: ['복비', '중개보수', '부동산'] },

  // 추가 배치
  { href: '/four-insurances', label: '4대보험 계산기', category: 'salary-tax', badge: 'NEW', keywords: ['국민연금', '건강보험', '고용보험', '4대보험'] },
  { href: '/car-tax', label: '자동차세 계산기', category: 'finance', badge: 'NEW', keywords: ['자동차세', '차량세금', '배기량', '연납'] },
  { href: '/gift-tax', label: '증여세 계산기', category: 'finance', badge: 'NEW', keywords: ['증여세', '증여', '자녀증여', '증여공제'] },
  { href: '/compound-interest', label: '복리 계산기', category: 'finance', badge: 'NEW', keywords: ['복리', '복리이자', '투자', '72의법칙'] },
  { href: '/date-calc', label: '날짜 계산기', category: 'utility', badge: 'NEW', keywords: ['날짜계산', '며칠후', '일수'] },
  { href: '/due-date', label: '출산예정일 계산기', category: 'health', badge: 'NEW', keywords: ['출산예정일', '임신주수', '분만'] },

  // 이미지·파일 도구 (브라우저 처리, 서버 전송 없음)
  { href: '/image-compress', label: '사진 용량 줄이기', category: 'image', badge: 'NEW', keywords: ['사진용량', '이미지압축', '용량줄이기', 'KB', '200kb', '용량맞추기'] },
  { href: '/image-stitch', label: '카톡 캡처 이어붙이기', category: 'image', badge: 'NEW', keywords: ['캡처합치기', '이미지합치기', '사진합치기', '스크린샷합치기', '세로결합'] },
  { href: '/image-mask', label: '민감정보 가리기 (모자이크)', category: 'image', badge: 'NEW', keywords: ['신분증가리기', '주민번호가리기', '모자이크', '통장마스킹', 'exif제거', '계좌번호가리기'] },
  { href: '/id-photo', label: '증명사진 만들기', category: 'image', badge: 'NEW', keywords: ['증명사진', '여권사진', '반명함', '증명사진규격', '비자사진'] },
  { href: '/heic-to-jpg', label: 'HEIC → JPG 변환', category: 'image', badge: 'NEW', keywords: ['heic변환', 'heic jpg', '아이폰사진변환', 'heif', 'heic안열림'] },
  { href: '/image-to-pdf', label: '이미지 PDF 변환', category: 'image', badge: 'NEW', keywords: ['이미지pdf', '사진pdf', 'jpg pdf', '사진여러장pdf', 'pdf만들기'] },
  { href: '/text-image', label: '텍스트 이미지 생성기', category: 'image', badge: 'NEW', keywords: ['명언이미지', '글귀이미지', '코드이미지', '카드뉴스', '텍스트이미지'] },
  { href: '/watermark', label: '워터마크 넣기', category: 'image', badge: 'NEW', keywords: ['워터마크', '사진워터마크', '로고삽입', '저작권표시', '도용방지'] },
]

export function getToolByHref(href: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.href === href)
}

export function getRelatedTools(href: string, limit = 4): ToolMeta[] {
  const current = getToolByHref(href)
  if (!current) return TOOLS.slice(0, limit)
  const sameCategory = TOOLS.filter((t) => t.category === current.category && t.href !== href)
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit)
  // 같은 카테고리가 부족하면 다른 카테고리로 채움
  const others = TOOLS.filter((t) => t.category !== current.category && t.href !== href)
  return [...sameCategory, ...others].slice(0, limit)
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return TOOLS.filter(
    (t) =>
      t.label.toLowerCase().includes(q) ||
      t.keywords?.some((k) => k.toLowerCase().includes(q))
  )
}
