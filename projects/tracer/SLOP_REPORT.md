# SLOP_REPORT -- Tracer (NoCorny) redesign

Auditor: 3mpq-slophunter. Live: http://localhost:3107 @ 1440px + 500px.
Reference: research/ai-design-slop.md. Driven with REAL wall-clock scroll
(CDP, no virtual-time) so framer scroll-in sections render and rest before
each capture. Captures: /tmp/tracer-audit/.

## Round 3 (re-audit of the V2 creative rebuild)

### Verdict: CLEAN

Deterministic gates green:
- `ds-lint projects/tracer/src` -> 0 errors, 0 warnings (22 files)
- `slop-scan projects/tracer/src` -> PASS (0 blocking signals)
- `slop-scan content/copy.json` -> PASS
- Rendered kit set (AmbientDrift, BlurReveal, useEnhancementEnabled,
  BentoGrid, DarkSection, FooterEditorial, SpecStrip) -> 0 errors. 6 WARNs,
  all em-dashes inside JSDoc docblocks (BentoGrid:63/98, BlurReveal:37/63/93,
  useEnhancementEnabled:6) -- code comments, never rendered. Kit-hygiene
  cleanup, not a Tracer offender.

### Brief items confirmed

1. **Dev grid overlay (pink stripes): GONE from the render.** `GridOverlay`
   is imported NOWHERE (page.tsx / layout.tsx do not mount it). Live DOM check:
   `.grid-overlay` absent, no "grid on/off" button. The file
   (`components/dev/GridOverlay.tsx`) is now orphaned dead code -- safe to
   delete in the next refactor, but it does not render. The floating circle in
   the bottom-left of the desktop shots is the Next.js dev route-status
   indicator (injected by `next dev`), not page content; absent in prod.

2. **AmbientDrift is tasteful, not a blob/mesh tell.** Three instances, one
   per dark stage (Hero right margin top 18%, Ownership left 6%, FinalCta left
   12%). Opacity 0.10/0.10/0.11 (clamped <=0.12 in-component), duration
   32/34/30s (clamped >=20), translate-only drift, static opacity (no breathe),
   z-index:0 behind content that sits at z-[1], pointer-events:none. In the
   render it reads as a faint warm vignette in the margin (visible only as a
   soft glow at the hero top edge and a center-left wash in FinalCta), never a
   defined orb and never crossing a text edge. Halts on reduced-motion /
   ?motion=0. This is the sanctioned atmosphere loop, not gradient-mesh slop.

3. **Hero background is a near-solid dark studio stage.** `--color-ink-surface`
   + `dot-grid-dark` + the faint drift. Zero purple, zero multi-hue mesh, zero
   floating colored orb. The recorder pill is a SOLID bordered surface
   (`on-dark-glass-strong` + hairline + shadow), NOT a backdrop-blur glass card.

4. **One accent, no AI color tells.** Only `#e5484d` and its shades. Zero
   purple/violet/indigo, zero gradient text, zero gradient buttons, zero emoji
   icons. The Dropbox glyph is monochrome currentColor (not brand blue). Border
   on every surface (cards, pills, FAQ rows, footer columns). The only
   `backdrop-filter` is Nav's scrolled-state scrim over a solid token bg + real
   border -- the canonical functional frosted nav, not stacked glass.

5. **Motion is demonstrative, not decorative.** Hero morph (record -> Dropbox
   -> share link) plays once and rests on the link card. TruthRail's red dot
   travels down the rail on scroll-in, lights each guarantee, dissolves, rests
   with all four lit. CTAConvergence re-stages the chain once into the live
   link pill beside Download, then rests. Every `repeat: Infinity` is the record
   dot's live pulse (Hero pill, plus the traveling dot's halo bounded to its
   in-motion beat) -- the one sanctioned live-indicator loop. No identical
   fade-everything, no perpetual float, no scroll-jack.

## Seven-front scorecard (round 3)

| Front                       | R2 | R3 | Notes |
|-----------------------------|----|----|-------|
| Structure                   | 86 | 90 | Own narrative spine: dark morph hero -> light scroll-rail how-it-works -> Swiss feature grid -> dark ownership rail -> two-col FAQ -> dark CTA convergence -> big-type footer. One focal point per screen; light/dark/light rhythm. Not the centered-hero/3-card template. |
| Type                        | 84 | 86 | Geist (display) + Hanken (body) + Geist Mono for path/link strings only. All >=16px (smallest text token 16px; every 1x-px literal is a non-text dimension). Big display clamps. No gradient text, no Title Case soup. |
| Color                       | 90 | 92 | One accent #E5484D + shades. Zero purple/gradient/mesh/orb. Gradients limited to dot-grid + 1px hairline + the single-accent ambient radial. |
| Surface / decoration        | 86 | 90 | Borders on every surface; shadow secondary. Recorder pill + capture/folder cards are solid bordered, not backdrop-blur glass. Nav blur is the one functional scrim. radius via tokens (window/button/pill), no rounded-3xl soup. |
| Iconography / illustration  | 86 | 88 | Custom NoCorny mark (waveform + record dot), monochrome Dropbox glyph, currentColor copy/tick SVGs. No emoji, no stock 3D, consistent set. |
| Motion                      | 86 | 90 | AirBnB soft-spring morphs, choreographed + staggered, play once then rest. AmbientDrift = clamped atmosphere. Infinite loops only on the live record dot. Reduced-motion / ?motion=0 land statically on rest state, CLS 0. |
| Content authenticity        | 88 | 88 | Real product facts (own Dropbox, ~/Dropbox/Tracer/, tracer.nocorny.com/v/k7r2-mx9p, MIT, ~12MB, macOS-only). No fake logos/stats/avatars/testimonials. Copy clean (slop-scan PASS). |

No front <= 50, no three fronts <= 70 -> **CLEAN**.

## Mobile (500px honest width)

`document.body.scrollWidth === clientWidth === 500` (no overflow). Deliberate
single-screen stub: NoCorny mark, "macOS only. Download on your desktop.",
one Download button. Per the desktop-only mandate.

## Cross-summon

None required. Copy passed slop-scan + naturalist-domain checks clean; no fake
claims; reduced-motion + mobile-stub fallbacks present.

## Non-blocking cleanup notes (for deslopper / next refactor, not offenders)

1. `projects/tracer/src/components/dev/GridOverlay.tsx` -- orphaned dead code
   (the V2 alignment overlay). Not mounted, not rendered. Delete it and its
   `.grid-overlay*` rules in globals.css to remove the pink-stripe machinery
   entirely. Fix: rm the file + the CSS block.
2. Em-dashes in JSDoc docblocks of rendered kit components (BentoGrid:63/98,
   BlurReveal:37/63/93, useEnhancementEnabled:6). Not user-facing; ds-lint WARN
   not ERROR. Fix: swap "--" for ASCII in those comments during kit hygiene.
