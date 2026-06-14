# ACTIONS — Orchestra dashboard (redesign, round 1)

Reconciler: 3mpq-conductor
Date: 2026-06-15
Inputs: REVIEW.md (judge), MINIMAL_REVIEW.md (minimalist), COMPLETE_REVIEW.md
(completionist), REDESIGN_CONTRACT.md + REDESIGN_DIRECTION.md (intent),
server.mjs (source).
Target: `apps/orchestra/server.mjs` — single `page()` + helpers + inline `<style>`.

## VERDICT: ANOTHER ROUND

Round 1. Per the two-clean-rounds rule, the best attainable verdict on a first
pass is ANOTHER ROUND, never SHIP. Two confirmed BLOCKING defects must be fixed
(both produce a visible break), then re-review. Even if this were defect-free, it
would still need a second consecutive clean round before SHIP.

---

## KEY CONTRADICTION RESOLVED — the pipeline flow rail

**Conflict:** the architect/aesthete made the flow rail the *signature element*
(REDESIGN_CONTRACT §1, "NEW, the signature element"; REDESIGN_DIRECTION #2,
HIGH). The minimalist (B3) wants it **CUT** as duplication of the roster below.

**Decision: KEEP the rail as a flow signal, STRIP its duplicated per-stage
rollup.** Specifically: keep the six cells in pipeline order with the ASCII `->`
flow connectors (the rail's unique job — it conveys left-to-right FLOW, which the
vertically stacked roster `<h2>` blocks cannot). Remove the `<b>N</b> agents /
<b>N</b> active` count line and the per-stage load bar from each cell (`railCells`,
server.mjs:191-193) — those are the rollup the minimalist correctly identifies as
a re-sum of data shown directly below. Each rail cell keeps only the stage name.

**Rationale (one line):** the rail earns its place only as a flow diagram, not as
a second scoreboard — keep the flow, cut the rollup that the roster already states.

