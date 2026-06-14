# Orchestra Expansion Plan — toward getcorder-grade output from the first prompt

**Status:** proposal for validation (2026-06-15). Nothing built yet.
**Goal:** near-production landing pages from a single prompt. Quality and
correctness over speed and token cost. The bar is getcorder.com.

This plan is grounded in two research passes (sources at the end):
AI-writing "tells" (what makes copy read as machine-made) and
multi-agent orchestration / verification best practice (2024-2026).

---

## 0. The core reframe (read this first)

Three findings decide the whole architecture:

1. **Deterministic gates beat LLM judges for anything machine-checkable.**
   Font-size floors, banned dashes/words, component reuse, borders, one
   accent, token-only colors - these must be a real linter (ESLint /
   ast-grep / regex) that fails the build, not an LLM that can be talked
   into "looks fine." An LLM verifier can hallucinate a pass; a lint rule
   cannot. (Factory.ai; ContextCov arXiv 2603.00822; CodeRabbit ast-grep.)

2. **A separate verifier in a FRESH context catches far more than
   self-review.** Models have a ~64.5% "self-correction blind spot" -
   they fix an error when it is framed as someone else's but not as their
   own (Self-Correction Bench, arXiv 2507.02778). So critics must run in
   a fresh session with only the artifact + a written rubric, never
   inheriting the builder's chat. Our judge already does this; we extend
   the pattern to every critic.

3. **Parallel reads, serial builds.** Every source agrees: parallel
   *building* agents silently diverge on spacing/style - fatal for a
   strict design system (Cognition "Don't Build Multi-Agents"). But
   parallel *read-only verifiers* are the one multi-agent shape everyone
   endorses. So the large roster grows on the VERIFY side; building stays
   single-threaded (one soldier).

Consequence: the answer to "add many agents" is **yes, but mostly as
read-only verifiers, and the machine-checkable ones as deterministic
gates, not LLM agents.** A reconciler then merges all findings into one
action list so the soldier never gets contradictory feedback.

---

## 1. Two structural upgrades that make everything else work

These are prerequisites. Without them the new agents have nothing solid
to enforce against.

### 1a. A machine-readable Design System Registry (single source of truth)

Today `ui-kit/INDEX.md` is prose. To get 100% reuse we need a registry
that BOTH the prompt-composer reads and the linter validates against -
one canonical file, so the rules an agent is told and the rules a checker
enforces never diverge.

`ui-kit/REGISTRY.json` (or a strict section of INDEX.md), one entry per
component:
```
{
  "Button": {
    "import": "@aisoldier/ui-kit",
    "variants": ["primary", "secondary", "tertiary", "ghost"],
    "props": ["size", "iconLeft", "disabled", "href"],
    "useWhen": "any clickable call-to-action",
    "neverFor": "a nav header, a tab, a chip",
    "tokens": ["radius-pill", "accent", "border"]
  },
  ...
}
```
Rule it encodes, exactly as you put it: a button is a button - reuse
primary/secondary/tertiary, never re-create it. A header is a different
component - that genuinely warrants a new one. The registry makes that
distinction explicit and checkable.

### 1b. The build-contract + prompt-composer (forces DS-first on every prompt)

This is the agent you described: every prompt that reaches the soldier
must first force it to look at the whole design system and reuse before
inventing. We split it in two:

- **3mpq-architect (build-contract / spec compiler, pre-build).** Turns
  the brief + tokens + registry into a `SECTION_CONTRACT.md`: the section
  list, and for each section the *minimum* structure (heading + body by
  default - no subheading, no chips, no captions unless explicitly
  justified), plus which registry components map to each part. Minimalism
  is compiled in, not hoped for.
- **3mpq-prompter (prompt-composer).** Before the soldier does anything,
  it composes the soldier's task so the soldier MUST: (1) read the full
  REGISTRY, (2) map every UI element to an existing component or state
  why a new one is justified, (3) obey the live constraint set
  (14/16px floors, one accent, no dashes, no chips/captions, borders
  everywhere), (4) reuse component variants rather than modify a
  component. It injects these from the single source so they are never
  paraphrased or forgotten. (ContextCov: make the rules executable, not
  just stated.)

---

## 2. Proposed roster

Legend: **GATE** = deterministic, blocking, cannot be argued past.
**CRITIC** = fresh-context LLM, read-only, rubric-driven.
**ORCH** = orchestration. ★ = you explicitly asked for this.

