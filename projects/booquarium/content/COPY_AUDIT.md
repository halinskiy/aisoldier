# booquarium — Copy Audit

**Date:** 2026-04-17
**Written by:** 3mpq-copywriter
**Status:** Initial pass. No prior copy existed to audit; this documents choices soldier should know.

---

## Scope

All copy written from scratch in this session. No existing `copy.json` to compare against. This file records non-obvious decisions so soldier can implement them correctly.

---

## Copy decisions

### hero.body
Runs 28 words. Deliberately under the 30-word ceiling. It describes the book's premise without summarising the plot, which preserves curiosity and drives the CTA. The phrase "the one place he refused to chart" is the hook — it implies stakes without explaining them. Do not shorten this for layout reasons; if space is tight, reduce eyebrow or hero.subheadline label size instead.

### about.headline
"Before words, there were maps." Inverts the expected "before maps, there were words" to reflect Voss's background (cartography first, writing second). This is a character-establishing line. It must render in display serif at full weight. If space is tight, do not truncate — reduce padding instead.

### about.body
Three sentences totalling 48 words. The detail "300 hand-drawn maps covering every wall except one" is repeated from features.items[0] intentionally: the about section is seen before features, and this line is the first hint of the novel's central image. If soldier reorders sections, confirm the about bio does not duplicate features text without the features section appearing first.

### features.headline
"Four things worth reading for." Deliberately short and confident. It signals four items are coming without numbering them in the headline itself (the items carry numbers). Do not change to "What's Inside" or "Book Highlights" — those are generic.

### features.items[3].body
"This is a novel that trusts its readers enough to leave certain borders undrawn." This sentence does double duty: it describes the book's narrative restraint AND subtly signals literary quality to the Etsy buyer. It should stay exactly as written. It will resonate with mid-list authors who are tired of over-explained stories.

### praise.blurbs
All six blurbs are fabricated (fictional demo content). Each source is a real publication name. Soldier should render a visible disclaimer somewhere near this section: a small eyebrow or footnote reading "Sample copy for template demonstration" or similar. This protects the Etsy seller from misrepresentation if a buyer publishes the demo copy verbatim. Exact wording of the disclaimer is soldier's call, but it must be present at dev stage and flagged in HANDOFF.md.

### newsletter.headline
Two words: "First to know." Fits the display-serif large format. Short is intentional — this section is below the fold and should feel like a quiet offer, not a final hard sell.

### newsletter.body
Uses the word "ARC" (Advance Review Copy) deliberately. This is insider vocabulary for the target audience. It signals that the site was made for real authors, not generic creatives. Keep it.

### footer.tagline
"Some stories need a map. Some maps are the story." This is the brand-closing line. It references the novel's central metaphor, works as Elena Voss's personal editorial voice, and reads cleanly in small type. It should render in IBM Plex Sans at reduced weight, not serif, so it reads as a caption rather than a headline.

---

## Tone compliance check

- No em dashes used anywhere in the copy.
- No banned words present: checked against full list (harness, leverage, delve, seamless, cutting-edge, game-changer, revolutionize, utilize, elevate, unlock, empower, comprehensive, robust, landscape, navigate, tapestry).
- No startup lexicon: no "users", "conversions", "platform", "SaaS", "funnel", "content" in any copy field.
- All CTAs are verb-first and reading-oriented: "Read the first chapter", "Pre-order now", "Write to Elena", "Join the list".
- Nav links carry chapter numbers as specified.
- No exclamation marks anywhere.
- All sentences under 30 words. Longest single sentence is 28 words (hero.body).
- Active voice throughout.

---

## SEO notes

The meta title (58 characters) and description (155 characters, under limit) use the primary keyword "Elena Voss" in the title and "The Cartographer's Daughter" in both. The description includes a CTA ("Pre-order") naturally.

For soldier: if a page-level H1 is rendered from hero.headline, it should be "Elena Voss" with hero.subheadline as a visible subtitle element. Do not combine them into one H1 string.

---

## What soldier must not change without flagging

1. The phrase "the one place he refused to chart" in hero.body.
2. The sentence structure of about.headline.
3. The word "ARC" in newsletter.body.
4. All six praise.blurbs.source values (real publication names, keep casing exact).
5. footer.tagline (must not be abbreviated or line-broken mid-sentence).
