
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['unit/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: '../test-results/coverage',
      exclude: [
        'node_modules/',
        'e2e/',
        '**/*.config.ts',
        '**/*.spec.ts'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    },
    reporters: ['verbose', 'json'],
    outputFile: {
      json: '../test-results/vitest-results.json'
    }
  },
  resolve: {
    alias: {
      '@': new URL('../../../frontend', import.meta.url).pathname
    }
  }
});
