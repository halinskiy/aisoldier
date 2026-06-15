# LEARNINGS — how NOT to do it

Owned by 3mpq-archivist. Every agent reads this BEFORE a build; the
dispatcher/director pass the relevant items into the brief. Format:
**NEVER X. DO Y. WHY. (caught: when/by whom.)** Keep it flat, ASCII, short.
When a lesson recurs, escalate it to a lint rule or a doctrine line.

## Type
- NEVER use IBM Plex on tools/dashboards. DO use Montserrat (headings) +
  Manrope (body). WHY: user finds IBM Plex hard to read. (caught: 2026-06-15, user.)
- NEVER ship many font sizes (9 sizes) or any text below 16px. DO use ~3-4
  sizes, all >=16px, display big. WHY: amateur + unreadable. (user.)
- NEVER guess font roles. DO verify the pairing (which face is heading vs
  body) via the researcher before use. (user.)

## Animation
- NEVER loop an animation forever. DO animate appearance ONCE, then rest
  (live indicators excepted). WHY: constant motion is annoying. (user.)
- NEVER use flat fades or cheap bounces. DO use AirBnB-style smooth morphs
  with soft spring easing, creative and choreographed. WHY: the studio
  standard is AirBnB motion. (user, STRICT.)

## Layout
- NEVER let repeated siblings (cards/nodes/cells/rows) differ in size. DO
  make them identical width AND height regardless of content. WHY: uneven
  siblings read amateur; symmetry is non-negotiable. (user.)
- NEVER float a wide element at half-width in the middle. DO make it
  full-width on the same Swiss grid as everything else. (user.)
- DO lay the Swiss grid on the FIRST prompt and show it as a faint
  toggleable overlay (default on first prompt, off after). (user.)

## Copy / content
- NEVER use em/en dashes, bullets, middle dots, curly quotes, AI
  buzzwords, or legal/literary varnish in human-facing text. DO write
  plain, simple, human prose. (user, standing rule.)

## Minimalism
- NEVER add an eyebrow / kicker / brand label above a heading. It is a
  caption; banned. (caught: 2026-06-15, user.)
- NEVER add captions, helper text, or content the flow does not need. DO
  ship the minimum: section = heading (+ optional subheading), content
  terse and uniform. (user.)
- NEVER keep a section the user did not ask for. DO remove on request
  without argument ("убери" means remove it). (user.)

## Process
- NEVER claim a visual result is done without seeing it. DO verify with a
  Chrome headless screenshot (Playwright MCP is unreliable some sessions):
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
  --virtual-time-budget=2500 --screenshot=... <url>`. (caught: flying
  blind produced a 1/10 result, 2026-06-15.)
- NEVER use the 3MPQ design system loosely. DO pull colors/spacing/radii/
  type from the 3MPQ tokens (`ui-kit/TOKENS.md` / `REGISTRY.json`), or
  mirror them on standalone surfaces. (user.)
