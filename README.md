# Aisoldier

A strict creative-landing-page system for a two-person studio. Builds B2B landings in React/Next.js that are handed off to a Webflow developer for rebuild.

**Everything flows through one design system, one accent per project, and one agent: `3mpq-soldier`.**

---

## Quick start

```bash
cd ~/Aisoldier
claude
```

Then in the Claude Code session:
> Start a new project called `acme-landing`. Audience: CTO-level buyers in mid-market fintech. Goal: book enterprise demos.

The agent will:
1. Copy `projects/_template/` to `projects/acme-landing/`
2. Run kickoff research (audience, competitors, trends, moodboard)
3. Propose 2-3 accent candidates — wait for your pick
4. Propose 5-8 section patterns from the kit — wait for approval
5. Distil it all into `BRIEF.md`
6. Scaffold Next.js, wire Lenis, import Inspector
7. Build section-by-section, updating docs as it goes

## Scaffold a new project without the agent

```bash
./scripts/new-project.sh acme-landing
```

This just copies the template and substitutes `{{PROJECT_NAME}}`. Research + accent + code still have to be done in a session.

## Layout

```
Aisoldier/
├── CLAUDE.md                     # Global doctrine (hard rules)
├── DECISIONS.md                  # System-level ADR log
├── README.md                     # this file
├── .claude/
│   ├── agents/3mpq-soldier.md    # The subagent
│   └── settings.json             # Hooks
├── ui-kit/
│   ├── INDEX.md                  # Component registry — source of truth
│   ├── TOKENS.md                 # Token documentation
│   ├── PATTERNS.md               # Curated pattern shortlist
│   ├── tokens.css                # Tailwind v4 @theme implementation
│   ├── index.ts                  # Barrel export
│   ├── package.json              # Peer deps declaration
│   ├── lib/
│   │   └── cn.ts                 # clsx + tailwind-merge helper
│   ├── components/
│   │   ├── devtools/
│   │   │   ├── Inspector.tsx     # Cmd+click overlay
│   │   │   ├── InspectorPanel.tsx
│   │   │   ├── useInspectorHotkey.ts
│   │   │   └── README.md
│   │   ├── hero/
│   │   ├── section/
│   │   ├── motion/
│   │   └── nav/
│   └── patterns/
├── research/
│   └── awwwards-2024-2026-patterns.md   # 4,300-word base catalog
├── projects/
│   ├── _template/                # Scaffold for new projects
│   └── <project-name>/           # Live projects
└── scripts/
    └── new-project.sh            # CLI helper
```

## The doctrine, in 10 lines

1. **One accent color per project.** Chosen after audience research.
2. **Light theme by default.** Dark only on request.
3. **IBM Plex Serif (headings) + IBM Plex Sans (body).** Nothing else.
4. **Body never smaller than 16px.** 12px only for uppercase eyebrows.
5. **Easing is always `cubic-bezier(0.16, 1, 0.3, 1)`.** Nothing bounces.
6. **Borders everywhere. Shadows only in light theme.**
7. **UI kit is the source of truth.** Read `ui-kit/INDEX.md` before touching components.
8. **Every project has a doc dossier.** 9 MD files + 4 research files.
9. **Kickoff research is mandatory.** No code before audience, competitors, trends, moodboard.
10. **Re-research after 30 days.** Trends move fast.

Full doctrine: `CLAUDE.md`.

## Inspector overlay

Every kit component carries `data-component`, `data-source`, `data-tokens` attributes. In dev mode, Cmd+click any element to see the source path and tokens it uses. This is how the Webflow developer maps your React build back to rebuildable parts.

See `ui-kit/components/devtools/README.md`.

## Research base

`research/awwwards-2024-2026-patterns.md` — ~4,300-word catalog of the 30 most copied patterns from Awwwards SOTY/SOTM 2024-2026. The agent uses this as the base and produces a fresh niche-specific `TRENDS.md` in every project's own `research/` at kickoff.
