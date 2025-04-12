import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  // Remove the custom root so that the resolution is based on the project root.
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/manifest.json', dest: '.' },
        { src: 'src/popup.html', dest: '.' }
      ]
    }),
    {
      name: 'rename-popup-html',
      apply: 'build',
      enforce: 'post',
      generateBundle(options, bundle) {
        // Find the popup entry
        const popupEntry = bundle['popup.html'];
        if (popupEntry) {
          // Rename it to popup.html
          popupEntry.fileName = 'popup.html';
        }
      }
    }
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Use the full absolute path for the popup entry, which points to:
        // C:\Users\samue\Desktop\dev\TarrifFix\apps\extension\src\popup\index.html
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  // Rename the output file from index.html to popup.html
  publicDir: 'public',
  base: './'
}) 