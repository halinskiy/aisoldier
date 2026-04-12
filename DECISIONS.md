# Aisoldier — System Decision Log

Decisions about the **system itself**, not about any individual project. Per-project decisions live in each project's own `DECISIONS.md`.

Format:
```
## YYYY-MM-DD — title
**Decision:**
**Alternatives considered:**
**Why:**
**Consequences:**
```

---

## 2026-04-11 — Founding doctrine
**Decision:** Aisoldier is a two-person studio's landing-page system for creative B2B work that eventually hands off to Webflow. It enforces a shared UI kit, one accent per project, IBM Plex typography, light-first theme, and mandatory kickoff research before any code.
**Alternatives considered:** Free-form per-project design system (rejected — leads to drift); Webflow-native from day one (rejected — Webflow editing is painful for creative exploration).
**Why:** The creative exploration happens in code where we can move fast, the Webflow developer rebuilds the validated result.
**Consequences:** Every project has documentation overhead. Every reusable thing must be promoted to the kit.

## 2026-04-11 — Stack baseline
**Decision:** Next.js 15 App Router + React 19 + TypeScript strict + Tailwind CSS v4 + Framer Motion 12 + Lenis.
**Alternatives considered:** Vite + React (rejected — fewer batteries), Astro (rejected — MDX-first, mismatches our motion-heavy output), SvelteKit (rejected — team knows React).
**Why:** Matches 3mpq studio's internal stack. Tailwind v4 `@theme` block is the cleanest way to expose tokens. Lenis is effectively mandatory for 2024-2026 Awwwards-grade feel.
**Consequences:** Rive is a second-tier tool that requires explicit go; Webflow handoff for Rive always needs custom embed.

## 2026-04-11 — Single-accent rule
**Decision:** Exactly one accent color per project. Chosen at kickoff after audience research. Stored as `--color-accent` with `--color-accent-hover` and `--color-accent-subtle` derived.
**Alternatives considered:** Fixed IBM Blue for all projects (rejected — kills audience fit); 2-3 accents per project (rejected — becomes visual noise).
**Why:** Per-project single accent gives audience fit without brand chaos. Same doctrine as 3mpq studio.
**Consequences:** The agent must run Moodboard research and propose options at kickoff. No project starts with an unknown accent.

## 2026-04-11 — Light theme default
**Decision:** Light theme is the default for all B2B projects. Dark theme is opt-in only when brief demands.
**Alternatives considered:** Dark default (matches 3mpq studio parent aesthetic).
**Why:** B2B audience expectations lean light. 3mpq studio's dark personality is a portfolio choice, not a client-work default.
**Consequences:** Token defaults are light-first; dark is a secondary palette.

## 2026-04-11 — Every project is a doc dossier
**Decision:** Every project has its own `CLAUDE.md`, `BRIEF.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `COMPONENTS.md`, `INTEGRATIONS.md`, `DECISIONS.md`, `HANDOFF.md`, `CHANGELOG.md` plus a `research/` subfolder. All created from `projects/_template/`.
**Alternatives considered:** Single shared log per project (rejected — mixes concerns), documentation at the end (rejected — gets skipped).
**Why:** Context persists across sessions and weeks. Resumed projects >30 days old can re-orient the agent in one read.
**Consequences:** Every session ends with doc updates.

## 2026-04-11 — Re-research rule
**Decision:** If a project is resumed after >30 days, `TRENDS.md` and `COMPETITORS.md` must be redone before continuing.
**Why:** Creative landings trends move fast. Stale research is worse than no research — it produces 2023-looking work.
**Consequences:** Resumption has a research cost that the agent must budget.
