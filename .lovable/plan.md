

# Publish-Ready Polish -- The Final 13 Items

Everything below turns BohrX.ai from "great prototype" into "ready to share with the world."

---

## 1. Wire Up the Splash Screen (First Impression)
The `SplashScreen` component exists but is never rendered. First-time visitors should see the spiral animation + "Enter" gate before the site reveals. Uses `sessionStorage` so it only plays once per browser session.

**File:** `src/App.tsx`
- Add state: `showSplash` (default `true` if no `sessionStorage` flag)
- Render `SplashScreen` when `showSplash` is true; on "Enter," set flag + hide splash
- Wrap main content in a conditional render

## 2. Add Noise Texture Overlay
The `NoiseTexture` component exists but isn't used. Adds a subtle film-grain feel across the entire site.

**File:** `src/App.tsx`
- Import and render `<NoiseTexture />` alongside `CustomCursor` and `ScrollProgress`

## 3. Scroll-to-Top on Route Change
Currently navigating to a sub-page can land you mid-scroll. Every route change should reset to top.

**File:** `src/App.tsx` (inside `AnimatedRoutes`)
- Add `useEffect` that calls `window.scrollTo(0, 0)` when `location.pathname` changes

## 4. Change Snap from Mandatory to Proximity
`snap-mandatory` can trap trackpad/touch users. `snap-proximity` gives the same "scene" feel but with better usability.

**File:** `src/pages/Index.tsx`
- Change `snap-mandatory` to `snap-proximity`

## 5. Upgrade All Sub-Pages with Cinematic Treatment
The inner pages (Technology, BioAge, Alzheimer's, Collaborate, Founders) use plain `h1` tags and no parallax. They feel like a downgrade compared to the homepage.

**Files:** `TechnologyPage.tsx`, `BioAgePage.tsx`, `AlzheimersPage.tsx`, `CollaboratePage.tsx`, `FoundersPage.tsx`
- Import and use `TextReveal` for hero headings
- Add `bg-fixed` to hero background images for parallax
- Add numbered section labels (01, 02, 03) to content blocks
- Add staggered reveal animations to each content block

## 6. Add Page Titles for SEO
Every page should update `document.title` so the browser tab shows the correct name.

**Files:** All page components
- Add `useEffect(() => { document.title = "Technology -- BohrX.ai" }, [])` pattern to each page

## 7. Restyle the 404 Page
Currently uses default light-gray styling that completely breaks the cinematic dark aesthetic.

**File:** `src/pages/NotFound.tsx`
- Black background, uppercase typography, border-style button, matching the site's design language

## 8. Animate Mobile Menu
The hamburger menu appears/disappears instantly. Should slide down with a fade for consistency.

**File:** `src/components/layout/Header.tsx`
- Wrap mobile nav in `AnimatePresence` + `motion.div` with slide-down animation

## 9. Add TextReveal to Remaining Homepage Sections
The Alzheimer's and Founders homepage sections still use plain `h2` tags without `TextReveal`, breaking consistency with the other sections.

**Files:** `src/components/sections/Alzheimers.tsx`, `src/components/sections/FoundersSection.tsx`
- Import `TextReveal` and replace static `h2` tags

## 10. Add Parallax to Remaining Homepage Sections
Alzheimer's and Founders homepage sections don't have `bg-fixed` on their background images.

**Files:** `src/components/sections/Alzheimers.tsx`, `src/components/sections/FoundersSection.tsx`
- Add `bg-fixed` class to background image divs

## 11. Preload Critical Fonts
Prevent flash of unstyled text by preloading the Inter and JetBrains Mono font files.

**File:** `index.html`
- Add `<link rel="preload" as="style">` for the Google Fonts CSS

## 12. Update Default OG Image Reference
The OpenGraph image still points to a Lovable placeholder. Update the alt text and add a note -- you'll need to replace the actual image URL later with your own branded image.

**File:** `index.html`
- Update meta tag content to reference BohrX branding (placeholder URL stays until you provide a real image)

## 13. Add Smooth Image Load States
Large hero images can flash in. Add a CSS transition so they fade in gracefully when loaded.

**File:** `src/index.css`
- Add a utility class for background image fade-in on load

---

## Summary of All File Changes

| File | What Changes |
|------|-------------|
| `src/App.tsx` | Splash screen gate, noise texture, scroll-to-top |
| `src/pages/Index.tsx` | `snap-mandatory` to `snap-proximity` |
| `src/pages/TechnologyPage.tsx` | TextReveal, parallax, section numbers, page title |
| `src/pages/BioAgePage.tsx` | TextReveal, parallax, section numbers, page title |
| `src/pages/AlzheimersPage.tsx` | TextReveal, parallax, section numbers, page title |
| `src/pages/CollaboratePage.tsx` | TextReveal, parallax, page title |
| `src/pages/FoundersPage.tsx` | TextReveal, parallax, page title |
| `src/pages/NotFound.tsx` | Full restyle to match dark theme |
| `src/components/sections/Alzheimers.tsx` | TextReveal + bg-fixed |
| `src/components/sections/FoundersSection.tsx` | TextReveal + bg-fixed |
| `src/components/layout/Header.tsx` | Animated mobile menu |
| `index.html` | Font preload, OG image note |
| `src/index.css` | Image load transition utility |

No new dependencies needed.

