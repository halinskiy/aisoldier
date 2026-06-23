# {{PROJECT_NAME}} — Agent Retrospectives

Private learning journal for agents. NOT shown to the user. Each agent writes here after completing a major task to record mistakes, inefficiencies, and self-corrections for future sessions.

Read this file at the START of every session before building anything.

## 2026-06-23 — soldier — V3 premium-feel polish (void / CTA rest / panel snap)

### What took longer than it should have?
Nothing burned retries, but the FIRST pass left two new near-empty frames I only
caught on the re-probe: (a) the CTA opening frame was empty because I gave the
headline a clip-reveal tied to `p` (clipped to nothing at p~0, before the pin
even engages) instead of making the anchor always-visible; (b) I briefly set the
ownership numbers sticky to `height:78vh` to "lift" the content, which is wrong —
a sub-100vh sticky inside a vh runway just adds dead space at the bottom of every
frame. Reverted to 100vh and solved the seam with an overlap (`-mt-[18vh]` on the
following rows) instead.

### What did I miss that the prior reviews caught?
The reviews (judge + aesthete) were already explicit that the void shows at
TRANSITION SEAMS, not in the beats. My instinct was to tune the beats; the actual
fix was structural: pull the headline into the pin so the rest composes, tighten
runways, and OVERLAP hand-offs. The `?motion=0` static was a free cohesion oracle
the whole time — I should reference it FIRST when judging where things should rest,
not after.

### What will I do differently next time?
1. A persistent ANCHOR in a pinned stage (a headline) must be unconditionally
   visible, never gated on scroll progress — only the morphing SUBJECT scrubs.
   Otherwise the stage is empty until the subject arrives.
2. To close a dead seam between two pinned sections, OVERLAP them (negative margin
   pulling the next section up into the outgoing runway tail) rather than shrinking
   the sticky height (which adds bottom dead space).
3. For horizontal scrub panels, dwell-snap the x map (plateaus at each panel) AND
   add an edge mask — the dwell handles most rests, the mask saves the in-between
   transition frame. CSS scroll-snap fights Lenis, so do it in the transform map.
4. Always re-probe by REAL scroll after the fix; the gates + ?motion=0 pass even
   when a live transition frame is empty (the bug the user keeps catching).

---

## 2026-06-23 — 3mpq-soldier — V3 scrub hotfix (ref hydration + sticky pin + panel width)

### What took longer than it should have?
The build "passed gates" but was broken in the lived scroll because the two
failures are invisible to both ds-lint and tools/shoot.mjs. shoot.mjs uses
Chrome `--screenshot` which renders only the static/first-paint frame, so it
NEVER exercises a scroll-driven morph. I had to write a CDP scroll-and-screenshot
probe (tools/scroll-probe.mjs, Node 22 built-in WebSocket, zero deps) that drives
real Chrome, scrolls to absolute positions, lets the spring settle, and captures
the console. That probe found the "not hydrated" error in one run and then the
negative-top sticky bug via a getBoundingClientRect readout. Lesson: a scrubbed
build is not verified until something has actually SCROLLED it in a real browser
and read both the console and the element rects.

### What did I miss (that the user caught)?
Two bugs, both upstream of my edits, both classic:
1. Calling `useScroll({target: ref})` in a component that early-returns a fallback
   where the ref is never attached. On the first render the gate is false, the
   fallback renders, the target is unhydrated, Framer throws, scrollYProgress
   freezes. I initially assumed the ref fix alone would solve it.
2. `overflow:hidden` on an ancestor silently disabling `position:sticky`. After
   the ref fix the opacity probe showed beat-3 at opacity 1.0, yet the screenshot
   was empty — because the sticky stage had a NEGATIVE top (scrolled off-screen).
   Only reading getBoundingClientRect().top revealed it. I would have chased the
   clip-reveal timing forever without that rect readout.

### What will I do differently next time?
- For ANY scroll-scrubbed component: never call the scroll hook in the same
  component that conditionally returns a hook-free fallback. Split into a gate
  (no hook) + an inner `*Scrubbed` (owns the hook, ref always attached). Make this
  the default shape, not a fix.
- When a scrubbed stage looks empty but the element opacity is 1.0, read
  getBoundingClientRect().top before touching the animation timing — a sticky
  stage with a negative top means an `overflow:hidden` ancestor broke the pin.
- Verify a scrubbed build with scroll-probe.mjs (real scroll + console + rects),
  not shoot.mjs, before claiming the morph works. shoot.mjs only proves the
  static fallback.

## 2026-06-23 — 3mpq-soldier — V3 scroll-scrubbed motion re-architecture

### What took longer than it should have?
The em-dash sweep. I wrote every component with `—` in the JSDoc comment banners
(habit). ds-lint ERRORs on em-dash after code on the same line and WARNs in pure
comments; one inline comment (`Features.tsx:28`) was a hard ERROR. My first perl
sweep failed twice: once the `for` loop ate the whole space-separated `$FILES`
string as one filename, and once perl ran without `-CSD` so it never matched the
multibyte `\x{2014}` and silently left the dashes (and the double-run garbled a
middle-dot into a U+FFFD replacement char). Lesson below.

### What did I miss that a gate caught?
1. `useTransform` cannot animate a CSS-var color: my first TruthRows lit the row
   dot by interpolating `background` from `rgba(0,0,0,0)` to `var(--color-accent)`,
   which Motion rejects at runtime ("not an animatable color"). The dev console
   warned, not the build. Fix: never color-interpolate a token; fade the OPACITY
   of a filled accent dot layered over a hollow ring instead (compositor-safe,
   stays token-driven, no raw hex).
2. J2 flagged the pre-existing Nav `window.addEventListener('scroll')`. It only
   drove a boolean backdrop, not a morph, but the contract blocks on ANY match.
   Moved it to `useLenis(({scroll})=>...)` with a threshold guard so it rides the
   single Lenis loop and never re-renders per frame.

### What will I do differently next time?
- Write comment banners with ASCII dashes (`-`) from the start. Never type `—`
  in a .tsx, even in a comment; the linter cannot tell a banner from prose.
- For any multibyte text sweep use `perl -CSD -i -pe` and iterate the file list
  with a real `for f in a b c` (one path per word), never a `$FILES` variable
  holding a space-joined string passed as one argument.
- Reflex rule for scroll-driven dots/markers: light them by OPACITY of a
  pre-colored layer, never by animating `background`/`borderColor` between a
  transparent value and a CSS var. Motion can't tween a var color and it's a
  silent runtime warning, not a build failure.
- The shoot tool renders the STATIC fallback (headless = no enhancement), so a
  green screenshot proves the `?motion=0` composed-end-state gate but NOT the
  scrubbed experience. State that honestly; the scrubbed path needs a real
  interactive viewport (the user's scroll test) to verify.

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

