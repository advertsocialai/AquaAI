

# Redesign: SpaceX-Inspired Landing Page

## The Problem
The current site has many telltale signs of AI-generated design: gradient blobs, pulsing rings, spotlight cursors, noise textures, animated counters, Spline 3D scenes, and heavy use of decorative effects. SpaceX's website is the opposite -- minimal, photography-driven, and content-focused.

## SpaceX Design Language
- **Full-viewport sections** that each fill the entire screen, scrolling vertically between them
- **Large cinematic background images** behind each section
- **Minimal, clean navigation** -- transparent header, simple text links, no colored buttons
- **Bold uppercase headings** with restrained typography
- **Very few UI elements** -- no cards, no badges, no tags, no gradient blobs
- **Simple bordered CTA buttons** -- not filled/colored
- **Black background, white text** -- almost no accent colors
- **No decorative effects** -- no noise, no spotlight, no 3D, no pulsing animations

## What Changes

### 1. Remove Splash Screen
- Remove `SplashScreen` component and go straight to the main page
- Remove spiral animation dependency

### 2. Simplify the Header
- Make it fully transparent with no border or background blur
- Simple logo on the left, uppercase text links in the center, minimal right-side element
- Remove "Sign In" and "Get Started" buttons -- replace with a simple text link or nothing
- Use uppercase, spaced-out letter styling for nav items

### 3. Rebuild Hero as Full-Screen Image Section
- Full viewport height with a large background image (using a high-quality Unsplash biotech/science image)
- Remove Spline 3D scene, gradient blobs, pulsing rings, magnetic buttons, animated counters
- Simple left-aligned heading + one paragraph + one bordered "EXPLORE" button
- Stats removed or moved elsewhere

### 4. Rebuild All Sections as Full-Screen Image Panels
Each section becomes a full-viewport panel with a background image and minimal overlaid text:

- **Section 2 (Technology):** Full-screen image with heading "Revolutionizing Longevity Science" + short description + "LEARN MORE" button
- **Section 3 (Research):** Full-screen image with heading "Science at the Core" + description + "VIEW PUBLICATIONS" button  
- **Section 4 (Bio-Age):** Full-screen image with heading "Understanding Biological Age" + description + "EXPLORE" button
- **Section 5 (Collaboration):** Full-screen image with heading "Join Our Mission" + description + "GET IN TOUCH" button

All cards, grids, tags, icons, and decorative elements are removed.

### 5. Simplify the Footer
- Minimal single-line footer or very small footer
- Remove newsletter input, link columns, social icons grid
- Just copyright + a few inline links

### 6. Strip Decorative Components
Remove or stop using:
- `NoiseTexture`
- `GradientBlob`
- `PulsingRings`
- `SpotlightCursor`
- `Spotlight`
- `MagneticButton`
- `AnimatedCounter`
- `SplineScene`
- `SpiralAnimation`
- `TiltCard`

### 7. Update Global Styles
- Remove gradient text classes and glow effects from CSS
- Simplify to pure black (#000) background, white text
- Button style: bordered, uppercase, letter-spaced, no fill

## Technical Details

### Files to modify:
- `src/pages/Index.tsx` -- Remove splash screen, noise texture
- `src/components/layout/Header.tsx` -- Transparent minimal header
- `src/components/sections/Hero.tsx` -- Full-screen image hero, minimal text
- `src/components/sections/WhatWeBuilt.tsx` -- Full-screen image section
- `src/components/sections/Research.tsx` -- Full-screen image section
- `src/components/sections/BioAge.tsx` -- Full-screen image section
- `src/components/sections/Collaboration.tsx` -- Full-screen image section
- `src/components/layout/Footer.tsx` -- Minimal footer
- `src/index.css` -- Simplified styles, remove glow/gradient utilities
- `index.html` -- Update meta if needed

### Background images
Will use high-quality Unsplash images for each section (biotech, DNA, lab, science themes) referenced via URL.

### Estimated scope
This is a significant visual overhaul of every section, but the routing and page structure remain the same. The content (BhorX.ai branding and longevity/bio-age topic) stays -- only the visual presentation changes to match SpaceX's clean, cinematic style.

