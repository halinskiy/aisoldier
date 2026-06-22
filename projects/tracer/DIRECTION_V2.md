# DIRECTION_V2 — Tracer by NoCorny (creative escalation)

Owner: 3mpq-director · Date: 2026-06-22 · Build: V2 escalation (v1 PASSED, raise WHOLE page to the hero's ambition)
Source feedback: `REDESIGN_V2_BRIEF.md` · Source trends: `research/TRENDS_V2.md` (A1-A7, B1-B5, C grid, D hero, E craft floor)
Hand to: 3mpq-architect (update SECTION_CONTRACT) -> 3mpq-prompter -> 3mpq-soldier.

This is a DELTA on `DIRECTION.md`. Everything in v1 stays LOCKED unless a line here
overrides it: accent `#E5484D` (single, the record dot is the one motif), Geist +
Hanken Grotesk + Geist Mono (link/path strings only), all copy in `content/copy.json`,
desktop-only (1440px masterpiece, mobile is the single-screen stub), light -> DARK ->
light theme rhythm, 7-section order. Invent no facts. >=16px everywhere. No slop.

The v1 page shipped correct but timid below the fold. V2 makes EVERY section perform
on the hero's level: one full-width grid, a recurring red-dot protagonist threaded
top to bottom, a designed alive moment per section, and a real CTA composition. We
design AGAINST the four complaints; we do not relitigate them.

---

## 0. The four mandates (what V2 must satisfy)

1. **Hero reads ALIVE from frame 1.** Dot pulsing + timer running + ambient drift
   the instant it paints, BEFORE the morph chain starts. No "looks half-static, you
   must wait" dead air. NEVER shrink a beat into a tiny object: morph by POSITION +
   CONTENT + BLUR cross-fade, never scale-from-0, never collapse to a speck. Every
   beat holds a confident, legible size.
2. **ONE full-width grid, every section docked to it.** Defined ONCE below. FAQ,
   Features, Ownership, How-it-works, CTA all share the hero's outer gutters and
   column tracks. No section floats centered-narrow. The centered FAQ is the headline
   fix: it becomes a full-width two-column accordion.
3. **Every section has a designed alive moment.** The record-red dot is threaded
   down the page as the recurring protagonist (timer dot -> Dropbox sync dot -> copied
   tick -> FAQ open marker). Each section gets a seamless morph and may carry the ONE
   allowed ambient drift loop. Entertain on scroll; elegant, not noisy.
4. **A real CTA BLOCK, not a recolored band.** Chosen: **B2 — the whole morph chain
   converges into the live share-link pill beside the Download button.** The narrative
   climax, unique to Tracer. Storyboarded concretely in section 4.

---

## 1. The ONE grid system (defined ONCE, every section obeys)

This is the single most load-bearing fix. Define it once in `tokens.css` / a `.grid-page`
shell and make EVERY section a child of it. Readability is controlled by which columns
content spans, NEVER by a per-section max-width. Linear/Vercel do exactly this.

```
--grid-max:      1280px      /* content column max; centered in the 1440 viewport */
--grid-gutter:   64px        /* outer page gutter, left AND right, identical every section */
--grid-cols:     12          /* 12 equal column tracks */
--grid-colgap:   24px        /* gutter between columns */
```

Rules (blocking):
- **One container.** A single `.grid-page` (max-width `--grid-max`, margin-inline auto,
  padding-inline `--grid-gutter`, `display: grid`, `grid-template-columns: repeat(12, 1fr)`,
  `column-gap: --grid-colgap`). Every section's inner content is a grid child of THIS
  system. No section declares its own narrower max-width. Ever.
- **Full-bleed rule.** A section's BACKGROUND (the dark stages) may bleed edge-to-edge
  of the viewport, but its CONTENT still aligns to the same 12-col tracks and the same
  `--grid-gutter`. Background bleeds; content never drifts. So the dark hero stage,
  the dark Ownership stage, and the dark CTA stage are full-viewport-width color, with
  their inner content on the identical grid as the light sections above and below.
- **Column spans (the readability control):**
  - Section H2 + subheading: span columns 1-7 (left, flush) unless the section is
    centered hero type.
  - Hero headline/sub: span 1-8; the morph stage spans the full 1-12.
  - Features bento: full 1-12.
  - Ownership truth rows: full 1-12 (two-column layout WITHIN the grid).
  - **FAQ: full 1-12 as a two-column accordion** (cols 1-6 = column A of questions,
    cols 7-12 = column B). This is the explicit fix.
  - CTA block: full 1-12.
- **Audit gate:** every section's left content edge sits on grid column 1's left edge,
  every right content edge on column 12's right edge or an honest span boundary. Drop a
  faint grid overlay (12 col guides) toggle in a corner; ON for the first V2 prompt so
  the user can verify alignment, OFF after, toggle stays.

Restated for the three previously-suspect sections:
- **FAQ** — was centered-narrow. NOW: full 1-12, two-column accordion (questions split
  across cols 1-6 and 7-12), hairline dividers between rows, the open-state marker is
  the record-red dot. Edge-to-edge, same gutters as the hero.
- **Features** — full 1-12 bento, outer edges flush to the hero's gutters. No
  per-section inset.
- **Ownership** — dark background bleeds full viewport; the 4 truth rows sit on the
  same 1-12 grid (two-column within), left edge flush to the hero's left content edge.

---

## 2. Hero animation tuning (keep the liked concept, fix the "odd/half-static" read)

The v1 5-beat chain (REC pill -> condense -> Dropbox folder -> link pill -> red tick)
is KEPT. What changes is that it must read alive instantly and never shrink anything.

**A. Alive from frame 1 (the "it's animating" floor, per scout D).**
- The red record dot is pulsing the INSTANT the hero paints, before the chain begins.
  Scale pulse 1 -> 1.18 -> 1, ~1.2s, `ease-in-out`, infinite. This is the one permitted
  live loop and it is now the OPENING signal, not a late detail.
- A `REC 00:00 -> 00:0x` timer in Geist Mono ticks digits from frame 1, alongside the
  dot. Live motion the user cannot miss.
- The ambient drift layer (see 3A) is already drifting behind the stage on paint. So
  three things move before any morph: dot, timer, drift. Zero dead air, zero "is this
  static?" doubt.

**B. Never shrink to a tiny object (the explicit "too small" complaint).**
- Every beat holds a confident, legible size. The capture/pill objects stay LARGE
  across the whole chain.
- Morph technique is **position + content + blur cross-fade**, NOT scale. When one
  object becomes the next (REC pill -> condensed capture -> Dropbox folder -> link pill),
  it travels by position and swaps content under a brief `filter: blur(2px)` cross-fade
  (scout A5), at comparable size. It does not scale down to a speck and back up.
- Floor: any enter/exit that uses scale starts/ends at >= 0.9, never 0 (Emil Kowalski).
  Preferred is no scale at all on the big beats; use translate + blur + content swap.
- The condensed-capture beat (v1 beat 2) is RE-SPEC'd: it no longer "shrinks into a
  small travelling capture." It morphs the REC pill's content (waveform/frame) into a
  file-card of comparable footprint that slides toward the Dropbox folder. Same visual
  weight throughout.

**C. Easing + lifecycle.**
- Big hero beats: soft spring `cubic-bezier(0.34,1.42,0.5,1)`, 0.4-0.9s, ease-out feel,
  choreographed and staggered.
- State nudges (copy -> tick, hover): smooth `cubic-bezier(0.2,0.8,0.2,1)`, < 300ms.
- The chain plays ONCE on load then RESTS on the final share-link state. After rest,
  ONLY the record dot keeps pulsing (live indicator). The ambient drift keeps drifting
  (the one allowed ambient loop). Nothing else moves.
- `transform-origin` matches the trigger point, not center. `:active` on CTAs scales 0.97.

**D. Reduced-motion / `?motion=0`.** Land statically on the final beat (share-link pill
with red tick, Dropbox folder, path string all legible). Dot stops, timer frozen at
final value, ambient drift off. Full meaning without any motion.

---

## 3. Per-section creative upgrade (each on the hero's level)

The unifying devices: (A) the record-red dot threaded as protagonist, (B) the single
ambient drift loop, (C) one seamless blur-morph entrance per section that plays once.

**Ambient drift spec (the ONE allowed continuous content-area loop, scout A3).** A
single slow, heavily-blurred, low-opacity (<= 0.12) red glow blob OR 2-3 faint dot-grid
shapes that drift and morph behind a section's content. 20-40s cycle. Heavy blur. NEVER
crosses a text edge (sits behind, in margins/negative space). Pauses fully under
`prefers-reduced-motion` / `?motion=0`. Use it on the dark stages and at most one light
section; do not put it on every section or it becomes the gimmick. Content morphs still
play-once-then-rest; the drift is the only continuous content-area motion besides the
record dot.

### Nav (light, sticky)
- **Morph:** transparent -> `backdrop-blur(12px)` + `bg-white/80` + hairline bottom
  border on scroll, smooth `--ease-smooth` 200ms. The wordmark's squiggle-into-dot mark
  is where the dot motif is BORN: the squiggle's terminal dot is the same record red,
  and it gently pulses ONCE on first paint then rests (not a loop in nav).
- **Dot thread:** the active-section nav link carries a small record-red dot marker that
  slides (layout morph, `--ease-smooth`) between links as the user scrolls sections into
  view. One dot, traveling, tying nav to the page. (Implement only if trivial via
  IntersectionObserver; the slide is a position morph, not a fade.)
- **No drift here** (nav is chrome, keep it clean).

### Hero (DARK stage) — see section 2. The dot is born as the live REC dot.

### How it works (light) — scroll-scrubbed RE-STAGE, not a static row (scout A2)
- **Creative moment:** this is the hero chain RE-STAGED at reading pace, scrubbed by
  scroll position, ONE beat-panel full-width in view at a time (record -> lands in
  `~/Dropbox/Tracer/` -> `tracer.nocorny.com/v/...` link). Not a fresh 3-card grid.
- **Dot thread:** the record-red dot is the through-line bullet of all three panels:
  it is the pulsing REC dot in panel 1, becomes the Dropbox sync dot in panel 2,
  becomes the copied tick in panel 3. Same object, three honest jobs, blur-morphing
  between as the user scrolls.
- **Motion:** prefer native CSS `animation-timeline: view()` (off main thread, protects
  LCP); reserve Framer `useScroll` only for what CSS cannot express. Each panel enters
  with a blur-morph (>= 0.92 scale, never 0), plays once as it scrolls into view, rests.
- **Drift:** optional faint drift behind the pinned visual; off by default if it
  competes with the scrubbed morph.

### Features (light) — bento cells arrange into place on entry (scout A4)
- **Creative moment:** the 6 hairline cells morph INTO their grid slots on scroll-in,
  each cell springing from a slightly off position into its slot, STAGGERED (Framer
  `layout` + stagger), instead of a flat fade. Enter scale >= 0.92, soft spring, plays
  ONCE then rests. A static bento now reads designed.
- **Dot thread:** exactly ONE cell ("One click to share") holds a small live morph: a
  copy affordance that morphs to a record-red tick on scroll-into-view, plays once,
  rests. That cell's tick is the dot motif's appearance in this section. The other 5
  cells stay calm and uniform (label + one line, no icons).
- **Hover:** cell border `--color-border` -> `--color-border-strong`, 150ms `--ease-smooth`.
- **Drift:** none here; the layout-arrange moment is the section's life. Keep it calm.

### Ownership (DARK stage) — the protagonist dot leads the truth rows
- **Creative moment:** on scroll-in, a single record-red dot enters at the heading and
  travels DOWN the left rail of the four truth rows, each row's leading dot lighting to
  full red as the dot passes (blur-morph hand-off, scout A5), like the dot is signing
  off each guarantee. Plays once, then rests with all four dots lit. Rows blur-reveal
  staggered behind it.
- **Dot thread:** this is the dot as the "ownership seal" — it literally walks your
  guarantees. Same red, same object, honest job.
- **Drift:** the ambient red glow blob (3A) drifts slowly behind the dark stage, <= 0.12
  opacity, never crossing the text. This is a designed dramatic dark beat.
- **Motion:** the traveling dot uses `--ease-spring` for the hand-off settle; rows use
  BlurReveal stagger. Reduced-motion: all four dots lit, rows static.

### FAQ (light) — full-width two-column accordion, dot as open-state marker (scout C + A1)
- **Grid fix (the headline complaint):** full 1-12, two-column accordion. Questions
  split across cols 1-6 (column A) and cols 7-12 (column B). Hairline dividers between
  rows, ~12-16px vertical gap, 16-24px internal padding on the open answer. Edge-to-edge,
  same gutters as the hero. No centered 800px strip.
- **Creative moment / dot thread:** the open-state marker is the record-red dot. The
  closed row shows a small hollow ring; opening morphs the ring to a filled record-red
  dot (content+blur morph, `--ease-smooth`, < 300ms) and the answer height-expands with
  a brief blur on the seam (scout A5). Closing reverses. ONE dot lit at a time mirrors
  the hero's "one focal point."
- **State:** native `<details>/<summary>` for accessibility; animate open with
  height + blur-morph. Single-open feel preserved (the dot is the visual anchor).
- **Drift:** none; the two-column fill + the open-dot is the life.

### Footer (light) — calm sign-off
- **Morph:** the oversized wordmark blur-reveals once on scroll-in; its terminal
  squiggle dot is the record red, the dot's final resting place (the protagonist's home
  after walking the whole page). No loop, no drift. Quiet end.

