

# Add Animated Atom to Splash Screen

## What and Why

The best placement for this animated atom is the **splash screen**, replacing the current spiral animation. Here's why:

- The splash screen is the first thing users see -- a glowing, spinning atom with colorful orbits is a perfect "loading" visual for a biotech/science company called **BohrX** (named after the Bohr atomic model)
- It directly reinforces your brand identity
- The rest of the site has a clean, minimal design -- putting a large animated atom in the hero or header would clash with that aesthetic
- The splash screen is designed for exactly this kind of dramatic visual moment

## What Changes

1. **Create `src/components/ui/atom-animation.tsx`** -- A React component that renders the animated atom SVG inline. Will use CSS animations for the spinning orbits, nucleus glow pulse, and electron trail effects (ported from the uploaded `atom_animated.html` which has the richer JS-driven electron movement with trails and depth layering).

2. **Update `src/components/SplashScreen.tsx`** -- Replace `<SpiralAnimation />` with the new `<AtomAnimation />` component. Keep the existing BOHRX.AI title, tagline, and Enter button overlay on top.

3. **Optional cleanup** -- The old `spiral-animation.tsx` can be kept or removed depending on preference.

## Technical Details

- The atom animation uses CSS keyframes for orbit glow pulsing and a small JS `requestAnimationFrame` loop for electron position calculation (parametric ellipse math) and trail rendering
- Electrons will have proper depth-sorting so they pass behind the nucleus realistically
- Colors: purple nucleus (#5b46b8), pink/green/blue electrons matching the uploaded file
- The animation renders as an inline SVG inside a React component -- no external dependencies needed
- Will be sized to fill the splash screen viewport with the atom centered

