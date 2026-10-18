import { build } from 'esbuild'
await build({ entryPoints: ['features/seller-settlement/Workspace.tsx'], bundle: true, jsx: 'automatic', minify: true, format: 'iife', platform: 'browser', target: 'es2020', outfile: 'public/settlement-workspace.js', define: { 'process.env.NODE_ENV': '"production"' }, tsconfig: 'tsconfig.json' })
