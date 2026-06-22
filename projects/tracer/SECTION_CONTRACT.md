# SECTION_CONTRACT — Tracer by NoCorny
Owner: 3mpq-architect · Date: 2026-06-22
Source files compiled: DIRECTION.md, REDESIGN_BRIEF.md, CORRECTIONS.md, content/copy.json, CLAUDE.md,
ui-kit/INDEX.md, ui-kit/REGISTRY.json, ui-kit/TOKENS.md.
Hand to: 3mpq-prompter, then 3mpq-soldier.

---

## Token baseline for this project

All color references are vars; no raw hex anywhere in src/ except tokens.css.

```css
/* tokens.css — tracer overrides */
--color-accent:        #E5484D;
--color-accent-hover:  #CC3B42;
--color-accent-deep:   #A32A30;
--color-accent-subtle: rgba(229,72,77,0.08);
--color-accent-soft:   rgba(229,72,77,0.16);

/* Dark stage surfaces (hero + ownership + final-CTA) */
--color-ink-surface:   #111111;   /* warm near-black stage bg */
--color-on-dark:       #F4F4F4;   /* primary text on dark */

/* Kit neutrals (light page) */
--color-bg:            #ffffff;
--color-surface:       #fafafa;
--color-border:        #e5e5e5;
--color-border-strong: #d4d4d4;
--color-text:          #212121;
--color-text-muted:    #525252;
--color-text-subtle:   #a3a3a3;

/* Typography */
--font-display: 'Geist', system-ui, sans-serif;   /* headings + UI labels */
--font-body:    'Hanken Grotesk', system-ui, sans-serif; /* body / subheadings */
--font-mono:    'Geist Mono', monospace;           /* paths + links ONLY */

/* Radii */
--radius-window: 12px;
--radius-button:  8px;
--radius-pill:    9999px;

/* Motion (DIRECTION spec, overrides kit defaults) */
--ease-spring:  cubic-bezier(0.34, 1.42, 0.5, 1);   /* entrance / morph */
--ease-smooth:  cubic-bezier(0.2, 0.8, 0.2, 1);      /* hover / state change */
```

Type scale (project override, all >= 16px floor, ~4 sizes):
- display-xl  clamp(56px, 7vw, 96px)   Geist 600   lh 0.95   — hero H1
- display-md  clamp(36px, 4vw, 56px)   Geist 600   lh 1.05   — section H2
- body-lg     18px                      Hanken 400  lh 1.6    — subheadings, spec row
- body        16px                      Hanken 400  lh 1.625  — accordion answers, bento bodies

Geist Mono: 16px only, used solely for `~/Dropbox/Tracer/` paths and `tracer.nocorny.com/v/...` strings.
EyebrowLabel is BANNED on this project. No 12px text anywhere.

---

## Section rhythm (light / DARK / light / light / DARK / light / DARK / light)

```
Nav          light
Hero         DARK studio stage (inside light page)
How it works light
Features     light
Ownership    DARK studio stage
FAQ          light
Final CTA    DARK stage
Footer       light
```

---

## S1 — Nav

### Purpose
One-line sticky header. Wordmark left, anchor links center, GitHub star + red Download button right.

### Focal point
The red Download button. Everything else is subordinate monochrome.

### Theme
Light (transparent → backdrop-blur on scroll, ink text, accent CTA).

### Copy keys (from content/copy.json)
- `nav.logo`            → "NoCorny Tracer"
- `nav.links[*].label`  → "How it works", "Features", "Ownership", "FAQ", "GitHub"
- `nav.links[*].href`   → "#how", "#features", "#ownership", "#faq", GitHub external URL
- `nav.cta_primary`     → "Download for macOS"
- `nav.cta_secondary`   → "Sign in"  (tertiary/ghost weight; render only if space allows; no red)

### Component map
| Element | Kit component | Variant / note |
|---|---|---|
| Sticky header shell | `NavSticky` | standard; transparent → blur on scroll |
| Primary CTA | `Button/primary` | solid accent fill, --radius-button, "Download for macOS" |
| Sign-in link | `TextLink/subtle` | NOT a button; renders as low-weight nav text |
| Logo text | bespoke inline (see note below) | |

**Logo note.** The squiggle-into-dot mark is NoCorny's own SVG identity; it is NOT the 3mpq fallback Logo3mpq. Soldier renders the existing squiggle mark + "NoCorny Tracer" wordmark in --font-display at nav size. No LogoWave (wrong pattern — that splits on `~`). No gradient text on the wordmark.

### Minimum structure
- Wordmark (mark + text).
- Anchor links: How it works, Features, Ownership, FAQ, GitHub.
- Two CTAs: Sign in (ghost/text), Download for macOS (Button/primary).
- NOTHING ELSE. No tagline, no badge, no eyebrow.

### States
- Resting: transparent bg, ink text, accent Download button.
- Scrolled: `backdrop-blur(12px)` + `bg-white/80` + `border-b border-[--color-border]`.
- Hover on links: `--ease-smooth`, 150ms, muted → ink transition.
- Button: hover → accent-hover fill, 150ms, --ease-smooth.
- Focus-visible: 2px accent outline, 2px offset.
- Active link (current section in viewport): weight 600, accent underline — optional via IntersectionObserver; implement only if trivial.

