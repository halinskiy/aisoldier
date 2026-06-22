# ACTIONS.md — Tracer redesign, fix round 1 (reconciled)

Reconciled from 7 parallel critics (judge, aesthete, minimalist, slophunter, completionist, kitwarden, factcheck). Deduplicated + prioritized. Executor: 3mpq-soldier (serial). Re-gate + re-critic after.

Strong passes to PRESERVE (do not regress): exact theme rhythm (dark hero -> light -> light -> dark ownership -> light FAQ -> dark CTA -> light footer, no cream flash); ONE accent #E5484D (DOM scan: zero blue/violet); hero rests on share-link + red tick (not "Recording"); ?motion=0 lands static on beat-5, CLS 0; mobile 500px no overflow; copy matches copy.json; zero console errors (favicon 404 only); features bento uniformity; type system (Geist/Hanken, big display).

---

## BLOCKING (gate-relevant, all must clear)

### A. Hero rest composition — THE centerpiece fix (judge FAIL3 + aesthete BLOCK1)
File: `src/components/HeroMorphStage.tsx`. Measured void: ~160px between CTA and folder, ~110px between the two pills, ~190px down to spec row; pills read as small disconnected debris on a 760px black stage. The "one continuous object" promise is invisible at rest and the "screenshot screen" bar is unmet.
Fix (compose the RESTING frame, not just the motion):
- At rest show ONE generous, centered share-link artifact (~480-560px wide) on a subtle elevated dark card (`white/[0.03]` fill, `white/10` hairline, `--radius-window`, ~20px/24px padding) directly under the CTA cluster (~72px gap).
- The `~/Dropbox/Tracer/` folder is a TRANSIENT the morph passes through (beat 3), NOT parked on the stage at rest. One focal point at rest.
- Lift the spec row to ~48px below the artifact so artifact + spec row read as one credibility cluster; stage bottom padding ~56-64px.
- Vertical rhythm: headline->sub 24px, sub->CTA 40px, CTA->artifact ~72px (one calm gap, no void).
- Optional: a faint 1px `white/10` vertical thread tracing the journey so "it travelled here" reads after motion ends.
- Keep beat-5 as the SSR/`?motion=0` rest state (already correct); recompose where it lands.

### B. Remove "CHAPTER 01/02/03" kicker (judge FAIL1 + minimalist BLOCK + slophunter #1 + completionist N2)
File: kit `ui-kit/components/section/StickyFeatureList.tsx:240,249,293`. Renders `Chapter {number}` at 12px uppercase, accent-red when active = banned eyebrow + sub-16px + accent-label, all at once.
Fix: gate the ordinal label behind an opt-in prop (e.g. `showOrdinal`, default OFF). Tracer (`HowItWorks.tsx`) renders steps as title + one line only. Do NOT recolor or resize — remove it. Non-breaking for other kit consumers (default keeps current behavior OR flip default off + audit; prefer default off since it is a doctrine floor break).

### C. Sub-16px in kit components (judge FAIL2 + slophunter #2 + completionist B4)
File: kit `ui-kit/components/section/FooterEditorial.tsx:101` (sitemap links 14px) and `:134` (legal + "Back to top" 14px) -> raise to 16px (uppercase tracking may stay). StickyFeatureList covered by B.
NOTE the gate gap: ds-lint scoped to `projects/tracer/src` MISSED these because they live in `ui-kit/`. After fixing, run ds-lint against the kit too: `node tools/ds-lint.mjs ui-kit/components`.

### D. Footer external links missing target/rel (kitwarden BLOCK2 + completionist B1)
File: kit `FooterEditorial.tsx` + `src/components/sections/Footer.tsx`. GitHub/MIT/Releases/Agency open same-tab, no `rel=noopener`.
Fix: add `external?: boolean` to `FooterLink`; render external links via the already-imported `TextLink` (handles target+rel) or emit `target="_blank" rel="noopener noreferrer"`. Pass the `external` flag through from copy.json.

### E. Mono path not in Geist Mono in S3 (kitwarden #3 + completionist B2)
File: kit `StickyFeatureList.tsx` (body typed `string`) + `src/components/sections/HowItWorks.tsx`. The `~/Dropbox/Tracer/` path renders in Hanken, not Geist Mono.
Fix: widen `StickyFeatureItemData.body` to `string | ReactNode` (non-breaking; `<p>{body}</p>` already accepts ReactNode). Tracer wraps the path in `<span className="font-[family-name:var(--font-mono)]">~/Dropbox/Tracer/</span>`.

### F. Favicon 404 (completionist B3)
Add `src/app/icon.tsx` (Next.js auto-favicon) or `src/app/icon.svg` derived from `NoCornyMark` (squiggle + red dot). Kills the 404 / wrong tab mark ("1 Issue" dev indicator).

