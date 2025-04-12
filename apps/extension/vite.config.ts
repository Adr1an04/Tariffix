import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Build output to "dist" folder
    sourcemap: true, // Helpful for debugging extensions
  },
  // Ensure base path is correct for your extension
  base: './',
});