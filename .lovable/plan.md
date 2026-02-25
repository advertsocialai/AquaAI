

# Elevate BohrX.ai -- From Basic to Premium

The site currently repeats the same pattern in every section: background photo + gradient + text + button. Here's a set of upgrades that add depth, variety, and storytelling without breaking the cinematic aesthetic.

---

## 1. Add a "Pipeline" Visual Section (New Homepage Section)

A horizontal timeline strip between Stats and BioAge showing the BohrX data pipeline. Uses a horizontal scroll-within-viewport effect.

**New file:** `src/components/sections/Pipeline.tsx`
- Steps: Data Collection --> Multi-Omics Processing --> AI Modeling --> Insight Delivery
- Each step is a small card with an icon, label, and one-liner
- A thin horizontal line connects them with animated dots traveling along it
- Viewport-triggered stagger animation

**Edit:** `src/pages/Index.tsx` -- insert `<Pipeline />` after `<Stats />`

---

## 2. Add a "Mission" Manifesto Section (New Homepage Section)

A text-only, centered, typographic section -- no background image -- that breaks the repetitive photo pattern. Think Apple's "designed in California" moment.

**New file:** `src/components/sections/Mission.tsx`
- Large centered quote: "We believe aging is a solvable problem."
- Smaller paragraph below with the company philosophy
- Subtle horizontal rule dividers above and below
- Fade-in animation on scroll

**Edit:** `src/pages/Index.tsx` -- insert `<Mission />` after `<WhatWeBuilt />`

---

## 3. Add a Timeline / Roadmap Section (New Homepage Section)

A vertical timeline showing milestones -- past achievements and future goals. Adds credibility and forward momentum.

**New file:** `src/components/sections/Timeline.tsx`
- Vertical line with dots at each milestone
- Alternating left/right layout on desktop, stacked on mobile
- Milestones: Founded, First Model, EEG Research, Bio-Age Platform, Clinical Trials (upcoming)
- Each node animates in on scroll
- "Upcoming" items styled differently (dashed border, lower opacity)

**Edit:** `src/pages/Index.tsx` -- insert `<Timeline />` before `<FoundersSection />`

---

## 4. Add a Marquee / Logo Ticker for Research Partners

A horizontal auto-scrolling strip of partner/institution logos or names. Adds social proof.

**New file:** `src/components/sections/Partners.tsx`
- Similar pattern to the existing Research ticker but with partner names/institutions
- Double-row or single-row infinite scroll
- Placed after Collaboration section or before Footer

**Edit:** `src/pages/Index.tsx` -- insert before `<FoundersSection />`

---

## 5. Enrich Sub-Pages with More Content Depth

### Technology Page
- Add a "Tech Stack" visual grid (3x2 cards with icons for: Deep Learning, Transformers, Cloud Infrastructure, Real-time Inference, Multi-Omics, Data Pipelines)
- Add a "How It Works" 3-step flow diagram

### Founders Page  
- Add a "Vision" quote block between the hero and founder cards
- Add LinkedIn icon links for each founder
- Add an "Advisors" placeholder section

### BioAge & Alzheimer's Pages
- Add "Key Findings" stat cards (similar to Stats section but contextual)
- Add a "Methodology" numbered section

---

## 6. Fix the Splash Screen Aesthetic

The splash screen currently uses gradient blobs and rounded buttons which violate the site's design rules. Clean it up:

**Edit:** `src/components/SplashScreen.tsx`
- Remove the gradient glow effects behind the logo text
- Use plain white text for "BOHRX.AI" with letter-spacing (matching the header style)
- Replace the rounded "Enter" button with the site's standard bordered rectangular button
- Remove the gradient pulsing indicator, replace with a simple "scroll" line

---

## 7. Add Scroll-Triggered Section Labels

Small "01 / 08" style indicators that appear in the corner as you scroll through homepage sections. Adds a premium editorial feel.

**New file:** `src/components/ui/section-indicator.tsx`
- Fixed position bottom-right
- Shows current section number / total sections
- Updates based on scroll position using IntersectionObserver

**Edit:** `src/pages/Index.tsx` -- add the indicator component

---

## 8. Enhance the Footer

The footer is a single line. Upgrade it:

**Edit:** `src/components/layout/Footer.tsx`
- Add a large "BOHRX.AI" wordmark above the links
- Add a tagline: "Advancing the science of longevity"
- Add an email: hello@bohrx.ai (or placeholder)
- Keep the minimal spacing but with more visual weight

---

## Summary of New Files

| New File | Purpose |
|----------|---------|
| `src/components/sections/Pipeline.tsx` | Data pipeline horizontal visual |
| `src/components/sections/Mission.tsx` | Typographic manifesto section |
| `src/components/sections/Timeline.tsx` | Vertical milestone timeline |
| `src/components/sections/Partners.tsx` | Auto-scrolling partner logos |
| `src/components/ui/section-indicator.tsx` | Scroll position indicator |

## Summary of Edited Files

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add 4 new sections + section indicator |
| `src/components/SplashScreen.tsx` | Remove gradients, match site aesthetic |
| `src/components/layout/Footer.tsx` | Add wordmark + email + tagline |
| `src/pages/TechnologyPage.tsx` | Add tech stack grid + how-it-works flow |
| `src/pages/FoundersPage.tsx` | Add vision quote + LinkedIn links + advisors |
| `src/pages/BioAgePage.tsx` | Add key findings + methodology |
| `src/pages/AlzheimersPage.tsx` | Add key findings + methodology |

No new dependencies needed.