### Tier A — Pre-build (orchestration)
| Agent | Type | Job |
|---|---|---|
| `3mpq-dispatcher` (have) | ORCH | Route to the minimal tier. Now also decides which verifiers run. |
| `3mpq-architect` (new) | ORCH | Compile brief + tokens + registry into SECTION_CONTRACT.md with minimalism baked in. |
| `3mpq-prompter` (new) ★ | ORCH | Compose every soldier prompt to force DS-first reuse + inject the constraint set. |

### Tier B — Build (single-threaded, no parallel builders)
| Agent | Type | Job |
|---|---|---|
| `3mpq-soldier` (have) | build | Builds serially against the contract. Runs the linter on-save and self-heals before handoff. |

### Tier C — Deterministic validation (ONE owner, blocking, cheap, runs first)
| Agent | Type | Enforces |
|---|---|---|
| `3mpq-linter` (new) ★ | GATE | Real lint/AST/regex layer. Absorbs several "agents" you imagined into one reliable gate: **font-size floor (>=14 mobile / >=16 desktop)** ★, **banned typography (em-dash, en-dash, minus, bullet, middle dot, curly quotes in copy)** ★, **kit reuse (no inlined duplicate of a registry component; no raw hex; no off-scale sizes)** ★, borders on every card/input/badge, one accent only, data-component attributes, named imports. Autofix where possible; any violation = block. |

(Why a gate, not an LLM agent: these are exactly the rules that "drift
when left to prompts and hold when compiled into checks." This is the
single highest-leverage addition.)

### Tier D — LLM critics (parallel, read-only, fresh context, rubric)
| Agent | Type | Job |
|---|---|---|
| `3mpq-judge` (have, upgrade) | CRITIC/GATE | Visual + spacing + doctrine vs FIGMA_SPEC. Upgrade: fresh context, written rubric, randomized ordering, require 2 consecutive clean rounds. Stays the hard gate. |
| `3mpq-kitwarden` (new) ★ | CRITIC | The judgment the linter can't make: did soldier reuse the RIGHT component, or build a near-duplicate that should be a variant? Is a new component genuinely warranted (button vs header)? Proposes promoting one-offs into the kit. |
| `3mpq-minimalist` (new) ★ | CRITIC | Via negativa. Flags every chip, caption, redundant subheading, decorative element; "what can be removed?"; enforces heading + body unless justified. Easier to add than remove. |
| `3mpq-naturalist` (new) ★ | CRITIC | Copy-naturalness. Applies the ban list + naturalness scorecard, weighted toward STRUCTURE (burstiness, no "not just X, it's Y", concrete numbers, no AI buzzwords, no dashes). Separate from copywriter: copywriter writes, this audits. |
| `3mpq-aesthete` (new) | CRITIC | The getcorder "premium feel": spacing rhythm, alignment, restraint, hierarchy. Subjective; advisory unless a clear break. |
| `3mpq-completionist` (new) | CRITIC | What's missing: all interactive states (hover/focus/active/empty/loading/error), all breakpoints, every section in the contract. |
| `3mpq-factcheck` (new) | CRITIC | Copy claims vs source-of-truth (e.g. Corder feature inventory). No invented features, specs, or numbers. |
| `3mpq-inquisitor` (have) | CRITIC | Final whole-product audit, unchanged. |

### Tier E — Reconcile + ship
| Agent | Type | Job |
|---|---|---|
| `3mpq-conductor` (new) | ORCH | Merge linter + all critic outputs into ONE prioritized, de-duplicated action list; resolve contradictions before the soldier sees them. Prevents N contradictory reviews. |
| `3mpq-devops` (have) | ship | Git + deploy after FINAL PASSED, unchanged. |

### Periodic (not a standing agent)
- **Ban-list refresh** every ~30 days: re-research AI tells (the "delve"
  effect proves the list decays as models route around named words).
  Runs as a researcher task, updates the naturalist's rubric.

---

## 3. The new flow

