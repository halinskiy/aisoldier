# AESTHETE - Tracer V3 scroll-scrubbed (LIVE review, real wall-clock scrub)

Reference bar: getcorder.com / Linear / Screen Studio - calm, confident,
cinematic, alive. Reviewed LIVE at http://localhost:3107, 1440px, driven by
REAL scroll via tools/scroll-probe.mjs (Lenis-honest scrollY, spring allowed
to settle at each stop, every scrubbed section scrubbed at 4-5 positions).
Reduced-motion (?motion=0) and the 500px mobile stub verified. doc=13501px,
0 console errors, no horizontal overflow at any width.

## V3 verdict: ADVISORY-ONLY (no hard blockers) - but the advisories are the
## whole reason it still feels boring/empty/AI. Do the focused pass below.

The re-architecture WORKED at the mechanical level. The user's three core
complaints are objectively answered:
- "no morphs accompany scrolling" -> FALSE now. Verified live: the hero label
  morphs Hit record -> It is in your Dropbox -> Share the link AS you scroll,
  the pill cross-fades through the capture card to the link card, the how-it-
  works track slides horizontally under vertical wheel, the ownership bar fills
  under the wheel, the CTA dot blooms to card to folder to link pill. Scrolling
  continuously drives visible transformation top to bottom. This is real scrub,
  not enter-once reveal.
- "janky / рвано" -> the engine is sound (one spring per section, compositor
  props only, sticky pin). It reads smooth in motion. The remaining "janky"
  TELL is compositional, not frame-rate: see A2 (horizontal panels park mid-
  slide showing sliced half-panels at both edges).
- "AI block rhythm" -> genuinely broken. Vertical-scrub dark hero, horizontal-
  scrub light how-it-works, parallax dark ownership, full-bleed footer wordmark.
  The shape varies section to section. This is the strongest win of V3.

So why does it STILL read boring/empty/AI? One root cause dominates, and the
three weak spots the user already flagged are all symptoms of it.

## THE ROOT CAUSE (fix this and 80% of "boring/empty" dies): VOID.

Every pinned/dark stage is a 100vh black (or white) rectangle with a
modest-sized subject floating in the UPPER-MIDDLE third and a vast dead lower
half. Measured, not eyeballed:
- Hero rest (y2100): "Share the link." at ~290px, card top ~440px, card bottom
  ~610px. Below 610px = ~490px of pure black void. The card is ~590px wide in
  a 1440px stage = it occupies ~17% of the stage area.
- Hero scrub (y400-900): subject card ~360px wide, label and card separated by
  ~200px of black so they do not read as ONE object.
- Ownership numbers (y7600): three stat headlines jammed in the TOP 280px,
  then ~640px of black with one orphan dot.
- CTA convergence beat 1 (y10600): the "arriving dot" is a literal 20px speck
  in a near-empty 1440x800 black stage. The subject is microscopic.
- Inter-section frames (y2600, y5600, y11800): transitional moments where one
  section's content has left and the next has not arrived = an almost fully
  empty screen with only the floating ScrollDot in it.

Contrast: the ?motion=0 STATIC hero (rm-y0) is a BETTER composition than the
live scrubbed hero - headline + "Share the link." + card + spec strip all in
one tight, balanced frame. The scrub broke the cohesion the static state keeps.

### Fix the void (ranked, all advisory, all high-impact on "premium/full")

1. [HIGH] **Make the subject big and vertically centered in every pinned stage.**
   The morph subject should fill ~50-65% of the stage height/width, optically
   centered (not pinned to the top third). Hero: take the link card to
   max-w-[760-820px] and center the whole label+subject group on the viewport
   mid-line so the dead lower half closes. Same for the CTA convergence subject
   (the dot/card/folder/pill should arrive at a confident ~480-560px width, the
   dot beat should be a 40-48px dot or skip the bare-dot beat entirely and open
   on the capture card). Ownership numbers: vertically center the 3 stats and
   let them be genuinely large with the runway tighter. The single biggest
   premium lever on the page.

2. [HIGH] **Tighten the runways so there are NO near-empty transition frames.**
   The hero is 300vh, how 300vh, CTA 200vh. Between pins the page shows a dead
   frame (y2600, y5600, y11800). Either (a) cut runway heights ~20-25% so beats
   are denser per scroll unit, or (b) let the next section's content begin
   rising into the bottom of the outgoing pin (overlap the hand-off) so the
   screen is never 80% empty. No frame should read as "a dot in a void."

3. [MED] **Group the label with its subject.** In the hero the beat label and
   the morph card are ~200px apart vertically. Pull the gap to ~48-64px so the
   sentence and the object it describes read as one composed unit, the way the
   static fallback already does.

## A2 - HORIZONTAL PANELS PARK MID-SLIDE (this is the real "janky" tell)

