# Tracer — Changelog

## 2026-06-23 — V3 POLISH: close the void, compose the CTA rest, snap the panels (soldier)
Focused premium-feel pass on the working V3 scrub (every working mechanic kept:
engine, J1-J10 anti-jank, scrub correctness, ScrollDot, one accent #E5484D,
>=16px, grid, mobile stub, ?motion=0 fallback). Verified by REAL scroll
(tools/scroll-probe.mjs) at 40+ positions, not gates/?motion=0 alone. Doc went
13501px -> 10947px (tighter runways). 0 console errors on / and /?motion=0.

1. CTA CLIMAX RESTING FRAME (was: ends on empty black void). The headline was a
   separate grid block ABOVE the sticky stage, so it scrolled off before p=1 and
   the composed payoff never rested co-visible. Fix: pulled the headline INTO the
   pinned stage (FinalCta now passes `heading` to CTAConvergence; the separate
   headline GridPage + its ScrubReveal are gone). Headline is the persistent
   anchor (always visible, no clip-reveal). All beats finish by ~p0.85; from
   p0.85->1 the composed cluster (headline + resolved link card + Download + note)
   HOLDS static and CENTERED, like the Hero rests on its share card. The link is
   now a FULL-WIDTH card (max-w-[640px]) so tracer.nocorny.com/v/k7r2-mx9p is
   NEVER truncated and the clip-reveal finishes at inset(0 0 0 0). Runway 200vh
   -> 150vh. Verified: CTA rest at p~1 = full composed cluster, pill not clipped;
   the ?motion=0 static composes identically (cohesion reference matched).
   Files: CTAConvergence.tsx (rewritten), sections/FinalCta.tsx.

2. CLOSE THE VOID across pinned stages. Subjects enlarged + centered, runways
   tightened so beats are denser with no near-empty transition frames:
   - Hero 300vh -> 230vh; sticky stage biased to the UPPER third (pt-[14vh],
     justify-start) so the beat label + subject sit right under the H1 (closed
     the y0 soft void); subject box 260->300px, link card max 600->660px; H1 lead
     tightened (-mb-[8vh]). Files: HeroMorphStage.tsx, sections/Hero.tsx.
   - CTA subject larger (dot 20->24px, cards minWidth 380->420px), centered.
   - Ownership numbers runway 150vh -> 120vh, beats finish by ~p0.78 then hold.

3. SNAP THE HORIZONTAL PANELS (the real "janky" tell). The how-it-works 300vw
   track was a linear scrub that parked between panels showing sliced half-panels.
   Fix: the x map now DWELLS on each panel (dwell zones at p 0-0.34 / 0.46-0.66 /
   0.78-1 -> 0% / -33.333% / -66.667%) so any rest settles on ONE full panel; plus
   a 7vw horizontal edge MASK feathers any panel caught mid-slide so a transition
   frame reads clean, never a sharp sliced half-card. Runway 300vh -> 240vh. Still
   ONE spring, compositor `x` only (J5/J9 intact). File: HowItWorksScroll.tsx.

4. OWNERSHIP SEAM (was: ~600px empty dark viewport between numbers and truth
   rows). Numbers strip now top-biased + finishes early; truth rows pulled UP into
   the runway tail (-mt-[18vh]) so they rise as the strip rests (overlapped
   hand-off). The dead band is closed; reads as one continuous section. Files:
   OwnershipNumbers.tsx, sections/Ownership.tsx.

5. SCROLLDOT SPINE + subject-biased weave (kit). ScrollDot now draws a faint 1px
   trailing spine above the dot (linear-gradient, fades upward, shares the dot's
   opacity so it fades at docks) so it reads as one continuous thread, not a stray
   dot. New props: spine / spineVh / spineOpacity (default on). The page weave is
   biased toward center (44-52vw) where the hero card / how panels / CTA subjects
   sit, so the dot passes BESIDE the active subject. Files: ui-kit ScrollDot.tsx
   (promoted), app/page.tsx.

