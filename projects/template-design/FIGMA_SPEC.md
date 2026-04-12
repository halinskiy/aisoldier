# Template-Design — Figma Spec (Scrupulous Inventory)

**Figma file:** `hdriqKesBCNlAVapaGQXO6`
**URL:** https://www.figma.com/design/hdriqKesBCNlAVapaGQXO6/Template-Design?node-id=0-1
**Extracted:** 2026-04-11
**Status:** sections 1-3, 5-6, 8-10 detailed; 4, 7, 11, 12 + header pending symbol drill-down

---

## Top-level structure

Canvas `0:1` "🖥 Desktop" contains **4 primary artboards**:

| Artboard | Node ID | Size | Role |
|---|---|---|---|
| **Home** | `1:5` | 1440×12911.63 | Main landing page (desktop 1440 baseline) |
| **Case Study** | `191:1092` | 1440×5601 | Internal case-study page |
| **Style guide** | `259:3719` | 1440×2995 | Design system reference |
| **1920 container** | `259:2008` | 5608×13173 | 1920-width variant (secondary scope) |

Plus floating annotations: `humbldesign.io`, `forfuture.webflow.io`, `puchix-studio.webflow.io` (noted with "Анимация появления секций").

**Engineering decision:** build **Home first** (desktop 1440 baseline), make it responsive, treat 1920 as a wider-viewport check. Case Study and Style guide are secondary scope.

---

## Design tokens (from Style guide variables)

### Colors
```css
--color-dark: #212121;
--color-light: #EFEDE7;        /* warm light — NOT white */
--color-bg: #F8F7F1;           /* warm paper cream — page bg */
--color-accent: #FF512A;       /* orange-red — the single accent */
--color-white: #ffffff;
```

### Typography (all IBM Plex)

| Role | Family | Weight | Size / LH | LS |
|---|---|---|---|---|
| H0 | Plex Serif | 500 | 96 / 96 (1.0) | -2.5 |
| H1 | Plex Serif | 500 | 64 / 60.8 (0.95) | 0 |
| H2 | Plex Serif | 400 | 48 / 52.8 (1.1) | -2 |
| H3 | Plex Serif | 400 | 40 / 44 (1.1) | -1 |
| H4 | Plex Serif | 400 | 32 / 35.2 (1.1) | -1 |
| H5 | Plex Serif | 400 | 28 / 33.6 (1.2) | -0.5 |
| H6 | Plex Serif | 500 | 24 / 28.8 (1.2) | -0.5 |
| Large | Plex Sans | 400 | 20 / 28 (1.4) | 0 |
| Body | Plex Sans | 400 | 16 / 24 (1.5) | 0 |
| Small | Plex Sans | 400 | 14 / 21 (1.5) | 0 |
| Label L | Plex Sans | 400 | 12 / 18 (1.5) | 0.75 |
| Label S | Plex Sans | 400 | 10 / 15 (1.5) | 0.75 |

Weight mixing is deliberate: Medium on H0, H1, H6 (display + small heading); Regular on H2-H5 (narrative headings). Preserve.

---

## Home page sections (desktop 1440 baseline)

Total page height: **12,911.63 px**. Section container width: **1376 px** (32 left + 32 right padding = 1440).

### 1. Hero — `1:80` (y=89, h=733)

**Layout:** two-column content row + journey indicator row + card row

#### 1.1 Main content row — `Frame 532` (x=32, y=32, 1376×460)
- **Left col — `Frame 5` (0, 0, 501×460):**
  - Top block `Frame 516` (0, 0, 501×327):
    - Eyebrow pill `Frame 6` 142×29, text "Webflow Template" at (12, 4) → **⚠️ designer gap: placeholder text from Webflow template itself, not replaced with real brand.** Replace with e.g. "Wealth Advisory".
    - Headline block `Frame 9` (0, 53, 501×190):
      - **H0** "Strategic management" 501×122 — renders on **2 lines** ("Strategic" / "Management") with tight 0.95 lh
      - **Body** "We optimize capital allocation, minimize tax exposure, and build generational wealth" 501×48 (2 lines × 24 lh)
    - CTA row `Frame 10` (0, 283, 304×44):
      - Primary button `Frame 9` 163×44: text "Get Template" at (22, 10) + 6×6 dot ellipse at (135, 19) → **⚠️ "Get Template" is placeholder copy.** Should be "Schedule call" or "Book consultation".
      - Secondary button (ghost) instance `Button` at (171, 0), 133×44 — labeled "Get in touch" per screenshot
  - Social proof block `Container` (0, 375, 501×85):
    - Avatar strip `Container` (0, 0, 501×48): 4 circular avatars 48×48 at x=0, 32, 64, 96. **⚠️ designer gap: avatars overlap.** Spacing is 32 but avatar is 48 wide → each avatar covers its neighbor by 16px. This is a deliberate overlapping avatar stack (common pattern), but the stacking **z-order is wrong** (no explicit z-index, so the leftmost is at the bottom). Implementation must add `z-index` so leftmost is on TOP for the stacked look to read correctly.
    - Text `Container` (0, 64, 501×21): "Trusted by 500+ clients (4.9/5)" 196×21 (Body 14/16)
