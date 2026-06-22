# Tracer by NoCorny — Live Trend Scan

> **Scouted:** 2026-06-22 by 3mpq-scout
> **Expires:** 2026-07-22 (redo before continuing if resumed after that).
> **Project:** Tracer by NoCorny — free, open-source (MIT) macOS screen recorder.
> Record with a hotkey, the video uploads to YOUR OWN Dropbox (never NoCorny
> servers), and you get a clean shareable link like `tracer.nocorny.com/v/k7r2-mx9p`.
> A Loom alternative on the ownership / privacy angle.
> **Audience:** developers, designers, indie hackers, prosumers who want to own
> their data and like OSS.
> **Locked direction (NOT relitigated):** single accent = record-red `#E5484D`
> (the record dot as the one motif), MAX WOW cinematic interactive hero that
> performs record -> Dropbox -> shareable link, AirBnB-style morph motion,
> DESKTOP-ONLY (mobile is a deliberate single-screen stub). Theme leans dark/
> cinematic per the redesign brief (the recorder context wants a dark stage);
> director confirms the final default.

This is a REDESIGN off a competent-but-generic template (see `REDESIGN_BRIEF.md`):
purple gradient brand, PT Sans + Mulish, sub-16px chips, a 6-card grid, and a
hero that *shows* a finished video page but never *performs* the flow. Base
catalog: `../../../research/awwwards-2024-2026-patterns.md`. This file is the
current delta the director and architect fold into the bar and contract.

---

## 1. Recommended font pairing (roles VERIFIED)

### Verdict: **Geist (headings) + Hanken Grotesk (body)**

Both free, both Google Fonts, both variable. This replaces the template's
PT Sans + Mulish AND beats the standing doctrine default (Montserrat + Manrope)
for THIS audience. Evidence below.

**Why not the doctrine default here.** Montserrat + Manrope is the safe house
pairing, not a current one. Across 2026 roundups Manrope is now named as part of
the "Inter / Manrope / DM Sans crowd" that headlines should *stand out from*
(Made Good, MaxiBestOf, Untitled UI). A developer audience reads "Manrope body"
as a template, which is exactly the read this redesign exists to kill. Retire it
for Tracer.

**Why Geist for headings (verified as a display / heading role).**
- Geist is Vercel's typeface, purpose-built for developer tools and infra SaaS.
  Multiple 2026 sources call it the gold standard for dev tools and note it
  "projects more confidence and a slightly more technical personality" than
  Inter. That technical confidence is Tracer's read: an OSS tool for people who
  own their stack.
- Role check: at hero scale, Geist weight 700 with negative tracking
  (`-0.02em` to `-0.03em`) is the documented heading recipe (Pravin Kumar,
  2026). Sharp and geometric at large sizes is the heading job.
- It ships Geist Mono, which we use for ONE thing: the shareable-link string
  `tracer.nocorny.com/v/k7r2-mx9p` and any file path (`~/Dropbox/Tracer/`). That
  is a third role inside one type system, not a third family, so it stays inside
  the two-family rule (Geist Sans + Geist Mono are one system).

**Why Hanken Grotesk for body (verified as a body / text role).**
- Geist has one known weakness: small body sizes read ~8% slower on Windows.
  Tracer's audience is on macOS, but body copy still wants the most legible face.
  Hanken Grotesk is described in 2026 roundups as "the strongest free
  bouba-grotesk body workhorse: soft, friendly, screen-optimized" and "the free
  alternative to commercial bouba grotesks." Warmth and legibility at 16 to 18px
  is a body role by definition.
- It is genuinely current (rising, not peaked) and far less ubiquitous than
  Manrope or Inter, so the page does not read as a template.
- Soft, friendly body under a sharp, technical heading is the tension the best
  dev-tool sites run, and it satisfies the user's standing dislike of
  hard-to-read faces (IBM Plex is explicitly out).

**Single-family fallback (only if the two faces ever fight):** Geist Sans across
hero, body, and UI, hierarchy by weight and tracking only (hero 700 / body 400 /
UI labels 500 positive tracking). One 2026 dev-tool school argues a single
variable family is cleaner for infra SaaS. Keep this as the escape hatch, not the
plan. The plan is Geist + Hanken Grotesk.

**Type scale (4 sizes, all >= 16px), fixing the template's sub-16px violations:**
- Display (hero h1): `clamp(56px, 8vw, 116px)`, Geist 700, tracking `-0.03em`,
  leading `0.95`.
- Section h2: `clamp(34px, 4.5vw, 60px)`, Geist 700, tracking `-0.02em`.
- Body: `18px` desktop, Hanken Grotesk 400, leading `1.6`.
- UI / label / link string: `16px` floor, Geist or Geist Mono 500.

No eyebrows or kickers above headings (doctrine: captions banned). This deletes
every "Free · Open source · macOS" / "How it works" / "Features" chip from the
current site.

---

## 2. Concrete patterns to use for Tracer (each justified)