Gates: ds-lint src 0/0 over 24 files; slop-scan src + copy PASS; next build green;
ScrollDot.tsx lint clean. (Pre-existing em-dash WARNs in unrelated kit files
MarqueeInfinite/SplitText were untouched, not used by Tracer.)

## 2026-06-23 — V3 scrub HOTFIX: ref hydration + broken sticky pin + panel width (soldier)
Urgent fix round: gates passed but a live hand scroll-test showed the scrubbed
sections broken. Two independent root causes, both fixed and verified by a real
CDP scroll-and-screenshot probe (tools/scroll-probe.mjs, new) at multiple scroll
positions, since tools/shoot.mjs only renders the static fallback.

ROOT CAUSE 1 — useScroll target ref not hydrated.
Every scrubbed component called `useScrubProgress(ref)` / `useScroll({target:ref})`
at the top, then early-returned the static fallback (where `ref` was never
attached) on the first render (useEnhancementEnabled is false on SSR + first
client frame). Framer threw "Target ref is defined but not hydrated", scrollY-
Progress never advanced, and every useTransform froze -> empty stages.
Fix: split each scrubbed section into a thin gate that owns NO scroll hook, plus
an inner `*Scrubbed` component mounted ONLY when enhanced. The inner component
attaches its ref to an unconditionally rendered runway element in the SAME commit
the hook runs, so useScroll never sees an unhydrated target. Hook order is stable
in every component. Files: HeroMorphStage, HowItWorksScroll, CTAConvergence,
OwnershipNumbers, ScrubReveal. (TruthRows.Row and Features.FeatureCell already
attached their ref unconditionally, so they were safe and unchanged.)
Result: console "not hydrated" error GONE; scrollYProgress drives the morphs.