This satisfies the contract's intent (pipeline made visible) AND the minimalist's
valid duplication objection, and it matches the contract's own escape hatch
(MINIMAL_REVIEW B3 parenthetical: "keep the rail and cut the redundancy the other
way"). Note: cutting the rollup also dissolves the completionist's wrap defect
risk somewhat, but the wrap still must be fixed for the surviving cells (see #2).

---

## ORDERED CHECKLIST

### BLOCKING (fix first, in order)

- [ ] **1. Built-in rows render the literal string "undefined" in the model slot
  (x6).** [BLOCKING]
  - Where: `agentRow` server.mjs:142 (idle branch) and :150 (active branch),
    both render `<span class="model">${esc(a.model)}</span>`. BUILTINS objects
    (:54-61) have no `model` key, so `a.model` is `undefined`.
  - Confirmed by: judge Issue #1 (FAIL) AND minimalist A5 — same root cause,
    de-duplicated into one item.
  - Fix: guard the model span in BOTH branches:
    `${a.model ? \`<span class="model">${esc(a.model)}</span>\` : ""}`. (Do not
    fabricate a model value for built-ins — they genuinely have none; omit the
    span.) The same guard also protects the role fallback path (`a.role ||
    a.desc`) already handled, but verify built-in idle rows still render the
    `desc` text via the existing `a.role || a.desc || ""` at :143.
  - Why blocking: ships visible "undefined" text six times on a page whose
    entire pitch is calm/premium. Visible broken text = hard fail.

- [ ] **2. Flow rail wraps and orphans arrows in the 641–1119px band (768
  included).** [BLOCKING]
  - Where: `.rail` (flex-wrap:wrap) server.mjs:236, `.rail-cell{min-width:150px}`
    :237, `.rail-arrow` siblings built at :189. Only breakpoint is
    `@media (max-width:640px)` :280; nothing governs 641-1119px.
  - Confirmed by: completionist ISSUE 1. Classified BLOCKING per the task brief
    (visible break: orphan arrow pointing at nothing + no divider between
    wrapped rows). The completionist filed it advisory, but a visible layout
    break at the 768px checkpoint is a ship-stopper; the contract itself
    (REDESIGN_CONTRACT "Responsive intent" rule 3) makes "never a single orphan
    arrow glyph on its own line at any width" a hard acceptance criterion.
  - Fix: add `@media (max-width:1119px)` that, for the rail only, sets
    `.rail-arrow{display:none}` and gives `.rail-cell` a `border-bottom` so
    wrapped rows read as a grid. Keep the full single-column stack only below
    640. Net: arrows appear only when the rail is genuinely on one line
    (>=1120px), never orphaned. Note: with the rollup cut (rail decision above)
    each cell is narrower, but 6 cells + 5 arrows can still exceed mid widths,
    so the breakpoint is still required.
  - Why blocking: visible broken strip at the most common tablet/laptop widths
    and a direct violation of a stated contract acceptance rule.

### ADVISORY (after blocking, by impact)

- [ ] **3. Cut the rail's per-stage rollup (count line + load bar).** [ADVISORY]
  - Where: `railCells` server.mjs:191-193 — remove the `.rail-nums` span and the
    `.bar.bar-rail` span; keep only `.rail-name`. Drop now-dead CSS `.rail-nums`
    (:240-241) and `.bar-rail` (:247) and the `maxStageRuns`/`pct` rail math
    (:185, :188) if unused elsewhere.
  - This IS the rail-contradiction decision (see above). Advisory in severity (no
    broken render) but it is a required change to honor the resolution — do it.

- [ ] **4. Tighten the lede to remove UI-chrome captions.** [ADVISORY]
  - Where: server.mjs:293. Current: "Bars show each agent's share of total runs,
    idle agents have not earned a seat, and the ledger is read live."
  - Confirmed by: minimalist A3. The contract (§0) wants ONE sentence stating the
    one idea; two of three clauses caption widgets ("bars show...", "ledger is
    read live" — the latter duplicates the footer). Trim to the load-bearing
    clause: "Idle agents have not earned a seat." (or a one-line statement of
    what the orchestra is). One sentence, one period.

- [ ] **5. Scale comment claims five steps but seven ship.** [ADVISORY]
  - Where: comment server.mjs:220 vs measured sizes (12, 13, 15, 16, 22, 40,
    clamp(36,5vw,48)). The 13px rail-name (:239) and 13px rail-arrow (:242) are
    off the stated 5-step scale; 40px (.big :230) and the clamp h1 (:226) are two
    display sizes folded into one.
  - Confirmed by: judge Issue #2 (WARN).
  - Fix: prefer folding to a true 5-step scale — drop rail-name to 12px label
    tier (the rail-arrow CSS goes away anyway once arrows are hidden <1120 and
    the rollup is cut). If any size legitimately remains off-scale, update the
    comment to name every size honestly. Pick one; do not leave the comment
    lying.

- [ ] **6. "candidate to drop" restates the visible idle state.** [ADVISORY]
  - Where: server.mjs:144 `not yet invoked, candidate to drop`.
  - Confirmed by: minimalist A2. Judgment call: the dimmed/dashed/hollow-dot
    treatment plus the idle hero figure already say "candidate to drop" three
    times. BUT the contract (§2 idle agent) explicitly specifies the line
    "not yet invoked - candidate to drop" as the idle mono line.
  - Decision: KEEP the phrase — it is contract-sanctioned and is arguably the
    product thesis. Do NOT cut. Recorded here only to close the minimalist item:
    overruled in favor of the contract. (If the soldier wants, the comma can
    become " - " per ASCII separator style, but the current comma is also valid
    ASCII; no change required.)

- [ ] **7. `writes` line as always-on per-row metadata.** [ADVISORY — NO CHANGE]
  - Where: server.mjs:145/156, rendered on all 18 orchestra rows.
  - Confirmed by: minimalist A4 (suggests dropping).
  - Decision: KEEP. The contract (§2 item 4) explicitly justifies `writes` as the
    one doctrine artifact that distinguishes near-identical critics
    (REVIEW.md vs KIT_REVIEW.md vs MINIMAL_REVIEW.md). This is real
    triage-adjacent information, contract-required. Overruled in favor of the
    contract. No change.

- [ ] **8. 12px mono data lines below the 16px body floor.** [ADVISORY — NO CHANGE]
  - Where: `.stat-line` :232, `.rail-nums` :240, `.stats` :262, `.writes` :267,
    `.model` :257, `.contrib-idle` :265, footer :278.
  - Confirmed by: judge Issue #3 (WARN). Falls under the task's explicit
    "intentional 12px mono labels" allowance and the contract's responsive type
    floor note. Not a fail.
  - Decision: ACCEPTABLE as-is per scope. Optional polish only: if strict §4
    alignment is wanted later, bump data lines to 13-14px mono. No change to
    pass.

- [ ] **9. `.rail-arrow` connectors decorative if rail rollup cut.** [ADVISORY
  — RESOLVED by decision]
  - Where: server.mjs:189, CSS :242. Minimalist A1 wants them gone.
  - Decision: KEEP the arrows on desktop (>=1120px) — they are the one permitted
    decorative mark because they literally encode the pipeline-as-flow idea that
    is the rail's surviving purpose (contract §1 "Flow connector"). They are
    hidden below 1120px by item #2. This is the whole reason the rail survives
    B3; removing them would reduce the rail to a plain stage list with no flow
    signal. Overruled in favor of the rail decision.

---

## DE-DUPLICATION LOG
- "undefined" model leak: judge Issue #1 + minimalist A5 -> merged into item #1.
- Flow rail keep/cut: minimalist B3 vs contract §1 / aesthete #2 -> resolved in
  the contradiction section, executed as items #3 (cut rollup) + #9 (keep arrows)
  + #2 (fix wrap).
- Rail rollup duplication: minimalist B3 + aesthete #2 framing -> item #3.

## ITEMS DECLINED FROM CRITICS (recorded so the soldier does not act on them)
- Minimalist B1 (cut "Aisoldier" eyebrow): DECLINED. The contract (§0) explicitly
  sanctions exactly one 12px uppercase eyebrow as the studio brand mark and the
  doctrine's single sub-16px exception. Keep one eyebrow. Rationale: contract
  overrides; brand-mark eyebrow is doctrine-allowed, not a decorative subheading.
- Minimalist B2 (cut `.idle-hero` caption, fold "14" into stat-line): DECLINED.
  The contract (§0, REDESIGN_DIRECTION #5) makes the idle figure THE headline /
  thesis of the page, rendered large in accent. Folding it into the four-up mono
  line demotes the page's whole point. Keep the idle hero. (The caption "of 18
  idle" is the label for that hero number, not a banned stat-caption.)
- Aesthete #1 (replace card/row grid with a single ranked table sorted by runs
  desc across ALL agents): DECLINED for this round. The contract deliberately
  chose roster-grouped-by-stage with pipeline `order` sorting WITHIN a stage so
  the pipeline reading is preserved (contract §2 "Sorting within a stage: keep
  order... Do NOT sort by runs - that would scatter the pipeline reading"). A
  global runs-desc table is a different IA than the ratified contract. Out of
  scope for a fix round; raise with the architect if a re-architecture is wanted.

---

## SHIP GATE
- Deterministic gates: not run in this scope (judge reviewed rendered HTML/CSS
  only). Re-run linter before any SHIP claim.
- Blocking critic items open: 2 (#1, #2).
- Clean rounds completed: 0.
- Required for SHIP: deterministic gates green AND zero blocking items AND two
  consecutive clean rounds.

**Hand this list to the soldier. Fix #1 and #2 (blocking) plus #3, #4, #5
(advisory, low-cost, contract-aligned). Items #6-#9 are decisions/no-change.
Then re-submit for round 2. Nothing reaches the user until two clean rounds.**