### Pattern 1 — Hero PERFORMS the flow once on load; it does not show a finished page
The strongest 2026 signal for app and dev-tool landings: the static screenshot
hero is dead, the hero is now a live UI fragment that *demonstrates* the product
(Linear, Cursor, Vercel, Granola; SaaSframe names Notion / Linear / Framer for
story-driven heroes, Amplitude / Forest Admin for immersive in-hero previews).
The current Tracer hero already has the parts (a `REC 00:42` recorder pill, a
mocked video page, a transcript panel) but they sit static and compete. Collapse
them into ONE choreographed verb chain played once on load:
**hit record -> the capture lands in YOUR Dropbox -> a clean link appears,
copied.** This is the MAX WOW the brief demands AND the literal value prop, so it
earns its weight instead of decorating.

### Pattern 2 — The record-red dot as the single moving protagonist
Accent is locked to record-red `#E5484D`, replacing the purple gradient
wholesale. Make the record dot the one element that threads the hero: it pulses
live during record (the one allowed infinite loop, a genuine live indicator per
doctrine), then travels and *becomes* the Dropbox sync dot, then *becomes* the
copied-link tick. One object, three states, AirBnB morph between them. This turns
"one focal point per screen" into the narrative device and fixes the current
hero's three-competing-focal-points problem. No second color anywhere (kills the
leftover `--brand-red` vs purple split).

### Pattern 3 — Real macOS chrome, hairline-bordered, not a generic browser card
CleanShot, Screen Studio, and Raycast all sell trust by showing the *actual*
native surface; Cap (the closest peer) uses realistic UI mockups in greyscale
with one accent. For Tracer the honest surface is the macOS menu-bar recorder
pill, which is where the app actually lives. Render it pixel-honest with the
hairline border token (`gray-200` light / `#393939` dark), `radius-window 12px`,
light-theme shadow. Showing the genuine native UI is the credibility move for a
"runs on your machine, you own this" tool. Drop the generic 3-dot browser-window
cliche.

### Pattern 4 — Scroll-driven storytelling that continues the hero's morph chain
2026 scroll choreography for product tools "animates the hero into a live preview
as you scroll." Extend the hero's chain down the page so "How it works" is not a
separate 3-card row but the same morph re-staged: record -> your Dropbox folder
(`~/Dropbox/Tracer/`) -> the `tracer.nocorny.com/v/...` link. Use native CSS
`animation-timeline: scroll()` / `view()` where possible (~92% support, off main
thread, protects the tightened 2.0s LCP) and reserve Motion 12 `useScroll` for
the morph CSS cannot express. One claim per panel, terse and uniform.

### Pattern 5 — Bento feature grid, icon-free, hairline cells (replacing the 1+5 card grid)
The current "1 hero card + 5 equal cards" grid is the default SaaS look. Bento is
still the dominant dense-capability layout, but the Awwwards-grade move is
hairline-bordered cells with NO icon-trio rows (the icon row now reads as
bad-SaaS). Re-cut the real feature set into a calm 6-cell bento, each cell terse
and same-shaped, from product truth only: free and open source (MIT); your
Dropbox, your files; AI titles and transcripts; searchable captions; one-click
share; lightweight viewer counts (no tracking pixels). Borders everywhere; one
cell can hold a small live morph, the rest stay quiet.

### Pattern 6 — The shareable link as a tactile, copyable artifact in Geist Mono
The payoff of the whole product is a link, and Tracer already has the exact
format that sells it: `tracer.nocorny.com/v/k7r2-mx9p`. Treat it as a real
object: a pill showing that string in Geist Mono with a copy affordance that
morphs to a record-red tick on click (state change, smooth ease, no loop). This
is the one place mono earns its seat and it makes "instant shareable link"
concrete instead of asserted. Keep the literal `/v/k7r2-mx9p` format intact (it
is in KEEP).

### Pattern 7 — Privacy "what's missing" diagram as a spec/fact strip, not a logo wall
Tracer is new and OSS, so there is no honest enterprise-logo wall. The current
site already has the right idea (a "Your Mac -> Your Dropbox -> Viewers" diagram
with "notice what's missing? Tracer's video servers, because there aren't any").
The 2026 move is to formalize that into a hairline-bordered, monochrome spec
strip of terse true facts: free and open source, your Dropbox not ours,
recordings never touch a NoCorny server, no watermarks ever, revoke by
disconnecting Dropbox, MIT licensed, no cookies or trackers. This is the
credibility unit for an ownership tool and it avoids inventing social proof.
Drop the emoji and the "made with love" line per the KILL list; the facts carry
it. Every number must be real or the line is cut.

---

## 3. Three reference landings worth stealing structure from

### 1. Cap (cap.so) — the closest peer; steal the trust architecture
OSS screen recorder, own-bucket ownership, the same positioning Tracer owns. Its
structure: hero with one verb claim ("Record and share in seconds") plus an
explicit ownership line, then mode mockups in greyscale with a single accent,
then trust, terse feature blocks, transparent pricing, FAQ. STEAL: the ownership
sentence right under the headline, the greyscale-plus-one-accent UI mockups, and
open-source-as-trust. BEAT: Cap shows static mockups across three modes; Tracer
collapses to one flow and *animates* it, which is the differentiator.

