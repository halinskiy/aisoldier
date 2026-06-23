# Tracer — Review Log

Reviews by 3mpq-judge. Nothing reaches the user until the verdict is **PASSED**.

---

## 2026-06-23 — V3 SCROLL-SCRUB review (motion re-architecture, live scroll-driven)

**Reviewer:** 3mpq-judge
**Live target:** http://localhost:3107 (1440px desktop). Driven by SCROLL POSITION via `tools/scroll-probe.mjs` (real Chrome CDP, scrolls to absolute scrollY, lets the spring settle 1.2s, screenshots + captures console). NOT the static `shoot.mjs` fallback. 30+ probes across every runway, plus `?motion=0`, plus 500px mobile, plus CDP assertions.
**Verdict:** ISSUES (3 items: 1 FAIL, 2 WARN). The motion engine, the smoothness fix, and the hydration fix all PASS. The single FAIL is a dead/empty stage at the CTA climax END and two adjacent empty seams — the exact "I did not see morphs / empty stage" complaint recurring at transition points, not in the beats themselves.

Independent screenshots (my own, scroll-driven), all in `/tmp/aisoldier-judge/tracer-v3/`:
- Hero: `hero-y0/750/1500/2200.png` (3 beats: REC pill -> Capture card travels to Dropbox -> Share-link card)
- How: `how-y3400/4000/4700.png` (horizontal panels: Hit record -> It lands in your Dropbox -> Send the link)
- Features+Ownership: `feat-own-y6200/7200/7800/8500.png`, `own2-y7600/8000.png` (bento tick, numbers scrub, truth rows)
- FAQ+CTA: `faq-cta-y9500/10500/11200/12434.png`, `cta2-y10100/10800/11500.png`, `ctarest-y11900.png`
- Static: `m0-y0/3500.png`, `m0end-y5822.png` (?motion=0 composed end states)
- Mobile: `mob-y0.png` (500px stub)

---

### 1. SCROLL-DRIVEN MORPHS — mostly PASS, one FAIL on dead stages

**Hero (300vh, 3-beat vertical scrub) — PASS.** Driven by scrollY, every beat shows a live morphing subject, no empty stage:
- y0/y750 beat 1: "Hit record." + the `00:04 Recording` pill (red dot + stop button), ScrollDot tracking top-left.
- y1500 beat 2: "It is in your Dropbox." (mid blur-seam) + the `Capture saved / recording.mp4` card physically traveling toward the `~/Dropbox/Tracer/` folder slot. Live hand-off.
- y2200 beat 3: "Share the link." + the resolved card (`~/Dropbox/Tracer/ Synced` + `tracer.nocorny.com/v/k7r2-mx9p` + red tick) + SpecStrip. ScrollDot docked.

**How-it-works (300vh, horizontal scrub) — PASS.** Full-width panels, BIG readable text, NOT one-word-per-line. The horizontal travel is visible mid-scrub (y4000 shows panel 1 exiting left, panel 2 centering, panel 3 entering right). Panels read "01/03 Hit record", "02/03 It lands in your Dropbox", "03/03 Send the link" with proper body sentences and Geist Mono path/URL. The `01 / 03` panel counter is the contract's intended ordinal, not a banned eyebrow.

**Features (scrubbed reveal) — PASS.** 6 uniform bordered cells, copy verbatim, no icons. ScrollDot docks on `One click to share` (items[3]) with the red tick affordance.

**Ownership numbers (150vh) + truth rows — PASS on content, but see FAIL seam.** y7200/y7600 show the scrub working: `~0MB -> ~11MB` count-up, the upload bar filling, `0 servers` clip-revealing left-to-right, `MIT` fading in. y8500 shows all 4 truth rows lit red on the rail. The numbers and the truth rows are both alive.

**CTA (200vh, 4-beat climax) — PASS on beats 2-4, FAIL on the rest END.** y10100 beat 1 (headline + arriving ScrollDot), y10800 beat 2 (`recording.mp4` capture card blooms), y11200/y11500 beat 4 (link pill `tracer.nocorny.com/v/k7r2-mx9p` + tick resolves). The convergence chain is real and visible.

