# Tracer by NoCorny — Handoff

For the next (lighter) agent. Read this, then you can extend the page without
re-deriving intent. Build: Next.js 15 + React 19 + Tailwind v4 + Framer Motion 12
+ Lenis. Desktop-first; mobile is a deliberate single-screen stub.

Dev: `cd projects/tracer && npm run dev` -> http://localhost:3107
Build (typechecks): `npm run build`
Gates: `node ../../tools/ds-lint.mjs projects/tracer/src` and
`node ../../tools/slop-scan.mjs projects/tracer/src` (both must stay green).

## Where things live

- Tokens: `projects/tracer/tokens.css` (accent `#E5484D`, warm-neutral light
  palette, dark-stage `--color-ink-surface` / `--color-on-dark`, type scale,
  radii, `--ease-spring` / `--ease-out`, shadows). Change a value once here and
  it propagates. NEVER put a raw hex in a component; use `var(--*)`.
- Fonts: `src/app/layout.tsx` via next/font. Geist (display + UI), Hanken Grotesk
  (body), Geist Mono (paths + link strings ONLY). `tokens.css` maps Tailwind
  `font-serif` -> Geist so kit components inherit the pairing.
- Global CSS: `src/app/globals.css` (dot-grid, dark-scope, imports the kit
  scroll-timeline-reveal.css). `@source` points Tailwind at the kit.
- Copy: `content/copy.json` (single source of all on-page text; wired verbatim).
- Pre-hydration motion bootstrap: inline `<head>` script in `layout.tsx` sets
  `html[data-motion="off"]` when `?motion=0`, before first paint.

## The ONE grid (V2 — read this before moving anything)

Every section's content sits inside `GridPage` (`src/components/GridPage.tsx`),
which applies `.grid-page` (defined once in `globals.css`): max-width
`--grid-max` (1280px), outer `--grid-gutter` (64px), 12 equal columns,
`--grid-colgap` (24px). DO NOT give a section its own max-width or narrower
padding; narrow by spanning fewer columns (`col-span-7` / `col-span-8` for
headings, `col-span-12` for content). Dark stages bleed full-viewport via the
kit `DarkSection` `bleed` prop, but their inner `GridPage` keeps content on the
same tracks. A dev-only `GridOverlay` (bottom-right "grid on/off" toggle,
localStorage) draws the 12 columns so you can check alignment; it never ships to
production.

## The dot thread (the page's protagonist)

The record-red dot (`--color-accent`) recurs section to section: nav squiggle
terminal dot (one-shot pulse) + sliding active-link dot -> hero live REC dot ->
how-it-works rail dot (REC -> sync -> tick) -> features "One click to share"
copy->tick -> ownership traveling dot lighting each truth row -> FAQ ring->dot
open marker -> CTA dot arrives and resolves into the link pill -> footer
wordmark dot. Keep any new dot the same accent and the same "one focal point".

## Section order + theme rhythm (src/app/page.tsx)

Nav (light) -> Hero (DARK) -> How it works (light) -> Features (light) ->
Ownership (DARK) -> FAQ (light) -> Final CTA (DARK) -> Footer (light). Every
dark/light boundary is a smooth surface change (no hard cut).

| # | Section | File | Kit vs custom | Notes |
|---|---|---|---|---|
| 1 | Nav | `sections/Nav.tsx` | custom (uses `NoCornyMark`) | Sticky, transparent over the dark hero then inverts to ink + blur on scroll. Squiggle mark (one-shot `pulse`) + wordmark, links, Sign in (ghost) + red Download. Scroll-spy drives a SINGLE accent dot that slides between the active links (`-bottom-2`, `left` morph). |
| 2 | Hero | `sections/Hero.tsx` | custom dark stage; kit `BlurReveal` + `AmbientDrift` + `SpecStrip` + custom `HeroMorphStage` | Headline+sub+CTAs cols 1-8, morph 1-12, spec row 1-12. Alive from frame 1 (dot pulse + timer tick + drift). At REST the morph shows ONE share-link card. |
| 3 | How it works | `sections/HowItWorks.tsx` | custom `HowItWorksScroll` (+ `.st-reveal`) | H2 cols 1-7; three full-width scroll panels (text + visual), record-dot rail threading REC->sync->tick. |
| 4 | Features | `sections/Features.tsx` | kit `BentoGrid`/`BentoCell` + Framer | Icon-free 3x2 bento full 1-12. Cells layout-arrange in on scroll (translate+scale 0.94, staggered, once). ONE live cell (items[3], "One click to share") copy->red tick. |
| 5 | Ownership | `sections/Ownership.tsx` | kit `DarkSection` (bleed) + `AmbientDrift` + custom `TravelingDot`/TruthRail | H2+sub cols 1-7; 4 truth rows (label 1-6, detail 7-12). A red dot travels down the rail lighting each row dot, then dissolves. |
| 6 | FAQ | `sections/Faq.tsx` | custom `FAQTwoCol` | H2 cols 1-7; full-width two-column accordion (split 4/3), ring->red-dot open marker, single-open, height+blur seam. |
| 7a | Final CTA | `sections/FinalCta.tsx` | kit `DarkSection` (bleed) + `AmbientDrift` + custom `CTAConvergence` | Headline cols 1-8; the B2 convergence (dot->capture->Dropbox->link pill beside Download). Note line. No body para, no 2nd CTA. |
| 7b | Footer | `sections/Footer.tsx` | kit `FooterEditorial` | Oversized wordmark + 3 labeled columns + tagline + legal. |
| -- | Mobile stub | `MobileStub.tsx` | custom | Single screen below md (mark, one line, Download). |

