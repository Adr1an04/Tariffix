import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/background/background.ts'),
      name: 'background',
      formats: ['iife'],
      fileName: () => 'background.js'
    },
    rollupOptions: {
      external: ['chrome'],
      output: {
        globals: {
          chrome: 'chrome'
        }
      }
    }
  }
}) 