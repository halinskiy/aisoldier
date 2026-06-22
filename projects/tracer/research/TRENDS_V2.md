# Tracer by NoCorny — Creative Escalation Scan (V2)

> **Scouted:** 2026-06-22 by 3mpq-scout
> **Expires:** 2026-07-22 (redo before continuing if resumed after that).
> **Round:** V2 creative escalation. V1 shipped (hero good, rest too boring).
> User wants the WHOLE page raised to the hero's ambition: more morphs,
> "wandering" elements, every section alive, ONE full-width grid, and a real
> DESIGNED CTA block (not a recolored band). Builds ON `TRENDS.md` (V1):
> font pairing (Geist + Hanken + Geist Mono), accent #E5484D, desktop-only,
> AirBnB soft-spring all stand. This file adds section-morph, CTA-block, and
> full-width-grid patterns. Read by director + soldier; not an essay.

---

## A. Section-level morph + "wandering element" patterns (7 stealable)

The principle from the best dev-tool pages (Linear, Vercel, Raycast): a
section is alive because ONE designed object behaves like the product, not
because everything wiggles. Steal behaviours, keep restraint.

### A1 — Thread the record-red dot down the page as the recurring protagonist
The single strongest continuity move and it is already Tracer's motif. Raycast
threads ONE motif (the command-palette / cube) through every section as visual
glue; Linear threads its avatar/agent clusters. For Tracer: the record-red dot
that stars the hero reappears as the live bullet of each section (the timer dot,
the Dropbox sync dot, the "copied" tick, the FAQ open-state marker). Same object,
different honest job per section. This is how you make the page feel composed,
not a stack of unrelated blocks. Refs: Raycast (cube motif), Linear (avatar/agent
motif threaded through Intake -> Monitor).

### A2 — Scroll-scrubbed re-stage of the hero chain (not a separate 3-card row)
The 2026 move on Linear/Vercel: the "how it works" content is the hero animation
RE-STAGED on scroll, scrubbed by scroll position, not a fresh static grid. Bind a
3-beat morph (record -> lands in `~/Dropbox/Tracer/` -> `tracer.nocorny.com/v/...`
link) to scroll progress with `animation-timeline: view()` (native, off main
thread, protects LCP) and reserve Motion 12 `useScroll` only for the morph CSS
cannot express. Each beat is a full-width panel; one claim per panel, terse and
uniform. Refs: Linear (numbered 1.0 Intake -> 5.0 Monitor scroll showcases),
Vercel agentic page (alternating full-width product showcases on scroll).

### A3 — Ambient drift layer (the ONE place continuous loops are allowed)
Awwwards 2026 names "floating / scattered / modular elements" and "smooth
morphing between shapes" as current. The tasteful version: a SLOW, low-contrast
ambient layer behind content (a soft red glow blob, or 2 to 3 faint dot-grid
shapes) that drifts and morphs continuously and subtly. This satisfies the user's
"wandering elements that morph seamlessly" without animating content. Rules to
keep it elegant not gimmicky: very low opacity (<=0.12), very slow (20 to 40s
cycle), heavy blur, never crosses a text edge, pauses under `prefers-reduced-
motion` / `?motion=0`. This is the ambient exception the brief explicitly allows;
content morphs still play-once-then-rest. Refs: Vercel hero gradient overlay
(parallax, subtle), Awwwards morphing-on-scroll inspiration.

### A4 — Layout-shift sections: content rearranges into place on entry
Awwwards 2026: "layout animations stay on top, elements move around and arrange
in different ways." For a feature/bento section, animate the CELLS morphing into
their grid positions on scroll-in (each cell springs from a slightly off
position/scale into its slot, staggered), instead of a flat fade. Uses Framer
`layout` + stagger. Plays once, then rests. This makes a static bento feel
designed. Keep enter scale >= 0.92 (never from 0 — Emil Kowalski) so it reads
gentle, not poppy.

### A5 — Blur-morph between states (the seam-hider that reads premium)
Emil Kowalski's concrete tip: apply `filter: blur(2px)` DURING a state transition
to smooth the visual gap between two states. Use this on every Tracer morph where
one object becomes another (dot -> sync dot -> tick, screenshot -> link pill).
The brief blur on the cross-fade is exactly what makes a morph read "seamless"
instead of "swap". Cheap to add, disproportionately premium. Pair with `ease-out`
on enter (starts fast, feels faster) and keep content state-change under 300ms;
the bigger hero beats can run the generous 0.4 to 0.9s spring.

### A6 — The shareable link as a live, scrubbable artifact (interactive, not just shown)
Family.co's signature is that users "scrub left and right and watch numbers
animate" — the object rewards touch. Make the `tracer.nocorny.com/v/k7r2-mx9p`
pill the page's one interactive toy: hovering it morphs the copy affordance to a
record-red tick, and the link string can type-on / glitch-settle into place on
scroll-in. It is the product payoff, so making it tactile is honest, not
decorative. Geist Mono, copy-to-clipboard, tick morph (state change, smooth ease,
no loop). Ref: Family.co (tactile, gesture-rewarding micro-interactions), V1
Pattern 6.