[HIGH, advisory] How-it-works: because the 300vw track is a continuous linear
scrub with no snap, ANY rest position between the 3 snap points shows two or
three SLICED half-panels at the screen edges (y3700: "oes live." clipped left +
"It lands in y..." + "~/Dropbox/T" clipped right; y4900: "racer/" left +
"Send the link" center + "tracer.nocorny.c" right). A still frame caught
between panels looks broken/unfinished - this is what reads as janky, not the
frame rate. Fixes, best first:
- (a) Add scroll-snap so the track rests ON a panel, never between: give the
  runway snap points at p = 0, 0.5, 1 (CSS scroll-snap on the runway, or clamp
  the useTransform so it eases to the nearest panel and dwells there). Each rest
  shows ONE clean full panel.
- (b) If keeping the free scrub, fade neighbor panels' opacity down hard at the
  edges (a vignette/mask on the runway) so a sliced panel is dimmed, not a
  sharp half-card bleeding in. (a) is the premium answer.
- Also vertically center the panel grid: at y3100 the section heading is pinned
  top and the panel sits in the bottom 40%, leaving a ~350px empty mid-band.

## A3 - CTA REST IS SCATTERED (user's exact complaint, confirmed)

[HIGH, advisory] At the CTA rest (y11200) the link pill is upper-left (and
clipping its own text: "tracer.nocorr" cut off at the pill's right edge),
then a ~150px gap, then the Download button mid-left, then the note - all
crammed in the left third with the headline OUT of frame and the right 70% of
the stage empty black. v2's tight grouping is gone. Compose the CTA rest as ONE
centered stack:
- headline (in frame), then the resolved link pill (full width, not clipped),
  then Download + note, all optically centered on the stage with generous but
  EQUAL vertical rhythm between them. Center the group, do not left-rag it into
  a void. Fix the link pill clip: at rest the clipPath must finish at inset(0)
  AND the pill container must be wide enough for the full SHARE string (it is
  currently narrower than its content, so even resolved it truncates).

## A4 - THE GLOBAL SCROLLDOT READS AS A STRAY DOT, NOT A PROTAGONIST

[MED, advisory] The concept (one record-red dot threading the page, docking at
each section marker) is good and the docking-to-nav touch (it lands under the
active nav item, y3700/y6600) is genuinely authored. BUT in the inter-section
voids (y5600, y7600, y10600) it floats alone in empty space and reads exactly
as the user feared: "a stray floating dot." It only reads as a protagonist when
there is something near it to relate to. Fixes:
- Once the voids close (root-cause fix above), the dot will almost always have a
  subject nearby - that alone rescues it.
- Give it a faint vertical hairline trail (a 1px low-opacity accent line it
  draws behind itself as it travels) so it reads as ONE continuous thread, not a
  dot that teleports between frames. A trailing spine is the difference between
  "stray dot" and "the file moving through the page."
- Make its weave less wandering: the current weave (20/62/32/70/50 vw) sends it
  to random horizontal spots that rarely align with the on-screen subject. Bias
  the weave stops so the dot passes THROUGH or beside the active subject at each
  section, then it reads as the file being carried, which is the whole story.

## A5 - HERO: TOP-OF-PAGE GAP

[LOW, advisory] At y0 the headline sits at ~190px and the first beat label +
pill sit at ~615-820px, with ~350px of empty black between headline and the
recorder pill. The very first impression has a soft middle. Pull the opening
beat up under the headline (or run the headline INTO the first beat as part of
the scrub) so the first screen is full from the start.

## What HOLDS (do not regress)

- ONE accent (#e5484d record-red) everywhere: dot, sync dots, tick, Download,
  bar fill, nav active marker, footer dot. No second hue. PASS.
- Type floor: all visible copy >=16px; spec strip, mono path/link strings,
  body all >=16px. PASS (confirmed in source + live).
- Grid unity: how / features / ownership / faq still dock to the V2 unified
  grid; features = clean 3x2 uniform cards (equal w+h, hairline borders);
  ownership truth rows uniform with lit red dots; FAQ two-column uniform. The
  uniform-siblings + same-role-same-style gates from V2 still PASS.
- Section-shape variety (vertical scrub / horizontal scrub / parallax / full-
  bleed wordmark) genuinely breaks the AI block rhythm. PASS - keep it.
- Footer wordmark (y12400) is a confident, premium close. PASS.
- Reduced-motion: runways collapse (13501->6722px), every scrubbed section
  rests on a composed static state, 0 CLS. PASS.
- Mobile 500px stub: single screen, no overflow, minimal. PASS.

## One-pass priority order (do these, re-shoot, ship)

1. Close the VOID: big centered subjects + tighter runways + no empty
   transition frames (root cause, kills "boring/empty"). [HIGH]
2. Snap the horizontal how-it-works panels so no frame shows sliced half-panels
   (kills the "janky" tell). [HIGH]
3. Recompose the CTA rest as one centered stack, fix the clipped link pill.
   [HIGH]
4. Give the ScrollDot a trailing spine + subject-biased weave so it reads as a
   thread, not a stray dot. [MED]
5. Close the hero top gap. [LOW]

None of these block ship on the doctrine gates - but items 1-3 are what stands
between "the morphs technically work" and "this feels like a premium, authored
film." Worth the one focused pass before deploy.