```
dispatcher (tier)
  -> architect (SECTION_CONTRACT: sections, minimum structure, component map)
  -> [economist -> copywriter, on new projects]
  -> prompter (compose DS-first soldier prompt + constraints)
  -> soldier (build serial, lint-on-save self-heal)
  -> 3mpq-linter (deterministic gates; fail fast, cheap, before any LLM spend)
  -> [parallel critics: judge, kitwarden, minimalist, naturalist,
      aesthete, completionist, factcheck]  (read-only, fresh context)
  -> conductor (one reconciled action list)
  -> soldier fixes -> re-lint -> re-critic
  -> require 2 consecutive clean rounds
  -> user sees it
  -> inquisitor (final product audit) -> devops (ship)
```

Order matters: deterministic gates run BEFORE the LLM critics, so a build
that fails a font-size or dash rule never burns critic tokens.

---

## 4. Honest counsel (where I push back on "many agents")

You said "probably many, even a huge number." The research says: yes on
the verify side, but with discipline, or the roster makes quality WORSE.

- **Don't turn machine-checkable rules into LLM agents.** Your "font-size
  agent" and "banned-words agent" are better as the deterministic
  `3mpq-linter`. Same intent, but it can't be argued past and costs
  almost nothing. (This is a feature, not me dodging - it's strictly more
  reliable.)
- **Don't parallelize building.** A second builder = a forked design
  system. Keep one soldier.
- **Cap the LLM critics and reconcile them.** Past a point, more critics
  add correlated blind spots and contradictory feedback. The conductor
  exists so the soldier gets one coherent list, not ten. If a proposed
  critic's blind spots overlap an existing one, fold it into a checklist
  instead of spawning it.
- **Blocking vs advisory must be explicit.** Linter + judge + naturalist
  (high-confidence tells) + minimalist (chips/captions) = blocking.
  Aesthete = advisory unless a clear break. No ambiguity about what can
  ship past what.
- **Cost posture.** This is ~10-15x the tokens of a single pass; you said
  that's acceptable for quality. We control it by failing fast on the
  cheap deterministic gates and only running the expensive critics on a
  build that already passed them.

Net: a genuinely large roster (12-14 agents), but its weight is on
read-only verification, anchored by one deterministic gate and one
reconciler. That is the shape that actually reduces errors.

---

## 5. Phased rollout (highest leverage first)

1. **DS Registry + `3mpq-linter`** - biggest, cheapest, can't hallucinate.
   Kills the most common drift (sizes, dashes, reuse, borders, accent).
2. **`3mpq-architect` + `3mpq-prompter`** - DS-first contract on every prompt.
3. **Judge upgrade** - fresh context, written rubric, 2 clean rounds.
4. **`3mpq-naturalist`** (+ dash/word rules already in the linter).
5. **`3mpq-minimalist` + `3mpq-kitwarden`**.
6. **`3mpq-conductor`** - once 3+ critics fire.
7. **`3mpq-completionist`, `3mpq-aesthete`, `3mpq-factcheck`**.

---

## 6. Open questions to validate

1. The machine-checkable concerns (font size, dashes, reuse) as a real
   **deterministic linter** (ESLint/ast-grep, needs a one-time setup) vs
   an LLM agent that runs greps? I strongly recommend real tooling.
2. Strictness of the subjective critics (aesthete, minimalist): hard
   block, or advisory with the conductor weighting?
3. Scope: retrofit corder-landing to the new pipeline, or apply only to
   new projects?
4. Model tiers per agent (opus for critics/judge, haiku for the linter
   driver, etc.) - cost vs quality trade per agent.
5. Naming: keep the `3mpq-` convention for all new agents?
6. Any concern you want as its own agent that I folded into the linter or
   an existing critic?

---

## Sources

AI-writing tells: Wikipedia "Signs of AI writing" (2025-26); Kobak et al.
Science Advances "excess vocabulary" (Jul 2025); Originality.ai perplexity
& burstiness (Oct 2025); CommsTrader / Nature variance (2025); Declic /
UndetectableAI em-dash (2025-26); conorbronsdon avoid-ai-writing (2025).

Orchestration: Anthropic "Building Effective Agents" (Dec 2024); Cognition
"Don't Build Multi-Agents" (Jun 2025); Self-Correction Bench arXiv
2507.02778 (Jul 2025); Cross-Context Review arXiv 2603.12123; Factory.ai
"Linters to Direct Agents"; ContextCov arXiv 2603.00822; Constitutional AI
arXiv 2212.08073; Debate or Vote arXiv 2508.17536; Via Negativa arXiv
2603.16417.
