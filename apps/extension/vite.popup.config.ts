import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: resolve(__dirname, 'src/popup/popup.tsx'),
      external: ['chrome'],
      output: {
        format: 'iife',
        entryFileNames: 'popup.js',
        globals: {
          chrome: 'chrome',
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 