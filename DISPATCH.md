---
name: Aisoldier — Task Dispatch Router
description: Read this FIRST. Maps any incoming task to the minimal set of agents and files needed. Prevents spinning up researcher/copywriter for spacing fixes.
---

# DISPATCH — Task → Agent Router

Read this before any work. Pick the lowest tier that covers the task. Do not invoke agents above what the tier requires.

---

## Tier 0 — Claude only. No agents.

**Triggers:** spacing, indentation, padding, margin, px value, rem value, color hex, opacity, TypeScript error, import error, lint fix, token rename, variable rename, prop rename, docs edit (HANDOFF/CHANGELOG/DECISIONS/README), any single-file surgical fix.

**Files to read:** only the specific file being changed.  
**Agents:** none.  
**Gate:** none (but verify visually in browser if touching layout).

---

## Tier 1 — Soldier + Judge

**Triggers:** component bug, add/change a prop, new variant on an existing kit component, responsive fix, animation tweak, fix a section visual issue, build a section when brief + copy already exist, any code change affecting more than one file.

**Files to read before starting:**
- `ui-kit/INDEX.md` (mandatory)
- `ui-kit/TOKENS.md`
- `projects/<slug>/CORRECTIONS.md` (if exists)
- `projects/<slug>/content/copy.json` (if section involves copy)

**Agents:** `3mpq-soldier` → `3mpq-judge`  
**Gate:** REVIEW.md must say `PASSED` before showing to user.

---

## Tier 2 — Copywriter + Soldier + Judge

**Triggers:** placeholder copy replacement, headline rewrite, CTA change, section copy audit, SEO meta, any request that contains "текст", "copy", "headline", "CTA", "написать контент".

**Files to read before starting:**
- `projects/<slug>/research/AUDIENCE.md`
- `projects/<slug>/content/copy.json`
- `projects/<slug>/COPY_AUDIT.md` (if exists)

**Agents:** `3mpq-copywriter` → `3mpq-soldier` (if code changes needed) → `3mpq-judge`  
**Gate:** REVIEW.md PASSED.

---

## Tier 3 — Researcher + Soldier + Judge

**Triggers:** judge flagged "needs creative direction" in REVIEW.md, mid-build UX/visual impasse, project resumed after >30 days (re-research TRENDS + COMPETITORS only), user asks for fresh competitor reference.

**Files to read before starting:**
- `projects/<slug>/research/` (all 4 files)
- `research/awwwards-2024-2026-patterns.md` (base catalog)

**Agents:** `3mpq-researcher` (targeted brief, not full kickoff) → `3mpq-soldier` → `3mpq-judge`  
**Gate:** REVIEW.md PASSED.

---

## Tier 4 — Full pipeline

**Triggers:** new project kickoff, first section of a new project, user says "новый проект", `/new-project` skill invoked.

**Sequence:** Researcher (full kickoff: AUDIENCE → COMPETITORS → TRENDS → MOODBOARD) → user confirms accent → Copywriter (full copy.json) → Soldier (scaffold + section 0) → Judge → PASSED → show to user.

**Do not skip researcher on a new project. Ever.**

---

## Tier 5 — Devops only

**Triggers:** "задеплой", "deploy", "push", "commit", `/deploy` skill, explicit ship request.

**Precondition:** REVIEW.md must have `FINAL PASSED` verdict. Refuse deploy without it.  
**Agent:** `3mpq-devops` only. No other agents.

---

## Tier 6 — Economist only (business / pricing / unit economics)

**Triggers:** "сколько стоить", "цена", "сколько продаж", "безубыток", "breakeven", "реклама", "unit economics", "burn", "LTV", "CAC", "страт", "бизнес-вопрос", any question framed around money-in / money-out that is not about making design or code.

**Files to read before starting:**
- `/Users/3mpq/Aisoldier/research/etsy-template-market.md` (market baseline)
- `/Users/3mpq/Aisoldier/research/economics/` (reusable channel-cost research)
- relevant persona profile if question is scoped to a segment

**Agent:** `3mpq-economist` only. Does not invoke soldier, judge, copywriter, or researcher.  
**Exception — pricing context for copywriter:** in Tier 4 (new project), after researcher but BEFORE copywriter, economist writes `projects/<slug>/content/pricing-brief.md`. Copywriter reads it before writing copy.

---

## Quick decision table

| Signal in request | Tier |
|---|---|
| "отступ", "spacing", "padding", "px", "rem" | 0 |
| "исправь", "fix", TypeScript error, import | 0 or 1 |
| "build section", "собери секцию" | 1 |
| "компонент", kit change, new variant | 1 |
| "текст", "copy", "headline", "CTA", "контент" | 2 |
| "исследуй", "конкуренты", judge says "creative direction" | 3 |
| "новый проект", `/new-project` | 4 |
| "задеплой", "deploy", `/deploy` | 5 |
| "цена", "сколько стоить", "breakeven", "реклама", business math | 6 |

---

## Figma MCP — rate limit protocol

Starter plan: ~20-30 calls/session max. On Figma-heavy tasks:
1. `get_metadata` once on main artboard → save to `/tmp/figma-metadata.xml`
2. Grep locally for subsequent lookups — do NOT re-call `get_metadata`
3. `get_variable_defs` once per session
4. `get_screenshot` only when metadata is insufficient

---

## Files always worth reading (if not read this session)

| File | Read when |
|---|---|
| `ui-kit/INDEX.md` | Any Tier 1+ component work |
| `RETRO.md` | Any Tier 1+ build work (past-self warnings) |
| `projects/<slug>/CORRECTIONS.md` | Before building or modifying a section |
| `projects/<slug>/REVIEW.md` | Before claiming work is done |

> **2026-06-15:** the expanded orchestra (architect, prompter, linter, kitwarden, minimalist, naturalist, aesthete, completionist, factcheck, conductor) and the new build pipeline are defined in `CLAUDE.md` section 8.1. Deterministic gate (`3mpq-linter` -> `tools/ds-lint.mjs`) runs first; critics run in parallel; `3mpq-conductor` reconciles. Log every subagent run via `apps/orchestra/log.mjs`.