## Custom (project-local) components

- `GridPage.tsx` -- the ONE grid wrapper. Use it for any new section.
- `HeroMorphStage.tsx` -- CUSTOM EMBED. Record pill -> file-capture card ->
  Dropbox folder -> share-link card -> red tick. Alive from frame 1 (dot pulse +
  timer, no setTimeout gate). Morphs travel by position+content+blur(2px), no
  scale below 0.94, never scale-from-0. Gated by `useEnhancementEnabled({minWidth:1024})`;
  static lands on the resting share-link card. Beat timings in the `useEffect`.
- `HowItWorksScroll.tsx` -- CUSTOM EMBED. Three scroll panels + the record-dot
  rail (Framer `useScroll` for the rail position; `.st-reveal` for panel text).
  `RecordVisual` / `DropboxVisual` / `LinkVisual` are the per-panel frames.
- `TravelingDot.tsx` (export `TruthRail`) -- CUSTOM EMBED. IntersectionObserver
  triggers the dot to walk `rowRefs` offsets, lighting each row dot; dissolves
  at the end. Static renders all rows lit.
- `FAQTwoCol.tsx` -- CUSTOM EMBED. Lifted `openId` state for single-open across
  both columns; native `<button>` triggers + `AnimatePresence` height+blur seam.
  Split is `Math.ceil(n/2)` (col A) / rest (col B).
- `CTAConvergence.tsx` -- CUSTOM EMBED. IntersectionObserver triggers the 4-beat
  chain; rests on the Download button + live link pill (real clipboard copy,
  auto-tick after 1.5s). Reuses HeroMorphStage's visual vocabulary, distinct
  composition. Static lands on the rest row.
- `GridOverlay.tsx` (in `dev/`) -- dev-only 12-col guide; never in production.
- `NoCornyMark.tsx` -- Tracer's brand mark (squiggle into a record dot), one-shot
  `pulse` prop on the terminal dot. Strokes `currentColor`; dot `--color-accent`.

## Promoted / extended in the kit this project

- `AmbientDrift` -> `ui-kit/components/motion/AmbientDrift.tsx` (registered in
  `index.ts`, `INDEX.md`, `REGISTRY.json` as `motion.AmbientDrift`). One slow
  blurred glow per dark stage. Opacity clamped <=0.12, duration >=20s,
  translation-only, pauses under reduced-motion + `?motion=0`. Uses `useId` for a
  hydration-stable keyframe name. Used by Hero, Ownership, CTA. Import from
  `@ui-kit/components/motion/AmbientDrift`.
- `DarkSection` extended: `bleed` prop drops the inner max-width + horizontal
  padding so the project supplies its own grid (the dark bg still bleeds
  full-viewport). Used by Ownership + Final CTA in V2.
- `SpecStrip` -> `section.SpecStrip` (Hero horizontal row). Vertical truth strip
  no longer used (replaced by TruthRail).
- `StickyFeatureList` / `FooterEditorial` extended in fix round 1 (see CHANGELOG).

## Favicon

- `src/app/icon.svg` (Next.js auto-favicon route). The NoCorny squiggle + red
  record dot on the ink surface. Hex is inline in the SVG (favicons cannot read
  CSS vars; ds-lint does not scan .svg). Resolves at `/icon.svg`.

## Motion notes

- Two continuous loops on the whole page, no more: the live record dot pulse +
  `AmbientDrift` (one instance per dark stage; same primitive, three placements).
  Everything else plays ONCE then rests.
- Every "thing becomes another thing" morph uses a `filter: blur(2px)` seam and
  travels by position+content, never scale-from-0, never below ~0.92 scale.
- Entrances: kit `BlurReveal` (handles reduced-motion AND `?motion=0`). Big beats
  use `--ease-spring`; state nudges (hover, copy->tick, accordion open, nav dot)
  use `--ease-out` under 300ms. `:active` scale 0.97 on buttons.
- `?motion=0` (and reduced-motion) lands EVERY section on its composed rest
  state: dot frozen, timer at final, drift off, FAQ closed/first-state, CTA on
  the link-pill+Download row. Verified by screenshot.
- Lenis smooth scroll is wired in `src/components/providers/LenisProvider.tsx`.

## Build infra note (important if you touch config)

The kit lives outside the project (`../../ui-kit`). It is symlinked into
`node_modules/@aisoldier/ui-kit`; `next.config.ts` aliases `@ui-kit` to that
symlink, sets `transpilePackages` + `resolve.symlinks=false`, and `tsconfig.json`
sets `preserveSymlinks:true`. This is what lets the kit's imports of
`react`/`framer-motion`/`lenis` resolve to THIS project's node_modules at BOTH
webpack-compile AND tsc-typecheck time. If `next build` ever fails with "Cannot
find module 'framer-motion'" from a kit file, the symlink or one of those flags
was lost.

## Known limitations / honest gaps

- LIVE morph timeline not self-verified by screenshot: Chrome
  `--virtual-time-budget` freezes framer-motion mid-flight, so the fast-forwarded
  frame shows the hero blurred/empty. The `?motion=0` rest states are all
  correct, and the reveal fires at t+1.2s, but the full live chain settling
  visible needs a wall-clock browser check (critics: please confirm the hero +
  CTA rest visible and the chains play once). v1 shipped the identical
  BlurReveal, so the risk is low.
- `ui-kit/components` (full scope) still reports ~87 pre-existing ds-lint errors
  in components Tracer does NOT import. Every kit component Tracer DOES render
  (incl. the V2 AmbientDrift + DarkSection) is 0-error. Out of scope here.
