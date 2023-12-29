import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig as ViteUserConfig } from 'vite';
import { UserConfig as VitestUserConfig } from 'vitest';

type UserConfig = ViteUserConfig & Partial<VitestUserConfig>;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
} as UserConfig);