- **Right col — `Group - 2 of 3`** (700, 0, 676×460): hero photograph (confirmed in screenshot: two professionals in a modern office, warm natural light)
  - **⚠️ designer gap:** gap between left col (501 wide) and right col (starts at x=700) = 199px. At 1440 desktop that's fine. At 1024px it's a problem — the two columns won't fit side-by-side with that kind of gap.

#### 1.2 Journey indicator row — `Frame 535` (x=32, y=528, 1376×172)
- Divider line + 2 markers `Frame 6` (0, 0, 1376×36):
  - Vector 5 (0, 18, 680×0) — horizontal line segment to the left of marker 1
  - Marker 1 `Frame 531` at (700, 0, 36×36):
    - Circle `Frame 530` inside (6, 6, 24×24), containing 12×12 ellipse at (6, 6) — accent-filled dot at center
    - Label `Frame 13` (0, 44, 98×27): text "Our Solution" at (8, 6)
  - Vector 1 (756, 18.00002, 564×0.00005) — second line segment to the right of marker 1 → **⚠️ designer gap: fractional y position `18.00002` and hairline height `0.00005` — snap to integer.**
  - Marker 2 `Frame 532` at (1340, 0, 36×36):
    - Same internal structure
    - Label `Frame 13` at **(-87, 44, 123×27)** — text "Increase royalty" at (8, 6) → **⚠️ designer gap: label is shifted 87px LEFT of its marker, probably to prevent clipping at the right edge. But this breaks left-alignment symmetry with marker 1 (whose label is at x=0). Screenshot confirms: label "INCREASE ROYALTY" appears at right edge as uppercase caps.**
  - **⚠️ major designer gap:** only **two** markers in what is clearly a "journey/timeline" indicator. Typical pattern has 3-5 steps. Designer under-designed this. Implementation decision: keep 2 markers but make the line + markers visually purposeful (e.g., "Our Solution → Increase Royalty"), OR suggest adding a middle marker for coherence.

- Card row `Frame 536` (0, 52, 1376×120):
  - Left: instance `List → Listitem → Link` (0, 0, 361×120) — a card showing "See our expertise for yours capital allocation" + small circular arrow button, per screenshot → **⚠️ typo in placeholder copy: "yours capital" should be "your capital".**
  - Right: arrow button `Frame 8` at (1332, 76, 44×44) with 24×24 icon → probably "next" arrow to horizontally scroll through cards. But there's only **1** card visible → **⚠️ designer gap: carousel with only one slide is meaningless. Either add more slides or remove the arrow.**

**Section 1 responsive plan:**
- ≥1280: pixel-perfect
- 768-1279: left col full-width, hero image below as full-bleed
- <768: hero text clamp(36px, 10vw, 64px) for H0 so "Strategic" and "Management" stack vertically; avatars shrink to 36×36 with 12px overlap; journey indicator stays horizontal but marker labels shrink to 10px uppercase; only keep the 1 carousel card, drop the arrow

---

### 2. Hero 2 / About Us — `5:5122` (y=822, h=602)

**Layout:** two-column intro paragraph block

- Left block `Frame 538` at (32, 80, 501×145):
  - Eyebrow pill `Frame 6` 82×29: text "About Us" at (12, 4)
  - **Body** "We help expert-led firms rethink how they present their services not by adding more, but by focusing better. Every engagement starts with a structural audit of what you offer, how it's framed, and why it matters." 501×96 (4 lines)
- Right block: single **Body** text at (732, 80, 676×442) — long-form paragraph about the firm: "Our product combines deep financial expertise with a commitment to clarity. We don't build portfolios in isolation..." (18 lines)

**⚠️ designer gaps:**
- Left column content ends at y=225 (80+145). Right column ends at y=522 (80+442). Both are inside a 602-tall section. Empty space below = 80px bottom padding, inconsistent with top padding (80). OK, symmetrical.
- Left body text width is 501 but the section container gap (right col starts at x=732) is **231px** — way more than the 199px gap in section 1. **Inconsistent gutter widths** between hero and about section. Pick one gutter width and stick with it (recommend 199 or round to 200).
- Right column content width is **676** but text width is 676 — right column fills. Good.
- **Copy issue:** left column has copy from `forfuture.webflow.io` (confirmed — it matches one of the reference URLs designer left on canvas). So this left paragraph is **lifted placeholder text**, not actual client copy. Flag for content rewrite.

**Section 2 responsive plan:**
- ≥1024: two-column, equal widths
- <1024: stack vertically, left paragraph first (intro), then long paragraph. Add 32-48px gap between.

---

### 3. Our Approach — `17:300` (y=1424, h=724)

**Layout:** header row + divider + 5-column stats/values row

- Header `Frame 539` (32, 120, 1376×141):
  - Left `Container` (0, 0, 501×141):
    - Eyebrow pill "Our Approach" 111×29
    - **H3** "Your wealth is only as secure as your strategy" 501×88 (2 lines × 44 lh)
  - Right `Container` (700, 0, 676×140):
    - **Body** "We help expert investors optimize their portfolios not by chasing trends, but by building structure. Every engagement starts with a comprehensive analysis of your assets and risk tolerance" 501×72 (3 lines)
    - CTA button "Get Started" 149×44 with dot ellipse at (121, 19)
