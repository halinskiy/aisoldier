# template-design — Agent Retrospectives

Private learning journal for agents. NOT shown to the user. Each agent writes here after completing a major task to record mistakes, inefficiencies, and self-corrections for future sessions.

Read this file at the START of every session before building anything.

---

## 2026-04-12 — 3mpq-judge — retrospective after v1 and v2 reviews

### What took longer than it should have?
Judge v1 missed 5 categories of problems that the user found in 10 seconds of visual review. The v2 re-run with expanded checklist caught everything, but the checklist should have been complete from v1. Two full review cycles instead of one.

### What did I miss that the user or judge caught?
1. EyebrowLabel pills stretched to full-width in flex containers. My v1 checklist verified font sizes and colors but never checked component WIDTH. Stretch bugs only appear inside flex parents with available space.
2. Stats row showing "0+" instead of real numbers when ?motion=0. I verified the page in normal mode but never tested the motion-disabled escape hatch. Initial animation state leaked as the visible fallback.
3. Footer cream flash on dark-to-dark transition. I never scrolled through section transitions watching for background bleed-through. My v1 checklist treated each section as isolated, not as a sequence.
4. Divider-to-content spacing too tight in 1 of 3 instances. I checked padding on sections but not margin between internal elements (divider → first child below it).

### What will I do differently next time?
- Add "component width audit" to v1 checklist: every pill/badge/inline element must be width: fit-content, tested inside a flex parent.
- Add "?motion=0 full scroll" to v1 checklist: load with motion disabled, verify all values show final state, not initial animation state.
- Add "section transition scroll" to v1 checklist: scroll the full page watching every section boundary. If bg changes, verify no third color appears during the transition.
- Add "internal spacing" to v1 checklist: measure gap between dividers and their adjacent content, not just section py.
- Always test in both modes (motion on + motion off) before declaring PASSED.

## 2026-04-12 — 3mpq-soldier — retrospective after 15 sessions

### What took longer than it should have?
Tailwind v4 + symlinked ui-kit integration. Spent 3 attempts before discovering @source directive was needed. Then webpack.resolve.symlinks=false. Then HMR cache requiring rm -rf .next on kit edits. Each was a separate discovery. Should have researched all three upfront as "monorepo + Tailwind v4 + Next.js 15" known issues.

### What did I miss that the user or judge caught?
1. EyebrowLabel in SectionHeader was display:block by default, stretched in flex context. Never tested the pill inside a flex parent during kit development. Only tested standalone.
2. Button primary had hardcoded bg-[#212121] instead of var(--color-text). Invisible on light theme. Only caught when dark-theme test forced inversion.
3. 16px minimum violated in 5 places (nav links 15px, footer tagline 15px, footer legal 13px, contact links 15px, form inputs 15px). Pattern: every time I wrote "small" text I defaulted to 15px or 13px instead of checking doctrine.
4. CountUp initial state "0" visible on ?motion=0. Didn't implement fallback for disabled-motion case.

### What will I do differently next time?
- When building ANY kit component, test it in 3 contexts: standalone, inside flex-row, inside flex-col. Stretch bugs only surface in flex.
- Never hardcode color values. Always use var(--color-*). If tempted to write a hex literal for "just this one case," that's the case that will break in dark mode.
- Before every text-size declaration, mentally verify: "Is this ≥16px for body? Is 12px only for uppercase eyebrow?" Make it a reflex, not a post-hoc check.
- CountUp and any animation-driven value: ALWAYS render the final value server-side or as noscript fallback. Animation enhances, doesn't create.
- Research "framework X + monorepo" known issues BEFORE the first npm install, not after the third failed attempt.

## 2026-04-12 — 3mpq-copywriter — retrospective after first full copy pass

### What took longer than it should have?
Nothing significant. First run, clean execution. But: I almost used "navigate" in the About section before catching myself. The banned word list needs to be internalized as muscle memory, not consulted as a checklist.

### What did I miss that the user or judge caught?
Nothing yet (awaiting judge review of copy fit in layout). Potential risk: some headlines may be too short for the large H0 treatment and look "lost" in the hero area. Will see in the visual review.

### What will I do differently next time?
- Before writing a headline, check the FIGMA_SPEC for the exact px height of the text block. A 3-word headline in a 501×122 H0 block might feel sparse. A 6-word headline would fill it better. Write for the container, not just the content.
- After writing copy, do a final pass searching for every word in the banned list. Don't trust "I didn't use any." Grep the output.
