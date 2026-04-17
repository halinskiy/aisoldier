# booquarium — Webflow Handoff

**For:** the Webflow developer who will rebuild this landing.

Update this file continuously. Do not wait until the end — sections get forgotten.

---

## How to use the Inspector
1. Run the project locally: `npm run dev`
2. Open in browser at `localhost:3456`
3. **Cmd+click** any element
4. A floating panel shows `data-component`, `data-source`, `data-tokens`
5. Open the source file path to see exactly how it's built

## Tokens to reproduce in Webflow
```
--color-accent: #B8322C
--color-accent-hover: #961F1A
--color-accent-subtle: rgba(184,50,44,0.08)
--color-bg: #ffffff
--color-text: #212121
--color-text-muted: #525252
--color-text-subtle: #a3a3a3
--color-border: #e5e5e5
--color-border-strong: #d4d4d4
```

Fonts: IBM Plex Sans (400,500,600) + IBM Plex Serif (500,600) from Google Fonts.

Type scale: clamp()-based. See `tokens.css` / `DESIGN_SYSTEM.md`.

Easing (reuse for everything): `cubic-bezier(0.16, 1, 0.3, 1)`.

Radii: `12px` (cards, windows), `8px` (buttons, inputs), `9999px` (pills).

---

## Section-by-section notes

### Section 0 — Nav — NATIVE IX2
- Component: `NavSticky`
- Logo: plain serif text (author name, no tilde glyph)
- Animation: transparent → 85% bg + backdrop-blur(24px) + hairline border + subtle shadow after 40px scroll
- Mobile: burger overlay with staggered serif link entrance
- Webflow: **NATIVE IX2** — scroll-triggered style change, mobile tabs for overlay

### Section 0.5 — Loader — CUSTOM EMBED REQUIRED
- Component: `src/components/Loader.tsx`
- Full-screen white overlay, `position: fixed; z-index: 9999`
- CSS 3D book (navy cover, crimson spine, gold border) animates cover opening over ~1.2s
- Simultaneously: Lenis scrolls to `500vh × 0.42` while overlay is still visible, so the R3F hero is in "pages open" state when the overlay fades
- Total duration: ~2.2s. Reduced-motion: skips animation, still jumps scroll.
- **Webflow verdict:** Recreate as a custom code embed or Webflow's built-in page loading screen with a CSS transition. The scroll jump needs JS (`window.scrollTo`).

### Section 1 — Hero — CUSTOM EMBED REQUIRED (R3F)
- Component: `src/components/sections/Hero.tsx` + `src/components/3d/BookScene.tsx`
- Layout: **500vh** parent (increased from 200vh), `position: sticky; top: 0` child (`h-screen`)
- Left column (58%): 3D book. Right column (42%): text.
- **3D Book** (`BookScene.tsx`):
  - Geometry: BoxGeometry for each part (front cover, back cover, pages block, spine)
  - Materials: 6-face material arrays — `face 4 (+Z)` = fantasy front cover texture, `face 5 (-Z)` = inside cover bookplate
  - Back cover: `face 5 (-Z)` = back cover with blurb + barcode
  - Pages block: `face 4 (+Z)` = two-page spread with literary typography (cream, drop cap, running headers)
  - Textures: generated from Canvas 2D API in `createBookTextures.ts` — no external assets
- **Scroll state machine** (two MotionValues fed from Hero scroll progress):
  - `coverAngle`: 0.05→0.30 = cover opens to -120°; 0.55→0.80 = cover closes back to 0°
  - `bookRotY`: 0.80→1.0 = book Y-rotates 180° to show back cover
  - Mouse parallax: outer tilt group ±0.14rad Y, ±0.09rad X, lerped at 0.04
  - Idle float: `Math.sin(t*0.75)*0.07` on Y axis
- Text column: eyebrow pill, H1 serif (clamp 44-96px), italic subhead (clamp 20-30px), body 16px, primary + secondary CTAs, small-caps metadata row
- Scroll hint: "Scroll to open" + animated mouse SVG, fades at scrollProgress 0.06
- **Webflow verdict:** 3D scene cannot be replicated in IX2. Recommended fallbacks (in order of preference):
  1. **Prefer:** keep the R3F canvas as a custom code embed mounted into a Webflow-managed wrapper (the rest of the text column is native).
  2. Fallback: replace the canvas with a static hi-res book cover photograph + subtle parallax IX2 interaction.
  3. Last resort: Rive animation of the book opening, driven by a scroll interaction.

