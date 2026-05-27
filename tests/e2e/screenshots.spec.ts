import { test } from "@playwright/test";

/**
 * One-shot screenshot run. Captures the landing, AquaAI dashboard, login,
 * signup, KYC, and knowledge pages on both desktop and mobile viewports.
 * Outputs land in `test-results/screenshots-<project>/`.
 *
 * Run alone: `npx playwright test tests/e2e/screenshots.spec.ts`
 */

const TARGETS: { slug: string; path: string }[] = [
  { slug: "home",        path: "/" },
  { slug: "aquaai",      path: "/aquaai" },
  { slug: "login",       path: "/login" },
  { slug: "signup",      path: "/signup" },
  { slug: "kyc",         path: "/kyc" },
  { slug: "knowledge",   path: "/knowledge" },
  { slug: "about",       path: "/about" },
  { slug: "founders",    path: "/founders" },
];

for (const t of TARGETS) {
  test(`screenshot ${t.slug}`, async ({ page }, testInfo) => {
    await page.goto(t.path);
    await page.waitForLoadState("networkidle");
    const enterBtn = page.getByRole("button", { name: /enter/i });
    if (await enterBtn.isVisible().catch(() => false)) {
      await enterBtn.click();
      await page.waitForLoadState("networkidle");
    }
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `test-results/screenshots-${testInfo.project.name}/${t.slug}.png`,
      fullPage: true,
    });
  });
}
