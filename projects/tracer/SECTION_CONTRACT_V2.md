# SECTION_CONTRACT_V2 — Tracer by NoCorny (creative escalation delta)

Owner: 3mpq-architect
Date: 2026-06-22
Round: V2 escalation — v1 PASSED, raising the whole page to the hero's ambition.
Source files: DIRECTION_V2.md, research/TRENDS_V2.md, SECTION_CONTRACT.md (v1 locked baseline),
              ui-kit/INDEX.md, ui-kit/REGISTRY.json, content/copy.json.
Hand to: 3mpq-prompter -> 3mpq-soldier (serial build).

This is a DELTA. Every v1 acceptance check carries forward and is still blocking.
Lines below OVERRIDE or EXTEND specific v1 items. Where a v1 line is not mentioned it stands unchanged.

---

## 0. What v1 got right (LOCKED, do not touch)

- Accent `#E5484D`, single, no purple, no gradients.
- Geist + Hanken Grotesk + Geist Mono (mono for paths/links only).
- Four type sizes: display-xl, display-md, body-lg, body. All >= 16px. Zero exceptions.
- Token layer: all hex lives in `tokens.css` only. `var(--)` everywhere else.
- Light -> DARK -> light -> light -> DARK -> light -> DARK -> light section rhythm.
- 7-section order: Nav, Hero, How-it-works, Features, Ownership, FAQ, Final CTA + Footer.
- Mobile single-screen stub. No real responsive layout. Hero morph does not run on mobile.
- `useEnhancementEnabled` gates all heavy motion. Reduced-motion + `?motion=0` land static.
- `SpecStrip`, `HeroMorphStage` introduced in v1, both promoted to kit or noted as local.
- v1 acceptance checks on Nav, Footer, mobile stub: all intact.

---

## 1. THE ONE GRID SYSTEM (hard contract, blocking)

This is the primary structural fix. Every section content must align to a single grid.
Define ONCE in `src/styles/tokens.css` (or the project `@theme` block).

```css
/* Grid tokens — add to the existing tokens.css block */
--grid-max:    1280px;    /* content column ceiling, centered in the 1440 viewport */
--grid-gutter: 64px;      /* outer left + right page gutter, identical on every section */
--grid-cols:   12;        /* 12 equal column tracks */
--grid-colgap: 24px;      /* gap between columns */
```

### The `.grid-page` container (ONE definition, every section uses it)

```tsx
/* src/components/GridPage.tsx — promote to ui-kit after build if reused on a second project */
<div
  className="grid-page"
  style={{
    maxWidth: 'var(--grid-max)',
    marginInline: 'auto',
    paddingInline: 'var(--grid-gutter)',
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    columnGap: 'var(--grid-colgap)',
  }}
>
  {children}
</div>
```

Rules (all blocking):
- One container class `.grid-page` defined once. No section may declare its own max-width or narrower padding.
- A section's BACKGROUND (the dark stages: Hero, Ownership, CTA) bleeds edge-to-edge of the viewport. Its CONTENT still lives inside `.grid-page` on the same tracks.
- No `mx-auto max-w-[800px]` or any per-section narrow shell anywhere. The narrowing is done by column spans only.

### Column spans (readability controlled by span, not by max-width)

| Section | Content span |
|---|---|
| Hero headline + sub | cols 1-8 |
| Hero morph stage | cols 1-12 (full) |
| How-it-works H2 | cols 1-7 |
| How-it-works scroll panels | cols 1-12 |
| Features bento | cols 1-12 |
| Ownership H2 + sub | cols 1-7 |
| Ownership truth rows | cols 1-12 (two-col within: label cols 1-6, detail cols 7-12) |
| FAQ H2 | cols 1-7 |
| FAQ two-col accordion | cols 1-12 (column A = rows in cols 1-6, column B = rows in cols 7-12) |
| CTA headline | cols 1-8 |
| CTA convergence composition + button + link pill | cols 1-12 |

### Grid overlay (dev-only, toggle)

- A faint 12-column guide overlay (CSS-only or a thin React dev-only component) is ON for the first V2 build session so the user can verify alignment visually at 1440px. It is toggled OFF via a corner button after sign-off. The toggle persists in localStorage.
- Implementation: a fixed `pointer-events-none` grid overlay with 12 columns matching `--grid-max` / `--grid-gutter` / `--grid-colgap`, opacity 0.08, accent-red columns. Hide in production behind `process.env.NODE_ENV !== 'production'` or the toggle.

### Grid audit acceptance gate (blocking, verifiable in the rendered page)

- [ ] Every section's left content edge aligns to the `.grid-page` column-1 left edge at 1440px viewport.
- [ ] Every section's right content edge aligns to column-12 right edge (or an honest span boundary) at 1440px viewport.
- [ ] No section has its own `max-width` constraint smaller than `--grid-max`.
- [ ] No section has its own `padding-inline` value that differs from `--grid-gutter`.
- [ ] Dark backgrounds (Hero, Ownership, CTA) bleed to 100vw; their inner `.grid-page` wrapper is still present and on-spec.
- [ ] The grid overlay toggle is visible and functional in dev; absent in production build.

---

## 2. MOTION CONTRACT (V2, blocking — overrides and extends v1 motion rules)

### Permitted continuous loops (exactly two on the whole page, no more)

