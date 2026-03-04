import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/test-results/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/api/v2/apiResponse.tsx'],
    },
    server: {
      deps: {
        inline: [/react-diff-viewer-continued/, /@exodus\/bytes/],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Mock the diff viewer library to avoid ESM/CJS transpilation issues during tests
      'react-diff-viewer-continued': path.resolve(__dirname, './src/test/__mocks__/react-diff-viewer-continued.tsx'),
    },
  },
});