**FAIL — three dead/empty stages at transition seams.** Driving by scrollY, three positions show a backbone/connective stage that is essentially empty black (morph subject gone, next content not yet arrived):
- **CTA end of runway (y11900, p~=1, the "rest")** — the WORST. The sticky stage is FULLY EMPTY black. Headline, link pill, Download button and note line have ALL scrolled off the top while the footer rises from the bottom. The contract S7a "Rest (p=1): headline + pill + Download button + note line simultaneously visible" never actually happens: by the time p reaches 1 the composed content has exited the viewport top. The climax of the whole page ends on a black void. (`ctarest-y11900.png`)
- **Ownership numbers->truth-rows seam (y8000)** — ~600px of empty dark between the numbers strip leaving the sticky stage and the first truth row entering from the bottom. Only the ScrollDot and a faint glow occupy the viewport. (`own2-y8000.png`)
- **CTA beat1->beat2 seam (y10500)** — headline gone off top, capture card not yet bloomed; center+top of the stage empty with the Download button stranded low-left. (`faq-cta-y10500.png`)

Root cause (CTA): in `CTAConvergence.tsx:122-179` the convergence subject + Download + note live INSIDE the sticky stage with `justify-center`, but the headline is rendered OUTSIDE/above it, and the morph subject is `items-start` (left column only). So (a) headline and resolved pill never coexist, and (b) as the 200vh runway finishes, the sticky un-pins and the centered content scrolls up and out before p hits 1, leaving the final frame empty. The "rest" the user lands on after the climax is a black void, not the composed headline+pill+button.

Root cause (Ownership seam): the numbers sticky stage (`OwnershipNumbers.tsx:74` 150vh) releases, but the truth rows section starts far enough below that a full empty viewport sits between them.

This is the user's complaint resurfacing: the beats DO morph (big win over V2's empty scrubbed stages), but the SEAMS between/after them still read as dead text-less black — and the CTA climax literally ends on emptiness.

### 2. SMOOTHNESS (the "рвано" fix) — PASS

J1-J10 verified on the live page + source:
- **J1 ONE rAF loop** — single `ReactLenis` provider in `layout.tsx:57` (autoRaf). No second loop.
- **J2 no scroll listeners** — `grep addEventListener.*scroll src/` = 0. Nav uses `useLenis(({scroll})=>...)` (a Lenis subscription, not a raw listener).
- **J3 no setState-on-scroll-morph** — the only scroll-fed setState is Nav's threshold-crossed boolean (`Nav.tsx:41-44`, guarded `prev===next?prev:next`, fires only crossing scroll>24) and `OwnershipNumbers.tsx:71` `useMotionValueEvent(count)` feeding display TEXT only. Neither drives a per-frame morph. J3-safe.
- **J4 no animated layout props** — the only `animate={{height:auto}}` is `FAQTwoCol.tsx:72`, the permitted discrete <250ms accordion interaction, not a scrub. The two `animate={{scale,opacity}}` are the one-permitted blink loop (compositor props).
- **J5 one spring per section** — every scrubbed section calls `useScrubProgress(ref)` exactly once (kit hook `ui-kit/hooks/useScrubProgress.ts` wraps the single useSpring). No section springs individual transforms.
- **J6 will-change scoped** — every `will-change` is on a named morphing node (dot/card/pill/bar/label/track), never a section shell.
- **J7 runways in vh** — `300vh`/`300vh`/`150vh`/`200vh`, all vh, on plain runway divs.
- **J8 position:sticky** — all four sticky stages use `position:sticky; top:0; height:100vh`. No JS-driven top. No motion value bound to `top`.
- **J9 compositor props only** — grep confirmed NO motion value drives width/height/top/left/margin/padding/boxShadow. Every motion.div style binding is opacity/filter/x/y/scale/scaleX/clipPath only. The `boxShadow` and `top:0/height:100vh` literals are static (card shadows + the sticky pin), not transform-driven.
- **J10 no reveal-on-enter as main event** — at scrollY 0 the backbone Hero shows beat 1 (recorder pill), and advancing requires scroll; content is revealed BY progress.

Single global `useScroll()` (no target) = exactly 1 (`useGlobalProgress.ts:24`); all section scrubs use `useScroll({target,offset})`. The scrub feels tied to the wheel via the 120/30 spring. No janky compounding.

### 3. NO console errors / hydration — PASS (the headline fix)

- `/` (normal): **0 console errors** across the full 0->13501px scroll.
- `/?motion=0`: **0 console errors**. The framer "Target ref is defined but not hydrated" error is GONE (the hook-bearing inner components mount only when enhanced, with the ref attached in the same commit — `HeroMorphStage.tsx:18-25` documents the fix). The V2 round-1 `?motion=0` hydration WARNING is also gone.
- `?motion=0` composed static end states verified: Hero lands on beat-3 (H1 + Share-link card + SpecStrip), Ownership truth rows all lit, CTA rest composed, footer. NO blank mid-beat. Doc collapses 13501px -> 6722px (runways -> auto), so CLS from runway collapse is 0.

