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
      entry: resolve(__dirname, 'src/content/content.ts'),
      name: 'content',
      formats: ['iife'],
      fileName: () => 'content.js'
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