- Divider `Frame 540` (32, 325, 1376×36): horizontal vector line 1376 wide
- 5-column stats row `Frame 529` (32, 425, 1376×179): 5 identical containers
  - Instance widths: **275.20001... each** → **⚠️ designer gap: fractional widths** (1376 / 5 = 275.2). Use `grid grid-cols-5` — browser handles the split perfectly.

**⚠️ designer gaps:**
- Content block ends at y=604 (425+179). Section is 724 tall. 120px bottom padding — matches top padding. OK.
- H3 is 40px (88/2). But 44px × 2 = 88. So line-height is 44, size is 40. Correct H3 mapping.
- Right column CTA "Get Started" — same as hero's "Get Template" but different label. **⚠️ copy-style inconsistency:** designer keeps changing CTA label without clear intent. Unify: one CTA style, one label per destination.

**Section 3 responsive plan:**
- ≥1280: as designed (2-col header + 5-col stats)
- 1024-1279: 2-col header, 5-col stats unchanged
- 768-1023: stacked header (left above right), stats row → 3 cols with wrap to 2
- <768: all stacked, stats → 2 cols (2×3 with last cell spanning or 2+2+1)

---

### 4. Services showcase — `183:2` (y=2148, h=1314) — **INFERRED from visual + structural reasoning**

**Confidence:** MEDIUM. This section is a symbol instance — its internal metadata was locked at Home-frame query time, and Figma MCP hit the Starter plan rate limit before I could drill down directly. Description below is inferred from: (a) the compressed full Home screenshot showing colorful image cards in this vertical range, (b) symmetry with how Section 6 (Case Studies) is structured, (c) typical wealth-management landing patterns.

**Likely role:** Services / Offerings card grid with photographic or gradient backgrounds. One of the most visually prominent sections in the compressed Home screenshot — colorful, probably 2×3 or 3×2 grid of image cards with title overlays.

**Assumed layout:**
- Header row at (32, 120, 1376×141): eyebrow pill + H3 headline (similar to sections 3, 5, 6, 9)
- Divider at around y=325
- Card grid at (32, 425-ish, 1376×~889): 2×3 grid of image cards, each ~676×~430 with 24px gap
- Each card: full-bleed image or gradient background, H4/H5 title overlay, optional small label/icon

**Engineering approach:** build as a reusable `ImageCardGrid` component that accepts N cards, defaults to 2-col × 3-row, collapses to 1-col on mobile. Image overlay uses a darkening gradient from bottom (`linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)`) for text legibility.

**Section 4 responsive plan:**
- ≥1024: 2×3 grid as designed
- 768-1023: 2×3 grid (cards narrower, text stays legible)
- <768: 1×6 stacked grid

---

### 5. Services list — `59:5795` (y=3462, h=1089)

**Layout:** header + 4-item vertical list

- Header `Container` (32, 120, 501×141):
  - Eyebrow pill "Services" 77×29
  - **H3** "Explore our service offerings" 501×88 (2 lines)
- 4-item list `Frame 523` (32, 325, 1376×644): 4 instances stacked vertically
  - Each instance 1376×149, gap 16px (165 - 149)
  - Items at y = 0, 165, 330, 495 (each has class `Container` / `Frame 529/530/531`)
  - **⚠️ designer gap:** instance types are `Container`, `Frame 529`, `Frame 530`, `Frame 531` — inconsistent naming suggests these were copy-pasted from different parents. In the Webflow handoff, treat them as one `ServiceRow` component with 4 data rows.
- Section ends at y=969 (325+644). Section height 1089 → 120px bottom padding. OK.

**Section 5 responsive plan:**
- ≥768: as designed, full-width rows
- <768: stack internal elements of each row (likely: title/desc/icon)

---

### 6. Proven Outcomes / Case Studies — `143:2621` (y=4551, h=1876)

**Layout:** header + 2×3 case study grid

- Header `Frame 539` (32, 120, 1376×140):
  - Left `Container` 501×97: eyebrow "Case Studies" 106×29 + **H3** "Proven outcomes" 501×44
  - Right `Container` (700, 0, 676×140): Body text + "Get Started" CTA
- Grid `Frame 529` (32, 340, 1376×1416): 6 case study cards
  - 2 columns × 3 rows
  - Each card 676×456
  - Gaps: 24px horizontal (700 - 676), 24px vertical (480 - 456)
  - Positions: (0,0), (700,0), (0,480), (700,480), (0,960), (700,960)
- Section ends at y=1756 (340+1416). Section 1876 → 120px bottom padding. OK.

**Section 6 responsive plan:**
- ≥1024: 2-col grid
- 640-1023: 2-col grid (cards narrower)
- <640: 1-col grid, full-width cards

---

### 7. Mid-page statement banner — `17:758` (y=6427, h=661) — **INFERRED from visual**

**Confidence:** MEDIUM. Symbol instance. From the compressed Home screenshot, this section appears as a **full-bleed orange-gradient banner** with a dramatic typographic statement — one of the two visually-loud moments on the page (the other being the contact form in Section 11).

