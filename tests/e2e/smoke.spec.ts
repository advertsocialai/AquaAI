import { test, expect } from "@playwright/test";

/**
 * Smoke E2E — verifies the core routes boot and the chat widget opens.
 *
 * These assertions are deliberately language- and copy-independent: the app
 * is fully i18n'd (Telugu by default), so we anchor on stable signals —
 * the brand title, a non-translated input placeholder, HTTP status, and
 * substantial rendered body — rather than English marketing copy. Detailed
 * per-page copy lives in the (non-blocking) e2e:full suite.
 */

async function dismissSplash(page: import("@playwright/test").Page) {
  const enterBtn = page.getByRole("button", { name: /enter/i });
  if (await enterBtn.isVisible().catch(() => false)) {
    await enterBtn.click();
  }
}

test("home page boots and shows the Aqua Rudra brand", async ({ page }) => {
  await page.goto("/");
  await dismissSplash(page);
  await expect(page).toHaveTitle(/Aqua\s*Rudra/i);
  const body = (await page.locator("body").innerText()).trim();
  expect(body.length, "home body should render real content").toBeGreaterThan(400);
});

test("AquaAI dashboard route is reachable", async ({ page }) => {
  const resp = await page.goto("/aquaai");
  expect(resp?.status(), "HTTP status for /aquaai").toBeLessThan(400);
  await page.waitForLoadState("domcontentloaded");
  const body = (await page.locator("body").innerText()).trim();
  expect(body.length, "/aquaai body should render real content").toBeGreaterThan(300);
});

test("Login page renders the mobile entry form", async ({ page }) => {
  const resp = await page.goto("/login");
  expect(resp?.status(), "HTTP status for /login").toBeLessThan(400);
  await page.waitForLoadState("domcontentloaded");
  // The +91 mobile placeholder is not translated, so it's a stable anchor.
  await expect(page.getByPlaceholder(/98765/)).toBeVisible();
});

test("Signup route is reachable and renders content", async ({ page }) => {
  const resp = await page.goto("/signup");
  expect(resp?.status(), "HTTP status for /signup").toBeLessThan(400);
  await page.waitForLoadState("domcontentloaded");
  const body = (await page.locator("body").innerText()).trim();
  expect(body.length, "/signup body should render real content").toBeGreaterThan(200);
});

test("ChatBot floating button opens the chat panel", async ({ page }) => {
  await page.goto("/aquaai");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: /open chat/i }).click();
  // The panel header reads "AquaI Assistant"; the welcome message also
  // contains the phrase, so match the header exactly to avoid strict-mode hits.
  await expect(page.getByText(/^AquaI Assistant$/i).first()).toBeVisible();
});
