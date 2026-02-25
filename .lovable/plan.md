

# Making BohrX.ai a 10/10 Experience

## The Problem

Right now, every section on the homepage follows the exact same pattern: background photo, gradient overlay, text at bottom-left, button. It's clean but **repetitive and predictable**. There's no rhythm, no surprise, no psychological tension. A truly impressive site needs visual variety, motion storytelling, and moments that make visitors pause.

## The Upgrade Strategy

The goal is to use **psychological principles** -- curiosity gaps, the Zeigarnik effect (incomplete patterns demand attention), progressive disclosure, and the Von Restorff effect (things that stand out are remembered) -- to make the site unforgettable.

---

### 1. Scroll-Snapping Between Sections

Lock each full-screen section into view so users experience one "scene" at a time, like flipping through a cinematic story. This creates **focus and intentionality** -- each section gets full attention.

- Add `scroll-snap-type: y mandatory` to the main container
- Each section gets `scroll-snap-align: start`

### 2. Parallax Depth on Hero Images

Background images move at a slower rate than content as users scroll, creating a sense of **depth and immersion** that flat pages lack.

- Apply `background-attachment: fixed` or use a scroll-driven transform on image layers
- Subtle effect (not extreme) to maintain elegance

### 3. Cinematic Text Reveal Animations

Instead of text fading in as a block, reveal headings **line by line or word by word** with staggered timing. This creates a sense of **unfolding narrative** and keeps users reading.

- Split heading text into individual words/lines
- Use Framer Motion staggerChildren with a slight delay per word
- Apply a clip/mask reveal (text slides up from behind a hidden overflow)

### 4. A "By the Numbers" Stats Section

Add a section between Research and BioAge with animated counters. Numbers like "3,400+ biomarkers analyzed" or "12M+ data points" trigger the **authority bias** -- people trust quantified claims.

- Create a minimal horizontal layout with 3-4 stats
- Numbers count up from 0 when scrolled into view using the existing `animated-counter.tsx` component
- Keep the design sparse: just numbers, labels, thin separators

### 5. Scroll Progress Indicator

A thin white line at the top of the viewport that grows as users scroll down. This creates a **completion drive** (Zeigarnik effect) -- users subconsciously want to reach the end.

- Fixed bar at top, width tied to scroll percentage
- 1px height, white, subtle

### 6. Smooth Page Transitions

When navigating between pages, instead of a hard cut, use a **fade-to-black transition**. This mimics film editing and makes the site feel like a cohesive experience, not separate pages.

- Wrap route content in AnimatePresence with fade/slide animations
- Exit animation before enter animation

### 7. Custom Cursor Effect

Replace the default cursor with a subtle **spotlight or dot-ring cursor** on desktop. This makes the site feel interactive and premium. Psychologically, it turns passive viewing into active exploration.

- Small white dot (8px) as primary cursor
- Larger ring (32px) that follows with slight delay (lerp)
- Ring expands on hover over interactive elements

### 8. Varied Section Layouts (Break the Pattern)

The Von Restorff effect says the thing that's different gets remembered. Right now every section looks the same. We need to break the pattern:

- **Hero**: Keep as-is (full photo, text bottom-left) -- this sets the baseline
- **WhatWeBuilt**: Move text to **right side** instead of left
- **Research**: Add a **horizontal scrolling stat ticker** across the section
- **BioAge**: Use a **split layout** -- photo on left half, text on right half (no full-bleed image)
- **Collaboration**: Text **centered** with a large typographic treatment

### 9. Header Backdrop Blur on Scroll

The header is currently fully transparent. Add a subtle backdrop blur + dark tint that activates after scrolling past the first viewport. This provides **visual grounding** and makes navigation feel stable.

- Track scroll position
- After 100px scroll, apply `backdrop-blur-md bg-black/50`
- Smooth transition

### 10. Footer Enhancement

Add social links (LinkedIn, Twitter/X) and a subtle "Back to top" action. The footer is the last impression -- make it feel intentional.

---

## Technical Details

### Files to Create
- `src/components/ui/custom-cursor.tsx` -- Dot + ring cursor component
- `src/components/ui/scroll-progress.tsx` -- Top progress bar
- `src/components/ui/text-reveal.tsx` -- Word-by-word text animation component
- `src/components/sections/Stats.tsx` -- Animated stats section
- `src/components/layout/PageTransition.tsx` -- Route transition wrapper

### Files to Modify
- `src/pages/Index.tsx` -- Add Stats section, scroll-snap, new layouts
- `src/components/sections/Hero.tsx` -- Parallax + text reveal
- `src/components/sections/WhatWeBuilt.tsx` -- Right-aligned layout
- `src/components/sections/BioAge.tsx` -- Split layout
- `src/components/sections/Collaboration.tsx` -- Centered typography
- `src/components/sections/Research.tsx` -- Text reveal animations
- `src/components/layout/Header.tsx` -- Scroll-aware backdrop blur
- `src/components/layout/Footer.tsx` -- Social links, back-to-top
- `src/App.tsx` -- Wrap routes in PageTransition, add custom cursor + scroll progress
- `src/index.css` -- Scroll-snap rules, custom cursor hiding, smooth scroll tweaks

### Dependencies
- No new dependencies needed -- everything uses existing Framer Motion + GSAP + Tailwind

