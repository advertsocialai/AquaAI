

# Add Scrolling Tickers to More Sections

The Research section's horizontal scrolling ticker with domain keywords (EPIGENETICS, PROTEOMICS, etc.) adds a subtle, cinematic texture. We'll add the same treatment to other homepage sections -- each with **context-relevant terms** for that section's topic.

---

## Sections to Upgrade

### 1. WhatWeBuilt (Technology)
**Ticker terms:** `DEEP LEARNING` · `TRANSFORMER MODELS` · `MULTI-OMICS` · `NEURAL NETWORKS` · `DATA PIPELINES` · `REAL-TIME INFERENCE` · `CONTINUOUS LEARNING`

Position: Above the text block, near the bottom of the section (same placement as Research).

### 2. BioAge
**Ticker terms:** `DNA METHYLATION` · `EPIGENETIC CLOCKS` · `TELOMERE LENGTH` · `BLOOD BIOMARKERS` · `HORVATH CLOCK` · `PHENOTYPIC AGE` · `GRIP STRENGTH` · `VO2 MAX`

Position: At the top of the right-side text panel to add visual weight above the heading.

### 3. Alzheimers
**Ticker terms:** `EEG SIGNALS` · `BRAINWAVE PATTERNS` · `NEURAL OSCILLATIONS` · `COGNITIVE DECLINE` · `EARLY DETECTION` · `SPECTRAL ANALYSIS` · `P300 MARKERS`

Position: Above the text block at the bottom, matching Research section placement.

### 4. Collaboration
**Ticker terms:** `RESEARCHERS` · `INSTITUTIONS` · `INVESTORS` · `CLINICIANS` · `BIOTECH` · `PHARMA` · `UNIVERSITIES` · `HOSPITALS`

Position: Below the main CTA, as a subtle footer element within the section. Scrolls in the **opposite direction** (right to left reversed) for visual variety.

---

## Technical Details

Each ticker uses the same pattern from `Research.tsx`:
- A `border-y border-white/10` container with `overflow-hidden`
- A `motion.div` with `animate={{ x: ['0%', '-50%'] }}` and `repeat: Infinity`
- Array is duplicated (`[...ticker, ...ticker]`) for seamless looping
- Text styled as `text-xs text-white/30 tracking-[0.3em] font-medium`

### Files Modified
| File | Change |
|------|--------|
| `src/components/sections/WhatWeBuilt.tsx` | Add ticker above text block |
| `src/components/sections/BioAge.tsx` | Add ticker above heading in right panel |
| `src/components/sections/Alzheimers.tsx` | Add ticker above text block |
| `src/components/sections/Collaboration.tsx` | Add ticker below CTA button |

No new files or dependencies needed.
