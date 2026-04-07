

# Fix: Mobile Scroll Experience + Remove Lovable Badge

## Two Issues Identified

### 1. Poor Mobile Scroll Experience
**Root causes:**
- The Index page container has `snap-y snap-proximity overflow-y-auto h-screen` — this creates a nested scroll container that fights with mobile browser chrome (address bar, bottom nav). On mobile, `h-screen` doesn't account for the dynamic viewport height, causing awkward scroll behavior.
- All major sections use `h-screen` which on mobile can clip content or leave text hidden behind the address bar.
- `bg-fixed` (parallax) doesn't work on most mobile browsers (iOS Safari ignores it entirely), causing visual glitches.
- `snap-start` on every section creates jerky scrolling on mobile where sections may be taller than the viewport due to content overflow.

**Fix approach:**
- **Remove the nested scroll container** on Index — change `h-screen overflow-y-auto` to just `min-h-screen` so the page scrolls naturally via the browser window.
- **Use `min-h-screen` instead of `h-screen`** on all section components on mobile (via responsive classes like `min-h-screen md:h-screen`), so content can expand naturally on smaller screens.
- **Disable `bg-fixed` on mobile** — replace with `bg-fixed md:bg-fixed` or remove it, since iOS Safari doesn't support it and it causes rendering issues.
- **Disable snap scrolling on mobile** — use `md:snap-y md:snap-proximity` so snap only applies on desktop where sections fit the viewport.
- Add a `ScrollToTop` component (already exists in App.tsx) — no change needed there.

### 2. Lovable Badge Still Showing on Deployed Site
**Finding:** The badge visibility setting is already set to `hide_badge: true`. The badge may still appear due to caching. I'll use the `set_badge_visibility` tool to re-confirm the setting, but this is likely a cache issue on the deployed site.

**Fix:** Re-set the badge visibility to hidden and advise clearing cache / redeploying.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove `h-screen overflow-y-auto`, add responsive snap classes |
| `src/components/sections/Hero.tsx` | `h-screen` → `min-h-[100svh]` on mobile |
| `src/components/sections/WhatWeBuilt.tsx` | Same pattern |
| `src/components/sections/Research.tsx` | Same pattern |
| `src/components/sections/Stats.tsx` | Same pattern |
| `src/components/sections/BioAge.tsx` | Same pattern |
| `src/components/sections/Alzheimers.tsx` | Same pattern |
| `src/components/sections/Collaboration.tsx` | Same pattern |
| `src/components/sections/FoundersSection.tsx` | Same pattern |
| All sections with `bg-fixed` | Add `md:bg-fixed` or remove for mobile |
| Badge visibility | Re-confirm hidden via tool |

## Technical Detail

- Using `min-h-[100svh]` (small viewport height) instead of `h-screen` accounts for mobile browser chrome correctly
- `snap-y snap-proximity` will only apply on `md:` breakpoint and up
- `bg-fixed` will be conditional: removed on mobile (where it's broken), kept on desktop for the parallax effect