### G. Factcheck: drop unverifiable "local" (factcheck BLOCK)
File: `content/copy.json` FAQ "How do the AI titles and transcripts work?": "small local language model" -> "small language model". §1 says only "small LM"; "local" asserts on-device inference not in the source.

---

## SHOULD-FIX (same round)

### H. Nav: prefer extending kit NavSticky over the bespoke fork (kitwarden BLOCK1; completionist=advisory)
RESOLUTION: kitwarden owns reuse; the bespoke `Nav` differs from `NavSticky` only by two missing props. PREFERRED: add `transparentRest?: boolean` (transparent resting bg, no cream tint, scroll-to-backdrop logic unchanged) + `secondaryCta?: NavCta` to `NavSticky`, pass `logoNode={<NoCornyMark/>}`, delete bespoke `Nav`. Preserve the scroll color-inversion (ink-on-light -> paper-on-dark). If migrating regresses the inversion, KEEP bespoke Nav and document why in DECISIONS.md. Either way also add the nav active-link state (completionist S1): IntersectionObserver on #how/#features/#ownership/#faq toggling `aria-current` + `font-semibold` + accent underline.

### I. How-it-works pinned visual too empty/faint (aesthete #3 + judge WARN)
File: `src/components/MorphPanels.tsx`. The recorder/Dropbox/link mini-frame occupies ~20% of the dot-grid card at low opacity. Scale each beat visual to fill ~50-60% of the panel, full opacity, raise contrast vs the dotted surface. Three confident legible frames, not ghosts.

### J. Normalize section vertical padding + kill ownership trailing void (aesthete #4)
Dark sections read ~1.4x taller than content needs; Ownership has ~300px empty black under the last truth row. Normalize dark+light section content padding to one scale (~120px top/bottom); closing hairline ~64px below the last ownership row.

### K. Ownership truth-row geometry (aesthete #5)
File: `src/components/sections/Ownership.tsx`. Inconsistent label->detail gutter. Fix label column to ~280px (or cap detail measure ~62ch) so all four details share one left edge + right boundary. Keep the accent dot before each label.

### L. Raw hex/rgba outside tokens (slophunter #3 + judge WARN)
Files: `HeroMorphStage.tsx` (rgba white/black shadows, `#fff` strokes), `MorphPanels.tsx:90/92` (`#fff`), `globals.css:42` (`#333` dot-grid-dark), `Nav.tsx:35` (`rgba(255,255,255,0.8)`). Add tokens (on-dark glass, dark shadow, dot-grid-dark, on-dark stroke) to `tokens.css`; SVG strokes -> `currentColor` or `var(--color-on-dark)`.

### M. Drop glassmorphism on the hero recorder pill (slophunter #4)
File: `HeroMorphStage.tsx:181-182` `backdropFilter: blur(8px)`. Remove; keep hairline border + solid-ish dark fill (native-honest, not frosted). The sticky nav frosted bar may stay (conventional).

### N. Footer: off-copy line + flattened columns (judge WARN)
Remove the invented "Made by NoCorny Agency, Kyiv" line (not in copy.json) or wire it via copy `builtWith`. Restore the 3 labeled columns (Product / Open source / NoCorny) per contract S7b if `FooterEditorial` supports labeled columns; else document the flat-sitemap deviation in DECISIONS.md.

### O. Verify ?motion=0 gates the Features `.st-reveal` (completionist S2)
Confirm `ui-kit/components/motion/scroll-timeline-reveal.css` gates on `html[data-motion="off"]` (not only prefers-reduced-motion). If missing, add the gate.

---

## NICE / ADVISORY (do if cheap)

- P. Footer "Back to top" `white-space:nowrap` + baseline-align with legal line (aesthete #6).
- Q. MobileStub Download button: add `focus-visible:ring-2 ring-[var(--color-accent)] ring-offset-2` (completionist N1).
- R. Tighten Ownership subheading to one Loom clause (minimalist advisory): "Loom keeps your recordings on Loom's servers. Tracer hands the file to your Dropbox and gets out of the way."
- S. Loom free-plan figures (factcheck advisory): verify loom.com/pricing; if not confirmable, soften to durable wording ("The free plan has video count and length limits, and your viewer page carries Loom branding"). Do not ship volatile unverified specifics.
- (Skip, sanctioned/deferred: footer text wordmark fallback; DarkSection legacy inspector attrs; headline line-break is optional micro-tune.)

---

## Ship gate
Two consecutive clean rounds: deterministic gates green (ds-lint over BOTH `projects/tracer/src` AND `ui-kit/components`, slop-scan, shoot) + zero blocking critic items. Re-run judge + aesthete + slophunter + minimalist after this round.