### A7 — Horizontal break inside a vertical scroll (one unexpected axis)
Awwwards 2026: "scrolling down transitions into sliding sideways through a gallery
/ timeline — chapters in a story." ONE section (the privacy "what's missing"
proof, or the 3-beat flow) can pin and move horizontally as you scroll past it,
breaking the vertical monotony exactly once. Use sparingly (one section max) or it
becomes the gimmick the brief warns against. If it risks desktop-only complexity,
demote to a candidate; A2 + A4 already carry the "alive" requirement.

---

## B. Creative final CTA-block patterns (5 stealable, build-concrete)

The user's verdict on V1: "just changed the background and centered text."
Every pattern below is a real COMPOSITION with its own motion. Pick ONE and make
it the second-screenshot moment. All stay single-accent (#E5484D), borders on,
>=16px, Geist + Hanken.

### B1 — Product-surface CTA: the macOS recorder pill IS the backdrop, live
The strongest for Tracer. Instead of text-on-color, the CTA is the actual native
recorder surface (the menu-bar pill from V1 Pattern 3) rendered large and
center-stage on the dark cinematic stage, mid-record with the red dot pulsing
live, and the headline + "Download for macOS" sit composed against it. The CTA is
literally a frame of the product doing its job. Motion: the dot pulses (the one
allowed live loop), a faint ambient glow (A3) behind. This is the dev-tool move —
Raycast's CTA places its big cube visual behind the download buttons; Tracer's
equivalent is the honest product surface, which also sells trust. Refs: Raycast
("Take the short way" + cube behind buttons), Screen Studio (product-as-hero).

### B2 — The whole flow collapses into the CTA (payoff convergence)
Re-stage A1/A2 one final time AS the CTA: the record dot travels across the block,
lands as the Dropbox tick, and resolves into the live `tracer.nocorny.com/v/...`
link pill sitting right beside the download button — so the user watches the
promise complete and the CTA is the reward at the end of it. The morph plays once
on scroll-into-view, then rests with the link pill copyable. This makes the CTA
the narrative climax, not an afterthought band. Unique to Tracer; no competitor
has this because most do not have a single-object motif. Ref: Linear's closing
"Built for the future. Available today." but elevated from 4 flat buttons to a
performed payoff.

### B3 — Oversized-type CTA with the dot as the period/counter
Large-type CTA school (Ebury, Readme on Unsection): one enormous Geist line
("Own your recordings.") edge-to-edge, where the record-red dot is the only color
and acts as the full stop or a live `REC` counter ticking. Restraint draws focus
— flat color, giant type, one moving red dot, generous air. Button below. Motion:
the dot blinks live, the headline does a once-played mask/clip reveal on
scroll-in (blur-morph A5). Cleanest to build, very premium, very on-brand. Refs:
Ebury (large type + minimal + flat color), Readme (visible border + large type).

### B4 — Bordered floating CTA card lifted off the section (object, not band)
Unsection's "floating action card" + "visible border" pattern: the CTA is a
single hairline-bordered card (`radius-window 12px`) that sits LIFTED above the
section surface (light shadow, light theme; opacity-layer lift, dark) with the
dot-grid background showing around it. It reads as a tactile object you could pick
up, not a full-bleed color change. Motion: the card springs up on scroll-in (soft
overshoot, scale from 0.94), ambient glow behind. The border + lift is precisely
what turns a band into a designed moment. Refs: Unsection floating-action-card,
Readme bordered CTA.

### B5 — Split CTA: "for you" vs "the proof" two-pane
Vercel's split CTA ("For humans" | "For agents") translated to Tracer: left pane =
the human ask ("Download for macOS", v + size + "MIT licensed"), right pane = the
live proof (the link pill / Dropbox folder morph, or the `git clone` line in Geist
Mono since it is open source). Asymmetric two-column on the full-width grid, a
hairline divider down the middle, the red dot bridging the two panes. Gives the
CTA real structure and reinforces the ownership argument at the exit. Ref: Vercel
"Start building" split block.

> **Director's call to make:** B1 or B2 is the bold, on-brand "wow" choice
> (product surface / performed payoff); B3 is the safe-but-premium choice (giant
> type + live dot). B4/B5 are good if a second CTA or a calmer footer-CTA is
> wanted. Do NOT ship a flat color band with centered text — that is the exact
> V1 failure.

---

## C. Full-width grid system (fix the centered-narrow FAQ)

**The rule to enforce:** ONE column system spans the whole page; every section
docks to the SAME outer gutters and the SAME column tracks. Nothing gets its own
narrower max-width. The offender (FAQ) goes full-width on that grid.

- **Define one grid token.** A single full-bleed container with fixed page
  gutters (e.g. 64px desktop) and a shared column count (12-col, or a simpler
  named track set). Every section is a child of it; readability is controlled by
  which columns content spans, NOT by a per-section max-width. Linear/Vercel do
  exactly this: sections are edge-to-edge, copy just spans fewer center columns.

- **FAQ full-width = two-column accordion.** The standard fix for a too-narrow
  FAQ: a `grid-template-columns: 1fr 1fr` two-column accordion spanning the full
  grid (questions split across two columns), hairline dividers between rows,
  8 to 16px vertical gap, 16 to 24px internal padding on the open answer. Use
  native `<details>/<summary>` for state, animate open with a height/blur-morph
  (A5), and the open-state marker is the record-red dot (A1). This fills the full
  width honestly instead of one narrow centered column of stacked rows.
  Alternative if 2-col feels busy: keep one column of rows but let the row span
  the full grid width with the question left and answer revealing right (left
  question / right answer), so it is edge-to-edge, not a centered 800px strip.

- **Lists go full-width the same way.** Feature/bento and the privacy proof strip
  already want to be edge-to-edge (V1 Pattern 5 + 7). Confirm they share the
  outer gutters with the hero and CTA so there is zero per-section drift. Audit:
  every section's left/right content edge should line up with the hero's.

Refs: Linear (edge-to-edge sections, copy spans center columns), Vercel (full-
width alternating showcases), two-column FAQ accordion pattern (grid 1fr 1fr,
hairline dividers).

---

## D. Make the hero read ACTIVE immediately (and stop shrinking elements)

User: the morph reads odd / half-static; you should not have to wait to know it
is animating; nothing should shrink to a tiny object.

- **Start in motion, not from rest.** The live record dot should already be
  pulsing (the allowed live loop) the instant the hero paints, BEFORE the morph
  chain begins. A live, blinking red dot on frame 1 instantly signals "this is
  alive" so the user never wonders if it is static. (V1 already allows this one
  loop; make it the opening signal.)

