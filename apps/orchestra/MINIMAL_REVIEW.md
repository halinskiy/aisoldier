# MINIMAL_REVIEW — Orchestra dashboard

Reviewer: 3mpq-minimalist
Source: apps/orchestra/server.mjs (`page()` + helpers + inline `<style>`)
Live: http://localhost:7777
Date: 2026-06-15

Bar: getcorder. Heading + body, restrained, nothing decorative. For every
element: if removed, is the page worse for the user, or just smaller? If only
smaller, it goes.

---

## Verdict: ISSUES (8)

Blocking: 3 (one eyebrow, one caption, one redundant data axis)
Advisory: 5

The page is mostly disciplined. The roster rows are clean (name + model +
role + one mono contribution line) and that grammar earns its place. The
problems cluster at the top (masthead theatre) and in the duplicated
metadata between the flow rail and the roster.

---

## BLOCKING

### B1 — Eyebrow "Aisoldier" pads the H1
**Remove:** `<p class="eyebrow">Aisoldier</p>` — server.mjs:291 (CSS `.eyebrow` :225)
**Why:** The page is a heading + body section. The eyebrow says "Aisoldier",
the title says "The Orchestra", the `<title>` already says "Orchestra -
Aisoldier agents", and the footer says "agents: .claude/agents". The brand
is established four times. An uppercase 12px accent-colored kicker above a
serif H1 is the exact decorative eyebrow the doctrine warns momentum
reintroduces. Nothing is lost for the user if it goes; the H1 stands alone.
A section is heading + body. This eyebrow is not in any contract reason.

### B2 — `.idle-hero .cap` is a caption under a stat
**Remove the caption, fold the number into the stat-line:** the `<span
class="cap">of ${orchestraTotal} idle</span>` — server.mjs:297 (CSS :231).
The whole `.idle-hero` block (294-298) is a hero stat with a caption
underneath ("14" / "of 18 idle"). The stat-line right next to it (299-304)
already carries "18 orchestra agents". So "14 of 18 idle" belongs in the
stat-line as one more `<span><b>14</b> idle</span>`.
**Why:** Captions under stats are banned by default. This one also creates a
two-axis summary (one giant serif number on the left, four mono numbers on
the right) that says the same kind of thing twice. Collapse to a single
mono stat-line; the 40px serif "14" and its caption are decoration, not
information the four-up line can't carry. Removes a whole CSS block
(`.idle-hero`, `.idle-hero .big`, `.idle-hero .cap`, lines 229-231) and the
`.summary` flex-end alignment hack.

### B3 — The flow rail duplicates the roster's metadata
**Remove or demote:** the entire `.rail` block — railCells build at
server.mjs:187-195, render at :307, CSS :236-247.
**Why:** Every number in the rail is a re-rollup of data shown immediately
below it. "Route & plan / 3 agents / 1 active" is exactly what the "Route &
plan" roster section shows by listing 3 rows, one active. The six stage
headings in the rail repeat the six `<h2>` stage headings in the roster
verbatim. The rail's bars encode "run load per stage", which is the same
quantity the per-agent bars below already encode, just summed. This is a
6-cell grid (with arrows) standing in for information the user reads in the
list one scroll down. It is over-structure: a grid where the list already
says it. If the goal is "see the pipeline order at a glance", the six `<h2>`
headings in document order already are the pipeline. The rail is the single
biggest subtraction available and the page loses nothing the roster doesn't
already state.
*(If the conductor wants to keep one glance-level artifact, keep the rail
and cut the redundancy the other way — but do not ship both the rail AND the
full per-stage roster headings + counts. One of the two axes is dead weight.)*

---

## ADVISORY

### A1 — `.rail-arrow` "->" connectors are decorative
**Remove:** the `<span class="rail-arrow">-&gt;</span>` connectors —
server.mjs:189, CSS :242.
**Why:** If the rail survives B3, the arrows still go. Left-to-right reading
order already implies sequence; the document order of the stages already
implies sequence. The arrows are an icon that adds nothing. A gap between
cells communicates the same flow.

### A2 — "candidate to drop" restates the visible state
**Soften:** `not yet invoked, candidate to drop` — server.mjs:144.
**Why:** "not yet invoked" is the fact. "candidate to drop" is an editorial
restatement of what the dimmed row, hollow dot, and the masthead "14 of 18
idle" already say three times over. The whole design IS the candidate-to-drop
signal. Cutting ", candidate to drop" leaves "not yet invoked" — the data —
and removes the page telling the user how to feel about it. Advisory because
the phrase is arguably the product's thesis; but it is stated structurally
elsewhere, so it is a sentence restating a heading.

### A3 — The lede explains the chrome instead of the subject
**Tighten:** server.mjs:293 — "Bars show each agent's share of total runs,
idle agents have not earned a seat, and the ledger is read live."
**Why:** Two of three clauses are captions for UI mechanics ("bars show…",
"ledger is read live") rather than body about the orchestra. "the ledger is
read live" is a build-detail already stated in the footer ("contributions:
…/contributions.jsonl"). A getcorder lede states what the thing is, not how
to read its widgets. Trim to the one clause that carries meaning ("idle
agents have not earned a seat") or replace with a one-line statement of what
the orchestra is.

### A4 — `writes` line is duplicate metadata per row
**Consider dropping:** the `.writes` line on every roster row —
server.mjs:145/156, CSS :267-268.
**Why:** Each row already has name + role. The "writes X.md" artifact is a
second metadata line that, for most readers of a "who earns their seat"
dashboard, is reference detail, not the point. It is shown on all 18 orchestra
rows and turns a two-line row (name+role) into a three-line row. The `/agents.json`
endpoint already exposes `writes` for anyone who needs the machine-readable
list. Advisory: it is real information, not decoration, so this is a judgment
call for the conductor — but it is the kind of always-on secondary metadata
that pads every row.

### A5 — `model: "undefined"` renders as visible noise on built-ins
**Fix or hide:** built-in rows render `<span class="model">undefined</span>`
— BUILTINS have no `model`, so `a.model` is `undefined`, printed literally at
server.mjs:150/142. Visible six times in the appendix.
**Why:** Not a minimalism call so much as a leak, but it reads as decorative
junk: a 12px dim token that says "undefined". Either omit the model span when
absent or give built-ins a real value. Smaller and cleaner with it gone.

---

## What earns its place (keep)

- Roster row grammar: name + model + role + one mono contribution line. This
  is heading + body done right.
- The single shared bar mechanic (`involveBar`) — one visual, reused. No
  second accent, no gradient, no shadow. Doctrine-clean.
- Idle rows as a dimmed/hollow-dot/dashed-border variant rather than a chip
  or badge. Correct restraint — no decorative tag.
- The footer one-liner: terse, factual, no second CTA.
- Borders-as-separators throughout; no gratuitous dividers beyond the
  structural row borders.

No chips, pills, or decorative tags found anywhere — the idle state resisted
the obvious "candidate to drop" pill and used typography instead. Good.

---

## If only one thing changes
Cut the flow rail (B3). It is the largest block on the page and every number
in it is restated by the roster directly below. Everything else is trim;
the rail is structural duplication.
