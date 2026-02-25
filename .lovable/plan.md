

# Expand BhorX.ai: Add Pages, Founders, Alzheimer's Section (Skip Publications)

## Overview
We'll add real pages behind the buttons, introduce an Alzheimer's EEG detection section, add a Founders page, and skip the publications/research page for now since you're a startup.

## What's Changing

### 1. New Home Page Section: Alzheimer's EEG Detection
A new full-screen cinematic section added between BioAge and Collaboration:
- Brain/neuroscience background image
- Heading: "Detecting Alzheimer's Through EEG Signals"
- Description about using AI to analyze brainwave patterns for early detection
- "Learn More" button linking to `/alzheimers`

### 2. New Home Page Section: Founders
A new full-screen section after Collaboration (before footer):
- Clean portraits/team-style background image
- Heading: "Meet the Founders"
- Brief intro text about the founding team
- "Our Team" button linking to `/founders`

### 3. New Pages (all following SpaceX cinematic style)

| Page | Route | Content |
|------|-------|---------|
| **Technology** | `/technology` | Full-screen hero + detail sections about BhorX.ai's longevity AI stack |
| **Bio-Age** | `/bioage` | Hero + explanation of biological age prediction, how it works |
| **Alzheimer's EEG** | `/alzheimers` | Hero + the problem, EEG approach, AI methodology, early results |
| **Founders** | `/founders` | Hero + founder profiles with photos, bios, roles |
| **Collaborate** | `/collaborate` | Hero + partnership info, simple contact form |

No Research/Publications page for now -- the Research section on the home page will stay as a visual section but the "View Publications" button will say "Coming Soon" or link to the collaborate page.

### 4. Fix Navigation
- Header nav updated to use React Router `Link` components
- Nav items: TECHNOLOGY, BIO-AGE, ALZHEIMER'S, FOUNDERS, COLLABORATE
- Remove RESEARCH from nav (keep section on home page, just not as a nav destination)
- All section CTA buttons link to their respective pages

### 5. Update Routing
Register all 5 new routes in `App.tsx`.

## Technical Details

### New files to create:
- `src/components/sections/Alzheimers.tsx` -- home page section
- `src/components/sections/Founders.tsx` -- home page section
- `src/pages/TechnologyPage.tsx` -- full page
- `src/pages/BioAgePage.tsx` -- full page
- `src/pages/AlzheimersPage.tsx` -- full page
- `src/pages/FoundersPage.tsx` -- full page with founder profiles
- `src/pages/CollaboratePage.tsx` -- full page with contact info

### Files to modify:
- `src/App.tsx` -- Add 5 new routes
- `src/pages/Index.tsx` -- Add Alzheimers and Founders sections
- `src/components/layout/Header.tsx` -- Update nav to use React Router Links, add new nav items
- `src/components/sections/WhatWeBuilt.tsx` -- Button links to `/technology`
- `src/components/sections/Research.tsx` -- Change button to "Coming Soon" or link to `/collaborate`
- `src/components/sections/BioAge.tsx` -- Button links to `/bioage`
- `src/components/sections/Collaboration.tsx` -- Button links to `/collaborate`
- `src/components/layout/Footer.tsx` -- Fix footer links

### Page structure (each new page):
1. Shared Header
2. Full-screen hero with background image and heading
3. Content sections with paragraphs and key points (black bg, white text, minimal)
4. Shared Footer

### Founders Page specifics:
- Hero section with team photo background
- Grid of founder cards (photo, name, role, short bio) -- kept minimal, no fancy effects
- Each card: circular avatar photo, name in bold uppercase, role, 2-3 line bio
- Placeholder photos from Unsplash portraits until real ones are added

All pages maintain the black background, white text, cinematic SpaceX style.