### Tokens
`--color-accent`, `--color-border`, `--font-display`, `--radius-button`, `--ease-smooth`.

### Responsive
- 1440px: full nav with all links.
- 1920px: same, content column expands.
- 768px: not required (desktop-only project). If NavSticky collapses to burger at 768 that is acceptable; do NOT build a real mobile nav experience.
- 500px (mobile stub check): nav renders as logo-only or collapses cleanly. No overflow.

### Acceptance checks
- [ ] `NavSticky` imported from kit, not forked.
- [ ] Logo mark is the NoCorny SVG, not the 3mpq fallback.
- [ ] No gradient text on wordmark.
- [ ] Download button uses `Button/primary` with solid accent fill.
- [ ] Sign-in uses `TextLink` or ghost weight, not a second Button/primary.
- [ ] No eyebrow, no badge, no tagline in nav.
- [ ] All link hrefs match copy.json exactly.
- [ ] GitHub link has `target="_blank" rel="noopener noreferrer"`.
- [ ] Scroll transition: transparent → blur, 150ms --ease-smooth.
- [ ] All nav text >= 16px.

---

## S2 — Hero (cinematic morph stage)

### Purpose
The one screen that makes people screenshot. Demonstrates record -> your Dropbox -> clean link as a single continuous morphing object. The whole motion budget lives here.

### Focal point
The morphing object (macOS recorder pill → Dropbox folder → share-link pill). The headline supports it; nothing competes.

### Theme
DARK studio stage inset in the light page. Implemented as a `DarkSection` wrapper OR a bespoke full-bleed dark div with `--color-ink-surface` bg, hairline border `white/10`, `--radius-window`. The stage is content-column-width (not bleed), hairline-bordered. Page base remains light above and below.

### Copy keys (from content/copy.json)
- `hero.headline`     → "Your recordings. Not theirs."
- `hero.subheading`   → "Hit record. The file lands in your Dropbox. You get a clean shareable link. Viewers need no account. Free forever."
- `hero.cta_primary`  → "Download for macOS"
- `hero.cta_secondary`→ "Star on GitHub"
- `hero.spec_row[*]`  → "Free forever", "MIT licensed", "~12MB", "No account to watch", "Your Dropbox"

### Component map
| Element | Kit component | Note |
|---|---|---|
| Dark stage wrapper | `DarkSection` | scopes dark text ramp; OR bespoke dark div if DarkSection radius/border cannot be overridden for the inset stage shape — prefer DarkSection; flag if bespoke needed |
| Headline | bespoke display text | display-xl, Geist 600, `text-white/80` on dark stage |
| Subheading | bespoke text | body-lg, Hanken 400, `text-white/50` |
| Primary CTA | `Button/primary` | solid accent fill, --radius-button |
| Secondary CTA | `Button/ghost` | "Star on GitHub", outline/ghost on dark, TextLink acceptable |
| Spec row | **BESPOKE — SpecStrip** | single hairline-bordered mono row (see NEW COMPONENT below) |
| Morph object | **BESPOKE — HeroMorphStage** | 5-beat cinematic morph (see NEW COMPONENT below) |
| Scroll choreography | native CSS `animation-timeline: view()` preferred; Framer `useScroll` fallback | |
| Motion gate | `useEnhancementEnabled` | gates hero morph on viewport >= 1024 AND no reduced-motion AND no ?motion=0 |
| Section-enter reveal (headline/sub) | `BlurReveal` | wraps headline + sub; delay stagger 0 / 0.1s |

### NEW COMPONENT PROPOSED: SpecStrip
**Justification:** a single hairline-bordered one-line row of mono-typed spec facts (<=5) is a genuinely distinct presentation primitive not in the kit. It is not a Badge (too small and decorative), not a BentoGrid (grid of cards), not a MetricsBar (animated numbers). It is a static typographic row: `border` wrapping 5 `|`-divided mono spans. Promote to `ui-kit/components/section/SpecStrip.tsx` after build.
Props: `items: string[]`, `mono?: boolean` (defaults true), `tone?: 'light' | 'dark'`.

### NEW COMPONENT PROPOSED: HeroMorphStage
**Justification:** the 5-beat macOS-chrome morph sequence (recorder pill → condensed capture → Dropbox folder → share-link pill → red tick) is the entire reason this product page exists. No kit component approaches it. It is bespoke Framer Motion / CSS sequence work. Promote to `ui-kit/components/motion/HeroMorphStage.tsx` only if reused elsewhere; for now it lives in `projects/tracer/src/components/HeroMorphStage.tsx` and MUST be noted in HANDOFF.md as a custom embed.

### Hero 5-beat contract (DIRECTION §2, locked)

**Beat 1 — REC (enters).**
- macOS menu-bar recorder pill settles onto the stage. Soft-spring entrance, `cubic-bezier(0.34,1.42,0.5,1)`, ~0.7s.
- Pill chrome: hairline-bordered, native-macOS-honest shape (not a generic 3-dot browser card). Bg `--color-surface-2` on dark (dark surface slightly elevated), border `white/10`.
- Red record dot (`--color-accent`, `--radius-pill`, ~10px) pulses live. THIS IS THE ONLY PERMITTED INFINITE LOOP (genuine live indicator). Pulse: scale 1 -> 1.2 -> 1 at ~1.2s, `ease-in-out`.
- Timer label `00:00 -> 00:04` ticks in Geist Mono 16px `text-white/50`. Ticking starts 0.3s after entrance, stops at beat 2.
- Feels as if the app is recording now.

