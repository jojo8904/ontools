/**
 * 도구 페이지의 안내 섹션(GUIDE)과 FAQ 배열에 항목을 추가한다.
 * 사용: node scripts/add-tool-content.mjs <content.json>
 * JSON 형식: { "/route": { "guide": [{ "h": "...", "p": ["..."] }], "faq": [{ "q": "...", "a": "..." }] } }
 * - *GUIDE 배열 끝에 guide 항목을, *FAQ 배열 끝에 faq 항목을 덧붙인다.
 * - FAQ 배열이 없으면 EXTRA_FAQ 상수를 만들고 <ToolGuide /> 다음에 <FaqSection />을 넣는다.
 * - 이미 같은 제목(h)이나 질문(q)이 있으면 건너뛴다.
 */
import fs from 'node:fs'
import path from 'node:path'

const file = process.argv[2]
if (!file) { console.error('content.json 경로를 주세요'); process.exit(1) }
const content = JSON.parse(fs.readFileSync(file, 'utf8'))

function findArrayEnd(src, openIdx) {
  // openIdx는 '[' 위치. 문자열 리터럴을 건너뛰며 짝이 맞는 ']'를 찾는다.
  let depth = 0
  let i = openIdx
  while (i < src.length) {
    const c = src[i]
    if (c === "'" || c === '"' || c === '`') {
      const quote = c
      i++
      while (i < src.length && src[i] !== quote) { if (src[i] === '\\') i++; i++ }
    } else if (c === '[') depth++
    else if (c === ']') { depth--; if (depth === 0) return i }
    i++
  }
  return -1
}

function serialize(items, indent = '  ') {
  return items.map((it) => indent + JSON.stringify(it)).join(',\n')
}

let changed = 0
for (const [route, data] of Object.entries(content)) {
  const page = path.join('app', '(tools)', route.replace(/^\//, ''), 'page.tsx')
  if (!fs.existsSync(page)) { console.warn(`없음: ${page}`); continue }
  let src = fs.readFileSync(page, 'utf8')
  let added = { guide: 0, faq: 0 }

  if (data.guide?.length) {
    // 1순위: const *GUIDE = [ ... ]  2순위: 인라인 guide={[ ... ]} 또는 sections={[ ... ]}
    const m = src.match(/const (\w*GUIDE)\s*=\s*\[/) || src.match(/\b(guide|sections)=\{\[/)
    if (!m) { console.warn(`${route}: GUIDE 배열 없음`); }
    else {
      const open = m.index + m[0].length - 1
      const close = findArrayEnd(src, open)
      const fresh = data.guide.filter((g) => !src.includes(`h: '${g.h}'`) && !src.includes(`"h":"${g.h}"`))
      if (fresh.length) {
        const before = src.slice(0, close).replace(/\s*$/, '')
        const sep = before.endsWith(',') ? '\n' : ',\n'
        src = before + sep + serialize(fresh) + ',\n' + src.slice(close)
        added.guide = fresh.length
      }
    }
  }

  if (data.faq?.length) {
    // 1순위: const *FAQ = [ ... ]  2순위: 인라인 faq={[ ... ]} 또는 items={[ ... ]}
    const m = src.match(/const (\w*FAQ)\s*=\s*\[/) || src.match(/\b(faq|items)=\{\[/)
    const fresh = data.faq.filter((f) => !src.includes(`q: '${f.q}'`) && !src.includes(`"q":"${f.q}"`))
    if (m && fresh.length) {
      const open = m.index + m[0].length - 1
      const close = findArrayEnd(src, open)
      const before = src.slice(0, close).replace(/\s*$/, '')
      const sep = before.endsWith(',') ? '\n' : ',\n'
      src = before + sep + serialize(fresh) + ',\n' + src.slice(close)
      added.faq = fresh.length
    } else if (!m && fresh.length) {
      // FAQ 상수와 섹션을 새로 만든다
      if (!src.includes("import { FaqSection }")) {
        src = src.replace(/import \{ ToolGuide \} from '@\/components\/ToolGuide'\n/, (s) => s + "import { FaqSection } from '@/components/FaqSection'\n")
      }
      const constBlock = `const EXTRA_FAQ = [\n${serialize(fresh)},\n]\n\n`
      src = src.replace(/export const metadata/, constBlock + 'export const metadata')
      src = src.replace(/(<ToolGuide[^\n]*\/>\n)/, `$1      <FaqSection items={EXTRA_FAQ} />\n`)
      added.faq = fresh.length
    }
  }

  if (added.guide || added.faq) {
    fs.writeFileSync(page, src)
    changed++
    console.log(`${route}: 섹션 +${added.guide}, FAQ +${added.faq}`)
  } else {
    console.log(`${route}: 변경 없음`)
  }
}
console.log(`${changed}개 페이지 수정`)
