# COMPLETE_REVIEW.md — Orchestra dashboard

Agent: 3mpq-completionist
Date: 2026-06-15
Target: apps/orchestra/server.mjs, rendered at http://localhost:7777
Method: HTML cross-checked line-by-line against /agents.json; CSS read for breakpoint reasoning. No code edited.

## Verdict: ISSUES (1)

One advisory responsive gap. No blocking gaps: no agent dropped, no summary figure missing, no dead-end section.

---

## Coverage — all PASS

### Agent rendering (no silent drops)
- /agents.json lists 18 orchestra agents and 6 built-ins.
- HTML renders all 24 by name. Verified set-equal against the JSON:
  orchestra 18/18 (dispatcher, architect, prompter, researcher, economist,
  copywriter, soldier, linter, judge, kitwarden, minimalist, naturalist,
  aesthete, completionist, factcheck, inquisitor, conductor, devops);
  built-ins 6/6 (general-purpose, Explore, Plan, claude, claude-code-guide,
  statusline-setup).
- Total rows in body = 24 (6 active contrib rows + 18 idle rows). Matches.

### Contribution state per agent
- Active agents (4 orchestra: architect, soldier, linter, aesthete;
  2 built-in: Explore, general-purpose) each render: involvement bar,
  runs count, tokens (or `n/a` when `tokenKnown` is false — e.g. linter
  and Explore log 0/unknown tokens, shown as `n/a`, correct), and
  last-active relative time. All four fields present in all six active rows.
- Idle agents (14 orchestra + 4 built-in = 18) render the dimmed row with
  hollow dot, no bar (verified: 0 idle rows contain a `bar-fill`), and the
  flag "not yet invoked, candidate to drop" (18/18 occurrences). Correct.

### Summary header — all five figures present
1. idle hero: `14` "of 18 idle"
2. `18` orchestra agents
3. `6` built-in
4. `12` total runs (matches totalInv)
5. `599k` tokens (matches totalTok 599103)
All five render. PASS.

### Pipeline flow rail — all 6 stages
- 6 rail cells: Route & plan, Research & content, Build, Deterministic gate,
  Critics, Reconcile & ship. Each shows `<n> agents / <n> active` plus a
  per-stage run-load bar. 5 inline arrows between the 6 cells (correct count).
- Per-stage agent/active counts derive from the same byAgent map as the
  roster; cross-spot-checked Build (1 agent / 1 active) and
  Deterministic gate (1 / 1). Consistent.

### Roster + appendix — no empty headers
- 6 stage `<h2>` sections, each with a populated `.rows` block.
- Built-in appendix renders all 6 with the same row grammar (no writes line,
  elev tint). No section header appears with nothing under it.

---

## ISSUE 1 (advisory) — flow rail wraps and orphans arrows from 641px to ~1119px

**What is missing:** a responsive rule for the rail in the tablet/laptop band.
There is exactly one media query in the stylesheet, `@media (max-width:640px)`.
It correctly collapses the rail to a stacked single column and hides arrows.
Above 640px the desktop rail rule applies with no further breakpoint.

**Where:** `.rail` (flex-wrap:wrap) + `.rail-cell{flex:1 1 0;min-width:150px}`
+ the `.rail-arrow` siblings, server.mjs lines 236-242, 187-194.

**The problem:** the rail holds 6 cells at `min-width:150px` plus 5 inline
arrows (~24px each). Minimum single-line width is about 6×150 + 5×24 ≈ 1020px.
The wrapper is capped at `max-width:1120px` with 24px side padding, so the
content box only reaches ~1072px at >=1120px viewport — the only width where
the rail sits on one clean line.

Between **641px and ~1119px** (this includes the **768px** checkpoint, content
~720px, fits ~4 cells/row) the rail wraps to two rows. Two defects appear:
1. **Orphan arrow.** Arrows are flex siblings placed *after* each cell. When a
   wrap falls right after an arrow, the arrow dangles at the end of row 1 (or
   leads row 2) pointing at nothing — exactly the orphan-arrow case to flag.
2. **No row separator.** Desktop cells carry only `border-right`; the
   bottom border is added only in the <=640 rule. So the two wrapped rows have
   no divider between them and the rail box looks broken.

390px is fine (mobile rule stacks cleanly). 1440px is fine (capped at 1120,
single line). The gap is the 641–1119 band, 768 included.

**The fix (one breakpoint):** add `@media (max-width:1119px)` (or min-width
gate at 1120) that, for the rail only, hides `.rail-arrow` and gives
`.rail-cell` a `border-bottom` so wrapped rows read as a grid rather than a
broken strip. Simplest: reuse the existing 640 rule's `rail-arrow{display:none}`
and `rail-cell` bottom-border treatment, but raise its ceiling to 1119px while
keeping the full single-column stack only below 640. Net: arrows show only when
the rail is genuinely on one line (>=1120), never orphaned.

Advisory, not blocking: no data is lost, all 6 stages still render and remain
legible when wrapped; it is a visual-polish defect, not a dropped section.

---

## Summary
- Blocking gaps: 0 (no dropped agent, no missing summary figure, no dead-end).
- Advisory gaps: 1 (flow-rail wrap/orphan-arrow in the 641–1119px band).