**Beat 2 — STOP -> CONDENSE.**
- At T+~3s auto-trigger (no user interaction required; the sequence runs automatically on page load after entrance settles).
- Recording frame shrinks/condenses into a small travelling capture object. `cubic-bezier(0.34,1.42,0.5,1)`, ~0.5s morph.
- Red dot detaches visually and LEADS the condensed object as it travels.
- Timer freezes/fades. Pulse stops.

**Beat 3 — -> DROPBOX (ownership proof).**
- Condensed capture object travels and LANDS on / BECOMES a Dropbox folder object.
- Folder labelled `~/Dropbox/Tracer/` in Geist Mono 16px `text-white/50`.
- Dropbox glyph: monochrome (svg fill `text-white/60`), NOT blue. Red dot lands and becomes the Dropbox sync dot (same red, `--color-accent`).
- Spring settle, `cubic-bezier(0.34,1.42,0.5,1)`, ~0.6s.
- The Dropbox mark MUST be recognizable — the standard Dropbox open-box glyph, monochrome.

**Beat 4 — -> LINK MATERIALIZES.**
- A share-link pill grows into place from the folder object.
- Shows the real string `tracer.nocorny.com/v/k7r2-mx9p` in Geist Mono 16px `text-white/80`.
- Pill: hairline border `white/20`, `--radius-pill`, bg `white/5`.
- A copy icon/affordance appears on the right of the pill. Spring grow, ~0.5s.

**Beat 5 — COPY -> RED TICK (rests).**
- Copy affordance auto-triggers (or on click; both paths lead to same rest state).
- Morphs to a record-red checkmark (`--color-accent`). Smooth ease `cubic-bezier(0.2,0.8,0.2,1)`, 200ms. NO loop.
- The whole stage RESTS here. Only the red record dot in the original pill position may retain a very faint ambient glow (optional; not a loop).
- Nothing moves after beat 5 except hover interactions on the CTAs.

**Reduced-motion / `?motion=0` / LCP fallback.**
- `useEnhancementEnabled` gates the entire HeroMorphStage morph.
- When gate returns false: render beat-5 final state statically (share-link pill with red tick visible, Dropbox folder visible, path string visible). No motion. Full meaning preserved without reading the headline.
- Headline + subheading + spec row render unconditionally (no motion gate on text).

**Scroll choreography binding.**
- The hero stage is sticky (or scroll-pinned) and restages as S3 (How it works) below. Implement via native CSS `animation-timeline: scroll()` / `view()` on the three morph-phase overlays. Reserve Framer `useScroll` only for what CSS cannot express.
- The pinned surface must NOT produce a layout flash when the user scrolls past it. CLS = 0 requirement.

### Minimum structure (ceiling)
H1 headline + 1 subheading line + 1 spec row + 1 CTA pair (primary + ghost secondary) + the morph stage object.
NO eyebrow, NO badge above headline, NO third text element, NO caption under the CTA.

### Tokens (on dark stage)
`--color-ink-surface`, `--color-accent`, `--radius-window`, `--radius-pill`, `--radius-button`, `--font-display`, `--font-body`, `--font-mono`, `--ease-spring`, `--ease-smooth`, `white/80`, `white/50`, `white/20`, `white/10`, `white/5`.

### Responsive
- 1440px: full morph stage, headline at display-xl.
- 1920px: same, stage expands to content column width.
- 500px (mobile stub): hero morph does NOT run. Stub shows headline + Download button only (see S7 note for mobile stub spec). Verify `document.body.scrollWidth === clientWidth` at 500px.

### Acceptance checks
- [ ] Stage bg is `--color-ink-surface` (never raw `#111111` outside tokens.css).
- [ ] Stage has hairline border `white/10`, `--radius-window`.
- [ ] Headline is display-xl, Geist 600, `text-white/80`. Zero sub-16px text anywhere.
- [ ] Subheading body-lg, Hanken 400, `text-white/50`.
- [ ] No eyebrow chip, no badge, no third text block above or below CTA.
- [ ] Spec row renders as SpecStrip: one bordered mono row, 5 items, Geist Mono 16px, `text-white/50`. NOT colored pills.
- [ ] HeroMorphStage implements all 5 beats in order.
- [ ] Beat 1 red dot is the ONLY infinite loop (`scale` pulse, not an opacity fade loop).
- [ ] Timer uses Geist Mono. Path string uses Geist Mono. Share link uses Geist Mono. Nothing else uses Geist Mono.
- [ ] Dropbox glyph is monochrome svg, NOT blue.
- [ ] Share link string is exactly `tracer.nocorny.com/v/k7r2-mx9p`.
- [ ] Path label is exactly `~/Dropbox/Tracer/`.
- [ ] Beat 5 red tick uses `--ease-smooth`, 200ms, no loop.
- [ ] Stage RESTS fully after beat 5.
- [ ] `useEnhancementEnabled` gates the morph; reduced-motion + `?motion=0` land on beat-5 static state.
- [ ] `Button/primary` is solid accent fill; `Button/ghost` for GitHub. No gradient on either.
- [ ] Scroll choreography (CSS scroll-timeline preferred) transitions seamlessly into S3 below.
- [ ] CLS = 0 on sticky/pinned hero.
- [ ] `HeroMorphStage` noted in `HANDOFF.md` as custom embed.
- [ ] `SpecStrip` promoted to `ui-kit/components/section/SpecStrip.tsx` and registered in `REGISTRY.json` after build.

