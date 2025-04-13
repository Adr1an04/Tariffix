import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Create separate configs for each entry point
const configs = {
  content: defineConfig({
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/content/content.ts'),
        name: 'content',
        formats: ['iife'],
        fileName: () => 'content.js'
      }
    }
  }),
  background: defineConfig({
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/background/background.ts'),
        name: 'background',
        formats: ['iife'],
        fileName: () => 'background.js'
      }
    }
  }),
  popup: defineConfig({
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'src/popup/popup.tsx'),
        output: {
          format: 'iife',
          entryFileNames: 'popup.js'
        }
      }
    }
  })
}

// Export the main config
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: '.'
        },
        {
          src: 'src/popup/index.html',
          dest: '.',
          rename: 'index.html'
        },
        {
          src: 'src/rules',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    minify: false,
    sourcemap: true,
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 