### 4. NO REGRESSION — PASS

CDP-measured on both `/` and `/?motion=0`:
- **One accent** — blue/violet node scan = **0**. `--color-accent` = `#e5484d`. No second hue.
- **>=16px** — rendered-DOM sub-16px scan = **0 nodes** on both paths. `ds-lint src/` = 0 errors over 24 files. `slop-scan src/` and `copy.json` both PASS.
- **Unified grid** — every section docks the same `.grid-page` (verified visually across all probes; left rail of headlines/rows aligns at the same x).
- **Mobile 500px** — `document.body.scrollWidth === clientWidth` (500===500), no overflow, doc height 900px (single stub: mark + "macOS only. Download on your desktop." + one Download button). No scrub, no sticky.
- **Copy** matches copy.json — share string `tracer.nocorny.com/v/k7r2-mx9p`, path `~/Dropbox/Tracer/`, note `Free forever. ~12MB. MIT licensed.`, all headings exact.
- **Favicon** — `/icon.svg` = 200 (the `/favicon.ico` 404 is the expected/irrelevant default; the Next metadata icon is shipped).
- **Theme rhythm** — dark Hero -> light How -> light Features -> dark Ownership -> light FAQ -> dark CTA -> light Footer. No cream flash at any boundary.

---

### Issues requiring fix

| # | Severity | What | Scroll pos | Expected | Actual | Fix |
|---|---|---|---|---|---|---|
| 1 | **FAIL** | CTA climax ends on a fully EMPTY black stage; headline + pill never coexist | y11900 (CTA p~=1); also y10500 seam | S7a "Rest (p=1): headline + pill + Download button + note line simultaneously visible" | At end of the 200vh runway the sticky un-pins and ALL composed content scrolls off the top before p=1; the last CTA frame is black void. Headline is outside the sticky, so it exits before the pill resolves. | In `CTAConvergence.tsx`: pull the headline INTO the sticky stage (or hold the composed rest at the stage center through p=1) so headline + resolved pill + Download + note are co-visible at the runway END, not just mid-scrub. Option: finish all beat transforms by p~0.85 and keep the composed cluster静 (static, centered) for the last 0.85->1.0 so the climax rests full, like the Hero does. The page must not end its narrative on emptiness. |
| 2 | WARN | Ownership numbers->truth-rows dead seam (~600px empty viewport) | y8000 | continuous live subject through the section | numbers strip has left the sticky stage, truth rows not yet entered; only ScrollDot + glow visible | Tighten the gap: reduce the 150vh numbers runway slightly OR raise the truth rows so they enter as the numbers leave. The ScrollDot traveling helps but the band still reads dead. |
| 3 | WARN | CTA convergence + Ownership numbers sit in a left/upper column, leaving ~60% of the dark stage permanently empty | y10800, y11200, y7600 | one focal point that anchors the stage | the morph subject (card/pill/numbers) occupies only the left-upper quarter of a full-bleed 100vh dark stage; the rest is black | Either scale the subject up to anchor the stage, or center it, or pair it with the headline so the composition fills more of the focal area. Same "small object in a sea of black" failure mode the V2 hero rest had (and fixed) — apply that lesson to the CTA + Ownership stages. |

### Ranked fix order
1. **#1 CTA empty-rest climax (FAIL)** — the payoff of the entire scroll narrative currently ends on a black void. This is the single thing that re-triggers the user's "empty stage / I did not see the morph rest" complaint at the most important moment. Blocking.
2. #2 Ownership seam, #3 left-column voids — both WARN; they make the dark stages feel emptier than the director bar wants, but each individual beat does morph and is visible. Fix before SHIP; not user-experience-breaking the way #1 is.

### What is genuinely fixed vs V2 (credit)
The two reported motion bugs ARE fixed: the "not hydrated" error is gone (0 console errors on both paths), and the scrubbed stages are NO LONGER rendering empty during the beats — Hero, How, Ownership-numbers and CTA all show live morphing subjects driven by the wheel at multiple positions. The "boring / mostly text / janky" complaint is materially answered: horizontal panel travel, count-up numbers, traveling ScrollDot, clip-reveals, blur seams — all smooth (J1-J10 clean), all scroll-tied. The remaining FAIL is specifically the TRANSITION SEAMS and the CTA's final resting frame, not the beats.

