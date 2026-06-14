# Orchestra dashboard — REDESIGN CONTRACT

Compiled by 3mpq-architect. Target: `apps/orchestra/server.mjs` — the single
`page()` function + inline `<style>`. Zero deps, one HTML page, no JS required.
The soldier must satisfy this contract. The judge / minimalist check against it.

Data the page has (fixed, do not invent more):
- 18 orchestra agents grouped into 6 pipeline stages, in pipeline order.
- 6 built-in agents.
- Per agent: runs (count), tokens (may be n/a), last-active recency, share of
  total runs, idle flag ("not yet invoked, candidate to drop").
- Summary totals: orchestra count, built-in count, total runs, total tokens,
  idle count.
- Reality check: the ledger is SPARSE (currently 8 runs across 18+6 agents).
  Most agents are idle. The design must look deliberate when mostly empty,
  not broken. This is the single hardest constraint. Idle is the norm, not
  the exception, so idle must be a calm state, not an alarm state.

Doctrine that applies in full (this is not a kit project, so ignore the
component registry, but VISUAL doctrine is non-negotiable):
- IBM Plex: Serif for display (h1, h2), Sans for body, Mono for agent names,
  stats, tokens, recency, and the run/token numerals.
- One accent only: `#217a50`. No second brand color. The amber idle dot and
  the sonnet/opus badge tints are the ONE place where extra hues are tolerated
  today — see CUT list, most of them go.
- Light near-white surface (`--bg #fff`, `--elev #f7f7f6`), hairline borders
  (`--border #e5e5e5`).
- Dot-grid background allowed (24px) but quiet.
- ASCII only. No em-dash, en-dash, minus sign, bullet, middle dot, curly
  quotes. Use " - " (spaced ASCII hyphen) or restructure. The current `-`
  separators are fine; just never a real dash glyph.
- Hard minimalism: heading + body by default. No chips, no captions, no
  decorative subheadings. Every extra element below is justified or it is cut.

---

## Information architecture — the core decision

The current design is a flat sea of cards (24 cards, all the same weight). It
fails the brief because "who earns their seat" is NOT instantly legible — you
have to read every card's tiny stats line. The redesign inverts this:

1. **Contribution becomes the primary visual axis, not a footnote.** The run
   share (involvement bar) and the active/idle split must be readable at a
   glance across the whole roster, before reading a single role line.
2. **The pipeline becomes a visible left-to-right flow,** not six unrelated
   `<h2>` blocks. Work moves: Route -> Research -> Build -> Gate -> Critics ->
   Ship. The page should read as that sequence.
3. **Active vs idle is the headline story.** With 8 runs across 24 agents, the
   honest message is "3 agents do the work, 21 are on the bench." The page must
   say that without a paragraph.

---

## Section list and order

| # | Section | Why it exists |
|---|---------|---------------|
| 0 | Masthead + summary | What this is, in one breath, plus the five totals. |
| 1 | Pipeline flow strip | The six stages as one visible left-to-right sequence with per-stage load. The "it's a pipeline" idea, made visual. |
| 2 | Roster by stage | The agents themselves, grouped by stage, each with its contribution view. The substance. |
| 3 | Built-in agents | The platform agents, visibly secondary. |
| 4 | Footer | Provenance + the log command. Functional, not decorative. |

No other sections. No hero image, no legend block (the bar legends itself),
no "about" prose.

---

## Section 0 — Masthead + summary

**Purpose:** name the thing and give the five numbers that frame everything below.

**Minimum structure:**
- Eyebrow `Aisoldier` (12px uppercase, accent). JUSTIFIED: doctrine explicitly
  sanctions the 12px uppercase eyebrow as the one sub-16px element; it is the
  studio brand mark, not a decorative subheading. Keep exactly one.
- h1 (serif) `The Orchestra`.
- One lede line (<= 1 sentence, ~16-18px, muted). JUSTIFIED as the single body
  line for the masthead heading; this IS the "+ body" half of heading+body.
  Must state the one idea: bars show share of runs, idle agents have not earned
  a seat, data is live. No second paragraph.
- Summary: the five totals as mono stats. KEEP as a row of bordered stat pills
  (this is data display, not decorative chips — they carry the numbers the rest
  of the page contextualizes). Numerals in mono, label in sans.
  Required five: `N orchestra agents`, `N built-in`, `N total runs`,
  `Nk tokens`, `N idle`. The idle stat is the conscience of the page — render
  its number in accent if idle > 0 so the bench size is the one figure that pops.

**Cut from current:** nothing here is broken; tighten the lede to one sentence.

**Measurable:** masthead block <= 4 text elements + 1 stat row. Lede one
sentence, one period. Eyebrow appears exactly once on the page.

---

## Section 1 — Pipeline flow strip  (NEW, the signature element)

**Purpose:** make "this is a pipeline and here is where the work lands" legible
in under two seconds, before any card is read.

