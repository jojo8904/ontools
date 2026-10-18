// A route handler intentionally bypasses the site's analytics/ad-bearing root layout.
// Opaque-origin sandbox keeps even scripts on the parent page outside the file DOM.
export function GET() {
  return new Response(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>판매자 정산 비교 작업 공간</title><style>
*{box-sizing:border-box}body{margin:0;color:#241a33;background:#faf8fc;font:15px/1.65 system-ui,sans-serif}main{padding:16px}p{margin:10px 0}.notice{background:#ede8f7;border:1px solid #dcd1ed;border-radius:12px;padding:12px}.small{font-size:13px;color:#60576c}.actions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.sources{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}fieldset{min-width:0;background:white;border:1px solid #ddd2e8;border-radius:14px;padding:14px}legend{font-weight:700}label{display:block;margin:10px 0}input,select{display:block;width:100%;max-width:100%;padding:9px;border:1px solid #b8acc6;border-radius:6px;background:white;color:#241a33;font:inherit}button{border:1px solid #b8acc6;background:white;color:#35254d;border-radius:8px;padding:10px 14px;font:inherit;cursor:pointer;margin:4px}button.primary{background:#68508a;color:white;font-weight:700}button:disabled{opacity:.5;cursor:default}:focus-visible{outline:3px solid #9673c4;outline-offset:2px}.scroll{overflow:auto;max-height:450px;border:1px solid #e2daea;margin:12px 0}table{border-collapse:collapse;width:100%;font-size:13px;text-align:left}td,th{padding:8px;border-bottom:1px solid #e2daea;overflow-wrap:anywhere;min-width:85px;max-width:240px}th{background:#eee8f4}caption{text-align:left;padding:8px}.error{color:#9c2037;background:#fff0f0;padding:12px}details{margin-top:20px}summary{cursor:pointer}@media(max-width:540px){.sources{grid-template-columns:1fr}main{padding:8px}}
</style></head><body><div id="workspace"></div><script src="/settlement-workspace.js"></script></body></html>`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; script-src https://ontools.co.kr/settlement-workspace.js http://localhost:3000/settlement-workspace.js http://127.0.0.1:4127/settlement-workspace.js; style-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors https://ontools.co.kr http://localhost:3000 http://127.0.0.1:4127; sandbox allow-scripts allow-downloads",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