**Likely structure:**
- Full-bleed background: warm orange gradient (likely `#FF512A` → `#FFAB91` or similar accent-toned gradient)
- Centered H2 or H1 copy: short emotive/declarative line
- Optional subtext below headline
- Possibly a single CTA button

**Role on page:** emotional peak between Case Studies (section 6) and Testimonials (section 8). Breaks the rhythm of alternating header+grid sections with a full-stop statement.

**Engineering approach:** build as `BannerStatement` component. Full-bleed width (breaks out of the 1376 container), `py-[clamp(64px,10vw,120px)]`, centered text max-width 900px, accent or gradient background. One line, tight H2 sizing, maximum contrast against the cream surrounding sections.

**⚠️ designer gap:** text content not extracted. **Project decision:** use placeholder copy **"Clarity over complexity. Always."** — matches firm's positioning from the footer tagline. Flagged in `HANDOFF.md` that the real line needs client approval.

**Section 7 responsive plan:**
- All breakpoints: full-bleed, centered text, single column
- Font size scales via clamp
- On mobile, extra vertical padding to avoid feeling cramped

---

### 8. Testimonials + Stats — `143:1425` (y=7088, h=2493.63)

**⚠️ MAJOR designer gap #1:** eyebrow label says **"Services"** but section contains testimonials. Designer copy-pasted from another header and forgot to change. Must fix to **"Testimonials"** or **"Reviews"**.

**Layout:** header + divider + 3-column testimonial grid + stats row

- Header `Frame 539` (32, 120, 1376×97):
  - Left `Container` 501×97: eyebrow "Services" **⚠️ wrong** 77×29 + **H3** "Real results, real feedback" 501×44
  - Right `Container` (700, 0, 676×92):
    - **Body** "All reviews are available on founder's linkedin profile" 501×24
    - Button `Frame 8` (0, 48, 150×44) "Leave a review" — ghost/outline variant
- Divider `Frame 6` (32, 281, 1376×36): 1376-wide line
- Testimonial grid `Frame 529` (32, 381, 1376×1675.63):
  - **3 columns × ~4 rows = 10 cards** (screenshot confirms: row 1: Michael Johnson, Samantha Joyce, Oliver Ellis; row 2: Diana Xavier, Wendy Kemp, Holly Woods; row 3: Natali Caldwell, Rachel Zimmerman, Mia Walker; row 4: Zara Payne + 2 empty)
  - Card size: **442.67 × 400** (outer), positioned at x=0, 466.67, 933.33
  - **⚠️ designer gap: fractional widths.** Use `grid grid-cols-3 gap-6` — browser divides 1376 into 3 with 24px gaps naturally.
  - Card internal structure (per metadata for first card `Frame 549`):
    - Padding: 40 all sides
    - Frame 547 (content, 40, 40, 362.67×variable):
      - **Frame 546 (stars, 76×11.63)**: 5 stars 12×12 at x=0, 16, 32, 48, 64 (gap 4). **⚠️ height 11.63 — snap to 12.**
      - Quote text: starts at y=35.63, variable height (ranges 48 to 227 depending on quote length)
    - Frame 545 (author, 40, 312, 213×48):
      - Avatar 48×48
      - Paragraph (60, 1.5, 153×45): name 126×24 (Body 16/24) + role "Co-Founder @ Company" 153×21 (Small 14/21)
  - **⚠️ designer gap: all card heights are fixed at 400** but quote text lengths vary wildly (48, 72, 144, 168, 227). Some cards will have author block at y=312 even when the quote is short — big empty gap. Others will clip if the quote is longer than expected. Fix: make cards auto-height (min 400) and anchor author block to bottom.
  - **⚠️ designer gap: all 10 authors are "Co-Founder @ Company"** — placeholder text. Need real roles/companies.

- **Divider** `Frame 568` (32, 2120.63, 1376×36): horizontal Vector 4 line (1376×0), sits between testimonial grid and stats row
- **Stats row** `Frame 571` (32, 2220.63, 1376×153): **CONFIRMED from metadata**
  - 4 containers each 344 wide (1376/4 = 344), gap 0 (positions: 0, 344, 688, 1032)
  - Each container 344×153 with:
    - Number text at (0, 40, 344×44) — **H3** 40px Regular (44 = 1.1 × 40)
    - Caption text at (0, 92, 344×21) — **Small** 14px (21 = 1.5 × 14)
  - Values:
    - **500+** / Clients served globally
    - **$3.2B+** / Assets under management
    - **18 years** / Industry experience
    - **12%** / Average annual returns
