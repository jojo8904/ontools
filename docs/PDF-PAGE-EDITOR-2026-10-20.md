# PDF 페이지 편집 (2026-10-20)

- 기존 `/pdf-merge`의 병합·분할을 유지하고 별도 페이지 편집 탭 추가. 레지스트리는 기존 경로의 검색 키워드만 확장.
- 한 PDF의 페이지 썸네일, 앞/뒤 이동, 시계 방향 90도 회전, 삭제, 한 번에 새 PDF 다운로드. 원본 bytes는 보존하고 pdf-lib copyPages에 최종 순서와 원본 회전+추가 회전을 적용.
- 기존 설치된 pdfjs-dist와 버전 일치하는 `/pdf.worker-6.3.289.min.mjs` 사용. 새 의존성·외부 서비스·결제 없음. 문서 bytes/파일명/썸네일을 네트워크나 분석 이벤트로 전송하지 않음.
- 편집 제한: 50MiB, 1~200페이지. 12페이지 단위로 긴 변을 180px로 제한해 순차 렌더링. 화면 변경 시 렌더 취소 및 썸네일 URL 해제, 초기화/탭 이탈 시 worker 파기. 다운로드 URL은 교체·초기화·unmount 시 해제.
- 손상·암호화 PDF는 오류 메시지로 거절. 기존 병합·분할도 ignoreEncryption 우회 제거. 암호 해제 기능은 제공하지 않음.
- 마지막 페이지 삭제 금지. 모든 편집 버튼은 기본 키보드 동작 제공, 44px 터치 높이. 상태 메시지 aria-live 제공. 초기화는 원본 선택부터 재시작하며 편집 취소/실패 후 재선택 가능.
- PDF.js 미리보기 실패 시 메시지를 제공하고 저장을 시도할 수 있음. 저사양 기기의 극단적 압축/복잡한 PDF는 페이지·용량 제한 안에서도 메모리를 많이 쓸 수 있음. PDF 내부 구조·전자서명 보존은 보장하지 않으며 저장은 새 PDF로 재구성함.

## 검증

합성 PDF 단위 테스트: 순서, 기존 회전 누적, 삭제, 원본 보존, 빈 결과/잘못된 인덱스 거절, 손상·암호화 표시·201페이지 거절. 암호화 테스트는 합성 Encrypt trailer와 jsPDF로 생성한 실제 비밀번호 암호화 PDF 양쪽의 거절을 확인함.

Playwright desktop/mobile: 썸네일 표시, 이동·키보드 회전·삭제·마지막 페이지 보호, 실제 저장 bytes의 페이지 크기/회전 확인, 초기화·손상 파일 오류·문서 POST 없음, 기존 병합·추출·전체 ZIP 분할.

승인 범위는 구현과 검증 및 검토 브랜치/커밋 준비. main 병합, 프로덕션 배포, 티스토리 발행은 수행하지 않음.

최종 결과: `npm run lint`, `npm run typecheck`, `npm test -- --run` (20개 파일 / 175개 테스트), `npm run build` 통과. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- e2e/pdf-editor.spec.ts` desktop/mobile 6개 통과. `git diff --check` 통과.

빌드 중 기존 OG 이미지 동적 Google Fonts 조회에서 `EAI_AGAIN fonts.googleapis.com` 경고 발생. 빌드는 종료 코드 0으로 성공했고 PDF 편집과 무관함. OCR 언어 다운로드는 실행하지 않았고 TLS 검증 변경도 없음. 다양한 암호화 방식의 PDF, 대형 복잡 문서 전수 호환성 및 스크린리더 실기기 검증은 수행하지 않음.


## 배포 전 독립 리뷰 및 보완

독립 읽기 전용 리뷰 후 201페이지 초과 안내가 손상 오류로 표시되는 문제를 전용 오류로 수정. getPage 대기 후 취소 확인, canvas 해제/page cleanup의 finally 보장, 완료된 과거 로딩 작업의 ref 덮어쓰기 방지, 현재 파일/편집 상태에 일치하는 썸네일만 표시하도록 보완. 초기화·페이지 이동·저장 버튼도 44px 이상 높이로 통일.

- `PDF page editing > preserves source and saves reordered pages with additive rotations and deletion`: 원본 회전 90도에 추가 270도를 적용해 0도로 정규화, 삭제·순서·원본 bytes 보존 확인.
- `PDF page editing > rejects encrypted PDFs without bypassing encryption`: 합성 Encrypt trailer 거절.
- `PDF page editing > rejects a real password encrypted synthetic PDF`: jsPDF 실제 비밀번호 암호화 파일 거절.
- `PDF page editing > rejects damaged and excessive documents`: 손상 입력 및 201페이지 거절.
- `preview, reorder, rotate, delete, save and reset locally`: 데스크톱/모바일 각 통과. 저장 bytes 재로딩 결과 `[[200,0],[100,90]]` (페이지 너비, 회전), 마지막 페이지 보호, 키보드 회전, 손상 오류.
- `existing merge and extraction still download valid PDFs`: 데스크톱/모바일 각 통과. 병합 4페이지, 추출 너비 200의 1페이지, ZIP 2개 PDF와 두 번째 페이지 너비 확인.
- `repeated edits preserve existing rotation and replacement clears stale state`: 데스크톱/모바일 각 통과. 기존 90도 페이지를 6회 회전·2회 이동 후 다른 페이지 삭제, 저장 bytes 결과 `[[300,0],[100,270]]`. 교체 파일 재저장 결과 `[[400,0]]`. 교체 후 이전 썸네일 URL과 완료 상태 제거, 탭 재진입/초기화 후 썸네일·저장 버튼 없음, 실제 암호화 거절, 201페이지 안내, 로컬 worker 요청과 모든 요청 URL/body의 문서 마커 미포함 확인.

워크플로우 URL: `/pdf-merge` → **페이지 미리보기·편집**. worker는 동일 출처 `/pdf.worker-6.3.289.min.mjs`. public과 설치 패키지 worker SHA-256 모두 `8ab0e5e30031b4a06ecfddd5ae9562f0227f830ee7ec9ed1a968b134243d2386`.

독립 재리뷰에서 새 배포 차단 결함은 발견되지 않음. 파일 교체·초기화·탭 재진입의 최종 상태는 E2E로 검증했으나, getPage/render의 특정 타이밍에 취소되는 경합을 강제 지연하여 재현한 테스트는 미수행. 해당 취소 처리는 코드 리뷰로 확인함.
