# {{PROJECT_NAME}} — Webflow Handoff

**For:** the Webflow developer who will rebuild this landing.

Update this file continuously. Do not wait until the end — sections get forgotten.

## How to use the Inspector
1. Run the project locally: `npm run dev`
2. Open in browser at `localhost:3000`
3. **Cmd+click** any element
4. A floating panel shows `data-component`, `data-source`, `data-tokens`
5. Open the source file path to see exactly how it's built

## Tokens to reproduce in Webflow
```
--color-accent: {{#hex}}
--color-accent-hover: {{#hex}}
--color-accent-subtle: {{rgba}}
```
Fonts: IBM Plex Sans (400,500,600) + IBM Plex Serif (500,600,700) from Google Fonts.

Type scale: see `DESIGN_SYSTEM.md`. All sizes are `clamp()`-based — use Webflow's fluid typography presets that match the min/max.

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for everything. In Webflow, this is Custom easing preset — set it once and reuse.

Radii: `12px` (large), `8px` (small), `9999px` (pills). Nothing else.

## Section-by-section notes
For each section, document:
- What it does
- Kit component used (or "custom" if local)
- Animation approach (Framer Motion preset name OR code sketch)
- **Webflow realism verdict:** `NATIVE IX2` / `CUSTOM EMBED` / `SIMPLIFY` (use a static fallback instead)

### Section 1 — {{Nav}}
- Component: `NavSticky`
- Animation: transparent → backdrop-blur + border after 40px
- Webflow: **NATIVE IX2** — scroll-triggered style change

### Section 2 — {{Hero}}
- Component:
- Animation:
- Webflow:

### Section 3 — ...

## Known "simplify on Webflow" items
Animations that can't be reproduced in Webflow as-is. Document the fallback.
- {{item}}: {{fallback}}

## Known "custom embed" items
Animations that need a small JS snippet in Webflow.
- {{item}}: {{embed snippet location}}

## Assets
- All images, videos, SVGs referenced from `public/` — list absolute paths and final dimensions.
