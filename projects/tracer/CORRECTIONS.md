# Tracer — Research Corrections

Creative direction from 3mpq-researcher. Soldier reads this before building. Confirmed direction (do NOT relitigate, per project `CLAUDE.md`): **accent = record-red #E5484D; light page base with a cinematic DARK "studio" stage hero and a light → dark → light section rhythm; MAX WOW cinematic hero (record → your Dropbox → share-link morph); AirBnB motion; desktop-only (mobile is a deliberate minimal stub).** Product is **Tracer by NoCorny** (Kyiv); real share links look like `tracer.nocorny.com/v/k7r2-mx9p`. Facts come from `REDESIGN_BRIEF.md` §1 — invent nothing.

Companion files: `research/AUDIENCE.md`, `research/COMPETITORS.md` (both dated 2026-06-22).

---

## 2026-06-22 — Kickoff direction: the whole build

### The narrative spine (everything serves this)
**"Stop renting your screen recordings."** Every section is a beat in one argument: *Loom rents you a player and holds your file. Tracer hands you the file and gets out of the way.* Ownership is the emotion; Dropbox is the proof; red is the flag. The feeling at the end is **relief** — the quiet satisfaction of cancelling a subscription you resented.

Don't argue features against Loom. Argue *posture*: they hold your stuff, we hand it back. Show the mechanism; the mechanism IS the marketing.

### Current trend for this section type (verified, 2026-06-22)
- **Show the output, not a feature list.** Loom (loom.com) puts fake recording tiles in the hero; Screen Studio (screen.studio) makes the cinematic auto-zoomed clip in a device frame *be* the hero — motion does the selling. This is the category's most persuasive move.
- **The landing should feel like the app.** Screen Studio + CleanShot X (cleanshot.com): native-Mac restraint, real product imagery, sparing accent, page-as-product.
- **Ownership is the live wedge vs Loom.** Cap (cap.so) built its whole pitch on it ("owned by you", "100% ownership"), but with dev-only S3/Drive storage and polite-corporate tone. The flank is wide open for a sharper, wider telling.

---

## THE HERO — the one screen that has to land

The hero must dramatize the verb **record → your Dropbox → your link** as a single continuous morph. Not three static cards. One object transforming through three states, AirBnB-style (grows/expands/transforms into place, soft-spring overshoot `cubic-bezier(0.34,1.42,0.5,1)`, generous 0.6–0.9s, choreographed, plays ONCE then rests).

**The morph (this is the wow):**
1. **RECORD.** A macOS recording frame — a real-looking window with the red record dot live (this is the *one* legit infinite pulse: a true live indicator). A timer ticks. Feels like the app is running right now.
2. **→ DROPBOX.** The recording visually *condenses/flies* into a Dropbox folder/file object — the upload made physical. The point that lands: the file goes to a place that is **already yours**. Show the Dropbox glyph plainly; this is the proof of ownership and the thing no competitor can show (Cap shows an abstract S3 bucket; you show the folder people actually have).
3. **→ SHARE LINK.** The file morphs into a clean share-link pill showing a real Tracer URL (`tracer.nocorny.com/v/k7r2-mx9p`) / a stripped viewer page — no account wall, no watermark, no cookie banner. The contrast with Loom's gated player is the punchline. Use the real link format so the artifact reads as true.

**Stage note (confirmed):** the hero plays on a **dark cinematic "studio" stage** (like a recording open in a dark editor), even though the page base is light. The light → dark → light rhythm makes the hero the dramatic moment. Red record dot + share-link pop on the dark stage; respect the doctrine's dark-theme opacity layering (white/80, /50, /40) for hero text hierarchy.

**Make the three beats legible even before motion fires** (LCP / reduced-motion): the headline carries the meaning server-side; the morph enhances, never gates it. Respect `prefers-reduced-motion` → land on the final share-link state statically.

**Headline register (copywriter owns final words, this is the brief):** short, plain, a verb and a grievance. Direction, not final copy — e.g. the shape of *"Stop renting your screen recordings."* + a one-line sub stating the mechanism (record on Mac → lands in your Dropbox → instant link, free, no account). Big display type. No eyebrow/kicker above it (captions are banned). No "AI-powered" in the headline.

