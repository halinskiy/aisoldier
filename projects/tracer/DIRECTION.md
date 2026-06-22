# DIRECTION — Tracer by NoCorny

Owner: 3mpq-director · Date: 2026-06-22 · Build: Tier 1+ MAX WOW redesign
Hand to: 3mpq-architect (compile into SECTION_CONTRACT.md), then 3mpq-soldier.
Source of truth for facts: `REDESIGN_BRIEF.md` §1. Invent nothing.

LOCKED (do not relitigate): accent record-red `#E5484D` (one accent, the red
record dot is the single motif); Geist display + Hanken Grotesk body + Geist Mono
for link/path strings only; DESKTOP-ONLY (1440px is the masterpiece, mobile is a
single-screen stub); light page base + cinematic dark hero stage, light -> dark
-> light rhythm. This file formalizes all of it into a checkable bar.

---

## 0. The bar (what "done" feels like)

Apple/Linear/Screen-Studio tier. The page reads like the native Mac tool it
advertises, not a marketing site. One bold red motif, generous air, genuinely big
type, and ONE cinematic hero that PERFORMS the product's whole promise once on
load. The opposite of the killed purple-gradient template. "Looks fine / standard"
is a failure. The hero is the thing people screenshot.

---

## 1. The ONE flow + ONE focal point per screen

**The single user path (build only this):** a developer lands -> watches the hero
perform record -> their Dropbox -> a clean link -> scrolls the same chain restaged
as "how it works" -> skims the icon-free capability bento -> reads the one ownership
spec row -> checks FAQ -> hits "Download for macOS". One CTA verb the whole way:
**Download for macOS** (GitHub star is the only secondary, used once in nav). No
second flow, no sign-in journey, no pricing path, no use-case personas. If a second
flow creeps in, cut it.

**One focal point per screen (enforced):**
- Nav: the wordmark + the single red Download button.
- Hero: the morphing object. Headline supports it, never competes. Kill the
  current three-competing-focal-points hero (recorder pill + video page + transcript).
- How-it-works: the one re-staged morph panel in view at a time (3 beats, one at a time).
- Features bento: the grid as one calm field; at most ONE cell holds a small live morph.
- Ownership strip: the single hairline mono spec row.
- FAQ: the open question.
- Final CTA: the one red Download button on the dark stage.

---

## 2. The hero brief (concrete, the whole motion budget goes here)

**Stage.** A cinematic DARK "studio" stage (like a recording open in a dark
editor), full content-column width, hairline-bordered, `radius-window 12px`. Page
base is light; the hero is the first dark moment. Dark-theme opacity layering for
text hierarchy (white/80 headline-on-stage support, /50, /40). Red record dot and
the final link pill are the only saturated elements; everything else on the stage
is monochrome ink-on-dark.

**The object.** ONE continuous morphing object threads all three states. The
record-red dot is the protagonist: it pulses live, then travels and BECOMES the
Dropbox sync dot, then BECOMES the copied-link tick. One object, three honest
states, AirBnB spring morphs between them. Not three cards fading in.

**Chrome, pixel-honest.** The recording surface is the genuine macOS menu-bar
recorder pill (where the app actually lives), hairline-bordered, native-honest. NOT
a generic 3-dot browser-window card. This is the trust move for a "runs on your
machine, you own this" tool; the audience checks GitHub before the CTA.

**The 5-beat storyboard (what enters, morphs, rests):**

1. **REC (enters).** The macOS menu-bar recorder pill settles onto the dark stage
   (soft-spring entrance, gentle overshoot). The red record dot is LIVE and pulsing
   (this is the ONE permitted infinite loop, a true live indicator). A timer ticks
   `00:00 -> 00:04`. Feels like the app is recording right now.
2. **STOP -> CONDENSE.** The recording frame condenses/shrinks into a single
   travelling capture object (the file made physical). The red dot detaches as the
   moving protagonist and leads it.
3. **-> DROPBOX (the proof of ownership).** The capture flies into a recognizable
   Dropbox folder object labelled `~/Dropbox/Tracer/` (Geist Mono path). The red
   protagonist dot lands and becomes the Dropbox sync dot. This is the beat no
   competitor can show: the file goes somewhere the viewer ALREADY owns. Show the
   Dropbox glyph plainly, monochrome except the red sync dot.
