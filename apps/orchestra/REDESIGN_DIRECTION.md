# Orchestra dashboard — art direction for a full redesign

3mpq-aesthete. Reference bar: getcorder.com. Reviewed: `apps/orchestra/server.mjs`
(`page()` + inline `<style>`) and the live ledger `data/contributions.jsonl`
(8 runs total, almost all on built-ins — most orchestra agents read 0).

This is a redesign brief, not a code change. It is opinionated and ranked.
The conductor decides what ships.

---

## The one-sentence verdict

The current page is a **card wall** — 24 near-identical bordered tiles in a
flowing auto-fill grid, every tile shouting the same amount. That is the exact
opposite of the stated purpose. The purpose is *triage*: "who earns their seat."
Triage needs a **ranked, scannable list with one dominant signal**, not an
egalitarian grid where the idle agent and the workhorse occupy the same visual
footprint. Redesign around the signal, not around the catalog.

---

## What reads cheap / cramped / generic / cluttered today (specific)

1. **Everything is the same size.** A card for an agent with 4 runs is identical
   in size and weight to one with 0 runs. The single most important fact — who
   is busy vs idle — is encoded only in a 6px bar and a dashed border at 0.72
   opacity. The eye lands on *nothing first*. No hierarchy = no triage.

2. **Card wall = generic SaaS.** `repeat(auto-fill, minmax(330px,1fr))` with 24
   bordered rounded tiles is the default "admin dashboard" look. It reads
   template, not studio. getcorder.com never tiles like this.

3. **Cramped type, too many micro-sizes.** The CSS uses 16, 18, 14.5, 14, 12.5,
   12, 11.5, 10.5, 10 px — *nine* font sizes, several only 0.5px apart
   (14.5 vs 14, 12.5 vs 12, 11.5 vs 10.5). Half-pixel steps are invisible as
   hierarchy and read as indecision. The 10–11px mono labels are below the
   studio comfort floor and look cheap on a 1px dot grid.

4. **Chip soup.** Each card carries: name + type pill + model pill, role line,
   "writes" line, contribution bar, contribution stat line, and up to 10 tool
   chips. That is 6+ competing elements per tile across 24 tiles ≈ 150+ chips
   on screen. The tool chips in particular add enormous visual noise and answer
   a question nobody asked on a *contribution* dashboard.

5. **Sections stacked, pipeline invisible.** The orchestra is a *pipeline*
   (Route → Research → Build → Gate → Critics → Ship) but it renders as six
   stacked `<h2>` blocks. Stacking hides the single most interesting structural
   truth: it is a left-to-right flow. The reader cannot see the assembly line.

