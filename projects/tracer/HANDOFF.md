# Tracer by NoCorny — Handoff

For the next (lighter) agent. Read this, then you can extend the page without
re-deriving intent. Build: Next.js 15 + React 19 + Tailwind v4 + Framer Motion 12
+ Lenis. Desktop-first; mobile is a deliberate single-screen stub.

Dev: `cd projects/tracer && npm run dev` -> http://localhost:3107
Build (typechecks): `npm run build`
Gates: `node ../../tools/ds-lint.mjs projects/tracer/src` and
`node ../../tools/slop-scan.mjs projects/tracer/src` (both must stay green).

## V3 motion model (read this first — it is the whole architecture)

The page is SCROLL-SCRUBBED, not reveal-on-enter. Scroll progress drives every
morph; the wheel scrubs the page like film.

- **The engine** is `useScrubProgress(ref)` from `@ui-kit/hooks/useScrubProgress`.
  It does `useScroll({ target, offset })` + `useSpring` ONCE and returns a single
  `p` MotionValue. A scrubbed section wraps its content in a `vh` runway with a
  `position:sticky` 100vh stage, calls `useScrubProgress(ref)` exactly once, and
  maps `p` to compositor props (x/y/scale/opacity/clipPath/filter) only. Never
  add a second `useSpring`, never map `p` to width/height/top/left/margin (that
  is the jank source). Runway heights are LOCKED in vh.
- **The single page scroll source** is `useGlobalProgress()` (`src/hooks/`), the
  ONE no-target `useScroll()` in the codebase. `page.tsx` owns it and passes the
  value to BOTH the ScrollDot and the Ownership parallax. Do NOT add another
  no-target `useScroll()` (grep must stay at one).
- **The ScrollDot** (`@ui-kit/components/motion/ScrollDot`) is the global fixed
  through-dot. `page.tsx` mounts it once with `progress={pageProgress}` and the
  `dockWindows`/`startBlink`/`restBlink` config. It self-gates via
  useEnhancementEnabled (no overlay on mobile / reduced-motion / ?motion=0); each
  section shows its own static marker when the dot is absent. If you add a
  section with a dock target, add a `{start,end}` window to `SCROLL_DOT_DOCKS` in
  page.tsx and a static marker in that section.
  - **Spine (2026-06-23 polish):** ScrollDot draws a faint 1px trailing spine
    above the dot (`spine` default true; `spineVh` length, `spineOpacity` peak)
    so it reads as one continuous thread, not a stray dot. The spine shares the
    dot's opacity (fades at dock windows). Promoted to the kit.
  - **Weave is subject-biased:** page.tsx passes `weaveVw={["48vw","46vw","44vw",
    "52vw","50vw"]}` so the dot stays near center where the hero card / how panels
    / CTA subjects sit (it passes BESIDE the active subject, not at random x). If
    you move a subject off-center, re-bias the weave to follow it.
- **Section H2s** use `ScrubReveal` (`src/components/ScrubReveal.tsx`), an A4
  scroll-linked clip/blur type reveal. It replaced `BlurReveal` everywhere. Pass
  `variant="clip"` (default) or `variant="blur"`.
- **Anti-jank rules (must not regress):** ONE Lenis rAF loop (ReactLenis autoRaf
  in LenisProvider); NO `addEventListener('scroll')` (the Nav backdrop rides
  `useLenis` instead); NO setState inside a scroll handler; animate transform/
  opacity/clipPath/filter ONLY; `will-change` scoped to the morphing node, never
  a section shell.
- **The scrub-hydration pattern (must not regress — this caused the V3 hotfix).**
  A scrubbed component must NOT call `useScrubProgress(ref)` / `useScroll({target})`
  in the same component that early-returns the static fallback: on the first
  render `useEnhancementEnabled` is false, the fallback is returned, the `ref` is
  never attached, and Framer throws "Target ref is defined but not hydrated" so
  scrollYProgress freezes. PATTERN: a thin gate component decides `enhance` and
  owns NO scroll hook; when true it renders an inner `*Scrubbed` component that
  attaches its ref to an unconditionally rendered runway and calls the hook. See
  HeroMorphStage / HowItWorksScroll / CTAConvergence / OwnershipNumbers /
  ScrubReveal. Any NEW scrubbed section must follow it.
- **position:sticky needs a non-clipping ancestor (must not regress — also the
  V3 hotfix).** `overflow:hidden` on ANY ancestor silently disables a
  descendant's `position:sticky`, so the pinned stage scrolls away (negative top)
  and the morph subject leaves the screen. A dark stage that hosts a scrubbed
  sticky runway must keep `overflow:visible`: the Hero clips its AmbientDrift in
  an inner `absolute inset-0 overflow-hidden` layer instead of on the section,
  and the kit `DarkSection` takes `allowSticky` (drops overflow-hidden) which the
  CTA sets. Do not put overflow-hidden back on those section shells.
