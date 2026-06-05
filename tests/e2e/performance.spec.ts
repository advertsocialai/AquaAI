import { test, expect } from '@playwright/test';

/** Page-load performance budget (runs in CI where a browser is available). */
test('landing page loads within budget', async ({ page }) => {
  const start = Date.now();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(Date.now() - start).toBeLessThan(8000);

  const dcl = await page.evaluate(() => {
    const e = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return e ? e.domContentLoadedEventEnd - e.startTime : 0;
  });
  // DOMContentLoaded under 6s even on a cold cache.
  expect(dcl).toBeLessThan(6000);
});