1. The live record-red dot pulse (scale 1 -> 1.18 -> 1, ~1.2s, ease-in-out). Born in the Hero, the ONLY genuine live indicator. Also present in the CTA block B2 beat 1.
2. One ambient drift layer per dark stage (Hero, Ownership, CTA). Spec below. Total: three instances of the drift (one per dark stage), but each is the same single primitive. The drift is ONE loop type with three placements; it is not "three extra loops."

### Ambient drift spec (blocking constraints)

- A single slow, heavily-blurred, low-opacity red glow blob (or 2-3 faint dot-grid shapes) drifts behind the section content.
- Opacity: <= 0.12. Strictly enforced; any value above 0.12 is a blocking failure.
- Cycle duration: >= 20s. (20-40s range recommended.)
- Blur: heavy. The blob must read as atmosphere, never as a shape.
- Position: behind content, in margins or negative space. NEVER crosses a text edge.
- Pauses fully under `prefers-reduced-motion` and `?motion=0`.
- Applied to: Hero dark stage, Ownership dark stage, CTA dark stage. NOT applied to any light section (How-it-works may have optional faint drift only if it does not compete with the scroll-scrubbed morph — default is off there).
- NEW PRIMITIVE PROPOSED: `AmbientDrift` — see section 6.

### Blur-morph (required on every state transition where one object becomes another)

- Apply `filter: blur(2px)` during the cross-fade between states.
- Technique: translate + content swap + `filter: blur(2px)` cross-fade. NOT scale-from-0.
- Scale floor: if scale is used at all on an enter or exit, start/end at >= 0.92 for section morphs, >= 0.90 (absolute minimum) for micro-interactions. Never 0. Never collapses to a speck.
- This applies to: Hero beats 1-5, CTA B2 beats 1-4, How-it-works panel transitions, Features cell entry, FAQ open-state ring -> dot morph, Ownership traveling-dot hand-offs.

### Timing

- Big beats (hero chain, CTA convergence): `--ease-spring` (`cubic-bezier(0.34,1.42,0.5,1)`), 0.4-0.9s.
- State nudges (hover, copy -> tick, FAQ open/close, nav blur-in): `--ease-smooth` (`cubic-bezier(0.2,0.8,0.2,1)`), < 300ms.
- `:active` on all buttons: `scale(0.97)`.
- `transform-origin` at the trigger point.

### Play-once rule

Every entrance morph and scroll-triggered section animation plays ONCE on load or first scroll-into-view, then rests. No content area loop except the two listed above.

### Reduced-motion + `?motion=0`

Every section lands on its composed final (rest) state:
- Dot frozen. Timer frozen at final value. Drift off.
- Hero: beat-5 static (link pill + red tick + Dropbox folder + path string, all legible).
- CTA: rest state (headline + link pill beside Download button + note line, all legible).
- All meaning preserved without any motion.

---

## 3. PER-SECTION UPGRADE DELTA

### S1 — Nav (DELTA on v1)

**V2 additions only. All v1 Nav acceptance checks remain.**

#### Dot thread — squiggle terminal dot
- The NoCorny squiggle SVG's terminal dot is colored `--color-accent`. It pulses ONCE (scale 1 -> 1.1 -> 1) on first paint, then rests permanently. This is not a loop; it is a one-shot birth signal.
- Reduced-motion: no pulse, dot renders at full red statically.

#### Dot thread — active section sliding dot marker
- A small `--color-accent` dot (6-8px, `--radius-pill`) travels between the active nav link as the user scrolls sections into view. Implemented via IntersectionObserver on section IDs; the dot position is a CSS `translate` morph (layout morph, `--ease-smooth`, 200ms).
- Implement ONLY if IntersectionObserver approach is clean and does not add more than ~20 lines. If it would require a state management refactor, skip and note in DECISIONS.md.
- Reduced-motion: the dot appears at the active link statically, no travel animation.

#### Component map (V2 delta)
| Element | Kit component | Note |
|---|---|---|
| Active-section dot marker | bespoke inline (project-local) | 6-8px red dot, absolute-positioned, translate morph between link positions. Too specific to promote to kit. |

#### Acceptance checks (V2 additions)
- [ ] Squiggle terminal dot is `--color-accent`.
- [ ] One-shot pulse on first paint; dot rests after. No permanent loop in nav.
- [ ] Active-section sliding dot (if implemented): 6-8px, accent, translate morph only, `--ease-smooth`.
- [ ] Reduced-motion: dot static at active link; no pulse.

---

### S2 — Hero (DELTA on v1)

**The 5-beat chain is KEPT. V2 fixes the "half-static / shrink to tiny" complaints.**

#### A. Alive from frame 1 (required, blocking)

Three things must be moving the instant the hero paints, BEFORE beat 1 fully settles:

1. **Record-red dot pulse.** Already the only permitted infinite loop. Must begin on paint, not on beat 2. Gate only with `useEnhancementEnabled`; do not defer behind a `setTimeout`.
2. **REC timer tick.** The `00:00 -> 00:04` Geist Mono counter begins ticking from frame 1, alongside the dot. Stops at beat 2 (stop-record trigger). Ticking: increment the seconds digit every ~800ms using `setInterval` gated behind `useEnhancementEnabled`.
3. **Ambient drift.** The `AmbientDrift` layer (section 6) is already drifting behind the stage on paint.

Zero dead-air accepted. If the user's eye can question "is this static?", beat 1 has not loaded fast enough.

#### B. Beat 2 re-spec (no more "shrinks to a small travelling capture")