4. **-> LINK MATERIALIZES.** A clean share-link pill grows into place showing the
   real string `tracer.nocorny.com/v/k7r2-mx9p` in Geist Mono. No account wall, no
   watermark, no cookie banner on the implied viewer page (the contrast with Loom's
   gated player is the silent punchline).
5. **COPY -> RED TICK (rests).** A copy affordance on the pill morphs to a
   record-red tick on click/auto-trigger (smooth ease, no loop). The whole chain
   now RESTS in the final share-link state. Only the original record dot motif
   (now the live indicator on the resting pill, if used) may keep pulsing; nothing
   else moves.

**Reduced-motion / `?motion=0` / LCP.** The headline carries the meaning
server-side; the morph enhances, never gates it. Reduced-motion and `?motion=0`
land statically on beat 5 (the final share-link state, red tick shown). The three
beats must be legible before motion fires.

**Headline register (copywriter owns final words; this is the brief).** Short,
plain, a verb and a grievance, in the shape of "Stop renting your screen
recordings." Plus ONE subheading line stating the mechanism (record on Mac, lands
in your Dropbox, instant link, free, no account). Genuinely big display type. NO
eyebrow/kicker above it. No "AI-powered" in the headline.

**The one near-fold credibility unit (not chip-soup).** The killer facts (Free
forever, MIT, ~12MB, No account, Your Dropbox) render as a SINGLE quiet
hairline-bordered spec ROW, monochrome, Geist Mono internals, one line, max five
facts, uniform shape. This is the ONE place that credibility lives near the fold.
Not a scatter of colored pills.

**Scroll choreography (re-stages the hero as "How it works").** The hero's morph
chain continues down the page: "How it works" is NOT a separate 3-card row, it is
the SAME chain re-staged as three scroll-driven panels, one claim per panel, one in
view at a time: record -> `~/Dropbox/Tracer/` -> the `tracer.nocorny.com/v/...`
link. Prefer native CSS `animation-timeline: scroll()`/`view()` (off main thread,
protects LCP); reserve Framer Motion `useScroll` for what CSS cannot express.

---

## 3. Section list + order (7 sections) — theme + text budget

ONE full-width Swiss grid (12 columns). Every section shares the same left/right
edges; wide elements fill the content column edge to edge. Grid overlay toggle in a
corner: ON for the first build prompt, OFF from the second, toggle stays.

| # | Section | Theme | Focal point | Text budget (ceiling) |
|---|---|---|---|---|
| 1 | **Nav** (sticky, morph-on-scroll) | light | wordmark + red Download button | wordmark + nav links + 1 button label. No tagline. |
| 2 | **Hero** (cinematic morph stage) | DARK studio stage on light page | the morphing object | H1 + 1 sub line + 1 hairline mono spec row (<=5 facts) + 1 CTA (+ ghost GitHub). Nothing else. |
| 3 | **How it works** (re-staged morph, scroll) | light | one morph panel at a time | H2 + at most 1 sub. 3 beats, each = a 2-3 word label + one short line. Uniform. |
| 4 | **Features** (icon-free hairline bento) | light | the bento as one calm field | H2 + at most 1 sub. 6 cells, each = a short label + one terse line. NO icons, NO paragraphs. Uniform shape. |
| 5 | **Ownership / privacy spec strip** | DARK studio stage | the single hairline mono spec row | H2 + at most 1 sub. ONE monochrome hairline spec strip of terse true facts (your Dropbox not ours, never on a NoCorny server, no watermarks, revoke by disconnecting, MIT, no cookies/trackers). Uniform one-line items. |
| 6 | **FAQ** (accordion) | light | the open question | H2 only (no sub). Each item = question + one short answer. No preamble. |
| 7 | **Final CTA + footer** | final-CTA DARK stage, then light footer | the one red Download button | CTA: H2 (verb+grievance shape) + 1 sub + 1 red Download button. Footer (light): big wordmark, GitHub, Download, real links, one bottom line (MIT, no cookies). No manifesto, no "made with love", no emoji. |

**Theme rhythm (formalized, confirmed):**
`light nav -> DARK hero -> light how-it-works -> light features -> DARK ownership
strip -> light FAQ -> DARK final-CTA -> light footer.` The dark moments are the
dramatic beats (record stage, ownership proof, the closing ask). Each dark/light
transition is a smooth morph, never a hard cut or cream flash.

