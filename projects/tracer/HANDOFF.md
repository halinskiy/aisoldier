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

## Section order + theme rhythm (src/app/page.tsx)

Nav (light) -> Hero (DARK) -> How it works (light) -> Features (light) ->
Ownership (DARK) -> FAQ (light) -> Final CTA (DARK) -> Footer (light). Every
dark/light boundary is a smooth surface change (no hard cut).

| # | Section | File | Kit vs custom | Notes |
|---|---|---|---|---|
| 1 | Nav | `sections/Nav.tsx` | custom (uses `NoCornyMark`) | Sticky, transparent over the dark hero (light text) then inverts to ink + blurred surface on scroll. Squiggle mark + wordmark, links, Sign in (ghost) + red Download. Active-link scroll-spy (IntersectionObserver over #how/#features/#ownership/#faq) sets aria-current + font-semibold + an accent underline on the current section's link. |
| 2 | Hero | `sections/Hero.tsx` | custom dark stage; kit `BlurReveal` + `SpecStrip` + custom `HeroMorphStage` | The centerpiece. Headline + 1 sub + CTAs + the morph + one SpecStrip row. At REST the morph stage shows ONE composed share-link card directly under the CTA (provenance row + share link + red tick); artifact + spec row read as one credibility cluster. |
| 3 | How it works | `sections/HowItWorks.tsx` | kit `StickyFeatureList` + custom `MorphPanels` | 3 steps; each step's pinned visual is a static frame of the matching hero beat. |
| 4 | Features | `sections/Features.tsx` | kit `BentoGrid`/`BentoCell` + `.st-reveal` | Icon-free 3x2 uniform bento, 6 cells. |
| 5 | Ownership | `sections/Ownership.tsx` | kit `DarkSection` + `SpecStrip` (vertical) | The emotional core. 4 truth rows, one accent dot each. |
| 6 | FAQ | `sections/Faq.tsx` | kit `FAQAccordion` mode="single" | 7 items, one open at a time. |
| 7a | Final CTA | `sections/FinalCta.tsx` | kit `DarkSection` | One verb, one red Download, one note line. |
| 7b | Footer | `sections/Footer.tsx` | kit `FooterEditorial` | Oversized wordmark + 3 labeled columns (Product / Open source / NoCorny) + tagline + legal. External links carry target/rel. No invented "built with" line. |
| -- | Mobile stub | `MobileStub.tsx` | custom | Single screen below md (mark, one line, Download). Desktop hidden below md; stub hidden md+. |

## Custom (project-local) components

- `HeroMorphStage.tsx` -- CUSTOM EMBED. The cinematic morph (REC -> condense ->
  Dropbox folder transient -> share-link card -> red tick). Framer Motion, gated
  by the kit `useEnhancementEnabled({minWidth:1024})`. The red record dot pulse
  (beat 1) is the ONLY infinite loop on the whole page (a true live indicator).
  At REST exactly ONE element is on the stage: the elevated `ShareLinkCard`
  (provenance row + share link + red tick) on `--color-on-dark-glass`. The
  recorder pill (beats 1-2) and the Dropbox folder (beat 3) are TRANSIENTS, gone
  at rest. A faint vertical thread (`--color-on-dark-hairline`) traces the
  journey. No glassmorphism (backdrop-blur removed). Under reduced-motion /
  `?motion=0` / under 1024px it renders statically on the resting card (no
  flash). Beat timings live in the `useEffect`. NOT a kit component; product
  specific. All on-dark colors come from `tokens.css`; SVG strokes are
  `currentColor`. If another product needs a morph storyboard, generalise first.
- `MorphPanels.tsx` -- static light-surface frames (RecordPanel / DropboxPanel /
  LinkPanel) passed as `visual` to the How-it-works StickyFeatureList. Project-local.
- `NoCornyMark.tsx` -- Tracer's own brand mark (squiggle into a record dot). NOT
  the 3mpq fallback. Strokes are `currentColor`; the dot is `--color-accent`.

## Promoted / extended in the kit this project

- `SpecStrip` -> `ui-kit/components/section/SpecStrip.tsx` (registered in
  `index.ts`, `INDEX.md`, `REGISTRY.json` as `section.SpecStrip`). Horizontal
  credibility row + vertical truth strip. Used by Hero (horizontal) and
  Ownership (vertical). Vertical label column is a firm 280px so all detail rows
  share one left edge. Import from `@ui-kit/components/section/SpecStrip`.
- `StickyFeatureList` extended: `showOrdinal` prop (default OFF) gates the
  "Chapter NN" kicker; `item.body` accepts `string | ReactNode`. Tracer uses
  both (ordinal off; step-2 body wraps the mono path).
- `FooterEditorial` extended: `FooterLink.external` adds `target=_blank
  rel=noopener noreferrer`; optional labeled `columns` prop; all text >= 16px.

## Favicon

- `src/app/icon.svg` (Next.js auto-favicon route). The NoCorny squiggle + red
  record dot on the ink surface. Hex is inline in the SVG (favicons cannot read
  CSS vars; ds-lint does not scan .svg). Resolves at `/icon.svg`.

## Motion notes

- Entrances: kit `BlurReveal` (handles reduced-motion AND `?motion=0`, renders
  children visibly, animates once). Features cells use the kit native CSS
  `.st-reveal` (triple-gated, CLS 0).
- Hero morph: plays once on load then rests. Hover/state uses `--ease-out`;
  entrance/spring uses `--ease-spring`.
- Lenis smooth scroll is wired in `src/components/providers/LenisProvider.tsx`
  (root layout). Anchor links scroll smoothly.

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

- How-it-works pinned visuals cross-fade between beats on scroll (kit
  AnimatePresence). They now fill ~half the panel at full opacity; in a static
  headless screenshot the panel can briefly read mid-transition, but renders
  confidently in a real browser on scroll.
- `ui-kit/components` (full scope) still reports ~87 pre-existing ds-lint errors
  in components Tracer does NOT import (CmdKSearch, MetricsBar, system docs,
  Badge, LogoBelt, etc.): mostly intentional sub-16px and comment glyphs. Every
  kit component Tracer DOES render is 0-error. Cleaning the rest is a separate
  kit-hygiene pass (see DECISIONS), not this project's scope.