### Self-deferral ledger
None outstanding from prior reviews. Round-2 (V2) promised work was completed. No new deferrals made this round.

---

## 2026-06-23 — V2 CREATIVE REBUILD review (whole page raised to hero level)

**Reviewer:** 3mpq-judge
**Live target:** http://localhost:3107 (1440px desktop). Driven with REAL wall-clock CDP (Chrome on :9333, scroll-into-view + 1.5-3s waits per section), not a single static capture. Scroll-scrubbed sections and the CTA convergence were captured live.
**Verdict:** ISSUES (1 item: 1 WARN). No FAIL. The page is otherwise a clean pass; the single WARN does not affect the production user experience and is not user-visible.

Independent screenshots (my own, wall-clock driven), all in `/tmp/aisoldier-judge/tracer-v2/`:
- `01-hero-settled.png` (hero composed rest), `alive-t700.png` (hero alive mid-morph at T+0.7s)
- `h-03-how-mid.png` (How-it-works scroll-scrubbed, traveling dot rail)
- `05-features.png` (6-cell bento + tick cell)
- `06-ownership.png` (dark, 4 lit truth-row dots on the rail)
- `h-08-faq-open-right.png` (FAQ full-width two-column, ring->dot open marker)
- `h-11-cta-rest.png` (CTA B2 convergence composed rest)
- `m0-01-hero.png` / `m0-02-cta.png` (?motion=0 static rest)
- `m0-03-mobile500.png` (500px stub, no overflow)
- CDP data: `cdp-results.json`, `cdp-results2.json`, `cdp-motion0.json`

---

### Dev-overlay removal — CONFIRMED CLEAN

- `GridOverlay` is NOT imported in `page.tsx` or anywhere under `src/` (only referenced in its own file + two JSDoc comments). Rendered HTML grep for `grid-overlay`/`column-stripe` returns ZERO. No pink stripes, no toggle button, no dev overlay on the page. The "N" badge bottom-left is the standard Next.js dev-tools indicator (dev-only, never shipped), not a leftover toggle.

### V2 contract — VERIFIED PASS (measured, not assumed)

1. **ONE grid — PASS.** Every `.grid-page` on the page measures identically: `left:80 right:1360 width:1280`, `max-width:1280px`, `padding-inline:64px`. Confirmed across Nav, Hero, How, Features, Ownership, FAQ, CTA, Footer. No per-section narrow shell ( `narrowShells` scan found only the H1 `max-width:885px` which is an honest cols-1-8 span boundary, not a centering shell, and one `inline-flex max-w-full` pill — neither is a section max-width). FAQ is full-width two-column (col lefts at x=144 and x=769 = col 1 and col 7), grid 80-1360, NO centered-narrow strip, `narrow:null`. The headline grid fix is delivered.

