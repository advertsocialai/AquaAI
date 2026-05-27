

# Fix Hero Background & Header Contrast

## Problems
1. The hero background image (bright lab/test tubes) is too light — makes the header logo and nav links look pale and hard to read
2. The background doesn't match the dark, cinematic biotech aesthetic of the rest of the site

## Changes

### 1. Replace Hero background image
Swap the current Unsplash image for a darker, more dramatic scientific/cosmic visual — something like dark DNA strands, neural networks, or abstract molecular structures against a deep dark background. This aligns with the design memory: "dark, abstract, scientific, or cosmic visuals."

Good candidates from Unsplash:
- `photo-1635070041078-e363dbe005cb` — dark abstract molecular/DNA visualization
- `photo-1614935151651-0bea6508db6b` — dark neural network visualization  
- `photo-1507003211169-0a1dd7228f2d` — dark scientific abstract

Will test and pick the best one that keeps the dark mood while being visually striking.

**File:** `src/components/sections/Hero.tsx` — change the `backgroundImage` URL

### 2. Strengthen the gradient overlay
Make the `bg-gradient-to-t` overlay darker to guarantee text readability regardless of image brightness: change `via-black/40` to `via-black/60`.

**File:** `src/components/sections/Hero.tsx` — update gradient classes

### 3. Boost header logo & nav visibility
- Change the atom logo SVG to render with a subtle glow/brightness filter so it pops on any background
- Change nav link color from `text-white/70` to `text-white/80` for better contrast
- Add a subtle text shadow or drop-shadow to the AQUA AI text

**File:** `src/components/layout/Header.tsx` — add drop-shadow filter to logo image, boost nav text opacity

