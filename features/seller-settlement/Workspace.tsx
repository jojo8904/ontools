'use client'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useLocalTask } from '@/lib/useLocalTask'
import { useObjectUrls } from '@/lib/useObjectUrls'
import { DEMO_ORDER, DEMO_SETTLEMENT, parseCsv, reconcile, resultCsv, type Sheet, type Mapping, type Result } from './utils'

type Source = { sheets: Sheet[]; selected: number; mapping: Mapping }
const empty = (): Source => ({ sheets: [], selected: 0, mapping: { key: 0, amount: 1 } })
function Workspace() {
  const [sources, setSources] = useState<Source[]>([empty(), empty()])
  const [results, setResults] = useState<Result[] | null>(null)
  const [filter, setFilter] = useState('전체')
  const { busy, error, setError, run } = useLocalTask()
  const { createObjectUrl, clearObjectUrls } = useObjectUrls()
  const update = (i: number, value: Source) => { setSources(prev => prev.map((s, n) => i === n ? value : s)); setResults(null); setError('') }
  const download = (text: string, name: string) => {
    const a = document.createElement('a'); a.href = createObjectUrl(new Blob([text], { type: 'text/csv;charset=utf-8' }), name); a.download = name; a.click()
  }
  const demo = () => { setSources([{ ...empty(), sheets: parseCsv(DEMO_ORDER) }, { ...empty(), sheets: parseCsv(DEMO_SETTLEMENT) }]); setResults(null); setError('') }
  const compare = () => {
    try { setResults(reconcile(sources[0].sheets[sources[0].selected], sources[0].mapping, sources[1].sheets[sources[1].selected], sources[1].mapping)); setFilter('전체'); setError('') }
    catch (e) { setError(e instanceof Error ? e.message : '열을 확인해 주세요.') }
  }
  const visible = results?.filter(r => filter === '전체' || r.status === filter) || []
  return <main>
    <div className="notice"><strong>무료 · 가입 없이 · 파일 서버 전송 없음</strong><p>광고·분석 페이지와 분리된 작업 공간이야. 파일·결과는 이 창의 메모리에만 있어. 새로고침하면 사라져.</p></div>
    <div className="actions"><button disabled={busy} onClick={demo}>합성 예제로 시작</button><button disabled={busy} onClick={() => { setSources([empty(), empty()]); setResults(null); setError(''); clearObjectUrls(); document.querySelectorAll<HTMLInputElement>('input[type=file]').forEach(e => { e.value = '' }) }}>초기화</button></div>
    <p className="small">XLSX / UTF-8 CSV · 파일당 5MB · 시트 최대 5개 · 시트당 데이터 10,000행 / 100열. 첫 번째 실제 행은 제목이야. XLSX 숫자 키는 제외되므로 주문번호를 텍스트 셀로 저장해 줘.</p>
    <div className="sources">{sources.map((source, i) => {
      const sheet = source.sheets[source.selected]
      return <fieldset key={i} disabled={busy}><legend>{i === 0 ? '1. 주문 파일' : '2. 정산 파일'}</legend>
        <label>파일 선택<input aria-label={i === 0 ? '주문 파일' : '정산 파일'} type="file" accept=".xlsx,.csv" onChange={e => {
          const file = e.target.files?.[0]; if (!file) return
          update(i, empty())
          void run(async signal => { const { parseFile } = await import('./parser'); const sheets = await parseFile(file); if (!signal.aborted) update(i, { ...empty(), sheets }) })
        }} /></label>
        {sheet && <>
          <label>시트<select aria-label={`${i === 0 ? '주문' : '정산'} 시트`} value={source.selected} onChange={e => update(i, { ...source, selected: Number(e.target.value), mapping: { key: 0, amount: 1 } })}>{source.sheets.map((s, n) => <option key={n} value={n}>{s.name}</option>)}</select></label>
          {(['key', 'amount'] as const).map(k => <label key={k}>{k === 'key' ? '주문/상품 키 열' : '비교 금액 열'}<select aria-label={`${i === 0 ? '주문' : '정산'} ${k === 'key' ? '키' : '금액'} 열`} value={source.mapping[k]} onChange={e => update(i, { ...source, mapping: { ...source.mapping, [k]: Number(e.target.value) } })}>
            {Array.from({ length: Math.max(...sheet.rows.map(r => r.cells.length)) }, (_, n) => <option key={n} value={n}>{n + 1}열: {sheet.rows[0]?.cells[n]?.value || '(제목 없음)'}</option>)}
          </select></label>)}
          <p className="small">제목 행 {sheet.rows[0].row} · 데이터 {sheet.rows.length - 1}행. 키는 공백·대소문자까지 정확히 비교해.</p>
          <div className="scroll"><table><caption>처음 3개 데이터 행 미리보기</caption><thead><tr><th>원본 행</th><th>키</th><th>금액</th></tr></thead><tbody>{sheet.rows.slice(1, 4).map(r => <tr key={r.row}><td>{r.row}</td><td>{r.cells[source.mapping.key]?.value}</td><td>{r.cells[source.mapping.amount]?.value}</td></tr>)}</tbody></table></div>
        </>}
      </fieldset>
    })}</div>
    <p className="small">계산 기준: 정산 금액 − 주문 금액. 같은 통화·같은 기준의 금액을 골라 줘. 소수는 최대 2자리까지 정확히 계산하며 반올림하지 않아. 중복 키는 합산하지 않아.</p>
    <button className="primary" disabled={busy || sources.some(s => !s.sheets.length)} onClick={compare}>{busy ? '파일 읽는 중…' : '선택한 열 비교하기'}</button>
    {error && <p role="alert" className="error">{error}</p>}
    {results && <section aria-label="비교 결과"><h2>비교 결과</h2><p role="status">{results.length}개 비교 항목 · {results.filter(r => r.status === '일치').length}개 일치</p>
      <p className="notice">차이는 미지급·세무 오류의 확정이 아니야. 부분 환불, 수수료, 상품 단위, 정산일 차이를 원본에서 확인해 줘.</p>
      <label>상태 필터<select value={filter} onChange={e => setFilter(e.target.value)}>{['전체', '일치', '금액 차이', '주문에만 있음', '정산에만 있음', '중복 키', '입력 오류'].map(s => <option key={s}>{s}</option>)}</select></label>
      <p>{['일치', '금액 차이', '주문에만 있음', '정산에만 있음', '중복 키', '입력 오류'].map(s => `${s} ${results.filter(r => r.status === s).length}`).join(' · ')}</p>
      <button onClick={() => download(resultCsv(results, sources[0].sheets[sources[0].selected], sources[1].sheets[sources[1].selected]), 'settlement-comparison.csv')}>전체 결과 CSV 다운로드</button>
      <div className="scroll"><table><caption>선택 상태 {visible.length}개 (화면은 처음 200개, CSV는 전체)</caption><thead><tr>{['상태', '키', '주문 행', '정산 행', '주문 금액', '정산 금액', '차이', '확인 안내'].map(s => <th key={s}>{s}</th>)}</tr></thead><tbody>{visible.slice(0, 200).map((r, i) => <tr key={i}><td>{r.status}</td><td>{r.key}</td><td>{r.orderRows.join(', ') || '—'}</td><td>{r.settlementRows.join(', ') || '—'}</td><td>{r.order}</td><td>{r.settlement}</td><td>{r.difference}</td><td>{r.reason}</td></tr>)}</tbody></table></div>
    </section>}
    <details><summary>합성 예제 파일 다운로드</summary><p>실제 고객 정보가 없는 예제야. 00123의 차이는 -300.00, 긴 주문번호와 환불은 일치하고 중복·오류·양쪽 단독 키도 포함돼.</p><button onClick={() => download('\uFEFF' + DEMO_ORDER, 'demo-orders.csv')}>주문 예제 CSV</button><button onClick={() => download('\uFEFF' + DEMO_SETTLEMENT, 'demo-settlements.csv')}>정산 예제 CSV</button></details>
  </main>
}
createRoot(document.getElementById('workspace')!).render(<Workspace />)