6. **Accent overused and muddled.** #217a50 appears on: eyebrow, opus badge
   border+text, CRITIC type border+text, the contribution bar, *and* the idle
   warning uses a second color (#c98b1a amber) plus sonnet badges use a third
   (#b07b1a). Three colors. Doctrine is ONE accent used sparingly. Right now the
   accent is wallpaper and there are two extra hues fighting it.

7. **The summary bar is weak and buried.** Five identical grey mono pills. The
   most important number for this tool — "X agents idle / 0 runs" — is the last
   pill, same weight as "tokens logged." The headline stat should be the lede.

8. **Idle treatment is too polite.** dashed border + 0.72 opacity is a whisper.
   "Candidate to drop" is the entire reason this dashboard exists; it should be
   unmissable, not faded into the background.

9. **Built-ins mixed in as equals.** Six built-in agents get full cards in the
   same grid. They are not part of the orchestra you are triaging; right now
   they dilute the count and (per the ledger) are actually the *only* things
   with runs — which makes the orchestra look busier than it is.

---

## Ranked art direction

Impact = how much it moves the page toward "see who earns their seat at a glance"
and toward the getcorder bar.

### 1. Replace the card wall with a single ranked table/ledger. [HIGH]
This is the redesign. One column of rows, **sorted by runs descending**, idle
agents sinking to the bottom. A table is the correct form for "compare 24 things
on one metric." Each row is a thin horizontal band:

```
 NAME (mono)          STAGE        ROLE (truncated)              BAR + RUNS    TOK    LAST
 3mpq-soldier         build        Builds sections serially...   ████████ 12  340k   today
 3mpq-judge           critic       Visual + spacing vs spec...   ████ 5       120k   2d ago
 ...
 3mpq-aesthete        critic       Premium feel...               ·  0         —      never   IDLE
```

- Row height ~56px, generous. Hairline `#ececeb` bottom border only — no per-row
  box, no radius, no card. The page becomes a quiet ledger.
- The whole row is the unit; the eye runs down the BAR column and instantly sees
  the cliff where work stops and idle begins.
- Sorting *is* the hierarchy. The busiest agent sits at the top, biggest bar,
  first thing read. The idle agents cluster at the bottom under a faint rule.
- Keep tools and "writes" OUT of the row. Put them in an expand-on-click detail
  (or drop entirely — see #9). The row carries only what triage needs.

### 2. Render the pipeline as a left-to-right flow rail, above the table. [HIGH]
Before the ledger, a single horizontal strip showing the six stages as a flow:

```
 ROUTE & PLAN  →  RESEARCH  →  BUILD  →  GATE  →  CRITICS  →  SHIP
     3              3           1         1        8           2     (agent counts)
   180k            90k        340k      40k      210k         30k    (stage load)
```

- One row, six segments separated by a thin `→` or a 1px divider, left to right.
- Each segment is a small stack: stage name (mono, uppercase, 11px, `--dim`),
  agent count (serif or sans, ~28px), and a tiny load bar or token figure.
- This is the *only* place the flow lives. It answers "where does the work
  concentrate" in one glance — e.g. Critics is 8 agents but if 7 are idle the
  segment's load bar is nearly empty, which is a story by itself.
- Optionally: the segment whose stage is fully idle gets a faint accent
  underline so a dead stage is visible at the flow level too.
- This replaces the six stacked `<h2>` sections. Stage is now a *column value*
  in the table (#1) plus this rail — not a layout divider.

### 3. Make contribution legible with ONE encoding: a shared-scale horizontal bar + run count, period. [HIGH]
The single best visualization is the **horizontal bar normalized to the busiest
agent**, sitting in its own fixed-width column so all bars share a baseline and
are directly comparable down the page. Specifics:

- Bar track: 120px fixed, height 8px, `--track` (#f0f0ee), no border (the border
  on a 6px bar today is fussy). Fill: `--accent` (#217a50), 2px radius.
- **Do not floor the width at 6%** (current code does `Math.max(6, …)`). The
  floor is a lie — it makes a 1-run agent look ~half as busy as it is relative
  to a 12-run agent. Let small bars be small. Truth is the point.
- Run count as a mono number immediately right of the bar, `--fg`, 15px, 500.
  The number is the precise value; the bar is the instant comparison.
- **Zero runs = no bar at all**, replaced by a single accent-free dot and the
  count `0`. Absence of bar is the strongest possible "idle" signal — far
  stronger than a dashed border.
- Tokens and last-active are secondary, in `--muted`, to the right, smaller.
  They are context, not the headline. Last-active in mono so dates align.

Do not add sparklines, donuts, or a second metric bar. One bar, one scale, one
accent. That restraint is the getcorder bar.

### 4. Collapse nine font sizes to a five-step scale. [HIGH]
Half-pixel steps are noise. Lock a real scale:

| Token | px / weight / family | Use |
|---|---|---|
| display | 48 / 500 / serif | H1 "The Orchestra" |
| headline | 22 / 500 / serif | section / flow-rail label |
| body | 16 / 400 / sans | lede, role text |
| stat | 15 / 500 / mono | run counts, the numbers that matter |
| label | 12 / 600 / mono, 0.06em, uppercase | column heads, stage names, eyebrow |

Five sizes, each clearly distinct. Mono is reserved for agent names + all stats
(per doctrine). Nothing below 12px. Kill 14.5/12.5/11.5/10.5/10.

### 5. Promote the idle count to the headline; demote the rest. [HIGH]
The reason this tool exists is triage. Lead with it:

- One large figure at top, serif, ~40px: **"N of 18 agents have never run."**
  That single sentence is the dashboard's thesis. Put it directly under the H1
  as the lede, accent only on the number.
- The other stats (total runs, tokens) become a quiet single line of mono
  `--muted` text beneath it, not five equal pills. Pills imply equal weight;
  these are not equal.

### 6. Spend the accent in exactly three places. [HIGH]
ONE accent, sparingly. Allow #217a50 only on:
1. the contribution bar fill,
2. the headline idle number (#5),
3. one hover/active affordance (row hover left-edge tick, 2px).

Everywhere else goes monochrome. **Remove the amber idle dot (#c98b1a) and the
two brown badge colors (#b07b1a sonnet / opus accent).** Model is metadata — render
model as plain `--muted` mono text, not a colored pill. Idle signals via
*absence* (no bar, sunk to bottom) + a single `--fg` "IDLE" label in mono, not
a third hue. The page should be near-greyscale with green appearing only where
it means "work happened."

### 7. Establish an 8px spacing rhythm and let the page breathe. [MED]
Current paddings are ad hoc (16/16/14, 7/12, 2/7, etc.). Lock everything to an
8px grid: row vertical padding 16, column gaps 24, section gaps 48, page top
80. Wrap stays ~1120 but the table can go slightly wider (1200) since rows scan
horizontally. Generous whitespace is most of what makes getcorder feel premium —
the current page is dense because it boxes everything.

### 8. Hairlines over boxes; one elevation, used once. [MED]
Drop all card borders and radii from the agent rows — separators become single
1px `#ececeb` bottom rules. Reserve the radius + soft shadow for *one* element
only: the flow rail (#2) as a single framed strip, or nothing at all. "Borders
everywhere" in doctrine means every distinct surface has a hairline — it does
not mean 24 boxed cards. A ruled table satisfies the border rule and reads far
calmer. Hover: row background to `--elev` (#f7f7f6) + 2px accent left tick,
150ms ease. Pneumatic, quiet.

### 9. Cut tool chips and "writes" from the default view. [MED]
On a *contribution* dashboard, tool inventories are noise. Remove the up-to-10
tool chips per row entirely (or move to an expand/detail row revealed on click).
Same for the "writes" output path — useful reference, not triage signal. This
removes ~150 chips from the screen and is the biggest single decluttering win
after #1. Role text stays but truncated to one line with ellipsis; full role on
row expand or title attr.

### 10. Separate built-ins into a muted appendix. [MED]
Built-ins are not orchestra members you can drop. Per the ledger they are the
only things with runs, which currently flatters the orchestra. Move them below
the orchestra ledger under a quiet "Built-in agents (not part of the orchestra)"
rule, in `--muted`, no bars or a separate faint scale. Keep them out of the idle
count and the flow rail. The orchestra triage stays honest.

### 11. Add a column-header row and make it sortable-looking. [LOW]
A thin header row (NAME / STAGE / ROLE / RUNS / TOKENS / LAST) in label-style
mono, 12px uppercase `--dim`, sets the table's spine and removes ambiguity about
what each number is. Even without real sort interaction, default-sorted-by-runs
plus a small `↓` on the RUNS head communicates the ordering logic.

### 12. Quiet footer, mono, one line. [LOW]
The current footer is fine in spirit. Keep one line, `--dim` mono, but trim the
log-command verbosity — link to it rather than printing the full invocation.

---

## What to remove (the via-negativa list)
- Per-card borders, radii, hover shadows on agent tiles (→ ruled rows).
- The auto-fill card grid.
- Tool chips (≈150 elements).
- The "writes" line in the default row.
- The amber idle dot and the brown/green model badge colors.
- The 6% bar-width floor.
- Five equal-weight summary pills (→ one headline + one quiet line).
- Six stacked `<h2>` section dividers (→ flow rail + stage column).
- Four of the nine font sizes.

## What the redesigned page should feel like
A quiet, near-greyscale ledger on a faint dot grid. One serif headline states how
many agents are dead weight. A single horizontal flow rail shows where work
concentrates across the six stages. Below it, one ranked table: the busiest agent
on top with the longest green bar, a clean cascade of shorter bars, then a faint
rule and a cluster of bar-less "IDLE" rows at the bottom. Green appears only on
bars and the one number that matters. Nothing shouts. You know who earns their
seat in under three seconds.

## Note on real data (grounds #5 and #10)
The live ledger has only 8 runs and they are almost entirely on built-ins
(general-purpose, Explore) — the named orchestra agents are nearly all at 0.
So in practice the redesigned page will, today, show a near-empty table with a
long IDLE cluster and a flow rail that is mostly empty load bars. That is the
correct and honest picture, and it is exactly why hierarchy #1/#3/#5 matter:
the current card wall hides how little the orchestra has actually run. Design for
the truth — a mostly-idle ensemble — not for a full grid.

---
*Advisory by default. Items #1–#6 are HIGH impact; I would treat shipping the
card wall unchanged as a clear break from the getcorder bar (egalitarian grid
defeats the tool's one job). Everything here is direction, not code.*
