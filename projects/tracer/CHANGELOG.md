# Tracer — Changelog

## 2026-06-23 — V2 creative rebuild (soldier, from SECTION_CONTRACT_V2)
Raised the WHOLE page to the hero's ambition. v1 src was untouched (prior
session hit the limit before changing anything); this is the real V2.

THE ONE GRID
- Added grid tokens to `tokens.css`: `--grid-max:1280px`, `--grid-gutter:64px`,
  `--grid-cols:12`, `--grid-colgap:24px`.
- Added `.grid-page` (defined once in globals.css) + `GridPage.tsx` wrapper.
  EVERY section now docks to it; no per-section max-width survives. Readability
  is span-controlled (headings cols 1-7/1-8, content 1-12). Dark backgrounds
  bleed full-viewport via DarkSection `bleed` while content stays on the grid.
- Dev-only `GridOverlay.tsx` (12-col guide, localStorage toggle, default ON,
  absent in production). Confirmed every section's left content edge aligns at
  1440px via the overlay.

NEW PRIMITIVE (promoted to kit)
- `AmbientDrift` -> `ui-kit/components/motion/AmbientDrift.tsx` (+ index.ts +
  REGISTRY `motion.AmbientDrift`). One slow blurred glow per dark stage. Opacity
  clamped <=0.12, duration clamped >=20s, translation-only, pauses under
  reduced-motion + ?motion=0. Used on Hero, Ownership, CTA. `useId` for a
  hydration-stable keyframe name (the module-counter version mismatched SSR vs
  client and broke ?motion=0 by regenerating the tree; fixed).

KIT
- `DarkSection` gained a `bleed` prop (drop inner max-width + padding so the
  project supplies its own grid). INDEX.md updated.

PER-SECTION
- Hero: alive from frame 1 (dot pulses + timer ticks immediately, no setTimeout
  gate; AmbientDrift drifting on paint). HeroMorphStage beat 2 re-spec'd: the REC
  pill becomes a file-capture CARD of comparable footprint (no scale-to-speck),
  morphs travel by position+content+blur(2px) seam, scale floor >=0.94. Headline
  + sub + CTAs on cols 1-8, morph stage 1-12, spec row 1-12. `:active` scale 0.97
  on CTAs.
- How it works: REPLACED StickyFeatureList with `HowItWorksScroll.tsx` (three
  full-width scroll panels, dot rail threading REC -> sync -> tick, panel
  entrances via `.st-reveal`). Removed `MorphPanels.tsx`.
- Features: layout-arrange entrance (cells spring from translate+scale 0.94,
  staggered, soft spring, once) + ONE live cell ("One click to share") with a
  copy -> record-red tick blur-morph. Full 1-12.
- Ownership: REPLACED static SpecStrip rows with `TravelingDot.tsx` (TruthRail):
  a record-red dot travels down the left rail lighting each truth-row dot, then
  dissolves with all four lit. Two-column rows on the grid + AmbientDrift.
- FAQ: REPLACED single-column FAQAccordion with `FAQTwoCol.tsx` (full-width
  two-column, sequential split 4/3, hairline column + row dividers, ring ->
  filled record-red dot open marker, single-open, native button triggers,
  height+blur seam). The headline grid fix.
- Final CTA: REPLACED the BlurReveal band with `CTAConvergence.tsx` (B2): on
  scroll-in the dot arrives -> blooms to capture card -> Dropbox folder + sync
  dot -> resolves into the live link pill BESIDE the Download button; copy
  affordance auto-ticks after 1.5s and stays interactive (real clipboard copy).
  Rest = headline (1-8) + pill + Download + "Free forever. ~12MB. MIT licensed."
  Dark bleed stage + AmbientDrift. No body paragraph, no second CTA.
- Nav: squiggle terminal dot one-shot pulse on paint (NoCornyMark `pulse`);
  single accent dot that slides between active links on scroll (replaces the
  per-link underline).

GATES
- ds-lint projects/tracer/src: 0 errors. AmbientDrift + DarkSection: 0 errors.
  (Pre-existing 87 kit errors are in components tracer never renders; unchanged.)
- slop-scan src + copy.json: PASS.
- next build: passes (full typecheck, externalDir kit).
- ?motion=0 lands every stage on its composed rest state (verified by
  screenshot). Mobile stub intact, no overflow at 500px. Zero console errors,
  no hydration mismatch on / or /?motion=0.

OPEN (for critics to re-verify in a REAL browser): the live morph/BlurReveal
timeline could not be cleanly captured under Chrome `--virtual-time-budget`
(it freezes framer animations mid-flight, leaving the hero blurred/empty in the
fast-forwarded frame). Static render is fully correct; the t+1.2s shot shows the
reveal firing. v1 shipped the identical BlurReveal. Re-confirm the hero rests
visible in a wall-clock browser.

## 2026-06-22 — fix round 1 (soldier, from ACTIONS.md)
Worked the reconciled 7-critic action list top to bottom.

BLOCKING (A-G), all done:
- A. Recomposed the hero rest state. `HeroMorphStage` now RESTS on ONE
  generous, centered, elevated dark share-link card (`--color-on-dark-glass`
  fill, `--color-on-dark-hairline` border, radius-window) directly under the
  CTA cluster: a provenance row (Dropbox glyph + `~/Dropbox/Tracer/` + Synced),
  a hairline, then the share link + record-red tick. The Dropbox folder is now
  a TRANSIENT the morph passes through (beat 3), not parked at rest. A faint
  `--color-on-dark-hairline` vertical thread traces the journey. Stage height
  300px, max-w 620px. Hero rhythm tightened (sub mt-6, CTA mt-10, artifact
  mt-[72px], spec row mt-12) so the ~160px void is gone and artifact + spec row
  read as one credibility cluster.