- **🔴 compliance gap:** "12% average annual returns" is a direct return claim. For SEC-regulated wealth managers, any specific return figure in marketing materials requires: time period, methodology (gross vs net, pre-tax vs post-tax), benchmark comparison, backtest vs actual disclosure, and a "past performance does not guarantee future results" disclaimer. Leaving as-is exposes the client to legal risk.
- **Project decision** (see `DECISIONS.md`): replace "12% Average annual returns" with **"400+ Families served"** — compliance-neutral, matches the About section tagline "over 400 families and institutions".
- **⚠️ designer gap: testimonial card heights inconsistent within rows.** Wendy Kemp's card (row 2, col 2) is **403.63 px tall** instead of 400 — her quote is longer and the card auto-grew. This cascades: row 3 starts at y=851.63 instead of 848. Full grid Y offsets: row 1 y=0, row 2 y=424, row 3 y=851.63, row 4 y=1275.63. Implementation must use **CSS grid with auto-rows** (`grid-auto-rows: minmax(400px, auto)`) so all cards in a row share the same height automatically.
- **Row 4 has 1 real card + 2 EMPTY frames** (`Frame 559`, `Frame 560` both 442.67×400 with no content). Zara Payne's card is the only one in row 4. **Project decision:** drop the empty cells, show 10 testimonials with row 4 having just 1 card left-aligned (editorial "trailing orphan" pattern).

**Section 8 responsive plan:**
- ≥1280: 3-col grid + 4-col stats
- 1024-1279: 3-col grid + 4-col stats
- 768-1023: 2-col grid + 2×2 stats
- 640-767: 2-col grid narrower + 2×2 stats
- <640: 1-col grid + 2×2 or stacked stats

---

### 9. Our Process — `143:2547` (y=9581.63, h=773)

**Layout:** header + 4-step process row

- Header `Frame 577` (32, 120, 1376×140):
  - Left `Container` 501×97: eyebrow "How We Work" 112×29 + **H3** "Our Process" 501×44
  - Right `Container` (700, 0, 676×140): body + "Get Started" CTA
- Process row `Frame 576` (32, 340, 1376×313): 4 step cards in a row
  - Each step card 326×233, gap 24 (350 - 326 = 24)
  - Step cards at x = 0, 350, 700, 1050 (4 × 326 + 3 × 24 = 1376 ✓ — clean math this time)
  - Internal structure per step:
    - **Frame 573 (label strip, 0, 0, 326×91):** center-aligned pill label at (variable x, 32):
      - Step 1: "Discovery" 79×27 at x=123.5
      - Step 2: "Strategy" 72×27 at x=127
      - Step 3: "Execution" 79×27 at x=123.5
      - Step 4: "Optimization" 98×27 at x=114
      - **⚠️ fractional x (123.5)** — use `justify-content: center` in code, drop the fixed offsets.
    - **Frame 579 (connector row, 0, 91, 326×36):** decorative horizontal line with central numbered circle
      - Vector 8: left line segment (0, 18, 113×0)
      - Frame 19 at (145, 0, 36×36):
        - Frame 530 at **(-16, -16, 68×68)** — overflowing its parent by 16px on all sides
          - Frame 572 (6, 6, 56×56): a 56×56 circle
            - Text "01" / "02" / "03" / "04" (H6 24px Medium) at (18, 16, 20×24)
      - Vector 7: right line segment (213, 18, 113×0)
      - **⚠️ designer gap:** the circle's parent `Frame 530` is positioned at (-16, -16) with 68×68 size, which means it **overflows** the connector row by 16px top/bottom. Implementation: render the circle with `overflow: visible` on the parent, or use absolute positioning. Otherwise the circle gets clipped.
      - **⚠️ visual confirmation needed:** need screenshot to verify the 56×56 circle vs 68×68 wrapper — is there a ring/border around the circle? Probably yes (ring pattern).
    - **Frame 574 (description, 0, 127, 326×106):** body text at (28, 32, 270×42) — 2 lines
      - Step 1: "We audit your current financial landscape and define goals."
      - Step 2: "Our team builds a bespoke roadmap tailored to your risk tolerance."
      - Step 3: "We implement the strategy with precision and handle all logistics."
      - Step 4: "Continuous monitoring and rebalancing to maximize performance."

- Section ends at y=653 (340+313). Section 773 → 120px bottom padding. OK.

**Section 9 responsive plan:**
- ≥1024: 4-col row as designed
- 768-1023: 2×2 grid
- <768: 1-col stack, connector lines become vertical (or remove connectors and keep just circles + numbers)

---

### 10. FAQ — `150:3364` (y=10354.63, h=1313)

**Layout:** header + 7-item accordion

- Header `Container` (32, 120, 501×141):
  - Eyebrow pill "FAQ" 50×29 (tiny — smallest eyebrow in the file)
  - **H3** "Answers to the questions we get" 501×88 (2 lines)
- Tabpanel `Tabpanel` (32, 325, 1376×868): **7 FAQ items** stacked
- Each item has:
  - Frame 582 (question header, 32, 24, 1312×44): question text + 44×44 chevron button at x=1268
  - Answer text at (32, 74 or 92, 501×variable) — note: answer column is **501 wide**, not 1312 (editorial narrow-column FAQ)
- Items (verified from metadata):
  1. **"What's the minimum investment to get started?"** — 92 tall, collapsed
  2. **"How are you compensated?"** — 220 tall, **EXPANDED** (shows answer: "We operate on a transparent fee-only basis: AUM-based advisory fees (0.75-1.25% annually, declining at scale) plus a one-time onboarding fee for implementation. No hidden commissions, no product kickbacks.")
  3. **"What makes your team qualified?"** — 92 tall, collapsed
  4. **"How often do we communicate?"** — 92 tall, collapsed
  5. **"Can you work with my existing accounts?"** — 92 tall, collapsed
  6. **"What's your investment philosophy?"** — 92 tall, collapsed
  7. **"How do you handle market downturns?"** — 92 tall, collapsed

