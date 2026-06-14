# Review — Orchestra dashboard (redesign) — ROUND 2

**Date:** 2026-06-15
**Reviewer:** 3mpq-judge
**Target:** `apps/orchestra/server.mjs` (`page()` + helpers + inline `<style>`)
**Live instance:** http://localhost:7777 (reviewed from rendered HTML + CSS source via curl)
**Verdict:** PASSED

Round 1 shipped one FAIL (visible "undefined" x6) and two WARNs. All three are
resolved. The rail-contradiction fixes from ACTIONS.md (#1-#5) are applied
correctly, the rail is now a clean flow signal with no rollup, and the
mid-width orphan-arrow band is governed by a dedicated breakpoint. A fresh full
pass found nothing newly broken by the edits. This is a clean round 2.

---

## Targeted re-checks (the three asks)

### 1. "undefined" model leak — RESOLVED
- `curl -s http://localhost:7777/ | grep -c undefined` => **0**.
- Built-in rows omit the model span entirely. The guard
  `${a.model ? \`<span class="model">${esc(a.model)}</span>\` : ""}` is present in
  BOTH `agentRow` branches (server.mjs:142 idle, :150 active). BUILTINS objects
  (:54-61) genuinely carry no `model` key — the fix correctly omits the span
  rather than fabricating a value.
- Rendered `<span class="model">` count = **18** (the 18 orchestra agents that
  have a model). Contents enumerated: `opus` x7, `sonnet` x8, `haiku` x3 — all
  real, none empty. The 6 appendix rows (general-purpose, Explore, Plan, claude,
  claude-code-guide, statusline-setup) render name + role only, no model slot,
  no "undefined". Verified by reading the full appendix block (rendered :251-292).

### 2. Flow rail — RESOLVED, measured to spec
- **6 cells:** `<div class="rail-cell">` rendered count = **6** (Route & plan,
  Research & content, Build, Deterministic gate, Critics, Reconcile & ship).
- **Exactly 5 `->` connectors:** `<span class="rail-arrow">` rendered count =
  **5**. Connector dropped after the last cell via `i < stages.length - 1`
  (server.mjs:185). Glyph is ASCII `-&gt;`.
- **`@media (max-width:1119px)` present** (rendered CSS :71-74): sets
  `.rail-arrow{display:none}` and `.rail-cell{border-bottom:1px solid var(--border)}`.
  In the 641-1119px band the rail wraps, arrows are hidden (no orphan glyph), and
  wrapped cells are divided by a bottom hairline — exactly the contract acceptance
  rule "never a single orphan arrow glyph at any width." The 640px stack rule is
  separate and additive (:76-83).
- **Per-stage rollup removed:** `grep 'rail-nums\|bar-rail'` on rendered HTML =
  **0**. Each cell renders only `.rail-name` (rail-name span count = 6). The dead
  `maxStageRuns`/`pct` rail math and `.rail-nums`/`.bar-rail` CSS are gone
  (railCells now server.mjs:184-189, stage name only).

### 3. Doctrine — still clean
- **One accent:** `--accent:#217a50` (:211). Full hex enumeration of rendered
  output = 11 values; the only non-neutral is `#217a50`. (`#161616 #6b6b68
  #a0a09c #d8d8d4 #e5e5e5 #eaeae8 #ececec #f0f0ee #f7f7f6 #fff` are all neutral.)
- **IBM Plex only:** rendered families = `IBM Plex Serif`, `IBM Plex Sans`,
  `IBM Plex Mono`. No fourth family. Google Fonts link loads exactly those three
  (:209).
- **ASCII-only:** banned-char scan
  (`grep -cP '[\x{2014}\x{2013}\x{2212}\x{2022}\x{00B7}\x{2018}\x{2019}\x{201C}\x{201D}]'`)
  = **0** on both rendered HTML and `server.mjs` source.
- **Hairline borders:** `--border:#e5e5e5` consistent across rail, rows, summary,
  footer; appendix steps to `--border-strong:#d8d8d4` for the quiet tier. Idle
  rows keep the dashed-border calm signal.
- **Minimalism intact:** rail is now a pure flow diagram (no second scoreboard),
  lede trimmed to one sentence, no chips/captions/redundant subheadings.

---

## Round-1 WARN follow-ups (now closed)

- **Issue #2 (scale comment honesty) — RESOLVED.** The off-scale 13px tier is
  gone entirely. Rendered `font-size` enumeration = `12px, 15px, 16px, 22px,
  40px, clamp(36px,5vw,48px)` — six distinct sizes. The comment (:214-215) now
  names every one honestly: "display h1 clamp(36-48) serif, idle-hero 40 serif,
  headline 22 serif, body 16 sans, stat 15 mono, label 12 mono." Comment matches
  reality. The former 13px rail-name dropped to the 12px label tier.
- **Issue #3 (12px mono data lines) — ACCEPTED per scope.** Unchanged, within the
  task's explicit "intentional 12px mono labels" allowance and the contract's
  responsive type-floor note. Not a fail. Per ACTIONS #8: acceptable as-is.

## Advisory items from ACTIONS.md

- #4 (tighten lede) — DONE. Now "Idle agents have not earned a seat." (one
  sentence, one period; rendered :89).
