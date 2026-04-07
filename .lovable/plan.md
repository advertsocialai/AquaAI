

# Fix Header Logo - Make It Bold and Visible

## Problem
The current atom-logo.svg uses light, pastel colors with thin strokes that wash out at 40x40px on a dark background. It looks pale and doesn't read as a proper logo at small sizes.

## Changes

### 1. Redesign `src/assets/atom-logo.svg`
Make it punchy at small sizes:
- **Thicker orbit strokes** (6 → 10) with higher opacity (full 1.0)
- **Brighter, more saturated colors** -- vibrant purple (#a855f7), bright teal (#34d399), vivid blue (#60a5fa) for orbits
- **Larger nucleus** (r=62 → 75) with brighter purple gradient so it's clearly visible
- **Bigger electrons** (r=18 → 22) with more saturated fills
- **Remove the subtle white highlight ellipses** that add visual noise at small sizes
- **Drop the low-opacity values** -- everything should be bold and fully opaque

### 2. Update Header logo styling in `src/components/layout/Header.tsx`
- Add a subtle `drop-shadow` filter or glow to the logo img so it pops against the dark/transparent header
- Possibly increase size slightly from `w-10 h-10` to `w-11 h-11`

## Files to Edit
- `src/assets/atom-logo.svg` -- redesign with bolder colors, thicker strokes, larger elements
- `src/components/layout/Header.tsx` -- add glow/shadow effect to logo image