**Hero proof-chips are BANNED as chip-soup.** If you must surface the killer facts (Free forever · MIT · ~12MB · No account · Your Dropbox), render them as a single quiet hairline-bordered **spec row** (mono-internal, monochrome, ≥16px), one line, not a scatter of colored pills. One row, max five facts, uniform shape. This is the ONE place the ~12MB / MIT / free-forever credibility lives near the fold.

---

## Recommended section spine (short, dense, confident — NOT a 14-section SaaS march)

Pick from `ui-kit/PATTERNS.md`; justification each:

1. **Nav** — `NavSticky` morph-on-scroll. Wordmark left, GitHub star + "Download for Mac" right. Red used once.
2. **Hero** — custom cinematic morph (above). The whole budget goes here.
3. **The ownership argument** — ONE focused section, not a feature grid: a quiet, honest *them vs you* contrast. Loom = your file on their server, behind their account, with their watermark. Tracer = your file in your Dropbox, your link, your footage. This is where "stop renting" pays off. A restrained comparison (the 2026 comparison-table revival, Cap-style but sharper and red-accented) or a two-column "rent vs own" lockup. Keep it terse and uniform.
4. **How it works** — three beats (record / lands in Dropbox / share) as the *quiet* version of the hero morph; `StickyFeatureList` or staggered reveal. Uniform short items.
5. **What's inside, stated plainly** — the real features as a tight `BentoGrid`, but uniform and terse: AI titles, searchable captioned transcripts, one-click share, viewer analytics, no watermark, no trackers. Mechanism over adjectives. No icon-soup.
6. **Open + free, said once, loud** — MIT, free forever, ~12MB, no cookies. A single confident statement section, not scattered chips.
7. **Footer** — `FooterEditorial`. Big wordmark, GitHub, download. Optional one honest line of dry wit.

That's it. ~7 beats. Resist adding logo walls, use-case cards, testimonial carousels, enterprise blocks — that's the Loom sprawl we're beating.

---

## Specific corrections for soldier (must-follow)

1. **The hero morph is the product — spend the whole motion budget there.** record → Dropbox → share-link as ONE continuous morphing object, not 3 cards fading in. AirBnB soft-spring, plays once then rests. The live red record dot is the only permitted infinite pulse (it's a true live indicator). Everything else animates once.

2. **Show Dropbox literally.** The ownership claim only lands because the file goes somewhere the viewer *already owns*. Render a recognizable Dropbox file/folder object in the morph. This is the single thing no competitor can show (Cap shows an abstract S3 bucket; civilians don't have buckets, they have Dropbox).

3. **Red is the record button — use it like one.** Single accent #E5484D. Use it where recording/ownership lives: the live dot, the primary CTA, the "you own this" side of the contrast. Everywhere else is monochrome ink-on-paper. NEVER a second brand color, NEVER a gradient. The whole category is blue/purple — staying disciplined on red IS the differentiation.

4. **No generic SaaS hero, no purple/blue gradient, no chip-soup.** Banned on sight: purple/violet gradient hero (that's Tella, the generic look our doctrine kills), a scatter of colored proof-pills under the headline (collapse to ONE hairline spec row), a 24-logo trust wall, "AI-powered" as the headline, use-case cards (Sales/Eng/Support/Design), em-dashes/bullets/buzzwords in copy. Show the mechanism, not adjectives.

5. **Make the landing feel like a native Mac app, not a marketing site.** Real product window chrome in the hero (macOS frame), CleanShot/Screen-Studio-grade restraint, sparing accent, ~12MB/native/fast surfaced as credibility. The page should read like a tool an engineer would respect — because they'll check the GitHub repo before they trust the CTA.

6. **Out-sharpen Cap on tone.** Cap says "Privacy by Default" (forgettable, corporate). We say "stop renting." Verbs and grievances, not compliance nouns. Plain BBC-register sentences, talking to a smart peer. Confidence, not hype.

7. **Typography — VERIFIED pairing (do not guess roles):** studio default **Montserrat for headings, Manrope for body** is a verified, current pairing and fits a native-Mac-tool register well (warm, legible modern sans — and explicitly NOT IBM Plex, which the user finds hard to read and which the dev audience would clock as dated). Montserrat = display/headings only; Manrope = body/UI/spec-row only. ~3–4 sizes total, all ≥16px, display type genuinely big. If scout proposes a sharper pairing later, re-verify roles before swapping.

8. **Desktop-only is a feature, not an apology.** Don't hedge the mobile stub. The product is macOS; the landing is desktop-first by design. Build the desktop experience to MAX WOW; mobile is a clean stub.