---

## S3 — How it works (re-staged morph, scroll-driven)

### Purpose
The same three beats from the hero re-stated at reading pace: record, it lands in your Dropbox, share the link. One beat in view at a time.

### Focal point
One morph-panel at a time. The scroll-driven panel is the focal point; text labels support it.

### Theme
Light.

### Copy keys (from content/copy.json)
- `how_it_works.heading`     → "Record, own, share."
- `how_it_works.steps[0].title` → "Hit record"
- `how_it_works.steps[0].body`  → "Press the global hotkey. A red dot appears. Record whatever you need."
- `how_it_works.steps[1].title` → "It lands in your Dropbox"
- `how_it_works.steps[1].body`  → "The file goes straight to ~/Dropbox/Tracer/. NoCorny never touches it."
- `how_it_works.steps[2].title` → "Send the link"
- `how_it_works.steps[2].body`  → "A clean tracer.nocorny.com/v/... link is already in your clipboard. Done."

Note: path string `~/Dropbox/Tracer/` in step[1].body renders in Geist Mono inline.

### Component map
| Element | Kit component | Note |
|---|---|---|
| Section H2 | bespoke heading | display-md, Geist 600, ink |
| Scroll-driven step list | `StickyFeatureList` | pinned-left visual + scrolling-right list; 3 items; cross-fades the visual per step |
| Per-step visual | bespoke static mini-morph panels | reuse the 3 morph-phase visuals from HeroMorphStage at smaller scale; pass as `visual` prop to each StickyFeatureList item |
| Section-enter reveal | `BlurReveal` | wraps H2 only |

**StickyFeatureList usage note.** Items array: `[{number:'01',title:'Hit record',body:...,visual:<RecordPanel/>},{...},{...}]`. The cross-fade between visuals is IntersectionObserver-driven (kit default). This is the correct kit component: pinned visual + scroll list, exactly the pattern.

### Minimum structure (ceiling)
H2 heading. 3 steps, each: a short title (Geist 600 18px min) + one body line (Hanken 16px). The pinned visual per step. NO subheading on the section (one heading only: "Record, own, share."). NO icons (the morph panel IS the visual). NO numbered badges — the StickyFeatureList numbers prop handles ordinal labels if needed; keep them monochrome.

### States
- Step visual cross-fade: `AnimatePresence mode="wait"`, kit-default 300ms opacity morph. Reduced-motion: instant swap (kit handles).
- Step items: `BlurReveal` stagger on first scroll into view.

### Tokens
`--font-display`, `--font-body`, `--font-mono` (inline path string), `--color-text`, `--color-text-muted`, `--color-accent` (step number / dot accent), `--color-border`, `--radius-window`, `section-y`.

### Responsive
- 1440px: pinned-left visual 50% width, scrolling-right list 50%.
- 1920px: same.
- 500px: StickyFeatureList collapses to stacked layout (kit default); morph visuals render statically (beat-5 each).

### Acceptance checks
- [ ] `StickyFeatureList` from kit, not forked.
- [ ] Exactly 3 items, matching copy.json how_it_works.steps[0..2].
- [ ] `how_it_works.heading` = "Record, own, share." — no subheading on the section.
- [ ] Path string in step[1].body uses Geist Mono inline span.
- [ ] No icons, no numbered circle badges beyond what StickyFeatureList provides.
- [ ] No eyebrow chip above H2.
- [ ] All text >= 16px.
- [ ] Visual panels are simplified static frames of the morph beats, NOT screenshots.
- [ ] Reduced-motion: visuals render as final state (beat-5 equivalent), no animation.

---

## S4 — Features bento (icon-free hairline grid)

### Purpose
Six capabilities stated plainly. A calm, uniform field — not a showcase.

### Focal point
The bento grid as one calm field. No single cell dominates.

### Theme
Light.

### Copy keys (from content/copy.json)
- `features.heading`         → "What it does."
- `features.items[0..5].title` → "Your files, in your Dropbox", "AI titles and descriptions", "Searchable transcripts", "One click to share", "See who watched", "No watermarks. Ever."
- `features.items[0..5].body`  → full body text per item (see copy.json; each is one sentence or two short sentences)

### Component map
| Element | Kit component | Note |
|---|---|---|
| Section H2 | bespoke heading | display-md, Geist 600, ink |
| Feature grid | `BentoGrid` + `BentoCell` | 12-col grid; 6 cells |
| Section-enter reveal | `BlurReveal` | wraps H2 |
| Cell entry | `scroll-timeline-reveal.css` `.st-reveal` classes | staggered rise on scroll; or `BlurReveal` per cell with `data-motion-index` |