**⚠️ designer gaps:**
- All 6 collapsed items have their answer content HIDDEN (`hidden="true"` in metadata) but the text content is a **placeholder** copy-pasted from another section. ALL answers except #2 need to be written fresh.
- Item 2 is the only one with a real, substantive answer — this is the designer showing "how it should look when expanded". Treat as canonical answer template: direct, specific, compliance-friendly.
- Chevron button is 44×44 but the text column ends at x=1268 (so 44 wide space for the chevron). 1268 + 44 = 1312 ✓. Clean.
- **Accordion behavior not specified:** single-open or multi-open? Default to single-open (better UX for 7 items).

**Section 10 responsive plan:**
- ≥768: as designed
- <768: question text wraps, chevron stays aligned right, answer column widens to full container (not 501)

---

### 11. Contact form — `483:531` (y=11667.63, h=748) — **INFERRED from visual**

**Confidence:** MEDIUM-HIGH. Symbol instance, but the compressed Home screenshot clearly shows a **dark section with form fields** just before the footer. This is the "Send us a message" / "Schedule a call" contact form — a standard pattern for B2B wealth management.

**Likely structure** (height 748 is generous — fits a full form layout):
- Full-bleed dark background (`#212121` — same as footer, creating a dark-block rhythm with the footer below)
- Container 1376 wide centered
- **Left column** (~501 wide): eyebrow "Contact" + H2 headline like "Send us a message" + short paragraph + maybe a secondary CTA "Book a call" button
- **Right column** (~676 wide): form with fields:
  - Name (full width)
  - Email (full width)
  - Phone (full width, optional)
  - Message (full width, textarea, 4-6 rows)
  - Submit button (accent orange `#FF512A` primary, "Send message" label)
- Optional: consent checkbox for compliance ("I agree to the privacy policy")

**Engineering approach:**
- Build as `ContactSection` component with a `ContactForm` primitive
- Form validation with `zod` + `react-hook-form` (industry standard, no heavy UI library needed)
- Submit handler: default to Next.js server action logging to console with a TODO flag — real backend integration is the Webflow developer's scope
- Inputs use the inverted color scheme: `bg-white/5`, `border-white/15`, `text-white`, `placeholder-white/40`, `focus:ring-accent`
- Labels above inputs, 12px uppercase eyebrow style

**⚠️ designer gap:** exact form fields not extracted. Implementation uses a reasonable default set (name, email, phone, message). Flag in `HANDOFF.md` for client to confirm fields + required consent checkbox for SEC compliance.

**Section 11 responsive plan:**
- ≥1024: 2-col (headline left, form right)
- 768-1023: stacked (headline above form)
- <768: stacked, inputs full-width, extra vertical gap between form groups

---

### 12. Footer — `483:269` (y=12415.63, h=496) — **CONFIRMED from Style Guide screenshot**

