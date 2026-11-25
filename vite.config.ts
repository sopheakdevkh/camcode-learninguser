import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const metaUrl = (import.meta as ImportMeta & { url: string }).url;
const srcDir = decodeURIComponent(new URL('./src', metaUrl).pathname);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  server: {
    port: 3001,
    strictPort: false,
  },
  preview: {
    port: 3001,
    strictPort: false,
  },
});

