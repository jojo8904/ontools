import { defineConfig, devices } from '@playwright/test'

const remoteURL = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  timeout: 45000,
  fullyParallel: false,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  outputDir: remoteURL ? 'test-results/production' : 'test-results/local',
  use: { baseURL: remoteURL || 'http://127.0.0.1:4127', trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: remoteURL ? undefined : {
    command: 'npm run start -- --hostname 127.0.0.1 --port 4127',
    url: 'http://127.0.0.1:4127',
    reuseExistingServer: false,
    timeout: 60000,
  },
})