**BentoGrid layout spec (6 cells, 12 columns).**
Proposed asymmetric but UNIFORM layout — every cell same internal shape (label + one line):
- Row 1: cell A (col-span 4), cell B (col-span 4), cell C (col-span 4).
- Row 2: cell D (col-span 4), cell E (col-span 4), cell F (col-span 4).
A simple 3×2 uniform grid. Soldier may propose a mild asymmetry (e.g. one 6-col + two 3-col per row) ONLY if it genuinely improves reading rhythm without creating a "hero card" that competes; default is the equal 3-col grid. NO "hero card" (one large + five small) — that is the generic SaaS look being killed.

**Cell contents (per cell, ceiling):**
- One short title (Geist 600, 18px).
- One body line (Hanken 400, 16px).
- NO icons. NO sub-labels. NO captions. NO decorative illustrations. Hairline border (`--color-border`), `--radius-window`, bg `--color-surface`. Uniform.

**One live morph cell (optional, max one):** DIRECTION permits at most ONE cell to hold a small live morph (e.g. the "One click to share" cell showing the copy → tick micro-animation). If included, it must be subtle, play once on scroll-into-view, then rest. Gate with `useEnhancementEnabled`. Not required; only include if it sharpens the "show the mechanism" principle without adding visual noise.

### Minimum structure (ceiling)
H2 only ("What it does." — no subheading needed; the heading is complete). 6 BentoCells, each = title + one body line. Nothing else. NO section subheading unless "What it does." genuinely needs support — it does not.

### States
- Cell hover: `border-color: --color-border-strong`, 150ms --ease-smooth.
- Cell entry: `.st-reveal` stagger or BlurReveal.
- If one cell has live morph: plays once on view, rests. Gate with useEnhancementEnabled.

### Tokens
`--font-display`, `--font-body`, `--color-surface`, `--color-border`, `--color-border-strong`, `--radius-window`, `--ease-smooth`, `section-y`.

### Responsive
- 1440px: 3-col × 2-row grid.
- 1920px: same or mild spacing increase.
- 500px: collapses to 1-col stack (BentoCell `base=12` fallback); static, no morph.

### Acceptance checks
- [ ] `BentoGrid` + `BentoCell` from kit, not forked.
- [ ] Exactly 6 cells matching features.items[0..5] from copy.json.
- [ ] "What it does." heading only — NO subheading on this section.
- [ ] NO icons in any cell.
- [ ] NO hero-card asymmetry (one 12-col dominant cell).
- [ ] Cell structure: title >= 16px + one body line >= 16px only. Nothing else.
- [ ] All cells uniform shape and padding.
- [ ] Hairline border on every cell.
- [ ] No eyebrow chip above H2.
- [ ] Live morph cell (if used): max one, plays once, rests, gated by useEnhancementEnabled.
- [ ] All text >= 16px. Geist Mono not used in this section (no paths/links here).

---

## S5 — Ownership / privacy spec strip

### Purpose
The single ownership argument. Loom holds your file; Tracer hands it back. Four terse truths, uniform.

### Focal point
The four-item spec strip (hairline mono rows). The heading sets the argument; the rows prove it.

### Theme
DARK studio stage. Use `DarkSection` wrapper (same token contract as S2 stage: `--color-ink-surface`, dark text ramp, `white/10` hairlines).

### Copy keys (from content/copy.json)
- `ownership.heading`         → "You own this."
- `ownership.subheading`      → "Loom holds your recordings on Loom's servers, behind Loom's account, under Loom's terms. Tracer hands the file to your Dropbox and gets out of the way."
- `ownership.truths[0].label` → "Zero video on our servers"
- `ownership.truths[0].detail`→ "The file is yours from the moment you stop recording. It never touches NoCorny infrastructure."
- `ownership.truths[1].label` → "No watermarks"
- `ownership.truths[1].detail`→ "The viewer page shows your recording. There is no Tracer badge, no upgrade prompt."
- `ownership.truths[2].label` → "Revoke any time"
- `ownership.truths[2].detail`→ "Disconnect Dropbox and the link stops working. You control access, not us."
- `ownership.truths[3].label` → "Open source"
- `ownership.truths[3].detail`→ "The app and the web viewer are MIT licensed. Read every line at github.com/nocorny/tracer."

### Component map
| Element | Kit component | Note |
|---|---|---|
| Dark section wrapper | `DarkSection` | `--color-ink-surface` bg, `white/10` top+bottom hairlines |
| Section H2 | bespoke heading | display-md, Geist 600, `text-white/80` |
| Subheading | bespoke text | body-lg, Hanken 400, `text-white/50` |
| Four truth rows | **SpecStrip** (promoted in S2) | hairline-separated rows; label in Geist 600 16px + detail in Hanken 400 16px; monochrome `text-white/80` label, `text-white/50` detail |
| Section-enter reveal | `BlurReveal` | wraps H2 + subheading; rows stagger with `.st-reveal` or BlurReveal delay |

**SpecStrip in this context:** the 4 truths are NOT a bento grid and NOT a StickyFeatureList. They are a vertical stack of hairline-divided rows, each: label (left, Geist 600) + detail (right, Hanken 400). The SpecStrip component designed in S2 handles horizontal; for vertical rows, the soldier may extend SpecStrip with a `direction="vertical"` prop OR build a simple bespoke `TruthRow` list here. If bespoke, promote to kit as `SpecStrip/vertical` variant afterward. Decision: soldier picks whichever is cleaner; must note in DECISIONS.md.

