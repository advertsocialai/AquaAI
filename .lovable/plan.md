

# Redesign Splash Screen - Clean & Minimal

## Problem
The current splash screen feels cluttered -- the "AI for Humanity" caption competes with the atom animation, and the text overlaps awkwardly with the bright orbits. The overall composition doesn't feel polished.

## Changes

1. **Remove the "AI for Humanity" subtitle entirely** -- strip it out so only the BohrX logo and Enter button remain.

2. **Center BohrX text directly over the nucleus** -- instead of placing text above the atom, overlay it dead-center on top of the nucleus so it feels integrated with the animation rather than fighting it. The atom becomes the backdrop for the logo.

3. **Add a subtle radial dark vignette** behind the text area so the white text always reads clearly against the glowing orbits.

4. **Move Enter button lower and make it more subtle** -- smaller, more translucent, positioned at the very bottom as a minimal prompt.

5. **Reduce atom animation brightness slightly** -- lower the orbit stroke opacity and electron glow so the animation supports the text rather than overpowering it.

## Files to Edit
- `src/components/SplashScreen.tsx` -- remove subtitle, center the BohrX heading over the atom, add vignette overlay
- `src/components/ui/atom-animation.tsx` -- slightly reduce glow intensity

