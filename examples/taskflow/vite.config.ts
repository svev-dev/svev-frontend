import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    target: 'ES2022',
  },
  resolve: {
    alias: {
      'svev-frontend': path.resolve(__dirname, '../../src/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
});
