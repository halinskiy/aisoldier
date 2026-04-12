# Aisoldier — System Log

System-level changelog for the Aisoldier design-to-code studio. Tracks shipped projects, kit evolution, and doctrine changes. Project-specific session logs live in `projects/<name>/CHANGELOG.md`.

---

## 2026-04-12 — Template-Design v1.0 ready for handoff 🏁

**Project:** [`projects/template-design`](projects/template-design/README.md) — SEC-regulated wealth management landing built from Figma `hdriqKesBCNlAVapaGQXO6`.

**Status:** production-ready reference build, handed off to the Webflow developer.

| Metric | Result |
|---|---|
| Sections built | **13 / 13** |
| Designer gaps closed | **17 / 17** (numerical CDP contract tests) |
| Lighthouse Performance | 99 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 96 |
| Lighthouse SEO | 100 |
| Production bundle | 94.1 kB route, 196 kB First Load JS, static prerendered |
| Full-page height delta vs Figma | -51 px (0.4%) — clamp-based responsive, safe |
| Sessions | **15** |

**Architectural wins the project validated for future work:**

1. **Kit reuse test (session 8, Section 6 Case Studies)** — `ImageCardGrid` + `ImageCard` composed Section 6 in 2 component calls with 0 prop changes and 0 overrides. `caseStudies.cards` from JSON passed straight to the grid without a single `.map()` or re-projection. Proved the kit API was parameterised correctly on the first design, not over-fitted to Section 4.
2. **Dark-theme architectural test (session 13, Section 11 Contact)** — wrapping a section in an inline `style={{ "--color-bg": "#1e1e1e", ... }}` override inverts all nested kit components automatically via CSS custom-property cascade. Proved the kit is truly token-driven. Found and fixed latent tech debt in `Button` primary (hardcoded `#212121` → `var(--color-text)`). Added new `variant="accent"` for CTAs that should stay constant across themes.
3. **CDP contract-test habit (session 11 onward)** — every "gap closed" claim backed by a `Runtime.evaluate` DOM query, not visual inspection. Catches 3-pixel drift that screenshots would miss. Recorded as a durable ADR.
4. **Motion pass via CSS + one IntersectionObserver (session 15)** — zero-JS-per-element reveal. `MotionProvider` driver + attribute state flips + CSS transitions. Bundle-efficient, SSR-safe, and the `?motion=0` URL escape hatch makes regression screenshots pixel-identical to pre-motion.
5. **Compliance runtime assertion (session 14, Section 12 Footer)** — `legal_has_your: true`, `legal_no_prioritize_our: true` verified via DOM text-match regex, not visual. The SEC fiduciary-violation bug ("prioritize our interests" → "your interests") is now provably absent at runtime.

**Known non-blockers documented in `HANDOFF.md`:**
- 6 of 7 FAQ answers are placeholder with a visible "Client to confirm" tag
- 10 testimonial roles all still read "Co-Founder @ Company" (placeholder)
- Contact form server action logs to console — wire to real CRM before publish
- Photography is all warm Unsplash placeholders — replace with licensed brand photography
- Section 4 Services and Section 5 Services list both have `Services` as the eyebrow (designer reuse) — preserved verbatim, client must rename one

**Deliverables for the Webflow developer:**
- `projects/template-design/` — full source code
- `projects/template-design/HANDOFF.md` — per-section Webflow verdict (NATIVE IX2 / CUSTOM EMBED / SIMPLIFY) + must-fix list
- `projects/template-design/embeds/` — vanilla JS + CSS snippets reproducing motion behaviour: `blur-reveal.js`, `magnetic-button.js`, `count-up-stats.js` + paste-order README
- `projects/template-design/DECISIONS.md` — 17 ADRs for every non-obvious choice
- Running reference build at `localhost:3456` with dev-only Inspector (Cmd+click any element)

---

## Kit evolution

The `@aisoldier/ui-kit` grew from **4 stub components** (session 1, aspirational) to **12 live components** (session 15) through strict discipline: promotion requires ≥2 confirmed uses, no speculative promotions.

| Session | Promoted | Cumulative | Driver |
|---|---|---|---|
| 1 | Inspector | 1 | Baseline — dev tool spec'd before any components existed. |
| 2 | `NavSticky` | 2 | Built in the kit directly (first project needed it, roadmap candidate). |
| 3 | `EyebrowLabel`, `Button`, `AvatarStack` | 5 | Hero section — three primitives all had ≥2 anticipated uses (eyebrow across every section, button across CTAs, avatar stack for trust bar + any future testimonial block). |
| 5 | `SectionHeader`, `SectionDivider` | 7 | Approach section — SectionHeader pattern first repeated here, Divider named to show up in Inspector. |
| 6 | `ImageCard`, `ImageCardGrid` | 9 | Services showcase — built for §4 with an explicit plan to reuse in §6. Reuse validated in session 8. |
| 14 | `LogoWave` | 10 | Footer — second use of the wave-glyph wordmark (first was Nav). Promoted the moment the rule was satisfied, not earlier. |
| 15 | `BlurReveal`, `SplitText` | 12 | Motion pass — two motion primitives with clear ≥2-use surfaces (every section for BlurReveal, both About paragraphs for SplitText). |

**What was held local (single-use) despite temptation:**
- `ServiceListRow` (§5) — the pattern never reappeared.
- `TestimonialCard` / `StatsRow` / `StarIcon` (§8) — universal patterns but single-use in this project.
- `ProcessSteps` / `ProcessStep` (§9).
- `FAQAccordion` / `FAQItem` / `ChevronToggle` (§10).
- `ContactLead` / `ContactForm` / `FieldText` / `FieldTextarea` (§11).
- `FooterEditorial` / `DotRow` / `SocialRow` / `SocialIcon` (§12).
- `Banner` (§7).

This adds up to ~15 components that could have been kit candidates but weren't. The discipline paid off: 12 kit components, each with ≥2 real uses, and 15 local components that stayed right-sized for their single section.

---

## Doctrine changes

No doctrine changes during the Template-Design build. The global `~/Aisoldier/CLAUDE.md` written before session 1 proved correct and sufficient. Future projects should start from the same doctrine unless a specific section flags an unmet rule.

One doctrine principle earned its keep repeatedly: **"promotion requires ≥2 confirmed uses, not ≥2 anticipated uses"**. Several times (sessions 5, 10, 12, 14) a component looked universal enough to promote on first build; holding until the second real use kept the kit tight and meant every promoted component shipped with a validated API.

---

## What's in progress

Nothing. Template-Design v1.0 is the first Aisoldier project and it's shipped. Next project will start from `projects/_template/` with a fresh kickoff research phase.

---

## What's next (optional polish)

- [ ] Publish the kit as a proper npm workspace (currently `file:../../ui-kit` dependency — works, but a real workspace would allow versioning)
- [ ] Auto-screenshot diff tool as part of the shoot script (store snapshots, compare on each session)
- [ ] Migrate `embeds/*.js` to TypeScript with a build step that outputs vanilla JS — easier to maintain alongside the React reference
- [ ] Storybook for the kit (currently Inspector on a running project is the only kit demo)
