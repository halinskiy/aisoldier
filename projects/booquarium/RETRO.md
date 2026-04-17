# booquarium — Agent Retrospectives

Private learning journal for agents. NOT shown to the user. Each agent writes here after completing a major task to record mistakes, inefficiencies, and self-corrections for future sessions.

Read this file at the START of every session before building anything.

---

## 2026-04-17 — 3mpq-judge — Full Page RE-REVIEW #2 (FINAL PASSED)

### What took longer than it should have?
Spinning up a fresh headless Chrome + CDP client from scratch for every review — no persistent tooling. Each re-review needs ~30s of bootstrapping (launch Chrome with --remote-debugging-port, curl `/json/version`, etc.) before any real measurement happens. Not catastrophic but adds friction.

### What did I miss that the user or soldier caught?
Nothing this pass — fixes verified cleanly on first CDP audit. But REVIEW #1 did miss that the Button kit's `base` class had no explicit transition-timing-function for 4 prior sessions; the template-design builds must have had the same silent easing regression. I only noticed because the user's strict checklist item 2 demanded borders and I happened to CDP-audit every button while there.

### What will I do differently next time?
On every first-review of any project that uses `ui-kit/components/ui/Button.tsx`, explicitly CDP-measure `transitionTimingFunction` on at least one Button instance before issuing a verdict. Tailwind's `transition-[...]` shorthand does NOT set a timing function — the fact that most projects happen to get away with ease-in-out is a bug I was rubber-stamping. Easing audit is now a default checklist item for any interactive kit primitive, not something I do only when a button looks suspicious.

---

## 2026-04-17 — 3mpq-soldier — Section 0: Nav

### What took longer than it should have?
HMR cache on symlinked kit caused stale build: my fix to NavSticky (plain link when no `~`) was in source but the live DOM still served the old LogoWave. Judge caught it. Fix was `rm -rf .next` + restart — 5 min wasted.

### What did I miss that judge caught?
1. CTA "Pre-order now" at 14px — NavSticky hardcoded `text-[14px]` on the pill CTA. I read the component before building but didn't scan for sub-16px sizes. Template-design RETRO said "mentally verify every text-size declaration" — I did not apply this to the pre-existing kit component.
2. Same for mobile overlay CTA at 15px.

### What will I do differently next time?
Before accepting any kit component as-is, grep it for `text-\[1[0-5]px\]` — any font size below 16px needs explicit justification (only `text-[12px]` is allowed for eyebrow labels). One grep, zero 14px surprises.

Format:
```
## YYYY-MM-DD — {agent name} — {task completed}

### What took longer than it should have?
### What did I miss that the user or judge caught?
### What will I do differently next time?
```

---

## 2026-04-17 — 3mpq-soldier — Hero 3D Book Complete Rebuild (Session 2)

### What took longer than it should have?
Running `next build` while `next dev` was alive corrupted the `.next` cache — the dev server continued serving stale 404-ing chunk references. Judge caught this immediately on the first re-review pass. Fix was `pkill next dev` + `rm -rf .next` + restart. 5 minutes wasted + 1 full judge re-review cycle.

### What did I miss that judge caught?
1. Loader "Opening…" caption was `fontSize: "14px"` — I wrote it as italic serif body text and forgot the 16px floor applies equally to italic copy, not only to upright body. The 12px exception requires uppercase + tracking; this label had neither.
2. Hardcoded `#B8322C` on the drop cap "T" inside `CSSBook` — illustration colours are acceptable inline, but UI-intent colour (a text glyph styled to match the accent) must use `var(--color-accent)`. I treated it as "cover art" when it was actually an interactive UI element.
3. `data-tokens="ease-out"` — I used a shorthand alias that doesn't exist in `TOKENS.md`. The canonical name for `cubic-bezier(0.16,1,0.3,1)` in this project is `ease-pneumatic`.
4. `useReducedMotion` not applied to Loader animation or the scroll-hint mouse SVG. I applied it to BookScene but forgot both other animation sites.

### What will I do differently next time?
- **Never run `next build` while `next dev` is alive.** Build to verify types with `npx tsc --noEmit` only; use a separate terminal or stop the dev server first.
- Before submitting any component for judge review, do one final grep: `grep -r "font-size.*1[0-5]px\|fontSize.*[\"']1[0-5]px" src/` — catches all below-16px violations including inline styles and string interpolations, not just Tailwind classes.
- Every `animation`, `transition`, or `repeat: Infinity` in a component that isn't R3F useFrame → add `useReducedMotion` guard in the same pass. Don't leave it for a second pass.
- Keep a running `token-aliases.md` note for any shorthand I invent (`ease-out`, `ease-in`, etc.) — check it against `TOKENS.md` before writing `data-tokens` attributes.