### Section 2 — About — NATIVE IX2 with SplitText caveat
- Component: `src/components/sections/About.tsx`
- Layout: 2-col. Left = square dot-grid photo placeholder with serif initials "E.V." (will be replaced with a real author photo in production). Right = eyebrow + serif H2 + SplitText bio paragraph + "Write to Elena" secondary button.
- Animation:
  - `BlurReveal` on the photo + CTA (IX2: opacity/translate/filter on scroll-in)
  - `SplitText` on the bio — word-by-word stagger 0.025s per word, opacity + y + blur
- **Webflow verdict:** Section layout + BlurReveal are **NATIVE IX2**. SplitText per-word animation is **CUSTOM EMBED** — recommend a GSAP SplitText snippet OR simplify to a single-block paragraph fade.

### Section 3 — Features / Inside the Book — NATIVE IX2 (sticky)
- Component: `src/components/sections/Features.tsx` → `StickyFeatureList` kit component
- Layout: 2-col at `lg`. Left column sticky visual (cross-fades between items). Right column scrolling list of 4 chapter items.
- Per-item IntersectionObserver tracks the middle-of-viewport item and sets `data-active="true"`. Active item: accent left-bar, accent eyebrow, full-opacity title/body.
- **Webflow verdict:** **NATIVE IX2**. IX2 supports sticky + scroll-triggered style changes. Use a single "active state" interaction on each list item triggered when it enters the middle band. Sticky visual: cross-fade via 4 absolute-positioned variants; only one has opacity 1 at a time.

### Section 4 — Praise — NATIVE IX2
- Component: `src/components/sections/Praise.tsx` → `BlurbWall` kit component
- Layout: 3-col grid on `lg`, 2-col on `sm`, 1-col on narrow mobile
- Cards: 5 accent dot-stars, italic serif quote with accent curly quotes, small-caps source eyebrow
- Hover: border-strong + subtle shadow + translateY(-2px), all 300ms doctrine easing
- Entry: staggered BlurReveal via `data-motion-index`
- **Webflow verdict:** **NATIVE IX2**. Standard card grid with hover interaction and stagger on scroll-in.

### Section 5 — Newsletter — NATIVE IX2
- Component: `src/components/sections/Newsletter.tsx`
- Layout: full-width dot-grid surface, centred composition max-width 720px
- Form: email input + submit button, client-side confirmation flip on submit
- **Webflow verdict:** **NATIVE IX2**. Webflow's form with a Success state swap gives the exact same UX. Replace the `#` CTA target on hero buttons with a proper Webflow form action.

### Section 6 — Footer — NATIVE
- Component: `src/components/sections/Footer.tsx` → `FooterEditorial` kit component
- Rows:
  1. Oversized serif wordmark "Elena Voss" (clamp 72-240px)
  2. Sitemap (small-caps links, left) + tagline (IBM Plex Sans, right)
  3. Legal + "Built with Booquarium" + "Back to top" anchor
- **Webflow verdict:** **NATIVE**. Pure layout + link styles. "Back to top" is a standard in-page anchor.

---

## Known "custom embed" items
1. **Hero 3D book scene** — `src/components/3d/BookScene.tsx`. Requires React Three Fiber + drei + three. In Webflow, ship as a custom code embed mounted into a sized wrapper div. Document the mount target selector when embedding.
2. **SplitText per-word reveal** (About) — requires GSAP or a hand-rolled snippet. OR simplify to block fade in IX2 if custom code is not desired.

## Known "native IX2" motion budget
- Header morph (scroll threshold 40px)
- BlurReveal entry on every content block — opacity 0→1 + translateY 24→0 + blur 8→0 over 600ms, doctrine easing
- Sticky feature list active state (middle-of-viewport intersect)
- Blurb card hover
- Lenis smooth scroll — keep as the global scroll engine (single custom code snippet on the site; Webflow's native scroll stays off)

## Assets
- No image assets yet. All current surfaces are either typography, dot-grid backgrounds, or CSS-drawn illustrations. Author photo for Section 2 to be provided later (swap the placeholder for an `<img>` at `src/components/sections/About.tsx`, drop the dot-grid + initials).