Beat 2 is replaced:
- The REC pill's content (waveform + frame display) morphs INTO a **file-capture card** of comparable visual footprint. The card slides toward the Dropbox folder. Technique: translate + content swap + `filter: blur(2px)` seam. The pill does not shrink; it becomes.
- The file-capture card must hold a legible, confident size. No dimension may drop below 80% of the pill's original width/height.
- The red dot does not "detach and lead." The dot IS the object's accent; it stays on the card as the card travels.

#### C. Scale floor (blocking)

Any beat or micro-morph that uses scale must start/end at >= 0.92. Preferred: no scale on big beats. Use translate + blur + content swap instead.

#### V2 acceptance checks (additions to v1 checklist)
- [ ] Red dot pulse begins before the chain's first auto-trigger. Verify via DevTools timeline: dot is animating at T+0.
- [ ] Timer ticks from `00:00` on frame 1. Geist Mono 16px. Stops at beat 2.
- [ ] `AmbientDrift` is rendering and drifting on hero paint (opacity <= 0.12, >= 20s cycle, never crosses headline or sub text).
- [ ] Beat 2 is a file-capture card morph, not a shrink-to-small condensation. Card footprint >= 80% of beat-1 pill size.
- [ ] No beat uses scale below 0.92. Every enter/exit is translate + blur + content swap where possible.
- [ ] Reduced-motion: dot frozen, timer frozen at `00:04`, drift off. Beat-5 static state rendered.

---

### S3 — How it works (FULL UPGRADE — scroll-scrubbed re-stage, replaces v1 3-card StickyFeatureList approach)

**This section is REPLACED. The StickyFeatureList approach is retired for V2.**

#### Purpose
The hero chain re-staged at reading pace: one full-width beat panel in view at a time, scrubbed by scroll position. Three panels: record -> lands in `~/Dropbox/Tracer/` -> link in clipboard.

#### The dot thread
The record-red dot is the through-line of all three panels:
- Panel 1 (record): the pulsing REC dot.
- Panel 2 (Dropbox): the same dot becomes the Dropbox sync dot (blur-morph hand-off as user scrolls to panel 2).
- Panel 3 (link): the same dot becomes the copied-tick checkmark (blur-morph hand-off as user scrolls to panel 3).
Same object, three honest jobs.

#### Scroll implementation
- Prefer native CSS `animation-timeline: view()` on each panel (off main thread, protects LCP). Use Framer `useScroll` only for behavior CSS cannot express.
- Each panel is a full-width section that scrolls into view and triggers a blur-morph entrance (>= 0.92 scale). Panels play their entrance once, rest.
- Each panel: full 1-12 grid columns.
- The pinned morph visual (the large panel visual on the left or centered) cross-fades as the user scrolls to the next panel. The dot morph hand-off is the visual continuity.

#### Component map
| Element | Kit component | Note |
|---|---|---|
| Section H2 | bespoke heading | display-md, Geist 600, ink |
| Scroll-panel container | bespoke (project-local) | NOT StickyFeatureList. Three full-width panels, scroll-driven. Named `HowItWorksScroll.tsx`. |
| Panel visual (each) | bespoke | Reuse morph-phase visuals from HeroMorphStage at reading-pace scale. Static frames that cross-fade. |
| Panel dot hand-off | bespoke | The dot element travels between panels via translate + blur cross-fade on scroll progress. |
| Panel text | bespoke | Title (Geist 600, body-lg/18px) + body line (Hanken 400, 16px). |
| Section-enter H2 | `BlurReveal` | wraps H2 only |
| Scroll-driven reveals | `scroll-timeline-reveal.css` `.st-reveal` | for panel text labels on entry |

**StickyFeatureList retirement note.** The kit component remains correct for pinned-left-visual / scrolling-right-list patterns (e.g. feature comparisons). For this section, the scroll-scrubbed re-stage with dot hand-off is a distinct, bespoke scroll composition. Do NOT force it into StickyFeatureList.

#### Minimum structure (ceiling)
H2 ("Record, own, share.") + 3 panels, each: title + one body line + a full-width visual. No subheading on the section. No icons. No numbered badges.

#### Drift
Optional: faint ambient drift behind the pinned visual. Default OFF if it competes with the scrubbed morph. Decision: soldier evaluates visually; documents in DECISIONS.md.

#### Acceptance checks
- [ ] `HowItWorksScroll.tsx` is bespoke, project-local. StickyFeatureList NOT used in this section.
- [ ] Three panels, each on cols 1-12.
- [ ] Dot hand-off across panels: panel 1 = REC dot, panel 2 = sync dot, panel 3 = tick. Blur-morph on transition.
- [ ] Scroll-driven: CSS `animation-timeline: view()` as primary implementation.
- [ ] Panel entrances: >= 0.92 scale, `--ease-spring`, plays once.
- [ ] copy.json `how_it_works.steps[0..2]` titles and bodies match exactly.
- [ ] Path string `~/Dropbox/Tracer/` in panel 2 uses Geist Mono inline span.
- [ ] H2 = "Record, own, share." No subheading.
- [ ] No icons.
- [ ] Reduced-motion: all three panels render in their final/rest state simultaneously (dot as tick on panel 3 statically visible).
- [ ] All text >= 16px.

---

### S4 — Features bento (DELTA on v1)

**V1 is mostly correct. V2 adds the layout-morph-into-slots entrance and the one live cell.**

