import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export const baseConfig = defineConfig({
  plugins: [tailwindcss()],
  build: {
    target: 'ES2023',
  },
});

export function createViteConfig(port: number, overrides?: UserConfig): UserConfig {
  return mergeConfig(
    baseConfig,
    {
      server: {
        port,
      },
      ...overrides,
    },
    true
  );
}
