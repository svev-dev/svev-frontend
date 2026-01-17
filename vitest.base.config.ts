import { defineConfig } from 'vitest/config';

export const baseConfig = defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts', '**/*.config.ts'],
    },
    // Disable cache to prevent stale code issues
    cache: false,
    // Force re-run tests when files change
    watchExclude: [],
  },
  // Clear Vite cache
  clearScreen: true,
});
