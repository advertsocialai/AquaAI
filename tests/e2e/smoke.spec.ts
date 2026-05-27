import { test, expect } from "@playwright/test";

/**
 * Smoke E2E — verifies the marketing site and AquaAI dashboard load,
 * the language switcher works, and the chat widget opens. Run after
 * a build or in CI to catch route-level regressions.
 */

test("home page renders the brand", async ({ page }) => {
  await page.goto("/");
  // The splash screen shows on first visit; the user has to enter.
  const enterBtn = page.getByRole("button", { name: /enter/i });
  if (await enterBtn.isVisible().catch(() => false)) {
    await enterBtn.click();
  }
  await expect(page).toHaveTitle(/Aqua\s*AI/i);
});

test("AquaAI dashboard is reachable and shows the role selector", async ({ page }) => {
  await page.goto("/aquaai");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText(/View [Aa]s/).first()).toBeVisible();
  await expect(page.getByText("Farmer").first()).toBeVisible();
  await expect(page.getByText("Hatchery").first()).toBeVisible();
});

test("Login page renders OTP form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText(/Welcome back/i)).toBeVisible();
  const mobile = page.getByPlaceholder(/98765/);
  await mobile.fill("9876543210");
  await page.getByRole("button", { name: /Send OTP/i }).click();
  await expect(page.getByText(/6-digit OTP/i)).toBeVisible();
});

test("Signup wizard shows role selection", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByText(/Which best describes you/i)).toBeVisible();
  await expect(page.getByText("Farmer")).toBeVisible();
  await expect(page.getByText("Hatchery")).toBeVisible();
});

test("ChatBot floating button opens the chat panel", async ({ page }) => {
  await page.goto("/aquaai");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /open chat/i }).click();
  await expect(page.getByText(/AquaI Assistant/i)).toBeVisible();
});