**Minimum-text law (blocking):** a section ceiling is heading + at most one
subheading; many need only the heading. Content inside is terser and UNIFORM (every
item the same short shape: a label, a number, one line). No captions, no
eyebrow/kicker, no helper text, no paragraphs where a phrase works, no third text
element. It is easier to add than remove; ship the minimum.

---

## 4. Motion spec (AirBnB-style, plays once then rests)

- **Entrances:** soft spring with gentle overshoot, `cubic-bezier(0.34,1.42,0.5,1)`,
  durations 0.4-0.9s, choreographed and staggered. Elements grow/expand/morph into
  place; never a hard cut, never a flat fade as the default.
- **Hover / state changes:** smooth ease `cubic-bezier(0.2,0.8,0.2,1)`, min 150ms.
  The copy -> red-tick is a smooth state morph (no loop).
- **Plays once then rests.** Every entrance morph fires ONE time on load/scroll-in,
  then rests. NO infinite loops anywhere EXCEPT the single live record dot (a
  genuine live indicator). Idle decoration that never settles is cut.
- **One continuous journey.** Every transition the user meets (entrance, hover,
  state, dark<->light section boundary, scroll re-stage) is a smooth morph or soft
  transition. The whole page feels like one fluid AirBnB-style journey.
- **Demonstrate, not decorate.** Motion exists to show the flow, never to ornament.
- **`prefers-reduced-motion` and `?motion=0` respected** everywhere: land on final
  states statically, no movement, full meaning preserved.

---

## 5. Do-not list (this build, blocking)

- **No purple / no second brand hue.** Record-red `#E5484D` is the ONLY accent. The
  killed purple gradient system stays dead.
- **No gradient text, no gradient-fill buttons.** Multi-stop gradient wordmarks/CTAs
  are an AI/template tell. Solid red CTA, ink wordmark.
- **No eyebrow / kicker / brand chips** above any heading. Headings stand alone.
- **No chip-soup proof pills.** The near-fold facts collapse to ONE hairline mono
  spec row (<=5 facts). No scatter of colored pills anywhere.
- **No 24-logo trust wall** (no honest enterprise logos exist; do not fake social proof).
- **No icon emoji, no icon-trio feature rows.** The bento is icon-free, hairline cells.
- **No sub-16px text anywhere** (no exceptions for spec rows, meta, or labels).
- **No more than 2 font families.** Geist (display/headings, also UI labels) +
  Hanken Grotesk (body). Geist Mono is the SAME Geist system, used ONLY for the
  share-link string and file paths. ~3-4 sizes total.
- **No generic browser-window card** in the hero. Pixel-honest macOS chrome only.
- **No real responsive mobile.** Mobile is the deliberate single-screen stub (logo,
  one line, Download for macOS). No hero animation on mobile. Verify
  `document.body.scrollWidth === clientWidth` at 500px (no overflow).
- **No em/en dashes, bullets, middle dots, or hyphens-in-prose.** ASCII only. Real
  identifiers (`~/Dropbox/Tracer/`, `/v/k7r2-mx9p`, MIT) exempt.
- **No hedge / cutesy copy, no emoji** ("a quiet little...", "made with love",
  "Built for sharing, not for selling"). Verbs and grievances, BBC-plain.
- **No competing focal points per screen.** One thing matters per screen.
- **No raw hex outside `tokens.css`.** Every literal color in one token block;
  `var(--*)` everywhere else.
- **No static-screenshot hero, no flat-fade-as-default, no infinite idle decoration**
  (only the record dot pulses forever).
- **No invented facts.** Every number/feature matches `REDESIGN_BRIEF.md` §1.

---

## Verdict gate (post-build, blocking)

I block on: more than one flow; any section over the text budget (body-paragraph
content, a caption, a third text element); more than 2 font families or more than
~4 sizes or any sub-16px text; cramped spacing (no air); a static/effectless page;
any purple or gradient; chip-soup; a generic hero card; a real responsive mobile
where a stub was specified. Each issue gets: what, where, and the cut or change.
DIRECTOR_REVIEW.md will read the LIVE rendered 1440px page (headless screenshot),
not source.
