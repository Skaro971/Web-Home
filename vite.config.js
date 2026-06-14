import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: './',
  build: {
    outDir: 'extension',
    emptyOutDir: false,
    modulePreload: { polyfill: false },
  },
})