- **Continuous timer + ambient drift as the "it's alive" floor.** Pair the dot
  with a running `REC 00:0x` timer (digits ticking) and the slow ambient drift
  layer (A3). Even between morph beats, something is always moving, so there is
  no half-static dead air.

- **Keep every beat confidently sized.** Do not scale the capture/pills down into
  small objects between states. Hold each beat at a large, legible size and morph
  by POSITION + CONTENT + the blur cross-fade (A5), not by shrinking. If an
  element must leave, let it morph INTO the next object (dot -> sync dot -> tick)
  at comparable size rather than shrinking away. Emil Kowalski: never animate from
  scale 0; keep enters >= 0.9 — apply the same to exits so nothing collapses to a
  speck.

- **ease-out + generous spring, loop-once.** Enter beats use the soft-spring
  overshoot (`cubic-bezier(0.34,1.42,0.5,1)`), state nudges use smooth ease
  (`cubic-bezier(0.2,0.8,0.2,1)`). The chain plays ONCE then rests on the final
  link pill; only the record dot keeps blinking. Energetic = faster first beat +
  always-present dot/timer/drift, NOT infinite looping the whole chain.

Refs: Screen Studio (cinematic always-polished product motion), Family.co
(motion that reads alive on contact), Emil Kowalski 7 tips (ease-out, no
scale-from-0, blur masking, <300ms for state nudges).

---

## E. Craft floor (Emil Kowalski, apply everywhere)

- `ease-out` for enters/exits; avoid `ease-in` for UI.
- Never animate scale from 0; start >= 0.9 (gentler, premium).
- State-change nudges < 300ms (180ms feels more responsive than 400ms); reserve
  the generous 0.4 to 0.9s springs for big hero/CTA beats.
- `filter: blur(2px)` during state transitions to hide the seam (the morph-
  smoother).
- `transform: scale(0.97)` on `:active` for every button.
- `transform-origin` matches the trigger point, not default center.
- All of the above respect `prefers-reduced-motion` + `?motion=0` (static,
  composed, legible — ambient drift and all loops off).

---

## Sources

- Linear (edge-to-edge scroll showcases, threaded motif, closing CTA): https://linear.app
- Vercel (full-width alternating showcases, split "Start building" CTA, hero gradient drift): https://vercel.com
- Raycast (motif threaded through page, "Take the short way" CTA + cube visual, full-width grids): https://www.raycast.com
- Emil Kowalski, 7 practical animation tips (ease-out, no scale-from-0, blur masking, <300ms, active scale): https://emilkowal.ski/ui/7-practical-animation-tips
- Family.co (tactile, gesture-rewarding micro-interactions): https://family.co
- Unsection CTA gallery (floating-action card, bordered, large-type, flat-color patterns): https://www.unsection.com/category/cta-section-design
- ctaexamples.com (split, layered card, floating-action CTA compositions): https://ctaexamples.com/cta-section-examples/
- Saaspo CTA section gallery: https://saaspo.com/section-type/saas-cta-section-examples
- Awwwards 2026 (layout animations, floating/morphing elements, scroll->sideways): https://www.awwwards.com/inspiration/morphing-animation-on-scroll-quantox , https://lovable.dev/guides/scrolling-designs-patterns-when-to-use
- SaaSFrame 2026 trends (micro-animation with purpose, modular grids, interactive previews): https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples
- Two-column full-width FAQ accordion pattern: https://www.faqpage.com/faq-accordion-design