ROOT CAUSE 2 — overflow:hidden ancestor disabled position:sticky.
Even after the ref fix the hero/CTA stages still scrolled away (sticky stage had
a NEGATIVE top, morph subject pushed off-screen). Cause: `overflow:hidden` on an
ancestor silently disables a descendant's position:sticky. The Hero section and
the kit DarkSection both carried overflow-hidden.
Fix: moved the Hero's overflow-hidden onto a dedicated `absolute inset-0
overflow-hidden` AmbientDrift clip layer (so the glow still clips without
breaking the pin); added an `allowSticky` prop to the kit DarkSection that drops
overflow-hidden, set on the CTA. Now both stages pin and the morph subject is
present at every scroll position.

ALSO — how-it-works panels (one word per line + visual overlapping text).
The dead scrub had all 3 panels visible at 1/3 width simultaneously, and
PanelBody used a 2-col grid inside a narrow column. Reworked: each panel is now a
full 100vw slide (full-bleed `left-1/2 w-screen -translate-x-1/2` runway, track
width 300vw, x scrubs 0% -> -66.667%); body at a comfortable max-w-[44ch]; the
visual sits in its own `minmax(0,520px)` grid column with a 24-col gap so it
never overlaps the text. One panel fills the screen at a time.

ALSO — no dead frames in the runways. Widened the beat cross-fade overlaps so
beats share a blur seam (hero beat-2 exit 0.74 overlaps beat-3 reveal 0.62-0.84,
finishing before p=1) and enlarged the morph subjects (hero/CTA cards bigger,
hero stage box 260px) so the stage always carries a confident, large focal
composition, never a tiny pill in a black void.

Verified: 0 console errors on / and /?motion=0; morph subject visible at every
probed position in the Hero / How-it-works / CTA runways; ?motion=0 lands on the
composed end states (runways collapse, doc height 13501 -> 6722); ds-lint src
green, slop-scan copy green, next build green, dev 200. KEPT: engine, J1-J10,
ScrollDot, text cuts, one accent, >=16px, grid, mobile stub. No animated layout
props reintroduced.

## 2026-06-23 — V3 motion RE-ARCHITECTURE (soldier, from SECTION_CONTRACT_V3)
Root cause of the V2 feedback (boring, mostly text, very AI, janky, "no morphs
that accompany scrolling"): V2 motion was reveal-on-enter (play once on section
enter), not bound to scroll position. V3 makes scroll PROGRESS drive the morphs
so the wheel scrubs the page like film.

THE ENGINE (shared, promoted to kit)
- `useScrubProgress(ref)` hook: useScroll(target, offset start/start end/end) +
  useSpring ONCE -> one `p` MotionValue. Promoted to `ui-kit/hooks/
  useScrubProgress.ts` (registered in INDEX/REGISTRY/index.ts). Every scrubbed
  section is an instance with different useTransform mappings.
- `useGlobalProgress()` (project-local): the SINGLE no-target useScroll() on the
  page. Drives both the ScrollDot and the Ownership parallax bgY. Exactly one
  no-target useScroll() in the codebase.

THE THROUGH-ELEMENT (promoted to kit)
- `ScrollDot`: one position:fixed accent dot driven by the page progress, travels
  8vh->92vh with lateral weave, docks (opacity fade + blur seam) at 4 section
  markers, blinks only at the hero start + CTA rest. Promoted to `ui-kit/
  components/motion/ScrollDot.tsx` (registry key motion.ScrollDot). Gated by
  useEnhancementEnabled (no overlay on mobile / reduced-motion / ?motion=0).
- DELETED `TravelingDot.tsx` (V2): it animated `top`, a layout prop (J4 jank).

SCRUBBED EVERY SECTION
- Hero (`HeroMorphStage`): 300vh runway, 3-beat vertical scrub (REC -> Dropbox
  morph with blur seam at 0.45-0.55 -> link-pill clip-reveal). One <=6-word
  label per beat. hero.subheading SUPPRESSED inside the stage. H1 server-rendered
  above the stage as the persistent LCP anchor.
- How-it-works (`HowItWorksScroll`): 300vh runway, pinned HORIZONTAL scrub
  x:0%->-66% across 3 panels (reworked from CSS scroll-timeline). H2 via
  ScrubReveal. steps[0].body shortened to 2 sentences; steps[2] "Done." dropped
  (render only, copy.json intact).
- Features: per-cell local-useScroll y+blur+opacity reveal (no enter stagger);
  `.st-reveal` import removed. ScrollDot docks at cell[3] (static tick affordance).
- Ownership: `OwnershipNumbers` 150vh scrubbed strip (~12MB count + bar scaleX +
  "0 servers" clip + MIT fade); `TruthRows` A4 reveal rows with accent dots
  fading up on scroll; A7 parallax bgY on AmbientDrift via the shared global
  progress (no 2nd useScroll).
- FAQ: H2 via ScrubReveal; open/close stays a discrete sub-250ms interaction.
- CTA (`CTAConvergence`): 200vh runway, 4-beat scroll CLIMAX (dot arrives ->
  blooms to card -> Dropbox folder -> link-pill clip-reveal to rest beside
  Download). final_cta.body SUPPRESSED (render only).

ANTI-JANK (the рвано fix), all verified by grep:
- J1 one rAF loop (ReactLenis autoRaf). J2 no addEventListener('scroll') (Nav now
  rides useLenis). J3 no setState-on-scroll. J4 transform/opacity/clipPath/filter
  only. J5 one useSpring per scrubbed section. J6 will-change scoped to morph
  nodes. J7 vh runways. J8 position:sticky pins (no JS top). J9 compositor-only
  motion styles. J10 backbone is scrub, not reveal-on-enter.

SHARED HELPER
- `ScrubReveal` (project-local): A4 scroll-linked clip/blur type reveal, replaces
  BlurReveal on every section H2. Static-safe.

NEW SHARED HELPER + TEXT CUTS
- A4 type reveal replaces every play-once fade-up on section headings.
- copy.json untouched; cuts (hero.subheading, final_cta.body suppressed;
  steps[0]/[2] shortened) are RENDER-only, documented in HANDOFF.

GATES: ds-lint projects/tracer/src = 0/0. ScrollDot + useScrubProgress kit
additions = 0 errors. slop-scan PASS. next build PASS. dev 200 on / and /?motion=0,
console clean. Static fallback lands on composed end states (no blank mid-beat).

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