2. **HERO alive from frame 1 — PASS (wall-clock proven).** REC timer ticks live: sampled `00:00` (T+0.7s) -> `00:01` (T+1.9s) -> `00:03` (T+3.1s). Three infinite ambient-drift loops running (32s/34s/30s, opacity clamped <=0.12 by the kit `Math.min(...,0.12)`). At T+0.7s the headline is mid blur-reveal (page is animating on paint, not static). Plays once then rests on the composed link-pill + Dropbox folder + red tick object (a single connected unit with a visible vertical thread, NOT v1's two disconnected pills). No beat shrinks to a speck (subPx/min-object scans clean; morph is position+blur, not scale-from-0).

3. **How-it-works — PASS.** Scroll-scrubbed re-stage renders on scroll (height 1326px, multi-panel). Traveling record-red dot rail on the left. Panel 2 = Dropbox card + Synced dot + `~/Dropbox/Tracer/` (Geist Mono); panel 3 = share-link pill + red tick. `hasDropbox/hasPath/hasLink` all true. Dot hand-off REC -> sync -> tick confirmed.

4. **Features — PASS.** 6-cell bento, uniform cells, all bordered. Exactly ONE cell ("One click to share", items[3]) carries the copy->tick red micro-morph; no other colored element in the grid. No icons.

5. **Ownership (dark) — PASS.** `rgb(20,18,16)` dark stage. Single record-red dot travels the left rail; at rest all 4 truth-row dots lit red, two-column within (label cols 1-6, detail cols 7-12), hairline row dividers.

6. **CTA B2 convergence — PASS.** Dark stage `rgb(20,18,16)`. Designed composition, NOT a recolored band: headline "Stop renting your screen recordings." (cols 1-8) + Download button (x=144, w=209) sitting BESIDE the live `tracer.nocorny.com/v/k7r2-mx9p` link pill with red tick + "Free forever. ~12MB. MIT licensed." note line. `hasLink/hasDownload/hasNote/hasHeadline` all true. Plays on scroll, rests composed. This fully resolves the v1 "flat band" failure.

7. **No regression — PASS (with one WARN, below).**
   - Theme rhythm measured top-to-bottom: Hero dark `rgb(20,18,16)` -> How `#fff` -> Features `#fff` -> Ownership dark -> FAQ `#fff` -> CTA dark -> Footer light. No cream flash.
   - One accent: blue/violet DOM scan returned ZERO suspect elements. Accent is `#E5484D` only.
   - `>=16px`: live rendered-DOM sub-16px scan returned EMPTY. The v1 kit offenders are fixed (FooterEditorial no longer has 14px links; `StickyFeatureList` with its 12px "Chapter" kicker is RETIRED and not imported). `ds-lint src/` = 0 errors over 22 files. `slop-scan src/` and `copy.json` both PASS.
   - `?motion=0`: lands on composed rest (h1 opacity 1, share link present, CTA composed, note line present). Zero infinite animations running (drift paused). CLS held (stage reserves height).
   - Mobile 500px: `scrollWidth===clientWidth` (500===500), no overflow. Stub = mark + wordmark + one line + one Download button.
   - Copy matches copy.json. Favicon: served 200 at `/icon.svg` via Next metadata `<link rel="icon" ...icon.svg>` (the `/favicon.ico` 404 is expected and irrelevant; the metadata icon is the shipped favicon).
   - Console on the NORMAL page (no query): ZERO errors.

---

### Issue requiring fix

| # | Severity | What | Where | Expected | Actual | Fix |
|---|---|---|---|---|---|---|
| 1 | **WARN** | Hydration mismatch console error on the `?motion=0` path only | `src/app/layout.tsx:39` `<html>` + the pre-paint bootstrap script (`:48-53`) that sets `document.documentElement.dataset.motion='off'` before hydration | Clean `?motion=0` with no console error (soldier's own RETRO flags hydration mismatches as a known trap; contract global wants the static path clean) | On `?motion=0` React logs "A tree hydrated but some attributes of the server rendered HTML didn't match" for `data-motion="off"` on `<html>`. The bootstrap mutates the attribute pre-hydration; SSR markup has no attribute, so they diverge. The rest state still renders correctly and the page is unaffected — but the warning is real. The NORMAL page (no query) is clean. | Add `suppressHydrationWarning` to the `<html>` element in `layout.tsx` (the standard Next.js pattern for a pre-paint attribute bootstrap, same as theme scripts). One line. Re-verify `?motion=0` console is then clean. |

---

### Verdict rationale

The four V2 mandates are met and measured: the hero reads alive from frame 1 (timer ticking, drift drifting, mid-morph on paint), one full-width grid docks every section (all `.grid-page` identical at 80-1360), every section has a designed alive moment threaded by the record-red dot protagonist (nav -> hero -> how rail -> features tick -> ownership rail -> FAQ open marker -> CTA convergence), and the CTA is a real B2 composition with the link pill beside the Download button. The dev GridOverlay/stripes are gone. No FAIL-severity items.

The single WARN (#1) is a `?motion=0`-only hydration warning that does not touch the production user experience, does not break the static rest state, and is invisible to a normal visitor. It is a one-line `suppressHydrationWarning` fix. Because the contract calls for a clean static path and the soldier's RETRO already names this exact trap, I am logging it as ISSUES rather than waving it through — but it is the ONLY blocker, and it is minor. Fix #1, confirm the `?motion=0` console is clean, and this is a PASS.

---

## 2026-06-22 — Full product review (Tracer redesign, all 7 sections)

**Reviewer:** 3mpq-judge
**Live target:** http://localhost:3107 (1440px desktop; hero morph plays once ~7s then rests)
**Verdict:** ISSUES (8 items: 3 FAIL, 4 WARN, 1 NOTE)

Independent screenshots (my own, not soldier's):
- /tmp/aisoldier-judge/tracer/hero-settled-judge.png (settled hero, ~9s)
- /tmp/aisoldier-judge/tracer/how-section.png (How-it-works closeup)
- /tmp/aisoldier-judge/tracer/full.png (full page)
- /tmp/aisoldier-judge/tracer/motion0.png (?motion=0 static landing)
- /tmp/aisoldier-judge/tracer/mobile500.png (500px stub)

---

### What is RIGHT (verified, not assumed)

- **Theme rhythm — PASS.** Measured section backgrounds top to bottom: Hero `rgb(20,18,16)` dark, How `#fff` light, Features `#fff` light, Ownership `rgb(20,18,16)` dark, FAQ `#fff` light, Final-CTA `rgb(20,18,16)` dark, Footer light. Matches the contract exactly. No cream flash; light base is pure `#fff` per token. Boundaries clean.
- **One accent — PASS.** CDP scan for blue/violet/purple text+bg across the whole DOM returned ZERO suspect elements. Accent measured as `rgb(229,72,77)` = `#E5484D` everywhere. No gradient text, no gradient-fill buttons.
- **Hero rests on the right state — PASS.** At rest the recorder "Recording" pill is opacity 0 (correctly hidden); the Dropbox folder + share-link pill with the red tick are the resting composition. It does NOT rest on "Recording".
- **?motion=0 static landing — PASS.** `html[data-motion="off"]`; share link visible, red tick present, h1 opacity 1 immediately, no blank/0 flash, no recorder-pill flash. Lands on beat-5 statically. CLS 0 (stage reserves fixed `min-height:380px` in every mode).
- **Mobile stub — PASS.** At 500px `document.body.scrollWidth === clientWidth` (500 === 500, no overflow). Stub shows mark + "NoCorny Tracer" + "macOS only. Download on your desktop." + one Download button. No desktop content leaks, no hero animation.
- **Copy fidelity — PASS.** Headline, subheading, spec row, how-it-works steps, features, ownership truths, FAQ, final-CTA all match copy.json exactly. Share string `tracer.nocorny.com/v/k7r2-mx9p` and path `~/Dropbox/Tracer/` exact.
- **Console — PASS.** Zero non-favicon console errors / page errors / exceptions over a 9s settle.
- **ds-lint src/ — PASS** (0 errors, 16 files). Note: this only scans `src/`; the sub-16px violations below live in KIT components, which src-only lint cannot see — that is the gap.
- **Hero typography — PASS.** H1 Geist 600, 86.4px (within display-xl clamp), `rgb(245,243,239)` on dark. Geist Mono confined to timer/path/share strings (9 nodes). 3 font families only: Hanken Grotesk, Geist, Geist Mono (Geist Mono exempt as same system).
- **Features bento — PASS.** Uniform 3x2 hairline grid, no hero-card, no icons, titles 20px Geist 600, bodies 16px. Cells bordered.
- **Ownership — PASS.** 4 truth rows, labels 18px, monochrome on dark, no diagram, no icons.
- **FAQ / Final CTA — PASS** on structure, copy, single red CTA, dark stage.
- **Nav — PASS.** NoCorny squiggle mark (not 3mpq fallback), no gradient wordmark, single red Download Button/primary, Sign-in as ghost text, GitHub `target=_blank rel=noopener`.

---

### Issues requiring fix

| # | Severity | What | Where | Expected | Actual | Fix |
|---|---|---|---|---|---|---|
| 1 | **FAIL** | "CHAPTER 01/02/03" eyebrow chips above each step heading | kit `StickyFeatureList.tsx:249` (`Chapter {number}`), rendered in How-it-works | NO eyebrow/kicker above any heading (DIRECTION §5, contract S3 "No eyebrow chip above H2"; S3 says "keep numbers monochrome" but the kit renders a full uppercase tracked accent label = a kicker) | Rendered: `Chapter 01` at **12px, uppercase, tracking 0.062em, color `rgb(229,72,77)` accent** = textbook eyebrow chip | Pass an option to `StickyFeatureList` to suppress the "Chapter NN" kicker (or drop the `number` prop entirely), OR override it to a bare monochrome ordinal at >=16px. The accent uppercase tracked label must go. |
| 2 | **FAIL** | Sub-16px text in rendered output (>=16px floor is absolute on this project) | kit components, not src | All text >=16px everywhere (project CLAUDE.md, DIRECTION §5, contract global) | `Chapter 01/02/03` = **12px**; footer sitemap links Download/Dashboard/GitHub/MIT license/Releases/Agency = **14px**; "Back to top" = **14px** (kit `FooterEditorial.tsx:101,134`) | Raise kit `FooterEditorial` links + back-to-top to >=16px, and the StickyFeatureList kicker to >=16px (or remove per #1). These are kit-default sizes the project inherited; ds-lint src/ cannot catch them, so they slipped the gate. |
| 3 | **FAIL** | Weak/empty hero rest composition — large void + small, disconnected pills | Hero.tsx + HeroMorphStage.tsx | The morph object is the focal point that dominates; "the thing people screenshot" (DIRECTION §0/§2) | Measured: CTA cluster bottom ~y480; Dropbox folder top y642 (**~160px dead band**); folder (163px wide) and share pill (288px wide) float small on a 760px stage with **~110px empty gap between them and no visible thread connecting them**; share bottom y804 to spec row y994 = **~190px more void**. The "one continuous object, red dot threads all three states" promise is invisible at rest — it reads as two tiny afterthoughts in a sea of black. | Tighten the stage: reduce `min-height:380px` and the `mt-14`/`mt-12` voids; compose the resting folder + link as ONE connected unit (visible red-dot thread / connector between them), scale the pills up so they anchor the stage. The rested hero must read as a deliberate composed object, not leftover empty space. |
| 4 | WARN | Off-copy "Made by NoCorny Agency, Kyiv" line in footer | Footer.tsx:21 `builtWith=...` | Footer budget = wordmark + tagline + sitemap + legal line; "no agency praise" (contract S7b); all copy traceable to copy.json | An extra provenance line not present in copy.json | Remove `builtWith`, or add the string to copy.json if the user wants provenance. It is plain (not cutesy), so not a hard block, but it is unsanctioned extra text off the copy source of truth. |
| 5 | WARN | Footer flattens 3 columns into one link row | Footer.tsx:13 (`flatMap`) | "3 columns matching footer.columns[0..2]" with labels Product / Open source / NoCorny (contract S7b) | Single flat sitemap row; column labels (Product/Open source/NoCorny) are dropped | Either accept the flat row as a deliberate simplification (note in DECISIONS.md) or pass grouped columns if FooterEditorial supports them. Currently the contract's 3-column requirement is unmet. |
| 6 | WARN | How-it-works sticky visual is a near-empty dot-grid card | StickyFeatureList default visual container + MorphPanels | "simplified static frames of the morph beats" that read as the focal point | The light dot-grid card is ~90% empty with a single small "Recording" pill floating low-center; reads weak/disconnected | Enlarge/center the morph panel so it anchors the card, or shrink the card. Secondary to #1 but same "empty void" failure mode. |
| 7 | WARN | Raw hex `#fff` inside src (outside tokens.css) | MorphPanels.tsx:90, HeroMorphStage.tsx:293 (`stroke="#fff"`) | "All literal hex values live exclusively in tokens.css" (contract global) | `stroke="#fff"` on the tick SVG (ds-lint does not flag hex in SVG stroke attrs, so it passed) | Replace with a token (e.g. `var(--color-on-accent)` / `currentColor`). Cosmetic, low-risk. |
| 8 | NOTE | Next.js dev overlay shows "1 Issue" badge (bottom-left circular N) | dev server only | n/a (dev-only, not shipped to prod) | The Next 15 dev indicator reports 1 build/lint issue; produces NO runtime console error | Investigate the reported issue before deploy (likely a lint/hydration warning). Not user-visible in production. Not blocking the review. |

---

### Ranked top issues (fix in this order)

1. **#1 Chapter eyebrow chips** — direct violation of the "no eyebrow/kicker" law that the whole redesign is built around. Blocking.
2. **#2 sub-16px (12px chapters, 14px footer)** — the project's single hardest rule (>=16px everywhere) is broken in rendered output via kit defaults. Blocking.
3. **#3 weak hero rest composition** — the hero is the entire reason this page exists and at rest it is mostly empty black with two small disconnected pills. The director bar ("the thing people screenshot") is not met. Blocking on the bar.
4. #4–#7 footer/visual/hex polish (non-blocking but should land before SHIP).

**Re-review after #1, #2, #3 are fixed.** Items #1 and #2 trace to kit components (`StickyFeatureList`, `FooterEditorial`) whose defaults predate this project's strict floor — fixing them in the kit (>=16px, optional kicker) benefits every future project, so prefer the kit fix over a project-local patch.

### Self-deferral ledger
None outstanding from prior reviews (this is the first full review on Tracer). No new deferrals made.

---

## 2026-06-22 — Re-review (round 2, incremental, post fix-round-1)

**Reviewer:** 3mpq-judge
**Live target:** http://localhost:3107 (1440px desktop, hero settled ~9s; 500px mobile stub)
**Verdict:** PASSED

Independent re-screenshots (my own, raw CDP at settle=9s, not soldier's, not virtual-time-budget):
- /tmp/aisoldier-judge/tracer-r2/hero-settled.png (settled hero, 9s)
- /tmp/aisoldier-judge/tracer-r2/how.png (How-it-works, no kicker)
- /tmp/aisoldier-judge/tracer-r2/footer.png (3 labeled columns)
- /tmp/aisoldier-judge/tracer-r2/shot-1440.png + shot-500.png (visual gate)
- /tmp/aisoldier-judge/tracer-r2/cdp.json (measurements)

### The 3 round-1 FAILs — all RESOLVED

**FAIL #1 (Chapter eyebrow) -> FIXED.** CDP DOM scan for `chapter NN` / bare `0N` kicker nodes = **0**. How-it-works steps render as title + one line only ("Hit record" / "It lands in your Dropbox" / "Send the link"), no uppercase tracked accent kicker. Active step uses a monochrome-adjacent accent bar marker, not an eyebrow label. The `~/Dropbox/Tracer/` path renders in Geist Mono. Kit `StickyFeatureList` ordinal is now gated off by default.

**FAIL #2 (sub-16px in kit) -> FIXED.** Full rendered-DOM sub-16px scan (every node with direct visible text) = **0 nodes under 16px**. Footer links measured: Download/Dashboard/GitHub/MIT license/Releases/Agency/Back to top all **16px** (were 14px). Min footer text size = 16px. No 12px chapter labels remain.

**FAIL #3 (weak hero rest void) -> FIXED.** At rest the hero now lands on ONE consolidated elevated dark share-link card, measured: 544x141px, bg `rgba(245,243,239,0.04)` (white/[0.04] elevated), 1px `rgba(245,243,239,0.1)` hairline, radius 12px (`--radius-window`), 20px padding. It composes the Dropbox provenance row (`~/Dropbox/Tracer/` + red-dot + "Synced") on top, a hairline divider, then `tracer.nocorny.com/v/k7r2-mx9p` + red tick below as one 55px-span unit. A faint vertical thread connects the CTA to the card. No parked floating Dropbox folder pill, no two-disconnected-debris afterthoughts, no ~160px dead band between two pills. It reads as one deliberate screenshot-frame artifact = the director "the thing people screenshot" bar is met.
  - NOTE (non-blocking): CTA cluster bottom is at y485, card top at y637 = ~152px CTA->card gap. ACTIONS.md item A targeted ~72px. The gap is larger than spec, but it no longer reads as a void because the card is now large (544px) and dense and the faint thread bridges it. Acceptable; tightening to ~100-110px would be a marginal polish improvement, not a block.

### Round-1 WARNs — all cleared

- **Invented "Made by NoCorny Agency, Kyiv" line -> REMOVED.** CDP regex for "Made by" / "NoCorny Agency...Kyiv" in footer = false.
- **Footer flat row -> NOW 3 labeled columns.** PRODUCT (Download, Dashboard) / OPEN SOURCE (GitHub, MIT license, Releases) / NOCORNY (Agency), matching contract S7b.
- **Raw #fff hex -> MOVED to tokens.** SVG `stroke="#fff"`/`fill="#fff"` nodes in DOM = 0.
- **How-it-works near-empty visual -> FIXED.** Sticky panel shows a confident "Recording" pill (red dot + 00:04 timer + label), not a faint ghost in a sea of dots.

### Strong passes re-verified (no regression)

- **Theme rhythm** intact: dark hero -> light -> light -> dark ownership -> light FAQ -> dark CTA -> light footer. No cream flash.
- **One accent** intact: blue/violet DOM scan (b channel dominant >120) = **0 nodes**. Accent stays #E5484D.
- **Hero rests on the link**, not "Recording" (recorder pill hidden at rest).
- **?motion=0**: `data-motion="off"`, h1 opacity 1 immediately, share link + red tick visible static (beat-5), no blank flash. CLS 0 (stage min-height reserved).
- **Mobile 500px**: `document.body.scrollWidth === clientWidth` (500 === 500), no overflow. Stub = mark + "macOS only. Download on your desktop." + one Download button.
- **Copy** matches copy.json (share string + path exact).
- **Console**: 0 errors / 0 page exceptions over 9s settle. **Favicon now resolves**: GET /icon.svg = 200 (was 404).

### Remaining (non-blocking, do before SHIP if cheap)
- CTA->hero-card gap ~152px vs ~72px target (cosmetic; reads fine, not a void). NOTE, not a block.

### Self-deferral ledger
None outstanding. No new deferrals made. Round-2 work that was promised in round 1 (kit-level >=16px + optional-ordinal fix) was completed by soldier and verified here, not deferred.