- B. `StickyFeatureList`: gated the "Chapter NN" ordinal behind `showOrdinal`
  (default OFF) so the banned kicker no longer renders. Tracer leaves it off.
- C. Raised sub-16px in kit: `FooterEditorial` sitemap + back-to-top 14px->16px;
  `StickyFeatureList` ordinal + DefaultChapterVisual eyebrow 12px->16px.
- D. `FooterEditorial` `FooterLink.external` flag -> `target=_blank rel=noopener`;
  Tracer passes the copy.json `external` flags through (columns + flat).
- E. `StickyFeatureList.body` widened to `string | ReactNode`; HowItWorks renders
  the `~/Dropbox/Tracer/` path inside the step body in Geist Mono.
- F. Added `src/app/icon.svg` (NoCorny squiggle + red dot on the ink surface);
  favicon now resolves (registered route `/icon.svg`).
- G. copy.json FAQ: "small local language model" -> "small language model".

SHOULD-FIX (H-O):
- H. Kept bespoke `Nav` (documented in DECISIONS): migrating to NavSticky would
  regress the over-dark-hero color inversion. Added the nav active-link state:
  IntersectionObserver scroll-spy over #how/#features/#ownership/#faq toggling
  `aria-current` + `font-semibold` + an accent underline.
- I. Scaled the How-it-works `MorphPanels` visuals up (larger frames, shadow-lg,
  full opacity, `--color-on-dark` tick stroke) so they fill the panel.
- J/K. Tightened Ownership: SpecStrip vertical label column is now a firm 280px
  so all four details share one left edge and right boundary; one-clause
  subheading (item R).
- L. Moved raw rgba/#fff/#333 out of components into `tokens.css`
  (`--color-on-dark-glass`/`-strong`, `-hairline`/`-strong`, `--color-nav-scrim`,
  `--color-dot-dark`, `--shadow-dark-lg`); SVG strokes -> currentColor/var.
  globals.css dot-grid-dark + Nav scrim now reference tokens.
- M. Dropped the hero recorder-pill `backdropFilter: blur` glassmorphism.
- O. Verified `scroll-timeline-reveal.css` gates on `html[data-motion="off"]`
  (already correct, no change).

NICE (P-S):
- P. Footer back-to-top `whitespace-nowrap`.
- Q. MobileStub Download focus-visible ring.
- R. Ownership subheading tightened to one Loom clause.
- S. Verified loom.com/pricing (25 videos / 5 min free plan) still current; copy
  claim kept as-is.

Kit promotions/changes: `StickyFeatureList` (showOrdinal + ReactNode body),
`FooterEditorial` (external flag + labeled `columns` + 16px floor), `SpecStrip`
(280px label column). INDEX.md + REGISTRY.json updated.

Gates: ds-lint projects/tracer/src 0/0; all Tracer-consumed kit components 0
errors; slop-scan src + content PASS; next build passes; dev 200, zero console
errors; favicon resolves; mobile 500px no overflow. Hero rests composed.
NOT user-ready: awaiting judge + critic re-review.

## 2026-06-22 — full desktop redesign build (soldier)
- Built all 7 sections + mobile stub into the scaffold, theme rhythm
  Nav(light) -> Hero(DARK) -> How it works(light) -> Features(light) ->
  Ownership(DARK) -> FAQ(light) -> Final CTA(DARK) -> Footer(light).
- Hero centerpiece `HeroMorphStage`: the cinematic 5-beat morph
  (REC -> condense -> Dropbox folder -> share-link pill -> red tick), plays once
  then rests. Red record-dot pulse is the only infinite loop. Gated by
  `useEnhancementEnabled`; static beat-5 fallback under reduced-motion / `?motion=0`.
- Built `SpecStrip` (horizontal credibility row + vertical truth strip) and
  PROMOTED it to `ui-kit/components/section/SpecStrip.tsx` (index.ts, INDEX.md,
  REGISTRY.json `section.SpecStrip`). Rewired Hero + Ownership to import it from
  the kit; removed the local copy.
- Built project-local `NoCornyMark` (squiggle into record dot), `MorphPanels`
  (static how-it-works visuals), and a bespoke `Nav` (transparent over the dark
  hero with light->ink scroll inversion, two CTAs).
- Reused kit `BlurReveal`, `StickyFeatureList`, `BentoGrid`/`BentoCell`,
  `DarkSection`, `FAQAccordion` (mode=single), `FooterEditorial`,
  `useEnhancementEnabled`, `scroll-timeline-reveal.css`.
- Wired all copy verbatim from `content/copy.json`; mono strings
  `~/Dropbox/Tracer/` and `tracer.nocorny.com/v/k7r2-mx9p` in Geist Mono only.
- Tokens: mapped Tailwind `font-serif` -> Geist in tokens.css so kit components
  inherit the pairing. Added the pre-hydration `?motion=0` bootstrap in layout.
- Fixed kit module resolution (symlink + transpilePackages + resolve.symlinks
  false + preserveSymlinks) so `next build` typechecks the external kit cleanly.
- Gates: ds-lint 0/0, slop-scan PASS (src + content). Production build passes
  (types valid, static export of 4 routes). Dev server returns 200.
- Next: judge + critics review; then any fixes; then devops.