---

## 4. The CTA block storyboard — B2: payoff convergence (the narrative climax)

Chosen over B1/B3 because it is UNIQUE to Tracer (no competitor has a single-object
motif to converge), it pays off the exact promise the hero made, and it is the second
screenshot moment. It is an object/composition that PERFORMS, never a recolored band.

**Stage.** DARK full-bleed stage (background bleeds viewport; content on the 1-12 grid).
Ambient red glow blob drifting behind (3A, <= 0.12 opacity, never crossing text). The
headline "Stop renting your screen recordings." composed against it, not centered-floating.

**The convergence (plays ONCE on scroll-into-view, then rests):**

1. **Beat 1 — the dot arrives.** As the CTA scrolls into view, the record-red dot (the
   page's protagonist, last seen at FAQ/footer) travels into the block from the heading
   side, pulsing live. Confident size, no shrink.

2. **Beat 2 — record -> capture.** The dot blooms (content morph, not scale-from-0) into
   the small file-capture card from the hero chain, under a brief blur seam. Comparable
   size to the hero beat. It reads as "the recording you just made."

3. **Beat 3 — capture -> Dropbox tick.** The capture slides and morphs into the Dropbox
   folder glyph (monochrome) with the record-red SYNC dot landing on it. Blur cross-fade,
   `--ease-spring` settle. "It is in your Dropbox."

4. **Beat 4 — resolve into the live link pill BESIDE the Download button.** The folder
   morphs into the live `tracer.nocorny.com/v/k7r2-mx9p` share-link pill (Geist Mono,
   hairline border, copy affordance) that comes to REST sitting right next to the solid
   red **Download for macOS** button. The promise is now complete on screen: record ->
   your Dropbox -> clean link, resolved as the reward, with the download CTA as the
   obvious next act. The copy affordance morphs to a record-red tick on hover/auto.

5. **Rest state.** After the chain: the headline, the live (copyable, interactive per
   scout A6) link pill, the red Download button, and the note line "Free forever. ~12MB.
   MIT licensed." all composed on the dark stage. Only the link pill's copy interaction
   and the faint ambient drift remain alive; nothing else moves. The dot motif's journey
   ends here, resolved into the thing the user came for.

**Layout (on the grid).** Headline spans cols 1-8 (left, big display). The convergence
composition + Download button + link pill occupy cols 1-12 below it (or the composition
right cols 7-12, headline left 1-6 if a split reads cleaner — soldier picks the more
composed of the two, both are on-grid). Note line under the button, `text-white/40`,
16px. NO second CTA, NO GitHub repeat, NO eyebrow.

**Reduced-motion / `?motion=0`.** Land statically on the rest state: headline, the link
pill with red tick shown beside the Download button, note line. No convergence, no
drift, dot frozen. Full meaning, fully legible.

**Why this beats the v1 band:** v1 was "recolor + center text," a zero-composition
afterthought. B2 makes the CTA the place the whole page's narrative completes, a
performed payoff only Tracer can show, and an object the user can touch (copy the link).
That is the second screenshot moment the brief demands.

---

## 5. Motion spec (V2, AirBnB-style, plays once then rests)

- **Entrances / morphs:** soft spring `cubic-bezier(0.34,1.42,0.5,1)`, 0.4-0.9s,
  choreographed + staggered. Grow/translate/blur-morph into place. Never a hard cut,
  never a flat fade as the default, never scale-from-0.
- **State nudges (hover, copy->tick, accordion open):** smooth `cubic-bezier(0.2,0.8,0.2,1)`,
  < 300ms. `:active` scale 0.97 on buttons. `transform-origin` at the trigger.
- **Blur-morph everywhere a thing becomes another thing (scout A5).** `filter: blur(2px)`
  during the cross-fade. This is what makes every Tracer morph read seamless not "swap."
- **Plays once then rests.** Every entrance/section morph fires ONE time on load or
  scroll-into-view, then rests. The ONLY continuous loops on the whole page are: (1) the
  live record dot (genuine live indicator), (2) the single ambient drift layer per dark
  stage. Nothing else loops.
- **One continuous journey.** Every transition the user meets, including the dark<->light
  section boundaries and the dot threading between sections, is a smooth morph or soft
  transition. The whole page feels like one fluid AirBnB journey.
- **`prefers-reduced-motion` + `?motion=0`:** every section lands on its composed final
  state; dot frozen, timer frozen, drift off, all meaning preserved.

---

## 6. Do-not list (V2, blocking)

Carries forward all v1 do-nots PLUS the escalation-specific bans:
- **No centered-narrow section.** Every section docks to the ONE grid (sec 1), same
  outer gutters as the hero. FAQ specifically is full-width two-column. Any per-section
  max-width is a blocking failure.
- **No flat CTA band.** The CTA is the B2 convergence composition. A recolored band with
  centered text is the exact v1 failure and is blocked.
- **No scale-from-0, no shrink-to-tiny.** Hero and CTA beats hold confident sizes; morph
  by position + content + blur. Any beat that collapses to a speck or scales from 0 is a
  blocking failure (>= 0.9 floor if scale is used at all).
- **No second accent, no gradient text/buttons.** Record-red `#E5484D` only. Purple stays
  dead.
- **No infinite loops** except the single live record dot AND the single ambient drift
  layer per dark stage. Any other idle decoration that never settles is cut.
- **No drift that crosses text, exceeds 0.12 opacity, or runs faster than ~20s.** Ambient
  drift is barely-there atmosphere, never a focal element.
- **No sub-16px text** anywhere (no exceptions for markers, timers, mono strings, meta).
- **No more than 2 font families** (Geist + Hanken; Geist Mono is the same Geist system,
  link/path strings only). ~4 sizes total.
- **No eyebrow/kicker/chip above any heading. No chip-soup. No icons in the bento. No
  generic browser-window card in the hero. No invented facts. No em/en dashes, bullets,
  middle dots, or hyphens-in-prose (real identifiers exempt). No emoji. No hedge/cutesy
  copy.**
- **No real responsive mobile.** Mobile stays the single-screen stub (mark, one line,
  Download button). Hero/CTA morphs do NOT run on mobile. Verify
  `document.body.scrollWidth === clientWidth` at 500px.

---

## 7. Verdict gate (post-build, blocking)

DIRECTOR_REVIEW (V2) reads the LIVE rendered 1440px page (headless screenshot + a
scroll-through), not source. I block on: any section not on the one grid (esp. a
centered-narrow FAQ); the CTA rendered as a flat band instead of the B2 convergence; any
hero/CTA beat that shrinks to a tiny object or scales from 0; a section with no designed
alive moment (static text+list); more than the one ambient drift loop + the one record
dot looping; a second accent or any gradient; chip-soup or an eyebrow; any sub-16px text
or a third font family; cramped spacing; a broken mobile where the stub was specified.
Each issue gets: what, where, and the exact cut or change.

