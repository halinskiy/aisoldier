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

## 2026-06-23 — 3mpq-soldier — V2 creative rebuild (whole page)

### What took longer than it should have?
The AmbientDrift hydration mismatch. I gave the component a module-level
`driftSeq` counter to name its injected `@keyframes`. SSR rendered three drift
instances (names 1/2/3); the client hydration re-ran the initializer and the
shared counter continued (4/5/6), so the `<style>` content differed and React
regenerated the WHOLE tree on hydration. The downstream symptom was subtle and
cost me two screenshot cycles: `?motion=0` would not land on the rest state
because the regenerated client tree re-ran the morph instead of resting. I
chased it as a `useEnhancementEnabled` bug before reading the headless console
and seeing "Hydration failed". Fix: derive the keyframe name from `useId()`
(stable across SSR/client). Lesson: ANY per-instance unique id a component
injects into the DOM (keyframe name, clipPath id, gradient id) must come from
`useId`, never a module counter or `Math.random`, or it breaks hydration.

### What did I miss that the user or judge caught?
Nothing external this round (single builder, pre-review). Self-caught: the
Chrome `--virtual-time-budget` screenshot tool freezes framer-motion mid-flight,
so the live hero reads blurred/empty in the captured frame even though it is
correct in a real browser. I could verify the rest states (`?motion=0`) and that
the reveal fires (t+1.2s), but NOT a clean full-chain live settle. I documented
this honestly as an open item for critics rather than claiming a live pass I
could not screenshot.

### What will I do differently next time?
- Use `useId` for any injected DOM id from the FIRST line of a motion primitive
  that injects a `<style>` or SVG def; do not even write the counter version.
- When `?motion=0` does not visually rest, check the headless CONSOLE for a
  hydration mismatch BEFORE suspecting the gate hook; a regenerated tree re-runs
  every effect and defeats the static path.
- For live-motion verification, accept that virtual-time screenshots prove the
  rest state (?motion=0) + that the reveal triggers (early frame), and flag the
  full live settle for a wall-clock check, instead of burning cycles trying to
  freeze framer at the perfect frame.
- DarkSection `bleed` over forking: when a kit section's fixed inner shell fights
  a project grid, add a prop to the kit, do not re-implement the dark stage.

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