#### V2 entrance: cells arrange into slots on scroll-in
- Each cell springs from a slightly off-grid position (translate 16px down + scale 0.94) into its slot, staggered, on scroll-into-view.
- Use Framer `layout` animation + stagger (0.06s per cell) OR `scroll-timeline-reveal.css` `.st-reveal-1..4` for the first 4 + manual delay on cells 5-6.
- Enter scale starts at 0.94 (>= 0.92 floor satisfied). Soft spring `--ease-spring`. Plays ONCE, rests.
- Do NOT use `scale(0)` or opacity-only fade as the entrance.

#### V2 live cell: "One click to share" copy -> tick morph
- Exactly ONE cell (the "One click to share" cell, features.items[3]) holds a small copy affordance that morphs to a record-red tick on scroll-into-view. Plays once, rests. Gated by `useEnhancementEnabled`.
- The tick IS the dot motif's appearance in this section.
- The morph: copy icon (`text-[--color-text-subtle]`) blur-morphs to a record-red checkmark (`--color-accent`). `--ease-smooth`, < 250ms. No loop.

#### Component map (V2 delta — additions only)
| Element | Kit component | Note |
|---|---|---|
| Cell layout-arrange entrance | Framer `motion.div` with `layout` + stagger | bespoke per-cell, project-local |
| Live copy->tick morph (one cell) | bespoke inline within BentoCell | a two-state icon swap with blur-morph; too micro to promote |

#### V2 acceptance checks (additions to v1)
- [ ] Cells enter from translate+scale(0.94), staggered, soft spring. Not a flat fade.
- [ ] Enter scale >= 0.94, never < 0.92.
- [ ] Exactly ONE cell has the live morph (features.items[3], "One click to share").
- [ ] Live cell: copy -> tick blur-morph plays once on scroll-into-view, rests. Gated by `useEnhancementEnabled`.
- [ ] Tick color is `--color-accent`. No other colored element in the bento.
- [ ] Reduced-motion: cells render at rest position statically; tick shown in final (ticked) state.

---

### S5 — Ownership (FULL UPGRADE — traveling-dot rail replaces static BlurReveal rows)

**The section heading, subheading, and truth-row copy are unchanged from v1. The entrance animation is replaced.**

#### The traveling-dot entrance (the dot as ownership seal)

