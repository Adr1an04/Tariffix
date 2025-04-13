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
          dest: '.',
          transform: (content) => {
            const manifest = JSON.parse(content.toString());
            // Update paths in manifest
            manifest.action.default_popup = 'index.html';
            return JSON.stringify(manifest, null, 2);
          }
        },
        {
          src: 'src/popup/index.html',
          dest: '.',
          rename: 'index.html'
        },
        {
          src: 'src/assets/tariffixicon.png',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.tsx'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name].[hash].[ext]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (ext === 'css') {
            return 'css/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    },
    sourcemap: false,
    minify: true,
    reportCompressedSize: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  publicDir: false,
  base: './'
}) 