### Minimum structure (ceiling)
H2 + 1 subheading (justified: the subheading states the Loom contrast that gives the heading meaning; without it, "You own this." is abstract) + 4 truth rows. NO extra elements. NO diagrams (the current site's 3-node diagram is killed). NO icons.

### States
- Row hover: none required (these are not interactive).
- Section-enter: BlurReveal + stagger on rows.
- Dark/light transition border: smooth morph, no hard cut (handled by DarkSection top/bottom hairlines).

### Tokens (dark scope)
`--color-ink-surface`, `white/80`, `white/50`, `white/10`, `--color-accent` (optional: single accent dot before each label), `--font-display`, `--font-body`, `--radius-window`, `section-y`.

### Responsive
- 1440px: full two-column truth rows (label left, detail right) OR single-column if that reads more cleanly.
- 1920px: same.
- 500px: single-column stack; DarkSection renders statically; no morph.

### Acceptance checks
- [ ] `DarkSection` from kit, not a raw dark div. (If DarkSection props cannot accommodate the stage inset, flag and explain; do NOT inline ad-hoc dark colors.)
- [ ] "You own this." heading only; subheading present (justified above).
- [ ] Exactly 4 truth rows matching ownership.truths[0..3] from copy.json.
- [ ] No icons, no diagram, no checklist markers (text rows only).
- [ ] No eyebrow chip above H2.
- [ ] All text >= 16px.
- [ ] Monochrome on dark — no color except optional single accent dot per row.
- [ ] BlurReveal wraps heading/sub; rows stagger in.
- [ ] Section boundaries are smooth morph transitions (DarkSection white/10 hairlines handle this).

---

## S6 — FAQ (accordion)

### Purpose
Seven plain questions answered plainly. No preamble.

### Focal point
The open question. One question visible as "open" at a time (single mode).

### Theme
Light.

### Copy keys (from content/copy.json)
- `faq.heading`       → "Questions."
- `faq.items[0..6].question` and `.answer` → all 7 Q+A pairs (see copy.json)

### Component map
| Element | Kit component | Note |
|---|---|---|
| Section H2 | bespoke heading | display-md, Geist 600, ink |
| Accordion | `FAQAccordion` | `mode="single"` (radio-style; one open at a time; DIRECTION: "the open question" as focal point); items from copy.json faq.items |
| Section-enter reveal | `BlurReveal` | H2 only |

**FAQAccordion usage note.** Pass `mode="single"` (not the kit default `multi`). Items: `faq.items.map(i => ({question: i.question, answer: i.answer}))`. The kit component handles: hairline borders, rotating glyph, Framer AnimatePresence height+opacity exit, reduced-motion. No customization needed beyond mode and items.

### Minimum structure (ceiling)
H2 only ("Questions." — no subheading; the heading stands alone). 7 accordion items. Nothing else. NO preamble paragraph, NO eyebrow, NO badge.

### States
- Item open: AnimatePresence height expand, opacity 0→1, Framer kit default. Reduced-motion: instant.
- Item hover (closed): border-strong transition, 150ms.
- Rotating glyph: 0deg (closed) → 45deg (open), 150ms ease-smooth.
- Focus-visible: 2px accent outline on the trigger button.

### Tokens
`--font-display`, `--font-body`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-border-strong`, `--ease-smooth`, `section-y`.

### Responsive
- 1440px: full-width single-column accordion.
- 1920px: same.
- 500px: same layout, collapses cleanly; kit handles.

### Acceptance checks
- [ ] `FAQAccordion` from kit, not forked.
- [ ] `mode="single"` — not multi.
- [ ] Exactly 7 items matching faq.items[0..6] from copy.json.
- [ ] "Questions." heading only — no subheading.
- [ ] No eyebrow chip above H2.
- [ ] All text >= 16px (question label + answer body).
- [ ] No dashes, no bullets in any answer. ASCII only.
- [ ] Reduced-motion: instant open/close.
- [ ] Focus-visible on trigger: 2px accent outline.

---

## S7 — Final CTA + Footer

This section has two distinct sub-regions with different themes.

---

### S7a — Final CTA (DARK stage)

#### Purpose
The closing ask. One verb, one grievance, one red button.

#### Focal point
The red Download button.

#### Theme
DARK stage. `DarkSection` wrapper.

#### Copy keys (from content/copy.json)
- `final_cta.heading`    → "Stop renting your screen recordings."
- `final_cta.body`       → "Download Tracer, connect your Dropbox, and keep every recording you ever make."
- `final_cta.cta_primary`→ "Download for macOS"
- `final_cta.note`       → "Free forever. ~12MB. MIT licensed."

#### Component map
| Element | Kit component | Note |
|---|---|---|
| Dark section wrapper | `DarkSection` | same token contract as S2 / S5 |
| H2 | bespoke heading | display-md, Geist 600, `text-white/80` |
| Body | bespoke text | body-lg, Hanken 400, `text-white/50` |
| Primary CTA | `Button/primary` | solid accent fill, "Download for macOS" |
| Note line | bespoke text | body 16px, Hanken 400, `text-white/40` |
| Section-enter reveal | `BlurReveal` | wraps heading + body + button, staggered |

#### Minimum structure (ceiling)
H2 + 1 body line + 1 CTA button + 1 note line (justified: "Free forever. ~12MB. MIT licensed." is the last credibility beat before download; no word is wasted). NO secondary CTA here. NO GitHub star repeat here. NO eyebrow.

#### States
- Button: hover → `--color-accent-hover`, 150ms --ease-smooth.
- Focus-visible: 2px accent outline.

#### Tokens (dark scope)
`--color-ink-surface`, `--color-accent`, `--color-accent-hover`, `white/80`, `white/50`, `white/40`, `--radius-button`, `--ease-smooth`, `section-y`.

#### Acceptance checks
- [ ] `DarkSection` from kit.
- [ ] "Stop renting your screen recordings." exact match to copy.json.
- [ ] Body line exact match to copy.json.
- [ ] Single `Button/primary` — solid accent fill. No gradient. No second CTA.
- [ ] Note line "Free forever. ~12MB. MIT licensed." — 16px, `text-white/40`.
- [ ] No eyebrow chip.
- [ ] All text >= 16px.
- [ ] BlurReveal stagger: heading delay 0, body 0.1s, button 0.2s.

---

### S7b — Footer (light)

#### Purpose
Sitemap + legal. Wordmark left, links, one bottom legal line.

#### Focal point
The wordmark (identity sign-off).

#### Theme
Light.

#### Copy keys (from content/copy.json)
- `footer.tagline`          → "A macOS screen recorder that hands your footage back to you."
- `footer.columns[0].label` → "Product"; links: Download (/download), Dashboard (/dashboard)
- `footer.columns[1].label` → "Open source"; links: GitHub, MIT license, Releases (all external)
- `footer.columns[2].label` → "NoCorny"; links: Agency (external)
- `footer.legal`            → "2026, MIT licensed, no cookies, no trackers."

#### Component map
| Element | Kit component | Note |
|---|---|---|
| Footer shell | `FooterEditorial` | oversized wordmark + sitemap + tagline + legal row |
| External links | `TextLink` with `external` prop | kit handles target+rel automatically |

**FooterEditorial usage note.** Props: `wordmark="NoCorny Tracer"`, `tagline=footer.tagline`, `links` mapped from footer.columns (flatten to `{label, href, external}[]` if FooterEditorial expects a flat array, or pass grouped if it supports columns — check component props before mapping). `legal=footer.legal`. The squiggle mark may need to be passed as a ReactNode wordmark override if FooterEditorial's wordmark prop accepts only a string; soldier checks and notes in DECISIONS.md.

#### Minimum structure (ceiling)
Wordmark + tagline + 3-column sitemap + legal line. No manifesto paragraph. No "made with love". No emoji. No fourth column.

#### States
- Link hover: `TextLink` default (underline on hover, 150ms).
- Focus-visible: 2px accent outline.

#### Tokens
`--font-display`, `--font-body`, `--color-text`, `--color-text-muted`, `--color-border`, `section-y`.

#### Responsive
- 1440px: 3 columns.
- 500px: FooterEditorial collapses to 1-col stack (kit handles).

#### Acceptance checks
- [ ] `FooterEditorial` from kit, not forked.
- [ ] Wordmark = "NoCorny Tracer" (squiggle mark if passable; plain text wordmark otherwise — document decision).
- [ ] Tagline matches copy.json footer.tagline exactly.
- [ ] 3 columns matching footer.columns[0..2] from copy.json.
- [ ] All external links: target blank + rel noopener. (`TextLink external` prop handles).
- [ ] Legal line matches copy.json footer.legal exactly. No em dash in legal. No emoji.
- [ ] No manifesto, no agency praise, no "made with love" line.
- [ ] All text >= 16px.

---

## Mobile stub contract

The deliberate single-screen stub for screens <= 768px (checked via CSS `@media` + scroll-width assertion).

### What renders on mobile
- NoCorny squiggle mark + "NoCorny Tracer" wordmark, centered.
- One line: "macOS only. Download on your desktop." (body 16px, Hanken, `--color-text-muted`).
- One button: `Button/primary`, "Download for macOS", `--color-accent`.
- Nothing else. No hero morph. No nav links. No accordion. No bento.

### Layout
Full viewport height, flex column, centered vertically and horizontally. Light bg.

### Acceptance checks
- [ ] All desktop sections hidden via `@media (max-width: 767px) { display: none }` or equivalent Tailwind `hidden md:block` pattern.
- [ ] Mobile stub visible only below 768px.
- [ ] Stub contains: mark, wordmark, one line, one button. Nothing else.
- [ ] `document.body.scrollWidth === document.documentElement.clientWidth` at 500px (no horizontal overflow).
- [ ] Stub text >= 16px.
- [ ] No hero animation fires on mobile.

---

## Global acceptance checklist (blocking — conductor verifies all before SHIP)

### Typography
- [ ] All text >= 16px on every section, every theme. Zero sub-16px. Run `node tools/ds-lint.mjs src/`.
- [ ] Max 2 font families: Geist and Hanken Grotesk (Geist Mono is part of the Geist system, exempt from the count as a mono variant).
- [ ] ~4 size steps total: display-xl, display-md, body-lg, body. No extra ad-hoc sizes.
- [ ] Geist Mono used ONLY for `~/Dropbox/Tracer/` paths and `tracer.nocorny.com/v/...` link strings.
- [ ] No IBM Plex anywhere.
- [ ] No gradient text on any element (wordmark, headline, button, badge).

### Color / accent
- [ ] `--color-accent: #E5484D` is the ONLY brand color. Zero purple, zero violet, zero blue.
- [ ] All literal hex values live exclusively in tokens.css. Run `node tools/ds-lint.mjs src/` for raw-hex check.
- [ ] Every color reference in components uses `var(--)` or Tailwind utility that maps to a token.
- [ ] No gradient-fill buttons.

### Surfaces / borders
- [ ] Every card, cell, stage, pill, and window has a visible border (1px, `--color-border` on light / `white/10` on dark).
- [ ] No borderless floating cards.
- [ ] Stage radius = `--radius-window` (12px). Button radius = `--radius-button` (8px). Dots + pills = `--radius-pill`.

### Copy / slop
- [ ] Zero em dashes, en dashes, bullets, middle dots in prose. Run `node tools/ds-lint.mjs`.
- [ ] Zero hyphenated prose words (real identifiers `~/Dropbox/Tracer/`, `tracer.nocorny.com/v/k7r2-mx9p`, `MIT` exempt).
- [ ] Zero emoji in any rendered text.
- [ ] Zero eyebrow chips above any heading.
- [ ] Zero colored proof pills (spec row = SpecStrip only).
- [ ] All rendered copy matches content/copy.json exactly. No placeholder text, no "Lorem ipsum", no invented claims.
- [ ] Factcheck: every claim traceable to REDESIGN_BRIEF.md §1. Run `node tools/slop-scan.mjs src/`.

### Motion
- [ ] Hero morph 5 beats execute in order on load, then rest.
- [ ] ONLY the red record dot (beat 1) has an infinite loop.
- [ ] All other entrances: plays once, rests. No infinite idle decorations.
- [ ] Entrance easing: `cubic-bezier(0.34,1.42,0.5,1)` (--ease-spring). Durations 0.4-0.9s.
- [ ] Hover/state easing: `cubic-bezier(0.2,0.8,0.2,1)` (--ease-smooth). Min 150ms.
- [ ] `prefers-reduced-motion` respected: all motion components render final/resting state.
- [ ] `?motion=0` (`html[data-motion="off"]`) respected: `useEnhancementEnabled` returns false, hero lands on beat-5 static state.
- [ ] No flat fades as default transitions (morphs and spring reveals are the standard).
- [ ] Dark/light section boundary transitions: smooth morph (DarkSection hairlines), no hard cut or cream flash.
- [ ] Lenis smooth scroll active in root layout.

### Section structure
- [ ] Section text budget holds: every section = heading + at most 1 subheading. No body paragraphs in section intros.
- [ ] Content items are terse and uniform (same short shape per item across bento + truth rows).
- [ ] No captions, no helper text, no third text elements.
- [ ] Exactly 7 sections in the specified order: Nav, Hero, How it works, Features, Ownership, FAQ, Final CTA + Footer.
- [ ] Theme rhythm: Nav(light) → Hero(dark) → How-it-works(light) → Features(light) → Ownership(dark) → FAQ(light) → Final-CTA(dark) → Footer(light). Each transition smooth.

### Kit compliance
- [ ] `NavSticky`, `Button`, `FAQAccordion`, `FooterEditorial`, `DarkSection`, `BlurReveal`, `BentoGrid`/`BentoCell`, `StickyFeatureList`, `TextLink`, `useEnhancementEnabled`, `scroll-timeline-reveal.css` all imported from `@ui-kit/*`.
- [ ] No kit component forked or inline-duplicated in `src/`.
- [ ] `EyebrowLabel` NOT used anywhere in this project (banned; every usage is a blocking failure).
- [ ] NEW components `SpecStrip` and (when ready) `HeroMorphStage` registered in `ui-kit/REGISTRY.json` after build.

### Desktop-only / mobile
- [ ] `document.body.scrollWidth === document.documentElement.clientWidth` at 500px. No horizontal overflow.
- [ ] Hero morph does NOT run on mobile.
- [ ] Mobile stub renders: mark, wordmark, one line, one button.
- [ ] No real responsive mobile layout (not a requirement; a broken mobile is also not acceptable — the stub IS the mobile layout).

### Performance / correctness
- [ ] CLS = 0 on pinned hero (no layout flash on scroll-out).
- [ ] LCP element (hero headline) is server-rendered, no motion gate on text.
- [ ] All external links: `target="_blank" rel="noopener noreferrer"`.
- [ ] GitHub URL is the real `https://github.com/nocorny/tracer`.
- [ ] `/download` and `/dashboard` are real hrefs (not `#`).
- [ ] `HANDOFF.md` updated: section order, HeroMorphStage custom embed note, SpecStrip kit-promotion note, Framer Motion + Lenis deps noted.

---

## Component promotion queue (soldier must complete before SHIP)

| Component | Built in | Promote to | Registry key |
|---|---|---|---|
| `SpecStrip` | `src/components/SpecStrip.tsx` | `ui-kit/components/section/SpecStrip.tsx` | `section.SpecStrip` |
| `HeroMorphStage` | `src/components/HeroMorphStage.tsx` | `ui-kit/components/motion/HeroMorphStage.tsx` (only if reused; else stays project-local, noted in HANDOFF.md) | `motion.HeroMorphStage` (conditional) |
