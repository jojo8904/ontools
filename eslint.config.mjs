import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    files: ['app/CatRunner.tsx'],
    // This legacy canvas simulation mutates ref-owned objects in animation callbacks.
    rules: { 'react-hooks/immutability': 'off' },
  },
  {
    rules: {
      // Existing canvas tools intentionally use local blob images.
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts', 'public/pdf.worker-*.min.mjs', 'public/ocr/**']),
])