**Minimum structure:** six cells in a single horizontal row (wraps on mobile),
in pipeline order:
`Route & plan -> Research & content -> Build -> Deterministic gate -> Critics -> Reconcile & ship`

Each cell shows, top to bottom:
- Stage name (sans, 13-14px, weight 600).
- A count pair in mono: `agents` and `active` for that stage, e.g. `3 agents`
  / `1 active`. JUSTIFIED: this is the per-stage contribution rollup, the whole
  reason the strip exists; it is data, not caption.
- A thin stage-load bar: width = stage's share of total runs across all stages.
  Same bar language as the per-agent bar (accent fill on elev track), so the
  eye learns one visual once. A stage with zero runs shows an empty track (no
  amber, no alarm — empty is calm here).

**Flow connector:** between cells render a single ASCII arrow `->` (or a 1px
chevron drawn in CSS, no image, no SVG file). This is the ONE permitted
decorative mark because it literally encodes the pipeline-as-flow idea that is
the section's entire purpose. On wrap (mobile) the arrow may drop to a thin
1px connector line or hide; never let it create a lonely glyph on its own row.

**Constraints:**
- The strip is bordered as one surface (radius-window 12px) or six bordered
  cells sharing edges — pick one, not both. No shadow.
- No icons, no color per stage. One accent, hairlines, mono numerals. The only
  differentiation between stages is the bar length and the numbers.
- Heights equal across cells regardless of content so the row reads as a track.

**Cut:** do NOT add stage descriptions here (the roster section carries roles).
The strip is numbers + flow only.

**Measurable:** one row, six cells, equal height, exactly five `->` connectors
on desktop. Each cell <= 4 lines of content. Renders correctly when all six
loads are zero (all tracks empty, no NaN width, no amber).

---

## Section 2 — Roster by stage

**Purpose:** the agents, with the contribution view that answers "does this one
earn its seat."

**Structure per stage:**
- h2 (serif, 22px) = stage name. Reuse the SAME six names as the strip, same
  order, so strip and roster are obviously the same six stages. No per-stage
  intro sentence (CUT — the strip already summarized the stage; a sentence here
  is the redundant subheading the minimalist bans).
- A grid of agent cards.

**Agent card — minimum structure (heading + body + contribution):**
1. Agent name (mono, 14-15px, weight 500). This is the heading.
2. Role line (sans, 14px, fg). This is the body. ONE line of role; do not wrap
   to a paragraph.
3. Contribution view (see below) — the load-bearing addition, JUSTIFIED because
   contribution IS the purpose of the dashboard, not decoration.
4. `writes` line (mono, 12px, muted, prefixed with a dim `writes` key).
   JUSTIFIED: this is the agent's concrete output artifact, the one piece of
   doctrine context that distinguishes near-identical critics
   (REVIEW.md vs KIT_REVIEW.md vs MINIMAL_REVIEW.md). Keep, one line.

**CUT from the current card:**
- **Model badge (opus/sonnet/haiku) — CUT the colored variants.** They
  introduce green/amber/gray hues that read as a second and third accent and
  add nothing to "who earns their seat." If model must stay, render it as plain
  mono muted text inline with the name (e.g. `opus`), no border, no color. The
  amber sonnet badge and accent opus badge both violate the one-accent rule.
- **type badge (orchestration/content/build/gate/critic/ship) — CUT.** The
  stage grouping already encodes type; a per-card type pill is the chip the
  minimalist bans, and `type-CRITIC` colors it accent, fighting the bars for
  the eye. The stage heading carries this.
- **tool chips — CUT from the card face.** A wall of 10 mono chips per card is
  the single biggest source of clutter and is irrelevant to contribution. Tools
  stay available in `/agents.json` for anyone who needs them. If the user
  insists tools must be visible, they go as ONE plain mono line of comma-joined
  names truncated with `+N`, never as bordered chips. Default: cut entirely.

Net effect: card drops from up to 6 visual element types (name, type pill,
model badge, role, writes, bar, stats, chips) to 4 (name, role, contribution,
writes). That is the subtraction the brief demands.

**Contribution view — the "earns their seat" mechanic (KEEP + sharpen):**

Active agent:
- Involvement bar: `height 6px`, accent fill on `--elev` track, hairline
  border, fully rounded. Width = `max(6%, round(count / maxCount * 100))%` so a
  single run is still visible. This bar is the primary at-a-glance signal; it
  must be the most saturated accent mark on the card.
- One mono stats line beneath: `<b>N</b> runs / Nk tok / Xd ago` using the
  existing ` / ` separator with dim slashes. Tokens show `n/a` when unknown.

Idle agent (the common case, must be calm):
- The whole card gets the idle treatment: `opacity ~0.72`, dashed border. KEEP.
- In place of the bar, ONE quiet mono line: `not yet invoked - candidate to drop`.
- Idle marker: a single small dot. RECONSIDER COLOR: today it is amber
  (`#c98b1a`), a second hue. Prefer a NEUTRAL dim dot (`--dim`) OR an open
  (hollow, accent-border) dot, so idle is signaled by absence/dashing, not by a
  competing warm color. Decision: hollow dim dot, no fill. One accent on the
  page stays true.

