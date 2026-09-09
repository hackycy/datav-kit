import process from 'node:process'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/examples',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: '.cache/playwright-report', open: 'never' }]],
  outputDir: '.cache/playwright-results',
  use: {
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    viewport: { width: 1920, height: 1080 },
    launchOptions: { args: ['--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tests/examples/serve.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})
