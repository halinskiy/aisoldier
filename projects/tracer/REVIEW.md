# Tracer — Review Log

Reviews by 3mpq-judge. Nothing reaches the user until the verdict is **PASSED**.

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