**Sorting within a stage:** keep `order` (pipeline/role order) as the default so
the roster mirrors how work actually flows. Do NOT sort by runs — that would
scatter the pipeline reading. The bars already surface the workhorses visually;
they do not need to be physically reordered.

**Grid:** `repeat(auto-fill, minmax(330px, 1fr))`, gap 14px. KEEP — it already
holds at all widths.

**Measurable:** every card has exactly name + role + contribution + writes, in
that order. Zero type pills, zero model color badges, zero tool chip walls on
the rendered page. Idle cards: dashed border, opacity reduced, one hollow dim
dot, one mono line, no bar, no NaN. Active cards: bar width never 0% for
count>0, never >100%.

---

## Section 3 — Built-in agents

**Purpose:** show the platform agents as present but clearly secondary.

**Structure:** same card shape as Section 2 minus `writes` (built-ins have no
doctrine artifact). h2 `Built-in agents`. Cards use the `--elev` background to
read as a tier below the orchestra (KEEP this device — it is the legitimate way
to show secondary without a second color). Same contribution view, same idle
treatment.

**Cut:** tool chips here too (consistency with Section 2).

**Measurable:** built-in cards visually subordinate (elev bg) but identical in
layout grammar to orchestra cards; no extra elements.

---

## Section 4 — Footer

**Purpose:** provenance + how to log a run.

**Structure:** one mono line, dim, top hairline border. Source paths + the
`log.mjs` command. KEEP as-is; it is functional reference, not decoration.

**Cut:** nothing.

---

## What to KEEP from the current design (do not regress)

- The whole token block (`:root` vars) — accent, surfaces, borders are correct.
- Dot-grid background at 24px, quiet.
- Serif h1/h2, mono names/stats, sans body split.
- The involvement bar mechanic and `max(6%, ...)` floor.
- Idle = dashed border + reduced opacity.
- `--elev` background for built-in tier.
- Summary stat-pill row.
- The five-stat summary numbers and the `/agents.json` endpoint untouched.
- Footer provenance line.

## What to CUT (bias to subtraction)

1. Per-card **type badges** (whole `typeBadge` concept on the card face).
2. **Colored model badges** (opus accent / sonnet amber / haiku gray). Plain
   muted mono text at most, default cut.
3. **Tool chip walls** on every card (both orchestra and built-in).
4. The **amber idle dot color** — replace with hollow dim dot (kills hue #2/#3).
5. Any **per-stage intro sentence** in the roster (the strip summarizes).
6. Lede trimmed to **one sentence**.

After cuts the only non-grayscale ink on the page is the accent `#217a50`
(bars, eyebrow, idle stat number, optional hollow-dot border). That is the
one-accent doctrine satisfied literally.

---

## Responsive intent

| Breakpoint | Pipeline strip (S1) | Roster grid (S2/S3) | Masthead |
|---|---|---|---|
| 1920 | 6 cells one row, generous | grid auto-fill, 3-4 cols | wide, lede on one line |
| 1440 | 6 cells one row | 3 cols typical | unchanged |
| 768  | strip wraps to 2 rows of 3; arrows become 1px connectors or hide | 2 cols | stats wrap to 2 lines |
| 390  | strip stacks vertical (6 stacked cells), arrow dropped, optional thin connector between | 1 col | stats wrap; h1 clamps down |

Rules:
- `max-width 1120px` wrap KEEP.
- Type floor: body 16px desktop, may relax to 14px mobile for the densest mono
  stats only; never below 14px; eyebrow 12px is the sole exception.
- The pipeline strip must never produce a single orphan arrow glyph on its own
  line at any width — arrows belong between cells or not at all.
- No horizontal scroll at 390. Bars and stat rows wrap, never overflow.

---

## Acceptance checklist (judge / minimalist / linter check this)

- [ ] Exactly five sections in the order above; no hero image, no legend block,
      no about prose.
- [ ] Pipeline strip present, six cells, pipeline order, equal heights, ASCII
      `->` flow on desktop, degrades cleanly to no-orphan on mobile.
- [ ] Agent card = name + role + contribution + writes ONLY. No type pill, no
      color model badge, no tool chip wall.
- [ ] One accent `#217a50` is the only non-grayscale ink. No amber, no second
      green, no per-type color.
- [ ] Idle is calm: dashed + dimmed + hollow dim dot + one mono line. No alarm
      color. Renders correctly when most agents are idle.
- [ ] Involvement bars: floor 6% for count>0, never exceed 100%, empty track
      for zero. No NaN at any width.
- [ ] ASCII only, no dash/bullet/curly-quote glyphs anywhere in output.
- [ ] No horizontal scroll at 390 / 768 / 1440 / 1920.
- [ ] `/agents.json` endpoint and all five summary numbers unchanged.
