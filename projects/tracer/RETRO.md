# {{PROJECT_NAME}} — Agent Retrospectives

Private learning journal for agents. NOT shown to the user. Each agent writes here after completing a major task to record mistakes, inefficiencies, and self-corrections for future sessions.

Read this file at the START of every session before building anything.

Format:
```
## YYYY-MM-DD — {agent name} — {task completed}

### What took longer than it should have?
### What did I miss that the user or judge caught?
### What will I do differently next time?
```

---

## 2026-06-22 — 3mpq-soldier — fix round 1 (ACTIONS A-S)

### What took longer than it should have?
The dev server showed a `__webpack_modules__[moduleId] is not a function`
runtime error in the first post-edit screenshot even though `next build`
passed clean. This is the known symlinked-kit hot-reload trap (MEMORY:
direct kit edits need `rm -rf .next` + restart). I lost one screenshot cycle
before recalling it. Lesson already in MEMORY, now re-confirmed: after editing
ANY kit component, restart the dev server (kill + clear .next) before trusting
a screenshot; the stale chunk lies.

### What did I miss that the user or judge caught?
Nothing caught externally this round. Self-managed scope: the verify line said
"ds-lint ui-kit/components -> 0 errors" but the kit has 87 pre-existing errors
in components Tracer never renders. I did NOT blindly mass-edit 18 unrelated
files (cross-project regression risk, esp. the 68 font-size-floor that are
sanctioned sub-16px in other components). I cleared every error in the
Tracer-consumed components and documented the boundary. The risk was reading
the verify literally and breaking booquarium/system surfaces.

### What will I do differently next time?
- When a verify gate names a broad scope (ui-kit/components) but the task is one
  project, scope the fix to the components that project actually imports + the
  ones the ACTIONS items name, and document the boundary explicitly rather than
  either ignoring it or nuking the whole kit.
- For favicons, reach for a static `icon.svg` (exempt from ds-lint, no CSS-var
  dependency) over `icon.tsx` (which would put a raw hex in a .tsx the linter
  scans).
- Compose the RESTING frame first when a morph has a void problem: the bug was
  never the motion, it was that three transients were all parked at rest. One
  focal point at rest, transients leave the stage.

## 2026-06-22 — 3mpq-soldier — full Tracer desktop build

### What took longer than it should have?
Kit module resolution. The scaffold used a raw `@ui-kit -> ../../ui-kit` path
alias, which the dev server (webpack) compiled fine, so I thought I was clear.
But `next build` typechecks the external kit files and could not resolve their
`react`/`framer-motion` imports. I burned two build attempts (resolve.modules,
then symlink) before landing on the template-design pattern: symlink the kit into
`node_modules/@aisoldier/ui-kit` + `transpilePackages` + `resolve.symlinks=false`
+ tsconfig `preserveSymlinks:true`. Lesson: when a project consumes the external
kit via a bare path alias instead of the symlinked `file:` dep, ALWAYS run
`next build` (not just the dev server) before trusting the wiring; webpack-dev
resolution and tsc-typecheck resolution differ.

### What did I miss that the user or judge caught?
Self-caught before handoff: (1) the nav wordmark was invisible (ink text on the
dark hero) because I themed nav text with `--color-text` while it floats over the
dark hero at rest. Fixed with a scroll-driven light->ink inversion. (2) The
`StickyFeatureList` runway was a multi-viewport void at `itemMinHeight=56vh/34vh`;
dropped the override. (3) Em-dashes in my JSDoc comments tripped ds-lint (4
errors) — I default to `—` in prose comments out of habit.

### What will I do differently next time?
- Run `next build` (the real typecheck gate), not just `curl` the dev server,
  before claiming the wiring is sound on any externalDir/kit-alias project.
- Type comment separators as ASCII ` - ` from the start; ds-lint scans .tsx
  comments too, so a comment em-dash is a real ERROR.
- For any nav that floats over a dark hero at rest, build the theme inversion
  FIRST, not after the first screenshot shows an invisible wordmark.
- Reduce a sticky-scroll runway to the kit default until a screenshot proves more
  room is needed; large per-item heights create voids by default.

