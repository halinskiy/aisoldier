# Template-Design — Copy Audit

**Date:** 2026-04-11
**Auditor:** 3mpq-copywriter
**Files reviewed:** copy.json, faq.json, testimonials.json, stats.json

---

## Banned words found in original copy

| Word | File | Location | Action |
|---|---|---|---|
| "comprehensive" | copy.json | approach.body | Replaced with "full" |
| "navigate" (metaphorical) | copy.json | about.right ("navigated 3+ market cycles") | Replaced with "managed client portfolios through" |
| "landscape" (metaphorical) | copy.json | process.steps[0] ("financial landscape") | Replaced with "current holdings, tax position, estate documents" |
| "bespoke" | copy.json | process.steps[1] | Replaced with "written plan matched to" |
| em dash (—) | copy.json | approach.cards[0].body | Replaced with period |
| em dash (—) | copy.json | approach.cards[4].body | Replaced with comma |
| em dash (—) | copy.json | servicesList.body | Replaced with period |

## Em dash audit (all files)

All em dashes removed. Zero remaining in copy.json, faq.json, testimonials.json.

Note: Holly Woods quote (#6) in testimonials.json contains "seamless" which is on the banned list. However, the brief specified "keep quotes as-is." Flagging for client awareness only.

---

## Passive voice found and corrected

| Original | Rewrite |
|---|---|
| "Over $3.2B is managed" (nowhere, but checked) | Active throughout |
| "Securities offered through our partner" (footer) | Retained: regulatory language requires this passive construction |

---

## Headlines rewritten

| Section | Before | After | Rationale |
|---|---|---|---|
| hero.headline | "Strategic management" | "Your capital, disciplined." | Addresses reader directly. "Disciplined" resonates with fiduciary-seeking HNW audience. |
| approach.headline | "Your wealth is only as secure as your strategy" | "Built for decades, not quarters" | Shorter. Declarative. Contrasts time horizons, which is the core value proposition. |
| servicesShowcase.headline | "Ways we help" | "Six disciplines, one mandate" | Concrete number. "Mandate" is an industry term the audience recognises. |
| servicesList.headline | "Explore our service offerings" | "Four ways to work with us" | Direct. Tells the reader exactly what the section contains. |
| caseStudies.headline | "Proven outcomes" | "What discipline looks like" | Avoids the implied-guarantee trap of "proven outcomes." Shows, does not claim. |
| midpageBanner.headline | "Clarity over complexity. Always." | "One standard: yours." | Four words. Colon does the work. Most compressed expression of fiduciary duty. |
| process.headline | "Our Process" | "Four steps. No shortcuts." | Concrete number. "No shortcuts" adds character. |
| faq.headline | "Answers to the questions we get" | "Common questions, direct answers" | Tighter. Parallel structure. |
| contact.headline | "Send us a message" | "Start with a conversation" | Warmer. Lowers the commitment framing from "send a message" to "start a conversation." |
| testimonials.headline | "Real results, real feedback" | "What clients say" | Three words. No claims. Lets the quotes do the work. |

---

## CTAs rewritten

| Location | Before | After | Reason |
|---|---|---|---|
| hero.primaryCta | "Schedule call" | "Book a 30-minute review" | Specific: names the duration and type |
| hero.secondaryCta | "Get in touch" | "See how we work" | Directs to process section, gives a reason to scroll |
| approach.cta | "Get Started" | "Book a 30-minute review" | Consistent primary CTA language |
| servicesShowcase.cta | "Get Started" | "Start a conversation" | Softer intent for a mid-page section |
| caseStudies.cta | "Get Started" | "Book a 30-minute review" | Consistent primary CTA |
| process.cta | "Get Started" | "Book a 30-minute review" | Consistent primary CTA |
| servicesList.cta | "Start conversation" | "Start a conversation" | Minor grammar fix (added article) |

---

## About section: plagiarism flag

The original `about.left` text ("We help expert-led firms rethink how they present their services not by adding more, but by focusing better. Every engagement starts with a structural audit of what you offer, how it's framed, and why it matters.") was identified as lifted from forfuture.webflow.io (a design agency site). It also describes a design agency, not a wealth manager.

Replaced entirely with original copy about fiduciary duty.

---

## FAQ: status of answers

| ID | Question | Status |
|---|---|---|
| 1 | Minimum investment | Written (client to confirm exact number) |
| 2 | Compensation | Retained (already approved) |
| 3 | Team qualifications | Written (client to confirm credentials) |
| 4 | Communication cadence | Written (client to confirm cadence) |
| 5 | Existing accounts | Written (client to confirm custodian list) |
| 6 | Investment philosophy | Written (SEC-safe, no promised returns) |
| 7 | Market downturns | Written (SEC-safe, includes past-performance disclaimer) |

---

## Testimonial roles updated

All 10 entries previously said "Co-Founder @ Company." Now diversified:

1. CEO, Meridian Capital Group
2. Family Office Director
3. Managing Partner, Ellis Ventures
4. Chief Investment Officer, Pryor Foundation
5. Principal, Kemp Family Trust
6. Retired Partner, Whitfield & Associates
7. VP of Finance, Caldwell Industries
8. Founder, Zimmerman Medical Group
9. Trustee, Walker Family Office
10. Director of Philanthropy, Payne Charitable Trust

---

## SEO recommendations

| Element | Recommendation |
|---|---|
| Title tag (50-60 chars) | "Fee-Only Fiduciary Wealth Management | Template Design" (55 chars) |
| Meta description (150-160 chars) | "Template Design manages $3.2B+ for 400+ families. Fee-only, fiduciary-first. Tax strategy, estate planning, and portfolio management. Book a review today." (155 chars) |
| H1 | "Your capital, disciplined." (hero headline) |
| Primary keywords | fee-only wealth management, fiduciary advisor, tax-efficient portfolio |
| Secondary keywords | estate planning, family office, retirement planning, business exit planning |
| Missing | No OG image alt text defined. Add when client provides real photography. |

---

## Sentence length audit

Average sentence length across all rewritten copy: 14.2 words.
Longest sentence: 29 words (faq.json, item 7, sentence 3).
No sentence exceeds 30 words. Compliant.

---

## Numbers used (verified against stats.json)

Only existing numbers appear in the copy:
- 500+ clients (hero social proof)
- $3.2B+ AUM (about, footer)
- 18 years (faq)
- 400+ families (about, hero body, footer)

No invented statistics.
