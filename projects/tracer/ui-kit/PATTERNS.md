# UI Kit — Pattern Catalog

Section-level patterns that compose a landing. The agent picks 5-8 of these at project kickoff based on audience and fresh trends.

**Base catalog** — derived from `research/awwwards-2024-2026-patterns.md`. Grep-friendly: `PATTERN:`, `WHEN:`, `CODE:`, `WEBFLOW:`.

For full code approaches, pattern families, and the 30+ pattern catalog, see `research/awwwards-2024-2026-patterns.md`. This file is the curated shortlist — only patterns that match the studio's aesthetic constraints (editorial serif, single accent, pneumatic easing).

---

## PATTERN: Scroll-pinned hero compression
**WHEN:** Default hero for any landing where a single strong message carries the page. The #1 most-copied pattern of 2024-2026. Use unless the brief specifically calls for a different hero.
**SEEN ON:** Linear, Arc, Stripe Sessions, Igloo Inc (SOTY 2024).
**CODE:** 200vh parent (`relative`) + `sticky top-0 h-screen` child. Framer Motion `useScroll({ target: ref, offset: ['start start', 'end start'] })` + `useTransform` to scale text from 1 → 0.6 and opacity 1 → 0.4 across scroll progress.
**WEBFLOW:** Native IX2 — 200vh parent, sticky child, scroll-triggered scale action. Flag in `HANDOFF.md` as "native".
**COMPONENT:** `HeroPinned`

---

## PATTERN: Split-text word reveal
**WHEN:** Any paragraph or heading that needs to "arrive" on scroll. Pair with blur for editorial feel.
**SEEN ON:** Rauno, Vercel, Linear.
**CODE:** Split string by word, wrap each in `<motion.span>`, use `whileInView` with `staggerChildren: 0.04`. Each word starts at `opacity: 0, y: 12, filter: 'blur(6px)'`.
**WEBFLOW:** Custom embed. Native IX2 struggles with per-word stagger — this is a GSAP-in-Webflow job or a static fallback.
**COMPONENT:** `SplitTextReveal`

---

## PATTERN: Bento grid feature section
**WHEN:** Default layout for feature showcase. 2-3 large cards + 3-4 small cards in an asymmetric grid. 67% of top SaaS landings use this.
**SEEN ON:** Linear, Vercel, Cursor, Perplexity.
**CODE:** `grid grid-cols-4 grid-rows-2 gap-4` with each card having its own `col-span-N row-span-N`. Cards have the standard border + radius-window + subtle hover.
**WEBFLOW:** Native CSS grid.
**COMPONENT:** `BentoGrid` + `BentoCell`

---

## PATTERN: Logo marquee (trust bar)
**WHEN:** Just below the hero. "Used by X companies" strip. Always use if there's any logo to show.
**SEEN ON:** Everywhere 2024-2026.
**CODE:** Duplicated array of logos, container `overflow-hidden`, inner `flex` with `animate-marquee` keyframe translating `-50%` infinitely. Mask-gradient fade on left/right edges.
**WEBFLOW:** Native with CSS animation.
**COMPONENT:** `LogoMarquee`

---

## PATTERN: Sticky feature list with visual
**WHEN:** Product tour, capabilities deep-dive. Left column sticky with changing visual, right column scroll-long list of features.
**SEEN ON:** Apple product pages, Linear Method, Stripe.
**CODE:** Left: `sticky top-24 h-[80vh]` with a keyed visual that cross-fades. Right: long list of feature blocks, each triggering a state change via IntersectionObserver.
**WEBFLOW:** IX2 sticky scroll interactions can do it natively.
**COMPONENT:** `StickyFeatureList`

---

## PATTERN: Magnetic CTA button
**WHEN:** Primary CTA anywhere a "hero moment" happens — hero, contact, pricing.
**SEEN ON:** Most creative agency sites.
**CODE:** On `pointermove` within a 120px radius, translate button toward cursor by `(dx * 0.25, dy * 0.25)`. Reset on leave. Use Framer Motion `useMotionValue` + `useSpring` for damping.
**WEBFLOW:** Custom code embed required. Small JS snippet.
**COMPONENT:** `MagneticButton`

---

## PATTERN: Editorial quote block
**WHEN:** Testimonials. Singular quote, not a row.
**SEEN ON:** Vercel, Linear, Framer.
**CODE:** Large IBM Plex Serif italic text with oversized opening quote mark, byline below in Plex Sans with small avatar. Border on left edge in accent color.
**WEBFLOW:** Native.
**COMPONENT:** `EditorialQuote`

---

## PATTERN: FAQ accordion with layout animation
**WHEN:** Pricing, enterprise, anywhere objections need answering.
**CODE:** Single-open pattern. Framer Motion `<LayoutGroup>` for smooth height transitions. Each item is a `<motion.div layout>` with an internal collapse.
**WEBFLOW:** Native IX2 tabs/accordion.
**COMPONENT:** `FAQAccordion`

---

## PATTERN: Nav morph on scroll
**WHEN:** Every project. Default behavior.
**CODE:** Transparent at top, solid with `backdrop-blur` + border after 40px scroll. Framer Motion scroll-linked values drive `backgroundColor`, `borderColor`, `padding`.
**WEBFLOW:** Native IX2 scroll animation.
**COMPONENT:** `NavSticky`

---

## PATTERN: Editorial footer
**WHEN:** Closing of every landing.
**CODE:** Large display-xl typographic mark (brand name) + sitemap grid with small-caps eyebrow labels. Optional: clock/location line. Optional: scroll-top button.
**WEBFLOW:** Native.
**COMPONENT:** `FooterEditorial`

---

## Not in default catalog (use only on request)

- **Drivable WebGL portfolios** (Bruno Simon 2025 SOTM) — outlier, not B2B.
- **Scroll hijack with page swap** — slows B2B navigation, avoid by default.
- **View Transitions API page transitions** — zero Webflow path, don't use if handoff-bound.
- **Rive hero scenes** — second-tier tool, requires explicit go.
- **Three.js/R3F product scenes** — explicit brief only.
- **Chromatic aberration, film flicker** — too heavy for B2B.

---

## How to add a pattern

1. Build it in a project first.
2. Validate it works in 2+ projects.
3. Promote to this catalog with the full `PATTERN / WHEN / SEEN / CODE / WEBFLOW / COMPONENT` spec.
4. Add the component to `INDEX.md`.
5. Note the addition in the system-level `DECISIONS.md`.
