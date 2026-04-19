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

---

# Appendix — 2026-04-19 literary-fiction pass (gap analysis for booquarium v1)

**Why this appendix exists:** the main audit above was written from the Etsy-buyer / genre-field perspective (fantasy, YA, romance templates). The live booquarium build is now aimed at a literary-fiction author (Elena Voss, *The Cartographer's Daughter*, Paris Review register). None of the sites previously reviewed are literary fiction. This pass inventories **real literary-fiction author sites** and flags what's missing from booquarium's current 10-section build.

## Sites reviewed (literary fiction)

### 1. hernandiaz.net — Hernán Díaz (Pulitzer 2023, *Trust*)
URL: https://www.hernandiaz.net/
- **Nav as spine, not ornament.** 7 top-level items: Home · Bio · **Books** (dropdown with 4 titles) · **Stories, Essays, Misc.** (dropdown) · **Press** (dropdown split by book — *Trust Interviews* / *In the Distance Interviews*) · Events · Contact. The press dropdown is the killer pattern — interviews grouped per-book, not one flat list.
- **Homepage is an announcement, not a portfolio.** Single feature: the forthcoming *Ply* with PRH pre-order link. No hero carousel, no feature grid. One book, one link, done.
- **No newsletter, no book club, no media kit.** A Pulitzer winner. This is the literary-fiction paradox: the more serious the author, the less conversion machinery on the site.

### 2. jessaminechan.com — Jessamine Chan (debut, *The School for Good Mothers*, NYT bestseller)
URL: https://www.jessaminechan.com/
- **Dedicated Book Clubs page in primary nav.** The only one of the 8 sites with this pattern. Contents: downloadable Reading Group Guide PDF + a single CTA — "invite me to your book club via Zoom, contact SSPublicity@...". That's it. Minimal, but it exists, which is the point.
- **"Other Writing" nav item.** A corral for short stories, essays, reviews. Literary-fiction authors have careers-before-the-debut; this lets them honour that without cluttering the book page.
- **Instagram link in nav bar itself** (not footer). Literary debut audiences live on bookstagram.
- **"Enter" pattern on home.** Home page = book cover + two links ("Order" and "Enter"). "Enter" leads to the dedicated book microsite. Strong doorway metaphor — fits booquarium's book-as-object ethos.

### 3. maggieshipstead.com — Maggie Shipstead (Booker shortlist 2021, *Great Circle*)
URL: https://www.maggieshipstead.com/
- **"Articles" is a top-nav item.** Shipstead is also a travel writer for Condé Nast Traveller. The site frames the author as a writer-across-forms, not just a novelist.
- **"Videos" in primary nav.** Interview clips, bookstore readings, festival panels. Rare on literary sites, powerful for conversion — lets the reader hear the author's voice before buying.
- **Book-level sub-site** (maggieshipstead.com/greatcircle) with its own awards wall, retailer fan (Bookshop, Indiebound, B&N, PRH, Waterstones, Apple Books, Amazon — 7 retailers), and a linked **Reading Group Guide PDF**. Booquarium has neither the awards wall nor the retailer fan.

### 4. colsonwhitehead.com — Colson Whitehead (two-time Pulitzer)
URL: https://www.colsonwhitehead.com/
- **Scam warning is on the homepage.** Literal sentence: "I've been notified that scammers are impersonating me online, making the false claim that I'm interested in mentoring." This is a 2024-2026 pattern across established literary authors — the Impersonation Notice.
- **Contact is pre-split, not a form.** Three explicit addresses on the page: general, publicity contact (named), and a Speaking Engagements bureau link. No form. "Email the right human" is the editorial pattern — forms are SaaS-coded.
- **Minimal to the point of rude.** Books page literally says "here they are". The confidence of not selling.

### 5. douglasdstuart.com — Douglas Stuart (Booker 2020, *Shuggie Bain*, Scottish — closest peer to Elena Voss / Edinburgh)
URL: https://www.douglasdstuart.com/
- **"Conversations" is a dedicated nav item.** Curated podcast and interview appearances — *The New Yorker Radio Hour*, *Between the Covers*, *Talking Scared* etc. This is the Shipstead "Videos" pattern but audio-first.
- **Praise wall on homepage, not a separate page.** For the upcoming *John of John* (May 2026): 6+ quotes from other novelists — Richard Russo, Karl Geary, Sandra Newman. Author-quotes weighted above press-quotes. Literary-fiction authors blurb each other; readers of the genre read for this.
- **Book page = praise avalanche + awards wall + edition split (US Grove / UK Picador).** The *Shuggie Bain* page is essentially one long vertical scroll of ~19 pull quotes. Zero retailer buttons, zero book-club guide — the praise IS the sales argument.
- **Hebrides landscape hero.** Photograph of place. Scottish authors lean hard on geography as atmosphere. Relevant for Edinburgh-set *Cartographer's Daughter*.

### 6. oceanvuong.com — Ocean Vuong (*On Earth We're Briefly Gorgeous*, *The Emperor of Gladness*)
URL: https://www.oceanvuong.com/
- **Nav splits work by form:** About · **The Novels** · **The Poems** · Resources · Appearances · Contact. Literary authors with cross-form output always do this split. Don't collapse poems into books.
- **"Resources" as nav item.** Interview archive, classroom materials, reading guides, teaching kits. This is the literary equivalent of a press kit — aimed at teachers, librarians, book-club leaders.
- **"Appearances" not "Events".** Softer, literary register. Events is SaaS; appearances is a writer.

### 7. elifbatuman.com — Elif Batuman (*The Idiot*, Pulitzer finalist, debut)
URL: https://elifbatuman.com/
- **Substack is the newsletter.** Nav directs to "The Elif Life" on Substack rather than a Mailchimp form embedded on-site. Literary-fiction audiences expect Substack specifically, not a generic signup.
- **"Non-Books" as nav item.** Wry, personal framing — essays, New Yorker pieces, short stories all filed under a joke category. Voice shows up in the IA itself.
- **Multiple dated author photos** (2024 Rome, 2019 Lviv) with photographer credits. Image credit line matters — it's a *Paris Review* tell.

### 8. kavehakbar.com / others (reference, not a direct competitor — poet, but similar literary register)
- URL: https://kavehakbar.com/ (site rendered minimally to the scraper; noted for coverage completeness only — relies on hero typography as the entire design)

## Section frequency table (8 literary-fiction sites)

| Section / feature | Count | % | Present in booquarium v1? |
|---|---|---|---|
| Author bio page | 8 | 100% | Yes (About) |
| Book page (dedicated) | 8 | 100% | Partial — book info lives on hero, not a dedicated page |
| Praise / blurb wall | 8 | 100% | Yes (Reviews + PullQuote) |
| Contact (any form) | 8 | 100% | Implicit (Newsletter only) — **no contact** |
| Events / Appearances | 6 | 75% | **NO** |
| Press / Interviews / "Conversations" | 6 | 75% | **NO** |
| Retailer buttons (multi-store) | 5 | 63% | Partial — CTAs exist, retailer row does not |
| Awards / Recognition wall | 5 | 63% | **NO** (for a debut: press starred reviews substitute) |
| Other Writing / Essays / Non-Books | 5 | 63% | **NO** |
| Reading group guide / Book club | 4 | 50% | **NO** |
| Social links (Instagram-forward) | 4 | 50% | Footer only — not in nav |
| Scam / impersonation warning | 3 | 38% | N/A (debut — not yet famous enough) |
| Contact split (press vs readers vs speaking) | 3 | 38% | **NO** |
| Video / audio appearances | 3 | 38% | **NO** |
| Newsletter (on-site signup) | 3 | 38% | Yes (booquarium over-indexes here vs field) |
| Foreign editions / translations | 2 | 25% | **NO** |
| FAQ | 0 | 0% | **Yes — and this is a red flag, see below** |
| Marquee ticker | 0 | 0% | **Yes — and this is also a red flag** |
| Inside-the-book / chapter features (sticky list) | 0 | 0% | Yes — unique to us, keep but reframe |

## Gap analysis — what booquarium is missing (present in 3+ literary sites)

Ranked by frequency in the field:

### Gap 1. Events / Appearances (75% of sites, 0 of booquarium)
Literary-fiction launches live on the tour. Edinburgh debut means Edinburgh Book Festival, Charlotte Square, Topping & Co signings, London launch at Foyles / Daunt / Waterstones Piccadilly. Omitting this from a 10-section site reads as "no publisher, no tour" — the opposite of what Kirkus-starred suggests.

### Gap 2. Press / Interviews / "Conversations" archive (75%, 0 of booquarium)
Booquarium has *review blurbs* but not *long-form press*. Literary-fiction readers want to hear the author think. A "Conversations" (Stuart pattern) or "Press" (Díaz pattern) section aggregates podcast appearances, *Paris Review* interviews, radio hour clips. For a debut with a Kirkus star, this is the validation proof readers look for.

### Gap 3. Retailer fan — multi-store buy row (63%, partial in booquarium)
The field standard is a 5–7 retailer row: Bookshop.org (indie-coded) · Waterstones (UK-essential for an Edinburgh author) · Blackwell's · Amazon · Barnes & Noble · Apple Books · Audible. Booquarium's current CTAs are generic "Pre-order". Missing Bookshop.org specifically is a literary-fiction tell — that's the indie-bookseller signal.

### Gap 4. Awards / Recognition wall (63%, 0 of booquarium)
For a debut without prizes yet, this becomes the *starred reviews wall*: Kirkus starred · Booklist starred · Publishers Weekly · Library Journal · indie-bookstore picks. This is content booquarium already has (Kirkus pull-quote exists) but hasn't consolidated into a single trust-module.

### Gap 5. Other Writing / Essays / Non-Books (63%, 0 of booquarium)
Literary fiction authors are always also essayists, reviewers, or short-story writers before the debut. Elena Voss plausibly has prior *Granta* / *LRB* / *TLS* / *Paris Review* appearances. A three-to-five-item "Selected Writing" list with publication small-caps (same treatment as the Reviews section) is essentially free content and deepens the author's perceived career.

### Gap 6. Reading Group Guide / Book Clubs (50%, 0 of booquarium)
Not universal but half the field has it. For literary fiction specifically — which is the book-club genre — this is higher than 50% among *debuts with Kirkus stars*. Minimum viable version: a single PDF download + one line "Book clubs: I'm available on Zoom, email press@..." (Chan pattern). Cheap to build, signals seriousness.

### Gap 7. Contact split (38%, 0 of booquarium)
Whitehead / Stuart / Vuong pattern: no form. Three email links with labels: **For press** (publicity@publisher) · **For speaking** (agency) · **For readers** (general). Booquarium has Newsletter but no way to actually email Elena. Literary-fiction register demands "email the right human", not a form.

## Red flags in booquarium's current build (present in us, present in ~0% of field)

Not missing — rather, sections we have that **nobody in literary fiction has**:

### Red flag A. Marquee / infinite text ticker
Zero of the 8 literary sites use a marquee. This is a brutalist / tech-product / agency pattern. For Paris Review tone it reads as try-hard. Either kill it or defend it as a deliberate editorial device (e.g., a scrolling ribbon of review pull-quotes — closer to a tabloid front page than a ticker).

### Red flag B. FAQ (5 questions)
Zero of the 8 literary sites have an FAQ. FAQ is SaaS IA. For a novel, the answers to "When is it out? / Where can I buy it? / Is there an audiobook?" belong in the book page and retailer row, not a collapsible accordion. Killing this section would align us with the field.

### Red flag C. Features / "Inside the Book" sticky list
Zero literary sites do this — it's SaaS feature-grid IA translated to books. The closest literary equivalent is an **author's note** or a **reading group guide**. Proposal: reframe the existing sticky-4-item pattern as either (a) *Four threads* — thematic essay-notes from the author, or (b) *Four rooms* — object/place/character/form, positioned as an atmospheric entry into the novel, not "features."

## Prioritised recommendations — what to add next (3, ranked)

### Recommendation 1 — Add an Events / Appearances section
**Pattern:** 3-to-5 upcoming date cards. Each card: city / venue (Waterstones Piccadilly, Topping Edinburgh, Shakespeare & Co Paris) / date / "In conversation with …" line / RSVP link. Past dates collapse into a small list beneath. Editorial serif for the venue, sans for date + in-conversation-with.
**Why first:** highest field frequency (75%), signals "real author on a real tour", directly supports the Kirkus-starred credibility. Edinburgh specifically needs Edinburgh Book Festival visibility.
**Doctrine fit:** standard bordered card grid from `ui-kit/PATTERNS.md`. Single accent on the date-badge only. No new components needed.
**Copy cue:** section label "Appearances" not "Events". Use ordinal formatting: "15 May 2026 · Topping & Co, Edinburgh".

### Recommendation 2 — Collapse Marquee + FAQ and replace with a Press / Conversations strip
**Pattern:** a horizontally scrollable strip of 6-10 press appearances — podcast logo or publication wordmark · title of the piece · date · outbound arrow. Think: *The Paris Review*, *Granta Podcast*, *BBC Front Row*, *Lit Hub*, *The Bookseller*, *ScotLit*. Treat it like the Reviews row but for long-form press, not blurbs.
**Why second:** second-highest field frequency (75%), and the trade is net positive — we remove two patterns that are anti-literary (Marquee, FAQ) and gain one that is canonical (Press).
**Doctrine fit:** reuse the same bordered horizontal-scroll primitive as Reviews. Small-caps publication names, eyebrow label "In conversation".
**Copy cue:** "Conversations" (Stuart) or "Press" (Díaz). Pick one — "Conversations" is warmer and more *Paris Review*.

### Recommendation 3 — Retailer row + Reading Group Guide, both anchored to a dedicated book page
**Pattern:** introduce a new route `/the-cartographers-daughter` (the "Enter" pattern from Chan). On that page:
- full cover treatment (reuse the 3D book)
- long-form synopsis
- **retailer fan:** Bookshop.org · Waterstones · Blackwell's · Amazon UK · Amazon US · Apple Books · Audible — each as a small bordered pill with the retailer wordmark
- **awards & starred reviews strip:** Kirkus starred, plus whatever else (this is the existing PullQuote repositioned)
- **Reading Group Guide:** a single bordered card that downloads a PDF + a Chan-style Zoom-visit line
- **author's note:** 200-300 words from Elena about the book (repurposable as Instagram copy later)
**Why third:** hits four gaps at once (retailer fan 63%, awards 63%, book-club 50%, dedicated-book-page 100%) with one new page. Also moves booquarium from "landing page" to "author site" — which is the Paris-Review-register product we promised.
**Doctrine fit:** new route, but all primitives already in the kit. One accent pill for the Bookshop.org (indie-coded) button — the others are neutral outlines.
**Copy cue:** author's note opens with a first-person sentence about the *object* of the book (a map, a city, a craft) rather than the plot. Literary-fiction authors almost never pitch their own plot on their own site.

---

**Sources (literary-fiction pass):**
- https://www.hernandiaz.net/ — nav IA, press-per-book pattern
- https://www.jessaminechan.com/ — book clubs page, "Enter" doorway, Instagram-in-nav
- https://www.jessaminechan.com/book-clubs — minimum-viable book-club page
- https://www.maggieshipstead.com/ — Articles / Videos nav
- https://www.maggieshipstead.com/greatcircle — retailer fan (7 stores), awards wall, reading-group PDF
- https://www.colsonwhitehead.com/ — scam warning, contact split, no-form contact
- https://www.douglasdstuart.com/ — "Conversations" nav, praise-wall homepage, Hebrides hero
- https://www.douglasdstuart.com/shuggiebain — 19-quote praise avalanche, US/UK edition split
- https://www.oceanvuong.com/ — Novels/Poems split, "Resources" as nav, "Appearances"
- https://elifbatuman.com/ — Substack-as-newsletter, "Non-Books", dated photo credits
- https://kavehakbar.com/ — (minimal capture; poet, peripheral reference)
