import { test, expect, Page } from "@playwright/test";

/**
 * Per-page smoke pass — every public route must:
 *   - return 200 (no JS exception during render)
 *   - log no console errors past a small allowlist (PWA install banners,
 *     deferred-image hints, deliberate analytics warnings)
 *   - render meaningful content (more than just the global nav/footer)
 *
 * Pair with smoke.spec.ts (which exercises auth + chat). This file is
 * the route-coverage net: regressions that break a single page surface here.
 */

// Content that appears in the page body (not in the global nav). Keep these
// specific to in-page copy so the desktop nav links — hidden behind a
// hamburger on mobile viewports — don't match accidentally.
const ROUTES: { path: string; expectsText?: RegExp; minBodyChars?: number }[] = [
  { path: "/",                             minBodyChars: 800 },
  { path: "/aquaai",                       expectsText: /View [Aa]s/ },
  { path: "/about",                        expectsText: /Empowering farmers/i },
  { path: "/careers",                      expectsText: /Career Perks|Current openings/i },
  { path: "/contact",                      expectsText: /Get in touch|Contact us/i },
  { path: "/founders",                     expectsText: /founder|leadership|chaitanya/i },
  { path: "/knowledge",                    expectsText: /Pond Management|Sustainability|article/i },
  { path: "/login",                        expectsText: /welcome back/i },
  { path: "/signup",                       expectsText: /which best describes you/i },
  { path: "/forgot-password",              expectsText: /Reset your password/i },
  { path: "/privacy",                      expectsText: /privacy policy|personal information/i },
  { path: "/terms",                        expectsText: /terms of service|terms and conditions|acceptance/i },
  { path: "/kyc",                          expectsText: /aadhaar|PAN|identity|verif/i },
  { path: "/settings",                     expectsText: /language|notifications|preferences|account/i },
  { path: "/verify/test-cert-id-12345",    expectsText: /verify|certificate|valid|invalid/i },
];

// Console messages we deliberately ignore: PWA registration noise, missing
// preview avatars in dev, third-party iframe sandbox warnings, plus
// environment-only failures with handled fallbacks (no backend, sandbox CORS).
const CONSOLE_ALLOWLIST = [
  /service ?worker/i,
  /workbox/i,
  /vite/i,
  /HMR/i,
  /favicon/i,
  /lovable/i,                                  // brand banner in dev only
  /Download the React DevTools/i,
  /preload.*as.*image/i,
  /Failed to load resource.*404.*image/i,      // dev placeholder images
  // Backend not running in CI / sandbox — the price ticker falls back to a
  // local random-walk simulator (see usePriceTicker.ts).
  /WebSocket.*pricing-ws.*failed/i,
  /ws:\/\/localhost:8000/i,
  /ERR_CONNECTION_REFUSED/i,
  // Sandbox CORS strip on external APIs — weather widget handles the null and
  // hides itself; not user-visible in production where CORS is set.
  /open-meteo/i,
  /Access to fetch at .* has been blocked by CORS/i,
  /Access to fetch at .* from origin .* has been blocked/i,
  /ERR_FAILED/i,
];

function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  // Sandboxed test environments often block external CDNs (Unsplash, etc.)
  // returning 403/blocked. Track the *URL* of failing requests separately so we
  // can suppress only well-known external CDNs without hiding real app bugs.
  const blockedUrls: string[] = [];
  page.on("requestfailed", (req) => {
    blockedUrls.push(req.url());
  });
  page.on("response", async (resp) => {
    if (resp.status() >= 400) blockedUrls.push(resp.url());
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (CONSOLE_ALLOWLIST.some((re) => re.test(text))) return;
    // Generic "Failed to load resource: 403 ()" — match it against the
    // failing-URL list and drop if every failure is a known external CDN.
    if (/Failed to load resource/i.test(text)) {
      const allExternal = blockedUrls.every((u) =>
        /unsplash\.com|images\.unsplash|fonts\.googleapis|fonts\.gstatic|google-analytics|googletagmanager|cdn\.lovable/.test(
          u,
        ),
      );
      if (allExternal) return;
    }
    errors.push(text);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

for (const route of ROUTES) {
  test(`route ${route.path} renders without errors`, async ({ page }) => {
    const errs = watchConsole(page);
    const resp = await page.goto(route.path);
    expect(resp?.status(), `HTTP status for ${route.path}`).toBeLessThan(400);
    await page.waitForLoadState("networkidle");

    // Dismiss any splash gate so we actually reach the page chrome.
    const enterBtn = page.getByRole("button", { name: /enter/i });
    if (await enterBtn.isVisible().catch(() => false)) {
      await enterBtn.click();
      await page.waitForLoadState("networkidle");
    }

    if (route.expectsText) {
      await expect(
        page.getByText(route.expectsText).first(),
        `expected ${route.expectsText} on ${route.path}`,
      ).toBeVisible({ timeout: 10_000 });
    }

    if (route.minBodyChars) {
      const text = (await page.locator("body").innerText()).trim();
      expect(text.length, `body text length on ${route.path}`).toBeGreaterThan(
        route.minBodyChars,
      );
    }

    expect(errs, `console errors on ${route.path}`).toEqual([]);
  });
}

test("NotFound page renders for unknown routes", async ({ page }) => {
  const resp = await page.goto("/this-route-does-not-exist-xyz");
  // SPA always returns 200; the 404 view shows in-app.
  expect(resp?.status()).toBeLessThan(400);
  await page.waitForLoadState("networkidle");
  await expect(page.getByText(/404|not found|page.*missing/i).first()).toBeVisible();
});

test("Language switcher rotates AquaAI dashboard", async ({ page }) => {
  await page.goto("/aquaai");
  await page.waitForLoadState("networkidle");
  // The dashboard has a language menu. Open it and pick Telugu, then check
  // a glyph from the Telugu script appears — proves i18n actually swapped.
  const langTrigger = page
    .getByRole("button", { name: /language|EN|English|भाषा|মাধ্যম/i })
    .first();
  if (await langTrigger.isVisible().catch(() => false)) {
    await langTrigger.click();
    const teluguOpt = page.getByText(/తెలుగు|Telugu/i).first();
    if (await teluguOpt.isVisible().catch(() => false)) {
      await teluguOpt.click();
      await page.waitForTimeout(400);
      const hasTeluguGlyph = await page
        .locator("body")
        .innerText()
        .then((t) => /[ఀ-౿]/.test(t));
      expect(hasTeluguGlyph, "expected Telugu glyphs after language switch").toBe(true);
    }
  }
});
