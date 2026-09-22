import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/fold-viewer/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@foldlab/fold-viewer': fileURLToPath(
        new URL('../../packages/fold-viewer/src/index.ts', import.meta.url),
      ),
    },
  },
  build: { sourcemap: true },
});