On scroll-into-view, the sequence:
1. A single record-red dot enters at the heading level (from above or from the heading's left edge), pulsing live.
2. The dot travels DOWN the left rail of the four truth rows. It is a single element, `position: absolute`, animating `top` value via Framer `animate` with `--ease-spring`.
3. As the dot passes each row, that row's leading dot (a small ring glyph, `--color-text-subtle`) lights to full red (`--color-accent`). The hand-off: the traveling dot blur-morphs its opacity to the row's static dot, which fills to accent. The traveling dot continues to the next row.
4. After passing row 4, the traveling dot dissolves (opacity 0, `--ease-smooth`, 200ms). All four row dots are now lit red.
5. Plays ONCE. Rests with all four dots lit.

Rows blur-reveal staggered BEHIND the traveling dot (each row reveals as the dot reaches it, using BlurReveal with a computed delay matched to the dot's travel time).

- Reduced-motion: skip the travel entirely. Render all four rows with dots lit statically. BlurReveal renders children instantly (kit handles).

#### Component map (V2 delta)
| Element | Kit component | Note |
|---|---|---|
| Traveling dot element | bespoke (project-local) | `TravelingDot.tsx` — see section 6 for kit promotion decision |
| Row leading dot (lit state) | bespoke inline | simple 8px circle, two states: ring (`border accent-subtle`) -> filled (`bg-accent`) |
| Row blur-reveal (stagger) | `BlurReveal` | delay prop matched to traveling dot arrival time per row |
| Ambient drift | `AmbientDrift` | same instance spec as Hero; <= 0.12 opacity, >= 20s cycle, never crosses text |

#### Acceptance checks (V2 additions to v1)
- [ ] Traveling dot animates down the left rail, lighting each row dot as it passes.
- [ ] Dot travel uses `--ease-spring`. Each row hand-off is a blur-morph (traveling dot dims, row dot fills to accent).
- [ ] Four truth rows reveal staggered with BlurReveal, timed to match dot arrival.
- [ ] After sequence: traveling dot gone, all four row dots lit red, section rests.
- [ ] `AmbientDrift` behind the dark stage: opacity <= 0.12, >= 20s, no text crossings.
- [ ] Reduced-motion: all rows and dots rendered static at final state. No travel animation.
- [ ] All v1 S5 copy + component checks intact (DarkSection, SpecStrip/vertical, heading, subheading, 4 truth rows).

---

### S6 — FAQ (FULL UPGRADE — full-width two-column accordion, dot as open marker)

**The v1 FAQAccordion single-column approach is REPLACED. This is the headline grid fix.**

#### Grid fix
- Full 1-12, two columns. Column A = questions 1-4 (or 1, 3, 5, 7 if split by odd/even) in cols 1-6. Column B = questions 4-7 (or 2, 4, 6 if by odd/even) in cols 7-12. Soldier picks the split (by sequence or by odd/even) that produces the most even visual weight; documents choice in DECISIONS.md.
- Hairline vertical divider between cols 6 and 7 (`--color-border`, 1px).
- Hairline horizontal divider between rows (`--color-border`, 1px).
- 16-24px internal padding on the open answer.
- No centered 800px strip. No per-column max-width.

#### The open-state marker: hollow ring -> filled record-red dot
- Closed row: a small hollow ring (~8px, border 1.5px, `--color-border-strong`) to the left of the question text.
- Opening: the ring morphs to a filled record-red dot (`--color-accent`, `--radius-pill`). Content + blur morph, `--ease-smooth`, < 250ms. The answer height-expands with a brief `filter: blur(1px)` on the seam as it opens.
- Closing: reverses. Ring back to hollow.
- ONE dot lit at a time (single-open mode preserved). The visual mirrors the hero's "one focal point" principle.
- Implementation: native `<details>/<summary>` for accessibility; Framer AnimatePresence for height + blur seam animation.

#### Component map
| Element | Kit component | Note |
|---|---|---|
| Two-column accordion shell | bespoke (project-local) — `FAQTwoCol.tsx` | The v1 `FAQAccordion` kit component is single-column. A two-column wrapper with the dot-marker behavior and the divider grid is a distinct enough composition to warrant a new project-local component. |
| Accordion item state | native `<details>/<summary>` + Framer AnimatePresence | open/close; kit FAQAccordion logic can be extracted for reference |
| Open-state ring -> dot | bespoke inline | two-state morph inside the summary trigger; simple enough to inline |
| Section-enter H2 | `BlurReveal` | H2 only |

**FAQAccordion kit note.** The existing `FAQAccordion` is single-column and does not support the two-column grid with the dot-marker. Do NOT fork the kit component. Build `FAQTwoCol.tsx` project-local. If this two-column pattern is needed on a second project, promote it to the kit then.

#### Minimum structure
H2 ("Questions.") + 7 items split across two columns. No subheading. No eyebrow. No drift.

#### Acceptance checks (full replacement of v1 S6)
- [ ] FAQ content spans cols 1-12. No centered-narrow strip. Blocking failure if any per-column max-width is set.
- [ ] Column A and Column B each receive a correct share of the 7 FAQ items. Soldier documents the split in DECISIONS.md.
- [ ] Hairline vertical divider between columns. Hairline horizontal divider between rows.
- [ ] Closed state: hollow ring to left of question text.
- [ ] Open state: filled record-red dot (`--color-accent`). Blur-morph transition < 250ms.
- [ ] ONE item open at a time (single-open behavior).
- [ ] Answer height-expands with `filter: blur(1px)` seam via AnimatePresence.
- [ ] `FAQAccordion` kit component NOT used here (it is single-column). `FAQTwoCol.tsx` is project-local.
- [ ] Native `<details>/<summary>` for accessibility. Focus-visible: 2px accent outline on trigger.
- [ ] copy.json `faq.items[0..6]` — all 7 Q+A pairs rendered. No dashes, no bullets in answers.
- [ ] H2 = "Questions." No subheading.
- [ ] All text >= 16px.
- [ ] Reduced-motion: all items in closed state (or first item open statically). Ring/dot renders at final state of any open item; no morph.

---

### S7a — Final CTA: Block B2 (FULL REPLACEMENT — convergence composition)

**The v1 BlurReveal band is REPLACED by the B2 convergence composition.**

#### Stage
- DARK full-bleed (`DarkSection`, same token contract as Hero + Ownership).
- `AmbientDrift` behind the stage: same spec as other dark stages.
- Content on `.grid-page` cols 1-12.

#### The B2 convergence: 4 beats, plays ONCE on scroll-into-view, then rests

**Beat 1 — dot arrives.**
- The record-red dot enters the block from the heading side (translates in from left or top edge of the headline). Pulsing live (the one permitted infinite loop reactivated for this moment). Confident size: 12-16px, never smaller.
- Timing: `--ease-spring`, ~0.5s.

**Beat 2 — dot blooms into file-capture card.**
- The dot expands (content morph, NOT scale-from-0) into the file-capture card from the hero chain. Brief `filter: blur(2px)` cross-fade. Card size: comparable to the hero's beat-2 card. The card holds a small waveform or frame thumbnail visible in the composition.
- Timing: `--ease-spring`, ~0.6s.

**Beat 3 — capture morphs into Dropbox folder + sync dot.**
- The card translates and blur-morphs into the Dropbox folder glyph (monochrome SVG, same as hero beat 3). The record-red sync dot lands on the folder.
- Timing: `--ease-spring`, ~0.6s.

**Beat 4 — folder resolves into the live link pill BESIDE the Download button.**
- The folder blur-morphs into the live `tracer.nocorny.com/v/k7r2-mx9p` share-link pill (Geist Mono 16px, hairline border `white/20`, `--radius-pill`, bg `white/5`).
- The pill comes to REST sitting directly adjacent to the solid red "Download for macOS" `Button/primary`.
- A copy affordance appears on the pill's right. On hover (or auto after 1.5s delay), the copy affordance morphs to a record-red tick (`--ease-smooth`, < 200ms). No loop on this; it auto-shows once, then is interactive on subsequent hover.
- Timing: `--ease-spring`, ~0.5s settle.

**Rest state (after beat 4, permanent).**
- On screen simultaneously: the headline, the live copyable link pill, the red Download button adjacent to the pill, the note line.
- ONLY the ambient drift and the link pill's copy-interaction remain alive. Nothing else moves.
- The dot motif's journey ends here.

#### Layout on the grid

Two composition options. Soldier picks the one that reads more composed, documents in DECISIONS.md:

- Option A: Headline cols 1-8 (left-aligned, display-md). Convergence composition in cols 7-12 (right), Download button + link pill stacked below the composition in cols 7-12 or full-width in cols 1-12. Note line under the button cluster.
- Option B: Headline cols 1-8. Convergence composition + button + pill inline in a single row spanning cols 1-12 below the headline. Composition resolves into the pill which is immediately right of the button.

Both are on-grid. Neither centers the headline.

#### Component map
| Element | Kit component | Note |
|---|---|---|
| Dark stage | `DarkSection` | same as Hero, Ownership |
| Ambient drift | `AmbientDrift` | <= 0.12 opacity, >= 20s, never crosses text |
| Headline | bespoke display heading | display-md, Geist 600, `text-white/80`, cols 1-8 |
| B2 convergence (4 beats) | bespoke — `CTAConvergence.tsx` | project-local; reuses HeroMorphStage visual assets (file-capture card, Dropbox SVG, link pill) but is a distinct 4-beat composition. Note in HANDOFF.md as custom embed. |
| Download button | `Button/primary` | solid accent fill, "Download for macOS" |
| Link pill | bespoke inline within CTAConvergence | Geist Mono, hairline border, copy interaction with tick morph |
| Note line | bespoke text | body 16px, Hanken 400, `text-white/40` |

#### Copy (from content/copy.json)
- `final_cta.heading` -> "Stop renting your screen recordings."
- `final_cta.cta_primary` -> "Download for macOS"
- `final_cta.note` -> "Free forever. ~12MB. MIT licensed."
- Link pill text -> `tracer.nocorny.com/v/k7r2-mx9p` (same string as hero, Geist Mono)

No body paragraph in the CTA. The convergence IS the body. NO second CTA. NO GitHub repeat. NO eyebrow.

#### B2 beat checklist (checkable line by line)

- [ ] Beat 1: record-red dot enters from heading side. Pulsing. Size 12-16px. `--ease-spring`, ~0.5s.
- [ ] Beat 2: dot blooms into file-capture card. Content morph, NOT scale-from-0. `filter: blur(2px)` seam. Card comparable in footprint to hero beat-2 card. `--ease-spring`, ~0.6s.
- [ ] Beat 3: card morphs into monochrome Dropbox folder glyph + record-red sync dot on folder. `filter: blur(2px)` seam. `--ease-spring`, ~0.6s.
- [ ] Beat 4: folder morphs into live link pill, `tracer.nocorny.com/v/k7r2-mx9p`, Geist Mono 16px, hairline border `white/20`, `--radius-pill`, bg `white/5`. Pill comes to rest adjacent to the `Button/primary`. Copy affordance visible. `--ease-spring`, ~0.5s.
- [ ] Beat 4 auto-tick: copy affordance auto-morphs to record-red tick after 1.5s delay. `--ease-smooth`, < 200ms. NOT a loop; shows once, stays interactive.
- [ ] Rest state: headline + link pill + Download button + note line all simultaneously visible. No other motion.
- [ ] Ambient drift active behind dark stage.
- [ ] No scale used below 0.92 on any beat.
- [ ] `CTAConvergence.tsx` noted in HANDOFF.md as custom embed.
- [ ] Reduced-motion / `?motion=0`: lands statically on rest state. Headline + link pill with tick shown + Download button + note line. No convergence animation. Drift off.
- [ ] No second CTA. No GitHub star repeat. No eyebrow chip. No body paragraph.
- [ ] All text >= 16px. Note line exactly "Free forever. ~12MB. MIT licensed."
- [ ] Headline spans cols 1-8. Full composition on the `.grid-page` grid.
- [ ] `DarkSection` used for the dark stage shell.

#### Acceptance checks (S7a, replacing v1)
All beat checklist items above are the acceptance checks for this section. V1 S7a checks are superseded.

---

### S7b — Footer (unchanged from v1)

All v1 acceptance checks stand. No V2 changes.

One V2 note: the squiggle's terminal red dot in the wordmark is where the traveling protagonist comes to rest — "the dot's final resting place." The soldier may add a single subtle one-shot `scale(1.05)` pulse on the footer wordmark's dot when the user scrolls to the footer. Optional; document in DECISIONS.md if included. Reduced-motion: no pulse.

---

## 4. MOBILE STUB (unchanged from v1)

No change. All v1 mobile stub acceptance checks stand.

---

## 5. NEW PRIMITIVES — kit promotion decisions

### `AmbientDrift` — PROMOTE TO KIT

**Justification.** A slow, blurred, low-opacity drifting blob is used on three dark stages in this project (Hero, Ownership, CTA) and is likely to recur in any cinematic dark-stage landing. It is genuinely distinct from MarqueeInfinite (text ticker), BlurReveal (one-shot reveal), and from any existing kit motion primitive.

**Props:**
```tsx
interface AmbientDriftProps {
  /** Drift blob color (CSS color string; applied with opacity override). Default: var(--color-accent) */
  color?: string;
  /** Max opacity. Enforced <= 0.12. Default: 0.08 */
  opacity?: number;
  /** Cycle duration in seconds. Enforced >= 20. Default: 30 */
  duration?: number;
  /** Heavy blur applied to the blob. Default: 80px */
  blur?: number;
  /** Size of the blob in px. Default: 400 */
  size?: number;
  /** Pauses on prefers-reduced-motion + data-motion=off automatically. */
  className?: string;
}
```

**Rules baked into the component (non-overridable):**
- `opacity` is clamped to max 0.12 regardless of prop value.
- `duration` is clamped to min 20s.
- The blob is `position: absolute`, `pointer-events: none`, `z-index: 0`. Content must be `position: relative`, `z-index: 1` above it. The drift never touches content.
- `prefers-reduced-motion` and `data-motion="off"` halt the animation immediately (component checks both, renders the blob statically at start position with opacity 0 when paused).
- No infinite `scale` or `opacity` pulse — ONLY translation drift (x/y). Opacity is static at the set value.

**Promote to:** `ui-kit/components/motion/AmbientDrift.tsx`
**Registry key:** `motion.AmbientDrift`
**Build order:** build as project-local first, promote immediately after the hero section passes judge review.

---

### `TravelingDot` — KIT CANDIDACY FLAGGED, defer to post-V2 retrospective

**Justification for flag.** The Ownership section's traveling dot (animates `top` along a left rail, lights target dots as it passes) is potentially reusable on any section with a vertical list of guarantees or timeline items. However, it is tightly coupled to the truth-row layout in this project. Promote only if a second project needs a traveling-dot rail. For now, build as `src/components/TravelingDot.tsx` (project-local) and note in HANDOFF.md.

---

### `FAQTwoCol` — PROJECT-LOCAL, promote on second use

**Justification.** Two-column accordion with dot-marker and grid dividers is distinct from `FAQAccordion` but only built once so far. Build as `src/components/FAQTwoCol.tsx`. If needed on a second project, promote to kit as `FAQAccordion/twoCol` variant or a separate `FAQTwoCol` component. Note in HANDOFF.md.

---

### `CTAConvergence` (the B2 4-beat composition) — PROJECT-LOCAL

**Justification.** The B2 storyboard is unique to Tracer's single-object motif. It reuses visual assets from HeroMorphStage but is a distinct composition. No other project will have the same record->capture->Dropbox->link-pill motif. Stays project-local. Note in HANDOFF.md as a custom embed, same as HeroMorphStage.

---

### Grid overlay toggle — PROJECT-LOCAL dev utility

A dev-only 12-column guide overlay. Too project-specific and dev-only to promote to the kit. Lives in `src/components/dev/GridOverlay.tsx`, rendered only in `NODE_ENV !== 'production'`.

---

## 6. GLOBAL ACCEPTANCE CHECKLIST — V2 ADDITIONS

All v1 global checks carry forward. The following are V2-specific additions or overrides.

### Grid
- [ ] `--grid-max: 1280px`, `--grid-gutter: 64px`, `--grid-cols: 12`, `--grid-colgap: 24px` defined in tokens.css.
- [ ] `.grid-page` container defined once; used by every section's inner content wrapper.
- [ ] Every section's left content edge lines up with the hero's left content edge at 1440px viewport.
- [ ] Every section's right content edge lines up with the hero's right content edge at 1440px viewport.
- [ ] No per-section `max-width` smaller than `--grid-max`.
- [ ] Dark backgrounds (Hero, Ownership, CTA) are 100vw. Their `.grid-page` content wrapper is on-spec.
- [ ] FAQ is full 1-12 with two-column layout. Blocking failure if a centered-narrow FAQ is rendered.

### Motion
- [ ] Exactly two continuous loop types on the page: the record-red dot pulse + `AmbientDrift` (three dark-stage instances of the latter).
- [ ] No other infinite idle animation anywhere.
- [ ] `AmbientDrift` opacity <= 0.12 on all three instances. Cycle duration >= 20s. Never crosses text.
- [ ] Every blur-morph uses `filter: blur(2px)` during the cross-fade seam.
- [ ] No scale used below 0.92 on any enter or exit. No scale-from-0 anywhere.
- [ ] The hero reads alive from frame 1: dot pulsing, timer ticking, drift drifting before beat 1 auto-trigger.
- [ ] `AmbientDrift` promoted to `ui-kit/components/motion/AmbientDrift.tsx` and registered in REGISTRY.json before SHIP.

### Section structure
- [ ] S3 (How-it-works) uses `HowItWorksScroll.tsx` (scroll-scrubbed panels), NOT `StickyFeatureList`.
- [ ] S6 (FAQ) uses `FAQTwoCol.tsx` (two-column with dot marker), NOT `FAQAccordion`.
- [ ] S7a (Final CTA) uses `CTAConvergence.tsx` (B2 beats), NOT a BlurReveal band.

### Dot thread (the page's protagonist — verify section by section)
- [ ] Nav: squiggle terminal dot is record red. One-shot pulse on paint.
- [ ] Nav: active-section sliding dot (if implemented): travels between links on scroll.
- [ ] Hero: dot pulses as the live REC indicator from frame 1.
- [ ] How-it-works: dot morphs from REC dot (panel 1) -> sync dot (panel 2) -> tick (panel 3).
- [ ] Features: exactly one cell ("One click to share") shows a copy -> tick morph as the dot's presence.
- [ ] Ownership: dot travels down the left rail, lighting each truth-row dot.
- [ ] FAQ: ring -> filled red dot on open. One dot lit at a time.
- [ ] CTA: dot arrives (beat 1), blooms to file-capture (beat 2), morphs to sync dot on Dropbox (beat 3), resolves into link pill beside Download button (beat 4).
- [ ] Footer: squiggle terminal dot is record red. Optional one-shot pulse on scroll-in.

### Kit compliance additions
- [ ] `AmbientDrift` imported from `@ui-kit/components/motion/AmbientDrift` (after promotion).
- [ ] `StickyFeatureList` NOT used in S3 (correct non-use verified).
- [ ] `FAQAccordion` NOT used in S6 (correct non-use verified).
- [ ] `HowItWorksScroll`, `FAQTwoCol`, `CTAConvergence`, `TravelingDot` are project-local; none forked from an existing kit component.

### HANDOFF.md additions required before SHIP
- [ ] `HowItWorksScroll.tsx` — custom scroll-scrubbed re-stage, dot hand-off, scroll-timeline-view implementation.
- [ ] `TravelingDot.tsx` — project-local, kit promotion deferred.
- [ ] `FAQTwoCol.tsx` — project-local, kit promotion deferred.
- [ ] `CTAConvergence.tsx` — custom B2 four-beat composition, reuses HeroMorphStage assets.
- [ ] `AmbientDrift.tsx` — promoted to kit; usage: Hero, Ownership, CTA dark stages.
- [ ] Grid overlay toggle: dev-only, `src/components/dev/GridOverlay.tsx`.
- [ ] Note: `?motion=0` lands EVERY dark stage on composed static rest (drift off, beats frozen).

---

## 7. CARRY-FORWARD V1 ACCEPTANCE CHECKS (still blocking, no change)

These are reproduced as a summary. Full text is in SECTION_CONTRACT.md.

### Typography
- [ ] All text >= 16px everywhere, every section, every theme.
- [ ] Max 2 font families: Geist, Hanken Grotesk (Geist Mono is a mono variant of the same system, not a third family).
- [ ] ~4 size steps: display-xl, display-md, body-lg, body. No ad-hoc sizes.
- [ ] Geist Mono used only for path strings and link strings.
- [ ] No IBM Plex. No gradient text.

### Color
- [ ] `--color-accent: #E5484D` is the single brand color. No purple. No blue. No second brand hue.
- [ ] All literal hex lives in tokens.css only. ds-lint passes with zero raw-hex errors.
- [ ] No gradient-fill buttons.

### Surfaces
- [ ] Every card, cell, stage, pill, and window has a visible 1px border.
- [ ] `--radius-window` (12px) on stages. `--radius-button` (8px) on buttons. `--radius-pill` on dots, pills.

### Copy
- [ ] Zero em dashes, en dashes, bullets, middle dots in prose.
- [ ] Zero hyphenated prose words (identifiers exempt).
- [ ] Zero emoji in any rendered text.
- [ ] Zero eyebrow chips above any heading (EyebrowLabel banned, every use is blocking).
- [ ] All rendered copy matches content/copy.json exactly.
- [ ] `node tools/slop-scan.mjs src/` passes.
- [ ] `node tools/ds-lint.mjs src/` passes (also run over used kit components).

### Motion (v1 rules still blocking)
- [ ] `prefers-reduced-motion` respected on all motion components.
- [ ] `?motion=0` (`html[data-motion="off"]`) respected. `useEnhancementEnabled` returns false.
- [ ] No flat fades as default transitions.
- [ ] Dark/light section boundary transitions: smooth morph, no hard cut, no cream flash.
- [ ] Lenis smooth scroll active in root layout.

### Section structure
- [ ] 7 sections in order: Nav, Hero, How-it-works, Features, Ownership, FAQ, Final CTA + Footer.
- [ ] Theme rhythm: Nav(light) -> Hero(dark) -> How-it-works(light) -> Features(light) -> Ownership(dark) -> FAQ(light) -> Final-CTA(dark) -> Footer(light).
- [ ] Exactly 0 eyebrow chips across the whole page.

### Desktop-only / mobile
- [ ] Mobile stub renders: mark, wordmark, one line, one button. Nothing else.
- [ ] `document.body.scrollWidth === document.documentElement.clientWidth` at 500px.
- [ ] Hero morph does NOT run on mobile. CTA convergence does NOT run on mobile.

### Performance
- [ ] CLS = 0 on pinned hero.
- [ ] LCP element (hero headline) server-rendered; no motion gate on text.
- [ ] All external links: `target="_blank" rel="noopener noreferrer"`.

---

## 8. COMPONENT PROMOTION QUEUE (soldier completes before SHIP)

| Component | Built in | Promote to | Registry key | When |
|---|---|---|---|---|
| `AmbientDrift` | `src/components/AmbientDrift.tsx` | `ui-kit/components/motion/AmbientDrift.tsx` | `motion.AmbientDrift` | After Hero section passes judge review (used in three sections; promote early) |
| `SpecStrip` (v1, carried forward) | already promoted from v1 | `ui-kit/components/section/SpecStrip.tsx` | `section.SpecStrip` | Already done in v1 |
| `TravelingDot` | `src/components/TravelingDot.tsx` | defer | — | Post-V2 retrospective; promote on second use |
| `FAQTwoCol` | `src/components/FAQTwoCol.tsx` | defer | — | Post-V2 retrospective; promote on second use |
| `CTAConvergence` | `src/components/CTAConvergence.tsx` | no promotion | — | Project-local; too specific to Tracer's motif |
| `HeroMorphStage` (v1, carried forward) | `src/components/HeroMorphStage.tsx` | conditional (if reused) | `motion.HeroMorphStage` | Stays project-local until a second project needs it |
| `GridOverlay` | `src/components/dev/GridOverlay.tsx` | no promotion | — | Dev-only utility; project-local |