### 2. Screen Studio (screen.studio) — steal the cinematic product-as-hero polish
The reference for making a macOS recorder look beautiful: the product itself is
the cinematic object (automatic zoom, smooth cursor, clean background). STEAL:
the discipline of letting one gorgeous, motion-polished surface carry the hero
with almost no chrome around it, and the "the app does the polish for you"
confidence. This is the bar for the MAX WOW hero feel and the dark cinematic
stage Tracer leans toward.

### 3. Raycast (raycast.com) — steal the native-app structure and restraint
A native macOS app landing that sells trust through the genuine UI surface (the
command-palette motif repeated as visual continuity), Fast / Native / Reliable as
terse one-word labels, real creator testimonials, restrained single-accent
palette. STEAL: one repeated UI motif threaded through the page (for Tracer that
is the record-red dot, Pattern 2), the terse one-word capability labels, and the
single-accent restraint. Raycast proves a native-app page reads premium without
a logo wall or a busy feature grid.

---

## 4. What is current vs fading (this window)

**Gaining ground (adopt):**
- Hero as a live, playable product fragment that demonstrates the flow (now
  table stakes for native-app B2B, not a wow extra).
- Native CSS scroll-driven animation (`scroll()` / `view()`), ~92% support, off
  main thread, protects the tightened 2.0s "Good" LCP threshold.
- Geist for dev-tool branding; Hanken Grotesk as the fresh free body workhorse.
- Hairline-bordered bento and spec / fact strips replacing icon rows and fake
  logo walls.
- Motion with meaning only ("demonstrate functionality, not decorate"), a single
  choreographed entrance that rests.

**Fading (avoid):**
- Static screenshot heroes (the current Tracer hero is one).
- Multi-stop gradient wordmarks and gradient-fill buttons (an AI / template tell;
  it is exactly the purple system being killed).
- Inter / Manrope / DM Sans / PT Sans as the default heading-or-body crowd.
- Icon-trio feature rows.
- Eyebrow / kicker chips above every heading.
- Magnetic cursors, mix-blend custom cursors, chromatic aberration (agency-
  portfolio only in 2026; none on verified B2B refs).
- Generic 3-dot browser-window cards where the real native surface sells more
  trust.

---

## 5. Direction brief (the proactive proposal)

**The current move is:** the hero stops describing the product and *performs* it
as one continuous, once-played morph, with a single accent object as the
protagonist of that morph.

**The fresh take for Tracer:** make the record-red dot the protagonist and the
narrative the literal product chain. The dot pulses live (record) -> travels and
becomes the Dropbox sync dot (lands in YOUR `~/Dropbox/Tracer/`) -> becomes the
copied tick on a real Geist-Mono link pill showing `tracer.nocorny.com/v/k7r2-mx9p`
(share). One object, three honest states, AirBnB spring morphs between them,
played once on load, echoed in scroll. The link is a tactile copyable artifact,
the macOS chrome is pixel-honest, and the only infinite motion on the page is the
genuine record-blink.

**Why it beats the safe default (and the current site):** the current site is a
tasteful dark SaaS template, a purple-gradient beauty-shot of a finished video
page under a PT-Sans headline. It looks fine but says nothing about *ownership*,
which is Tracer's entire reason to exist. Our hero makes ownership visible: you
watch the file land in *your* Dropbox and the link appear, with nothing routed
through a NoCorny server. It is MAX WOW that is also the argument, on a font
system (Geist + Hanken Grotesk) that reads as a current developer tool instead of
a template, with one bold accent instead of a gradient.

---

## Sources

- Geist for dev tools (gold standard, technical confidence, Geist Mono pairing):
  https://www.pravinkumar.co/blog/inter-geist-plus-jakarta-sans-webflow-b2b-2026
- Popular fonts 2026 (Inter default, Geist rising, Geist Sans + Mono for dev):
  https://madegooddesigns.com/popular-fonts/
- SaaS font pairings 2026 (Geist + Inter gold standard for dev tools):
  https://denisaalla.com/modern-saas-font-pairings-2026/
- Manrope as part of the overused default crowd; Hanken Grotesk + Geist as the
  current free alternatives:
  https://madegooddesigns.com/best-sans-serif-fonts/ ,
  https://maxibestof.one/typefaces/overused-grotesk ,
  https://www.untitledui.com/blog/best-free-fonts
- Geist usage on shipping sites (Vercel Ship, basement studio, tech / SaaS):
  https://www.awwwards.com/websites/Geist/
- 2026 landing trends (interactive demos in hero, scroll storytelling, micro
  animation with purpose, real product UI over abstract):
  https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples ,
  https://theswiftk.it.com/blog/app-landing-page-design-trends-2026
- Cap (closest OSS own-bucket peer): https://cap.so
- Screen Studio (cinematic macOS recorder): https://screen.studio/
- Raycast (native macOS app landing): https://www.raycast.com
- CleanShot (native capture UI as trust): https://cleanshot.com/