- **How-it-works panels are full 100vw slides.** HowItWorksScroll breaks out of
  the grid column with `left-1/2 w-screen -translate-x-1/2`; the track is 300vw,
  body at `max-w-[44ch]`, the visual in its own `minmax(0,520px)` column. Keep
  panels full-width or the body wraps to one word per line and the visual overlaps
  the text.
  - **Panel SNAP (2026-06-23 polish, must not regress):** the `x` map DWELLS on
    each panel instead of scrubbing linearly, so a rest never parks between panels
    showing sliced half-panels. The dwell input/output map is `p [0,0.34,0.46,
    0.66,0.78,1] -> ["0%","0%","-33.333%","-33.333%","-66.667%","-66.667%"]`. Plus
    a 7vw horizontal edge MASK on the sticky stage feathers any panel caught
    mid-slide. If you add a 4th panel, extend the dwell map (4 plateaus) and the
    track width (400vw, x to -75%). Still ONE spring, compositor `x` only.
- **Pinned-stage composition (2026-06-23 polish, the "no void" rule).** Every
  pinned dark/light stage centers a subject that fills a good half of the stage,
  not a small object floating over a dead lower half. Runways are tightened (Hero
  230vh, How 240vh, Ownership-numbers 120vh, CTA 150vh) so beats are dense with no
  near-empty transition frame. The Hero sticky stage is biased UPPER (`pt-[14vh]`,
  `justify-start`) so the beat label + subject sit under the H1. The CTA headline
  lives INSIDE the pin and the composed rest (headline + resolved link card +
  Download + note) HOLDS static + centered from p~0.85 to p=1 (it must never end
  the page on emptiness). The Ownership truth rows are pulled up (`-mt-[18vh]`)
  into the numbers runway tail (overlapped hand-off) so there is no dead seam. The
  `?motion=0` static composition is the cohesion reference: the live rest should
  match it.

### RENDER-only text cuts (copy.json is the source of truth, untouched)
These keys exist in `content/copy.json` but are NOT rendered as-is:
- `hero.subheading` — SUPPRESSED inside the hero scrub stage (the morph + the
  per-beat labels are the sentence). The mobile stub does not use it either.
- `final_cta.body` — SUPPRESSED inside the CTA scrub stage (the convergence is
  the body).
- `how_it_works.steps[0].body` — rendered SHORTENED to "Press the global hotkey.
  The red dot goes live." (see `STEP_BODY_OVERRIDES` in `sections/HowItWorks.tsx`).
- `how_it_works.steps[2].body` — trailing "Done." sentence dropped in render.
Change the override map in HowItWorks.tsx, or un-suppress in Hero.tsx /
CTAConvergence.tsx, if a future direction wants the full copy back.

### V3 component status (runways tightened in the 2026-06-23 polish)
- `HeroMorphStage.tsx` — 3-beat scroll scrub, 230vh (was 300vh), upper-biased
  sticky stage. Project-local.
- `HowItWorksScroll.tsx` — Framer horizontal scrub, 240vh (was 300vh), DWELL-snap
  + 7vw edge mask. Project-local (Tracer-specific track).
- `CTAConvergence.tsx` — scroll climax, 150vh (was 200vh). The headline now lives
  INSIDE the pin (passed from FinalCta); the composed rest holds static p0.85->1.
  Project-local.
- `OwnershipNumbers.tsx` — A5 scrubbed numbers strip, 120vh (was 150vh).
  Project-local.
- `TruthRows.tsx` — NEW: A4 reveal rows (replaces the deleted TravelingDot).
- `ScrubReveal.tsx` — NEW: A4 type reveal helper. Project-local.
- `ScrollDot` + `useScrubProgress` — PROMOTED to the kit (see above).
- `TravelingDot.tsx` — DELETED (animated `top`, a layout prop = jank). The global
  ScrollDot + TruthRows replaced it.
- `scroll-timeline-reveal.css` import — REMOVED from globals.css (Features no
  longer uses `.st-reveal`; it scrubs per-cell via local useScroll now).

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
| 7a | Final CTA | `sections/FinalCta.tsx` | kit `DarkSection` (bleed, allowSticky) + custom `CTAConvergence` | The 150vh scroll climax: headline (INSIDE the pin) + the convergence (dot->capture->Dropbox->resolved link card) coming to a STATIC centered rest with the full-width link card + Download + note. No body para, no 2nd CTA. |
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
