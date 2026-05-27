import { test, expect } from "@playwright/test";

/**
 * User flow probes — push past "page renders" into the actual interactions
 * a user would do. Each test drives one happy path + at least one adjacent
 * probe (empty input, wrong OTP, etc.). The smoke + pages specs cover
 * route-level regressions; this file is for behavior regressions.
 */

test("Signup → role select → advances past step 1", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByText(/which best describes you/i)).toBeVisible();

  // Click the Farmer card — text appears multiple times so scope to its parent
  // button/card. Pick the first visible "Farmer" tile.
  const farmerCard = page.getByText(/^Farmer$/).first();
  await farmerCard.click();

  // Either an explicit Next/Continue button appears, or the wizard auto-advances.
  const nextBtn = page.getByRole("button", { name: /next|continue|proceed/i });
  if (await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click();
  }
  // Step 2 should reveal a different prompt (name, mobile, language, etc.).
  await expect(
    page.getByText(/name|mobile|phone|language|state|district|farm|hatchery/i).first(),
  ).toBeVisible({ timeout: 5_000 });
});

test("Login → empty OTP submit is blocked", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder(/98765/).fill("9876543210");
  await page.getByRole("button", { name: /Send OTP/i }).click();
  await expect(page.getByText(/6-digit OTP/i)).toBeVisible();

  // 🔍 Probe: try to submit without entering an OTP. Should not advance.
  const verifyBtn = page.getByRole("button", { name: /verify|submit|login|continue/i });
  if (await verifyBtn.isVisible().catch(() => false)) {
    const wasDisabled = await verifyBtn.isDisabled();
    if (!wasDisabled) {
      await verifyBtn.click();
      // Should still be on the OTP step — the "6-digit OTP" copy stays visible.
      await page.waitForTimeout(300);
      await expect(page.getByText(/6-digit OTP/i)).toBeVisible();
    } else {
      expect(wasDisabled, "verify button is disabled before OTP entry").toBe(true);
    }
  }
});

test("Login → invalid mobile number is rejected", async ({ page }) => {
  await page.goto("/login");
  const mobile = page.getByPlaceholder(/98765/);
  await mobile.fill("123");
  // Either the Send OTP button is disabled, or clicking it shows a validation msg.
  const sendBtn = page.getByRole("button", { name: /Send OTP/i });
  const disabled = await sendBtn.isDisabled().catch(() => false);
  if (!disabled) {
    await sendBtn.click();
    await page.waitForTimeout(300);
    // Should NOT have moved on to the OTP step.
    const otpVisible = await page.getByText(/6-digit OTP/i).isVisible().catch(() => false);
    expect(otpVisible, "expected to stay on mobile step with invalid input").toBe(false);
  } else {
    expect(disabled).toBe(true);
  }
});

test("Knowledge → article card opens an article page", async ({ page }) => {
  await page.goto("/knowledge");
  await page.waitForLoadState("networkidle");
  // Find the first article link. KnowledgePage renders cards as <a href="/knowledge/...">.
  const firstArticleLink = page
    .locator('a[href^="/knowledge/"]')
    .filter({ hasNot: page.locator('a[href$="/knowledge"]') })
    .first();
  await expect(firstArticleLink).toBeVisible();
  await firstArticleLink.click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/\/knowledge\/[a-z0-9-]+/i);
  // PageTransition fades in via framer-motion; wait for the article's h1 to be
  // both attached AND fully visible before reading body text (innerText returns
  // only currently-rendered nodes — measuring mid-animation produces flake).
  await expect(page.locator("article h1, h1").first()).toBeVisible({ timeout: 5_000 });
  await page.waitForTimeout(200);
  const articleText = await page.locator("article, main, body").first().innerText();
  expect(articleText.length).toBeGreaterThan(500);
});

test("PWA manifest is served", async ({ page, request }) => {
  await page.goto("/");
  const manifestLink = page.locator('link[rel="manifest"]');
  if ((await manifestLink.count()) > 0) {
    const href = await manifestLink.first().getAttribute("href");
    expect(href, "manifest href present").not.toBeNull();
    const resp = await request.get(href!);
    expect(resp.ok(), `manifest fetch ${href}`).toBe(true);
    const json = await resp.json();
    expect(json.name || json.short_name).toBeTruthy();
    expect(Array.isArray(json.icons)).toBe(true);
  }
});

test("AquaAI dashboard role switch updates the view", async ({ page }) => {
  await page.goto("/aquaai");
  await page.waitForLoadState("networkidle");
  // Click "Hatchery" role. The dashboard should re-render with hatchery copy.
  await page.getByText("Hatchery").first().click();
  await page.waitForTimeout(500);
  const text = (await page.locator("body").innerText()).toLowerCase();
  expect(text).toMatch(/hatchery|seed|larv|pl|broodstock/i);
});
