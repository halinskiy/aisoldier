# booquarium — Competitor Audit

**Date:** 2026-04-17
**Scope:** 4 real author sites (the benchmark) + 3 Etsy/template competitors (the commercial field) + 1 outlier that already does 3D books.

---

## A. Real author sites — the benchmark

### 1. leighbardugo.com
**Positioning:** NYT Bestselling fantasy author, Grishaverse.
**Sections:** Nav, hero portrait + tagline, featured book carousel, book grid, newsletter, events, social.
**Hero approach:** Large author portrait overlapping layered fantasy-forest artwork. Centered wordmark + "New York Times Bestselling Author" eyebrow.
**Typography:** Clean sans serif. No serif display — a missed opportunity for literary weight.
**Motion:** Carousel only. Static otherwise.
**What works:** Dark jewel-tone palette (deep purple/black/metallic) signals genre instantly. Book covers treated as art.
**What doesn't:** Feels like a 2019 Squarespace template. Hero relies entirely on portrait photography — useless for debut authors who have no pro headshot.
**Steal:** Genre-signal via accent color. Book-as-art treatment.

### 2. brandonsanderson.com
**Positioning:** Most prolific living fantasy author.
**Sections:** Nav, blog-first hero, book grid, progress bars for WIPs, store, newsletter.
**Hero approach:** Blog-forward. Latest post is the hero.
**What works:** Progress bars on upcoming books (cult-forming mechanic — readers refresh daily). Huge library grid.
**What doesn't:** Visually crowded. Shopify-derived theme. No serif anywhere. No sense of literary craft — ironic for a fantasy novelist.
**Steal:** Progress bar pattern for "book in progress" — incredibly sticky for reader retention.

### 3. johngreenbooks.com (John Green, Squarespace)
**Positioning:** NYT #1 bestselling literary YA.
**Sections:** Hero with book cover + short bio, book archive, events, newsletter.
**Hero approach:** Single book cover dominant, tight copy, one primary CTA.
**What works:** Clarity. You know what to do in 2 seconds. Editorial restraint.
**What doesn't:** Nothing moves. Zero craft signal beyond the photo.
**Steal:** One-CTA discipline. No clutter.

### 4. neilgaiman.com
**Positioning:** Literary fantasy legend.
**Sections:** Journal-forward, book archive, "appearances" calendar, shop.
**Hero approach:** Rotating feature card + journal post preview.
**What works:** Journal-as-hero signals "author is a thinking person, not a brand". Authentic voice.
**What doesn't:** Information density. Typography is generic.
**Steal:** Journal-as-personality anchor. Quotable pull-out in a serif block.

---

## B. Etsy commercial field — the direct competition

### 5. "Book Author Website Canva Template" (Etsy listing 4345302662)
**Price band:** $18-35. One-page Canva template aimed at debut romance authors.
**What it is:** A single long scroll Canva file. Buyer duplicates it, swaps images/text, publishes to a Canva domain.
**What works:** Cheap. Editable in browser with zero code.
**What doesn't:** Canva-hosted sites load slowly and look Canva. No custom domain without upgrade. No motion. No 3D. Every competitor in this price band is flat-PDF energy.
**Gap we can fill:** A template that looks like it cost $3,000, not $30. Motion and 3D are the differentiation wedge — literally nobody on Etsy has this.

### 6. "6 Page Author Media Kit Template" (Etsy listing 887841936)
**Price band:** $15-25. Canva media kit PDF, not a website.
**Note:** Buyers often purchase both. Suggests we could bundle a media-kit PDF export as a companion — but out of scope for v1.

### 7. Etsy search "book author website template" top-10 synthesis
**Visual language across the field (all of them):**
- Beige / cream / muted rose backgrounds. Safe, spa-like, low contrast.
- Playfair Display or Cormorant (never IBM Plex — doctrine advantage).
- Static book mockup .PNG on a desk with a coffee cup. Every. Single. One.
- Testimonial block with fake 5-star review from "Sarah M."
- Instagram grid embed.
- Zero animation beyond Canva defaults.

**What they ALL get wrong:**
- The book is always a flat image, never an object.
- Romance-coded cream aesthetic even when the buyer writes thrillers or literary fiction.
- "Author bio" is treated as a section, not the quiet backbone of the page.
- CTAs are weak ("Learn More") instead of action-coded ("Pre-order", "Read Chapter 1").
- Typography is decorative, never editorial — they mistake "calligraphy script" for "literary".

---

## C. The outlier

### 8. wawasensei.dev 3D book slider demo
**URL:** wawasensei.dev/tuto/3d-book-slider-landing-page-threejs-and-react + github.com/shreejai/book-slider-3d
**What it is:** Tutorial/demo of a React Three Fiber book with genuine page-turning geometry (curved mesh, not flat card flip).
**Why it matters:** Proves the tech works in React/Next. Nobody on Etsy has shipped this. Nobody in the author-site field has shipped this. **This is our moat.**
**Steal:** Curved-page geometry, hover-to-peek, click-to-open. Add scroll-linked chapter advance.

---

## Synthesis

**What the whole field does that we should copy:**
- Newsletter signup is non-negotiable (every site has it).
- Book grid / library view for multi-book authors.
- Events / tour date list.
- Press/praise quote section.
- Buy-link row with retailer logos (Amazon, Bookshop, B&N, indie).

**What the whole field does that is BORING and we should skip:**
- Flat book mockup on a desk with coffee (replace with 3D book).
- Beige-everything. Assign an accent with genre intent.
- Script fonts for headings. Replace with IBM Plex Serif — more literary, more expensive-feeling, zero spa energy.
- "Testimonials" framed as SaaS testimonials. Reframe as **praise** — blurbs with publication name in small caps (NYT, Kirkus, Publishers Weekly style).
- Generic "Contact" form. Replace with "For press and speaking" + "For readers" split — mirrors how authors actually field email.

**Our three-punch differentiation (each is unique on Etsy, together they are unassailable):**
1. 3D interactive book on hero (no competitor has this).
2. IBM Plex Serif editorial typography (nobody in the author template category uses it).
3. Single-accent genre palette system the buyer picks (thriller = blood red, fantasy = deep green, romance = dusty rose, literary = ink black, non-fiction = IBM blue). We ship one accent per SKU variant or make it a documented swap.
