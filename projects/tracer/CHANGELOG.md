# Tracer — Changelog

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