- #6/#7/#8/#9 — no-change decisions, honored: idle line "not yet invoked,
  candidate to drop" retained, per-row `writes` retained (18 writes lines on the
  orchestra roster), 12px mono floor retained, desktop arrows retained.

---

## Fresh full pass — nothing newly broken

- **Data integrity:** 24 total rows (18 orchestra + 6 built-in). 10 rendered
  `bar-fill` spans (active) + 14 `hollow` dots (idle) = 24. Idle hero reads
  "10 of 18 idle"; summary stat-line: 18 orchestra agents / 6 built-in / 18 total
  runs / 828k tokens. (Figures shifted from round-1's "14 idle" because the live
  ledger advanced — derived from real data, internally consistent.)
- **`:last-child` bottom-border in the 1119px rule:** the new
  `.rail-cell{border-bottom}` rule does not reset on `:last-child`, but the rail
  container has `overflow:hidden` and its own 1px border (:28), so the last cell's
  bottom border coincides with / is clipped by the container edge. No visible
  double line, no orphan. NOTE only, not a defect.
- **Masthead, summary, appendix, footer** all render cleanly; footer uses ASCII
  separators and escaped `&lt; &gt;` for the log-command example.

---

## CDP / measurement evidence

```json
{
  "undefined_occurrences_rendered": 0,
  "model_spans_rendered": 18,
  "model_span_values": { "opus": 7, "sonnet": 8, "haiku": 3 },
  "builtin_rows_with_model_span": 0,
  "rail_cells_rendered": 6,
  "rail_arrows_rendered": 5,
  "rail_name_spans": 6,
  "rail_rollup_remnants": 0,
  "media_query_1119": "present: .rail-arrow{display:none}, .rail-cell{border-bottom}",
  "media_query_640": "present (stack)",
  "accent": "#217a50",
  "non_neutral_hex": ["#217a50"],
  "hex_palette_size": 11,
  "font_families": ["IBM Plex Serif", "IBM Plex Sans", "IBM Plex Mono"],
  "font_sizes_shipped": ["12px","15px","16px","22px","40px","clamp(36px,5vw,48px)"],
  "scale_comment_matches_reality": true,
  "banned_chars_source": 0,
  "banned_chars_rendered": 0,
  "rows_total": 24,
  "active_bars": 10,
  "idle_hollow": 14,
  "lede": "Idle agents have not earned a seat."
}
```

## What was verified live

- `curl -s http://localhost:7777/` saved to /tmp/orch-rendered.html (293 lines),
  full rendered HTML + inline CSS inspected.
- grep counts for undefined, rail cells/arrows/names, rollup remnants, model
  spans, bar-fills, hollow dots, font-size declarations, hex palette, font
  families, banned chars — all on rendered output.
- `server.mjs` source cross-checked at the agentRow guard (:142,:150), railCells
  (:184-189), BUILTINS (:54-61), and the type-scale comment (:214-215).

---

## Verdict

**PASSED.** The round-1 FAIL ("undefined" x6) is gone (grep count 0, built-in
rows omit the span). The rail is exactly 6 cells / 5 ASCII arrows with a
dedicated `@media (max-width:1119px)` that kills orphan arrows in the 641-1119px
band and the per-stage rollup is fully removed. Doctrine holds: one accent
#217a50, IBM Plex only, ASCII-clean, hairline borders, minimalism intact. Both
round-1 WARNs are closed (scale comment now honest; 12px mono accepted per
scope). Fresh full pass found nothing newly broken. Clean round 2.
