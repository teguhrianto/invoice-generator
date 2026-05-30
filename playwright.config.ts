import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the invoice-generator E2E suite.
 *
 * - Targets Chromium only (headless) to keep CI fast.
 * - Spins up `pnpm dev` automatically if port 3000 is not already occupied.
 * - Captures screenshots + traces on failure for easy debugging.
 */
export default defineConfig({
  testDir: "./e2e",
  /** Run each test file in parallel; tests within a file run serially by default. */
  fullyParallel: true,
  /** Hard-fail in CI when a test.only is accidentally committed. */
  forbidOnly: !!process.env.CI,
  /** No automatic retries — flaky tests must be fixed at the root cause. */
  retries: 0,
  /** Limit parallelism in CI to avoid resource contention. */
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    /** Capture a screenshot on every test failure. */
    screenshot: "only-on-failure",
    /** Record a trace on first retry so failures in CI have a full timeline. */
    trace: "on-first-retry",
    /** Record video on first retry for visual debugging. */
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: true,
    /** Allow up to 2 minutes for the Next.js dev server cold start. */
    timeout: 120_000,
  },
});