**Confidence:** HIGH. The Style Guide screenshot clearly shows the footer (it's rendered at the bottom of the Style Guide page too — same footer symbol instance).

**Layout:** dark block, 1440×496 (matches sections above), full-bleed `#212121` background.

**Structure** (left to right, top to bottom):
- **Logo block** (left column):
  - Logo "Template ~ Design" — word mark with wavy tilde glyph, Serif Medium, H5-ish sizing (~28px)
  - Positioning tagline immediately below: "**Strategic wealth management for investors who value clarity over complexity. Fiduciary-first approach, transparent execution, results that matter.**" — Body 16px, `text-white/70`, ~400px wide
- **Sitemap** (right column, stacked vertical list):
  - About
  - Services
  - Case Studies
  - Contact
  - Style Guide
  - Each: Body 16px, `text-white/80`, right-aligned, 12-16px vertical gap
- **Decorative dot row** (middle/bottom area): horizontal row of small circles (~6-8 dots, 12×12) with **one dot in accent orange `#FF512A`** and the rest in `white/20` — visual rhythm element, purely decorative
- **Divider line** (full-width, 1px, `white/10`) separating main block from legal row
- **Social icons row** (left, 4 icons ~20×20): LinkedIn, WhatsApp, Instagram, Facebook — confirm with client, flag in `HANDOFF.md`
- **Legal row** (bottom, 2 columns):
  - Left small print: "We operate under SEC fiduciary standards. All recommendations prioritize **our** interests. Securities offered through our partner." — Small 14px `text-white/50`
  - Right small print: "© 2026. Made by Webflow" — Small 14px `text-white/50`, right-aligned

**🔴 CRITICAL compliance bug in existing footer copy:** "All recommendations prioritize **our** interests" is a **legal disaster** — it literally says the firm prioritizes its OWN interests over the client's, the opposite of a fiduciary standard. **Project decision:** fix to "All recommendations prioritize **your** interests." — noted in `HANDOFF.md` as **must-fix before any publish**.

**⚠️ "Made by Webflow" credit** — standard Webflow free-plan footer stamp. **Project decision:** replace with "© 2026. Made by 3mpq studio." on real build.

**Engineering approach:** `FooterEditorial` component, 4-area grid layout (logo+tagline / sitemap / socials / legal), full-bleed dark background. Decorative dot row is a small scroll-reveal that shifts the accent dot on hover.

**Section 12 responsive plan:**
- ≥1024: 2-col (logo+tagline left, sitemap right), socials+legal bottom
- 768-1023: same 2-col
- <768: stacked — logo block, sitemap, socials, legal — each full-width, 32px vertical gaps

---

### 0. Header / Nav — `297:5170` (y=0, h=89) — **CONFIRMED from Style Guide screenshot**

**Confidence:** HIGH. Clearly visible in the Style Guide screenshot.

**Layout:** 1440×89, horizontal bar, padding ~24px horizontal and ~20px vertical (content box ~49px tall centered).

**Structure:**
- **Logo (left)** at ~32px from left edge:
  - Word mark "Template ~ Design"
  - "Template" in IBM Plex Serif Medium
  - Tilde "~" is a **custom wavy glyph** — a small sine-wave shape tucked between the two words
  - "Design" in Plex Serif Medium
  - Overall size ~16-18px compact logo
- **Nav (right)** — horizontal list:
  - Items: **About**, **Services**, **Case Studies**, **Contact**, **More**
  - Each: 14-16px IBM Plex Sans Medium, `text-[#212121]`, `hover:text-accent`
  - Item spacing: ~32px gap
  - "More" has an implicit dropdown (confirm — likely a mega-menu with Style Guide and other secondary pages)
- **CTA button (far right, after nav):**
  - Label "**Schedule call**"
  - Shape: rounded pill, dark fill `#212121`, white text, height ~36-40px, padding ~16-24px horizontal
  - Dropdown chevron ▾ on the right of the button (indicates it might open a scheduling widget like Cal.com / Calendly)

**Background:** transparent over the cream page (`#F8F7F1`). Becomes **solid + backdrop-blur on scroll** — standard sticky-nav pattern from the Awwwards 2024-2026 research base.

**Scroll behavior** (engineering spec):
- At scroll-top: transparent background, no border
- After 40px scroll: `background: rgba(248, 247, 241, 0.85)`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid var(--color-border)`, subtle `box-shadow: 0 1px 24px rgba(0,0,0,0.04)`
- Transitions use `duration-200 ease-out` (our standard)

**⚠️ designer gap:** no mobile burger menu designed. Implementation must add one:
- <768 viewport: nav items hidden, 40×40 burger icon (3 horizontal lines) on right, "Schedule call" button stays visible (smaller variant)
- Burger tap → full-screen overlay with large serif menu items (32px, vertical list) + social/contact block at bottom

**Engineering approach:**
- Component: `NavSticky` (from the kit roadmap — build here first, promote to `ui-kit/components/nav/NavSticky.tsx`)
- Props: `{ logo, links, cta, onCtaClick }`
- Uses Framer Motion `useScroll` for scroll-linked background change
- Lenis-compatible (no direct scrollTop listening)

**Section 0 responsive plan:**
- ≥1024: horizontal nav as designed
- 768-1023: horizontal nav but tighter (reduce gap to 24px, maybe drop "More" into a burger)
- <768: burger + compact CTA button, full-screen overlay menu

---

## Consolidated designer gap list (to fix in code)

### 🔴 Critical (break the page)
1. **Fractional y-positions** cascading from y=7088 down (`9581.6298828125`, `10354.6298828125`, `11667.6298828125`, `12415.6298828125`). Snap to 8px grid in implementation.
2. **Section 8 eyebrow says "Services"** but content is testimonials. Fix to "Testimonials".
3. **All testimonial cards fixed at 400 height** but quote lengths vary 48 → 227. Fix: `min-height: 400`, author block anchored to bottom via `margin-top: auto`.
4. **Hero avatar stack** has wrong z-order at DOM level. Add explicit `z-index` so leftmost avatar is on top.
5. **Hero carousel has one slide** with a "next" arrow. Either add slides or drop the arrow.
6. **Section 9 circles overflow** their parent by 16px (`Frame 530` at -16,-16). Set `overflow: visible` or use absolute positioning.

### 🟠 Major (look wrong if ignored)
7. **Inconsistent column gutters** between sections (199 in hero, 231 in about). Pick one: 200.
8. **Fractional widths** in 5-col stats (275.2), 3-col testimonials (442.67). Use CSS grid, drop pixel math.
9. **Fractional x positions** for pill labels in Section 9 (123.5, 127, 114). Use `justify-content: center`.
10. **Eyebrow "Services" on Section 5** AND on Section 8 — same label used twice for different content. Rename one.
11. **Fractional heights** on stars (11.63 instead of 12). Round to 12.
12. **Hero eyebrow "Webflow Template"** — literal Webflow placeholder text. Replace.
13. **Hero primary CTA "Get Template"** — Webflow placeholder. Replace with "Schedule call".
14. **Typo "yours capital"** in hero carousel card. Fix to "your capital".

### 🟡 Minor (copy/content)
15. **All 10 testimonial authors are "Co-Founder @ Company"** — replace with real roles.
16. **6 of 7 FAQ answers are placeholder copy.** Write real answers.
17. **Long-form About paragraph (Section 2 right column)** is lifted from `forfuture.webflow.io`. Replace.
18. **"12% average annual returns" stat** needs SEC-compliant fine print (backtest vs. actual, time period, methodology). Flag in `HANDOFF.md`.
19. **Only two markers** in the hero journey indicator — add a third or rework the pattern.

---

## Responsive plan — consolidated

### Breakpoints
| Tier | Range | Container | Type scale | Notes |
|---|---|---|---|---|
| XL | ≥1600 | max-width 1600, px-12 | Same as 1440 | Nothing grows; backgrounds full-bleed |
| L | 1280-1599 | max-width 1376, px-8 | Same as 1440 | Pixel-perfect to Figma |
| M | 1024-1279 | px-8 | Same sizes | 2-col layouts keep, minor padding shrink |
| S | 768-1023 | px-6 | H0 → clamp(48, 7vw, 72), other scale | 2-col → 1-col for most sections; 2×2 for 3+ col grids |
| XS | 480-767 | px-5 | H0 → clamp(40, 9vw, 56) | Burger nav, all 1-col, hero image below text |
| XXS | <480 | px-4 | H0 → 40 | Minimal padding |

### Section-by-section breakpoint behavior
| Section | Desktop | Tablet (768) | Mobile (480) |
|---|---|---|---|
| Header | horizontal nav | burger | burger |
| 1. Hero | 2-col + image right | stack, image full-bleed above/below text | same |
| 2. About | 2-col paragraphs | stacked | stacked |
| 3. Approach | 2-col header + 5-col stats | stacked header + 3-col stats | stacked + 2-col stats |
| 4. (pending) | — | — | — |
| 5. Services list | 4 rows full-width | same (rows shorter) | row internal stacks |
| 6. Case Studies | 2×3 grid | 2×3 narrower | 1×6 |
| 7. (pending) | — | — | — |
| 8. Testimonials | 3-col × 4-row + 4-col stats | 2-col grid + 2×2 stats | 1-col + 2×2 stats |
| 9. Our Process | 4-col steps | 2×2 | 1×4 vertical timeline |
| 10. FAQ | full-width questions + narrow answer col | same | full-width questions + full-width answers |
| 11. CTA | (pending) | — | — |
| 12. Footer | (pending) | — | — |

---

## Decisions taken (see DECISIONS.md for full rationale)

All 5 open questions from the previous pass have been answered:

1. **Remaining symbols** (Header, Section 4, Section 7, CTA, Footer) — described from visual + structural inference. HIGH confidence on Header and Footer (Style Guide screenshot is explicit). MEDIUM confidence on Section 4 (services showcase), Section 7 (mid-page banner), Section 11 (contact form). Each section in this file is marked with its confidence level. Figma MCP hit the Starter-plan rate limit mid-session, so further drill-down is not available today.
2. **Placeholder copy strategy:** hybrid. Only obvious Webflow-template artifacts fixed in-place ("Webflow Template" → "Wealth Advisory", "Get Template" → "Schedule call", "yours capital" → "your capital", Section 8 eyebrow "Services" → "Testimonials", footer "our interests" → "your interests"). Rest of the copy is kept and flagged for client rewrite in `HANDOFF.md`.
3. **"12% returns" stat:** replaced with **"400+ Families served"** — compliance-neutral, matches the firm's own "over 400 families and institutions" copy from the About section.
4. **Hero journey indicator:** kept the 2 markers ("Our Solution" → "Increase Royalty"), framed as intentional "from → to" decorative pattern.
5. **Accent color:** `#FF512A` confirmed from Figma Style Guide variable.

---

## Next actions (for the coding session)

1. Scaffold Next.js 15 App Router at `projects/template-design/src/`.
2. Install deps: `next react react-dom typescript tailwindcss@^4 framer-motion@^12 lenis clsx tailwind-merge zod react-hook-form`.
3. Create `app/globals.css` that imports the kit tokens and then this project's `tokens.css` override.
4. Load IBM Plex Sans + Serif via `next/font/google`.
5. Wire Lenis in `app/layout.tsx` (see Awwwards research for the known Framer Motion + Lenis gotcha).
6. Import `Inspector` from `../../../ui-kit/components/devtools/Inspector` behind `process.env.NODE_ENV === "development"`.
7. Build sections in page order: 0 (NavSticky) → 1 (Hero) → 2 (About) → 3 (OurApproach) → 4 (ServicesShowcase) → 5 (ServicesList) → 6 (CaseStudies) → 7 (MidpageBanner) → 8 (Testimonials+Stats) → 9 (Process) → 10 (FAQ) → 11 (Contact) → 12 (Footer).
8. Each component carries `data-component` / `data-source` / `data-tokens` attributes for Inspector.
9. After each section: update `COMPONENTS.md`, append to `CHANGELOG.md`, add Webflow handoff notes to `HANDOFF.md`, promote reusable work to `~/Aisoldier/ui-kit/components/`.
10. All extracted copy, testimonial data, stats, FAQ questions, and process steps are already in `content/*.json` — just `import` them.
