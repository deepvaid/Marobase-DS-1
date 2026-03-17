import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  testMatch: 'capture-storybook.spec.ts',
  timeout: 90_000,
  expect: {
    timeout: 10_000
  },
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'artifacts/playwright-report' }]
  ],
  use: {
    baseURL: process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006',
    headless: true,
    trace: 'off',
    screenshot: 'off',
    video: 'off'
  }
});
