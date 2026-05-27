import { defineConfig, devices } from "@playwright/test";

/**
 * Browser E2E tests. Run with:
 *   npm run e2e          # headless
 *   npm run e2e -- --ui  # headed UI
 *
 * The webServer block boots `npm run dev` automatically if no server is
 * already listening on 8080.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH lets sandboxed environments point at
    // an already-installed chromium when cdn.playwright.dev is firewalled.
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH && {
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      }),
      // Sandbox proxies (CI containers, corporate MITM) re-sign HTTPS with
      // a cert the browser doesn't trust, producing spurious console
      // ERR_CERT_AUTHORITY_INVALID noise. Ignoring at the browser level
      // keeps the per-page console-error assertion meaningful for real bugs.
      args: ["--ignore-certificate-errors"],
    },
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile",   use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
});
