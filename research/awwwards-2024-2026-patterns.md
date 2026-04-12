# Awwwards 2024–2026 Creative Landing Pattern Catalog

Reference for a Claude Code agent that builds B2B creative landings in **React/Next.js + Tailwind + Framer Motion**, then hands off to a Webflow developer.

Aesthetic baseline the agent must respect:
- IBM Plex Serif (headings) + IBM Plex Sans (body), editorial tone
- Single accent color per project (e.g. IBM Blue `#0f62fe`), monochromatic otherwise
- Borders everywhere, shadows only in light theme
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast-in, gentle-out, **no overshoot**
- Light theme default; dark optional

---

## 1. Executive Summary — 10 Dominant 2024–2026 Trends

1. **Editorial serif + dense small-caps labels.** Oversized serif headlines (IBM Plex Serif, GT Sectra, Editorial New) paired with tiny uppercase sans labels (`text-[11px] tracking-[0.14em] uppercase`). Used by Linear, Vercel, Stripe, Rauno, 3mpq studio.
2. **Monochrome base + a single saturated accent.** White/off-white or near-black canvases, one signature hue for CTAs, underlines, focus rings. Lando Norris won SOTY 2025 on pure lime on black.
3. **Scroll-linked sticky hero compression.** Huge hero text shrinks and pins to a corner while the background transitions on scroll. Linear, Arc, Stripe Sessions, Igloo Inc.
4. **Bento grids for feature sections.** 67% of top SaaS landings now use them. Asymmetric modular cards with 12–24px gaps, 6–12 blocks max.
5. **Infinite marquee loop zones** as connective tissue between sections — logo strips, testimonials, giant word loops. Often speed-linked to scroll direction.
6. **Grain/noise overlays via SVG `feTurbulence` + `mix-blend-mode: overlay`** for film-texture warmth on otherwise flat monochrome.
7. **Split-text reveals on scroll** (word-by-word or line-by-line) with blur-in or y-translate. Driven by `whileInView` + variants, or GSAP SplitText.
8. **Cursor-follow and magnetic interactions.** Custom cursor with `mix-blend-mode: difference`, magnetic CTA buttons that lerp toward pointer.
9. **WebGL/3D heroes** (R3F + drei) — Igloo Inc won SOTY 2024 on this, Lando Norris won SOTY 2025 using WebGL helmet + Rive motion design.
10. **Lenis smooth scroll is table stakes.** Nearly every Awwwards-grade site in 2025–2026 uses Lenis (or Studio Freight Hamo) for inertial scroll, then layers Framer Motion `useScroll` on top.

---

## 2. Studied Sites (reference pool)

| Site | Why it matters |
|---|---|
| landonorris.com | Awwwards SOTY 2025. Lime accent on black, WebGL helmet, Rive motion, cinematic scroll. Agency OFF+BRAND. |
| igloo.inc | Awwwards SOTY 2024. Immersive 3D + legible scroll interactions. Agency Abeto. |
| bruno-simon.com | Sept 2025 portfolio. Full drivable 3D world (R3F + physics). Awwwards SOTM Jan 2026. |
| messenger.com (2025 redesign) | Near-perfect Awwwards score — interaction as play. |
| linear.app | Gradient shimmer loops, sticky header opacity shift, randomized team grid, issue tracker product shots in bento. |
| arc.net / thebrowser.company | Scroll-pinned hero compression; oversized serif with tight leading. |
| vercel.com + Vercel Ship | Grain overlay, grid backgrounds, scroll-linked product reveals, OG image factory. |
| stripe.com, stripe.com/sessions | Animated gradient hero, IntersectionObserver-driven section reveals, sticky talk cards, photo-pair stickiness. |
| rauno.me / devouringdetails.com | Blur-reveal on scroll (origin of the pattern). Staff design engineer at Vercel. |
| raycast.com | Editorial feature grid, command-palette visual motif. |
| cursor.com | Minimal mono + accent, video bg with grain, scroll-pinned feature cards. |
| perplexity.ai | Light editorial serif hero, subtle gradient mesh. |
| framer.com | Heavy use of marquee strips, scroll-pinned mockups, bento feature grids. |
| basement.studio | Cursor-driven sheen, mix-blend cursor, magnetic CTAs, marquee loops. |
| active-theory.com, resn.co.nz, immersive-g.com | WebGL reference set. |
| studiofreight.com (Hamo, Lenis, Tempus authors) | Reference implementation of Lenis + R3F. |
| unseen.studio | Editorial asymmetric layouts, serif hero, horizontal scroll galleries. |
| locomotive.ca | Origin of Locomotive Scroll; sticky pinned sections. |
| halinskiy.github.io/3mpq-studio | The user's own studio. Dark desktop-metaphor, macOS windows, editorial tone. |

---

## 3. Pattern Catalog (30+)

### HERO PATTERNS

---

**PATTERN: Scroll-pinned hero compression**
WHERE SEEN: linear.app, arc.net, stripe.com/sessions, igloo.inc
VISUAL: Hero text starts huge centered (`text-[clamp(64px,12vw,180px)]`), on scroll it scales down, fades, and pins to a corner while bg image/video reveals beneath.
CODE APPROACH:
```tsx
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.32])
const y = useTransform(scrollYProgress, [0, 1], [0, -120])
const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.4])

<section ref={ref} className="relative h-[200vh]">
  <div className="sticky top-0 h-screen flex items-center justify-center">
    <motion.h1 style={{ scale, y, opacity }} className="font-serif text-[12vw] leading-[0.9]">
      Headline
    </motion.h1>
  </div>
</section>
```
KEY TOKENS: easing `[0.16,1,0.3,1]`, `origin-top`, `will-change-transform`
WEBFLOW: native IX2 scroll-triggered animation inside a 200vh section with sticky child. **Yes, native.**

---

**PATTERN: Oversized serif + small-caps eyebrow**
WHERE SEEN: rauno.me, vercel.com, cursor.com, perplexity.ai
VISUAL: Tiny uppercase sans label (`01 / Manifesto`) above a 10–14vw serif headline with tight leading.
CODE:
```tsx
<div className="max-w-[18ch]">
  <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-neutral-500 mb-6">
    01 — Manifesto
  </p>
  <h1 className="font-serif text-[clamp(56px,10vw,160px)] leading-[0.92] tracking-[-0.02em]">
    Build quieter software.
  </h1>
</div>
```
TOKENS: `tracking-[0.14em]`, `leading-[0.92]`, `tracking-[-0.02em]` on headline.
WEBFLOW: **Native.** Fully static.

---

**PATTERN: Split-text word-by-word reveal on scroll**
WHERE SEEN: linear.app, stripe.com, rauno.me, basement.studio
VISUAL: Headline words rise from below the baseline with a stagger, clip-mask so they appear to emerge from under a line.
CODE:
```tsx
const words = "We build quiet tools for loud teams".split(' ')
const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.06 } },
}
const word = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16,1,0.3,1] } },
}

<motion.h2 variants={container} initial="hidden" whileInView="visible"
  viewport={{ once: true, amount: 0.6 }}
  className="font-serif text-6xl leading-[1] flex flex-wrap gap-x-3">
  {words.map((w,i) => (
    <span key={i} className="overflow-hidden inline-block">
      <motion.span variants={word} className="inline-block">{w}</motion.span>
    </span>
  ))}
</motion.h2>
```
TOOLS: framer-motion variants. Alternative: GSAP SplitText + ScrollTrigger.
WEBFLOW: **Custom embed.** IX2 can do per-element stagger but splitting the text requires a script or manual span wrapping.

---

**PATTERN: Blur-reveal on scroll (Rauno blur)**
WHERE SEEN: rauno.me, devouringdetails.com, vercel.com
VISUAL: Element enters viewport at `filter: blur(12px) opacity(0)`, settles to clear.
CODE:
```tsx
<motion.div
  initial={{ filter: 'blur(14px)', opacity: 0, y: 24 }}
  whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
/>
```
WEBFLOW: **Custom code.** IX2 does not animate `filter: blur` reliably cross-browser.

---

**PATTERN: Video/Canvas hero with grain overlay**
WHERE SEEN: cursor.com, vercel.com, framer.com, basement.studio
VISUAL: Full-bleed muted autoplay video/canvas with SVG noise `feTurbulence` layer multiplied on top.
CODE:
```tsx
<div className="relative h-screen overflow-hidden">
  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"/>
  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.22]"
       style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }}/>
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"/>
</div>
```
WEBFLOW: **Native.** Background video element + overlay div.

---

### SCROLL PATTERNS

---

**PATTERN: Horizontal pinned scroll section**
WHERE SEEN: stripe.com/sessions, framer.com, locomotive.ca
VISUAL: Vertical scroll is translated into horizontal movement of a wide inner track while the parent stays pinned. 3–5 panels glide sideways.
CODE (Framer Motion):
```tsx
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({ target: ref })
const x = useTransform(scrollYProgress, [0,1], ['0%','-75%'])

<section ref={ref} className="relative h-[400vh]">
  <div className="sticky top-0 h-screen overflow-hidden flex items-center">
    <motion.div style={{ x }} className="flex gap-8 pl-[10vw]">
      {panels.map(p => <Panel key={p.id} {...p} className="w-[80vw] shrink-0"/>)}
    </motion.div>
  </div>
</section>
```
GSAP alternative: `ScrollTrigger` with `pin: true, scrub: 1, end: () => '+=' + wrapper.offsetWidth`.
WEBFLOW: **Custom code.** Webflow has a horizontal-scroll IX2 preset but breaks with complex panels; in practice Webflow devs use Finsweet attributes or GSAP embed.

---

**PATTERN: Stacking sticky cards (deck reveal)**
WHERE SEEN: apple.com product pages, vercel.com, framer.com
VISUAL: Cards stack on top of each other as you scroll — each card sticks at `top-24`, next one slides over it with scale-down.
CODE:
```tsx
{cards.map((c, i) => (
  <div key={i} className="sticky top-24 h-[70vh]" style={{ top: `${24 + i*16}px` }}>
    <motion.div style={{ scale: useTransform(progress, [i/n, (i+1)/n], [1, 0.92]) }}>
      <Card {...c}/>
    </motion.div>
  </div>
))}
```
Olivier Larose's "cards-parallax" tutorial is the canonical React implementation.
WEBFLOW: **Custom embed.** IX2 sticky + transform per card is achievable but error-prone.

---

**PATTERN: Parallax depth layers**
WHERE SEEN: stripe.com, linear.app, igloo.inc
VISUAL: Background, midground, foreground move at 0.3x / 0.6x / 1x scroll.
CODE:
```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end','end start'] })
const bgY = useTransform(scrollYProgress, [0,1], ['0%','30%'])
const midY = useTransform(scrollYProgress, [0,1], ['0%','15%'])
```
WEBFLOW: **Native IX2** — this is its canonical use case.

---

**PATTERN: Scroll-driven SVG path draw**
WHERE SEEN: stripe.com/connect, linear.app "magic" section
VISUAL: An SVG line/path draws itself as user scrolls, connecting feature blocks.
CODE:
```tsx
const { scrollYProgress } = useScroll({ target: ref })
const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

<motion.path d="M0,0 C100,120 200,80 400,200" stroke="currentColor" fill="none"
  style={{ pathLength }} strokeWidth={1.5}/>
```
WEBFLOW: **Custom code.** IX2 cannot do `stroke-dasharray` animation natively.

---

**PATTERN: Scroll-hijack full-page storytelling**
WHERE SEEN: active-theory.com, resn.co.nz, apple.com/mac-pro
VISUAL: Every scroll unit advances a "slide" in a pinned scene. Often combined with R3F.
TOOLS: `lenis` + `framer-motion` scroll, or GSAP ScrollTrigger with `snap`.
WEBFLOW: **Not realistically.** Requires custom JS.

---

### NAVIGATION PATTERNS

---

**PATTERN: Sticky header with scroll-triggered compression**
WHERE SEEN: linear.app, vercel.com, framer.com
VISUAL: Header starts tall and transparent, at ~60px scroll becomes compact with 85% opacity backdrop blur border.
CODE:
```tsx
const { scrollY } = useScroll()
const [compact, setCompact] = useState(false)
useMotionValueEvent(scrollY, 'change', (y) => setCompact(y > 60))

<motion.header animate={compact ? 'compact':'full'}
  variants={{
    full: { paddingBlock: 20, backgroundColor: 'rgba(255,255,255,0)', borderBottomColor: 'transparent' },
    compact: { paddingBlock: 10, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottomColor: 'rgba(0,0,0,0.08)' },
  }}
  transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
  className="fixed top-0 inset-x-0 z-50 border-b"/>
```
WEBFLOW: **Native IX2.**

---

**PATTERN: Magnetic button**
WHERE SEEN: basement.studio, studio-freight.com, most Awwwards portfolios
VISUAL: Button lerps toward pointer while hovered within a radius, snaps back on leave.
CODE:
```tsx
function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 })
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width/2) * strength)
        y.set((e.clientY - r.top - r.height/2) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.div>
  )
}
```
WEBFLOW: **Custom code.** No native magnetic interaction.

---

**PATTERN: Mix-blend-mode custom cursor**
WHERE SEEN: basement.studio, unseen.studio, active-theory.com
VISUAL: Circle 24–40px, `mix-blend-mode: difference`, lerped via spring, scales 2x on hoverable elements.
CODE:
```tsx
const mx = useMotionValue(0); const my = useMotionValue(0)
const x = useSpring(mx, { damping: 20, stiffness: 300, mass: 0.3 })
const y = useSpring(my, { damping: 20, stiffness: 300, mass: 0.3 })
useEffect(() => {
  const fn = (e: MouseEvent) => { mx.set(e.clientX-16); my.set(e.clientY-16) }
  window.addEventListener('mousemove', fn); return () => window.removeEventListener('mousemove', fn)
}, [])

<motion.div style={{ x, y }} className="fixed top-0 left-0 w-8 h-8 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]"/>
```
Remember to hide OS cursor: `body { cursor: none }` on desktop only (use media query).
WEBFLOW: **Custom code.**

---

**PATTERN: Hover-reveal underlines**
WHERE SEEN: rauno.me, vercel.com, linear.app
VISUAL: Link text gets an underline that wipes from left to right on hover.
CODE:
```tsx
<a className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100">
  Read more
</a>
```
WEBFLOW: **Native.** Pure CSS.

---

### MARQUEES & LOOPS

---

**PATTERN: Infinite horizontal marquee**
WHERE SEEN: framer.com, linear.app, stripe.com, basement.studio
VISUAL: Logo strip or giant word loop that slides continuously. Edge masks fade to bg.
CODE (Tailwind + CSS keyframes):
```tsx
// tailwind.config: keyframes: { marquee: { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} } }, animation: { marquee: 'marquee 40s linear infinite' }
<div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
  <div className="flex w-max animate-marquee gap-16">
    {[...logos, ...logos].map((l,i) => <img key={i} src={l.src} className="h-8"/>)}
  </div>
</div>
```
Alternative: `react-fast-marquee`, `MagicUI Marquee`.
WEBFLOW: **Custom embed** (Webflow has marquee add-ons but core CSS animation requires custom code).

---

**PATTERN: Scroll-velocity linked marquee (reverse on scroll up)**
WHERE SEEN: studiofreight.com, basement.studio
VISUAL: Marquee speed is tied to `useVelocity(scrollY)`, reverses direction when scrolling up.
CODE:
```tsx
const { scrollY } = useScroll()
const velocity = useVelocity(scrollY)
const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 })
const skewed = useTransform(smoothVelocity, [-1000, 0, 1000], [-4, 0, 4])
const baseX = useMotionValue(0)
useAnimationFrame((t, delta) => {
  const moveBy = -50 * (delta/1000) + smoothVelocity.get() * 0.01 * (delta/1000)
  baseX.set(baseX.get() + moveBy)
})
```
WEBFLOW: **Not realistically.**

---

**PATTERN: Giant word loop (kinetic type section)**
WHERE SEEN: unseen.studio, 3mpq-studio, basement.studio
VISUAL: Full-width giant serif word repeated, slowly scrolling across the viewport. Used as a break between sections.
CODE: Same as marquee but with `text-[20vw] font-serif leading-none whitespace-nowrap`.
WEBFLOW: **Custom embed.**

---

### TRANSITIONS

---

**PATTERN: Page transition curtain overlay**
WHERE SEEN: studiofreight.com, locomotive.ca, unseen.studio
VISUAL: On route change, a dark panel slides up from bottom covering viewport, content swaps, panel slides out the top.
CODE (Framer Motion + App Router):
```tsx
'use client'
export function Curtain({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```
Alternative: `next-view-transitions` package + CSS `::view-transition-old/new` pseudo-elements.
WEBFLOW: **Native** "Page load" IX2 triggers can approximate this.

---

**PATTERN: View Transitions API morph**
WHERE SEEN: chrome.com, GitHub experimentation, progressive sites
VISUAL: Shared element (e.g., card) smoothly morphs into the detail page.
CODE: `next.config.js` → `experimental: { viewTransition: true }`, wrap elements in `<ViewTransition name="card-1">`.
WEBFLOW: **No.** Browser-API feature, no IX2 equivalent.

---

### MICRO-INTERACTIONS

---

**PATTERN: Text scramble / encrypt effect**
WHERE SEEN: active-theory.com, hyperplane, raycast launcher demo
VISUAL: Text briefly cycles through random characters before settling.
TOOLS: `use-scramble` hook, or custom with `requestAnimationFrame`.
```tsx
import { useScramble } from 'use-scramble'
const { ref, replay } = useScramble({ text: 'Hello world', speed: 0.6, tick: 1, scramble: 8 })
<h2 ref={ref} onMouseEnter={replay}/>
```
WEBFLOW: **Custom code.**

---

**PATTERN: Tilt-on-hover card**
WHERE SEEN: linear.app feature cards, vercel.com project cards
VISUAL: Card tilts 3D-perspective toward cursor, with a subtle sheen highlight tracking pointer.
CODE:
```tsx
const rx = useMotionValue(0); const ry = useMotionValue(0)
const srx = useSpring(rx, { stiffness: 150, damping: 15 })
const sry = useSpring(ry, { stiffness: 150, damping: 15 })

<motion.div
  style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect()
    rx.set(-((e.clientY - r.top - r.height/2) / r.height) * 8)
    ry.set(((e.clientX - r.left - r.width/2) / r.width) * 8)
  }}
  onMouseLeave={() => { rx.set(0); ry.set(0) }}
/>
```
WEBFLOW: **Native "mouse move over element" IX2** exists. Doable.

---

**PATTERN: Hover-reveal image swap (editorial list)**
WHERE SEEN: unseen.studio, 3mpq-studio project index
VISUAL: A text list of projects; hovering a row reveals the project image that follows the cursor.
CODE: Absolute-positioned image tracked via `useMotionValue(mouseX/Y)` with `useSpring`. `AnimatePresence` for the image.
WEBFLOW: **Custom code.**

---

### CONTENT REVEAL

---

**PATTERN: Staggered viewport reveal with variants**
WHERE SEEN: ubiquitous
CODE:
```tsx
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16,1,0.3,1] } } }

<motion.ul variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
  {items.map(i => <motion.li key={i.id} variants={item}>{i.label}</motion.li>)}
</motion.ul>
```
WEBFLOW: **Native IX2** (scroll-into-view trigger + staggered children).

---

**PATTERN: Clip-path wipe reveal**
WHERE SEEN: unseen.studio, editorial portfolios
VISUAL: Image appears via an animated `clip-path: inset(0 100% 0 0)` → `inset(0)` wipe.
CODE:
```tsx
<motion.img initial={{ clipPath: 'inset(0 100% 0 0)' }}
  whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
  viewport={{ once: true }}
  transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}/>
```
WEBFLOW: **Custom code.** Clip-path is not animatable in IX2.

---

### LAYOUT

---

**PATTERN: Bento grid feature section**
WHERE SEEN: apple.com, vercel.com, framer.com, raycast.com, linear.app
VISUAL: 4–8 tiles of varying sizes on a 12-col grid, 12–24px gaps, each tile has its own mini-interaction (animated gradient, video loop, animated icon).
CODE:
```tsx
<div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[220px]">
  <div className="md:col-span-4 md:row-span-2 rounded-2xl border bg-white p-8"/>
  <div className="md:col-span-2 rounded-2xl border bg-white p-6"/>
  <div className="md:col-span-2 rounded-2xl border bg-white p-6"/>
  <div className="md:col-span-3 rounded-2xl border bg-white p-6"/>
  <div className="md:col-span-3 rounded-2xl border bg-white p-6"/>
</div>
```
TOKENS: `rounded-2xl`, 1px `border-neutral-200`, hover lift `hover:-translate-y-0.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`.
WEBFLOW: **Native.** CSS Grid is fully supported.

---

**PATTERN: Editorial asymmetric layout**
WHERE SEEN: unseen.studio, rauno.me, 3mpq-studio
VISUAL: Deliberate off-center column, large whitespace, captions in small caps off to the side like a magazine.
CODE: 12-col CSS grid with content span 5 / caption span 2 / whitespace span 5.
WEBFLOW: **Native.**

---

**PATTERN: Dot-grid background**
WHERE SEEN: linear.app, vercel.com, rauno.me
VISUAL: Faint dot pattern across full-bleed sections.
CODE:
```tsx
<div className="relative">
  <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,theme(colors.neutral.200)_1px,transparent_0)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"/>
  <div className="relative">{children}</div>
</div>
```
WEBFLOW: **Native** (custom CSS via embed or style property).

---

**PATTERN: Full-bleed image + text lockup**
WHERE SEEN: stripe.com, apple.com, 3mpq-studio
VISUAL: Edge-to-edge image with tiny caption label bottom-left.
WEBFLOW: **Native.**

---

### ATMOSPHERE

---

**PATTERN: SVG noise/grain overlay**
WHERE SEEN: cursor.com, vercel.com, basement.studio, most Awwwards sites
CODE: (see Video/Canvas hero pattern above — same technique).
Can be a fixed full-viewport `div` with `position: fixed; inset: 0; pointer-events: none; mix-blend-mode: overlay; opacity: 0.12`.
WEBFLOW: **Native** (upload SVG as background image, set blend mode via custom CSS).

---

**PATTERN: Animated gradient mesh**
WHERE SEEN: stripe.com, linear.app, vercel.com OG images
VISUAL: Slow, organic gradient blobs drift in background.
TOOLS: `paper-design/shaders` (Paper Shaders — 2025 release), or manual canvas/WebGL, or pure CSS with multiple radial gradients and `animate-pulse`.
WEBFLOW: **Custom embed** for WebGL; CSS-only version is native.

---

**PATTERN: Chromatic aberration / RGB split on hover**
WHERE SEEN: basement.studio, active-theory.com
VISUAL: Text/image splits into red/blue channels on hover.
CODE: Three stacked copies with `mix-blend-mode: screen`, offset in x by `-1px` / `+1px`, colored `filter: hue-rotate`.
WEBFLOW: **Custom code.**

---

### 3D / WEBGL

---

**PATTERN: R3F hero scene with scroll-driven camera**
WHERE SEEN: igloo.inc, landonorris.com, bruno-simon.com
TOOLS: `@react-three/fiber`, `@react-three/drei` (ScrollControls, Scroll, useScroll), `three`.
CODE:
```tsx
<Canvas>
  <ScrollControls pages={4} damping={0.3}>
    <Scene/>
    <Scroll html>
      <h1 className="h-screen flex items-center">Headline</h1>
    </Scroll>
  </ScrollControls>
</Canvas>
```
WEBFLOW: **Custom embed.** Ship it as a self-contained React/Vite bundle that Webflow loads via `<script>`.

---

**PATTERN: GLSL shader background**
WHERE SEEN: resn.co.nz, active-theory.com, vercel OG
TOOLS: `@react-three/fiber` + `shaderMaterial` from drei, or `paper-design/shaders`.
WEBFLOW: **Custom embed.**

---

**PATTERN: Physics-driven interactive objects**
WHERE SEEN: bruno-simon.com (drivable car), some basement experiments
TOOLS: `@react-three/rapier` (2D) or `matter-js` for DOM physics.
WEBFLOW: **Not realistically.**

---

## 4. Tool Stack Reference

### Core (always install)
- `framer-motion` — `useScroll`, `useTransform`, `useMotionValue`, `useSpring`, `useVelocity`, `useInView`, `useMotionValueEvent`, `AnimatePresence`, `LayoutGroup`, variants, `whileInView`
- `lenis` — smooth scroll baseline. Wrap in a `<ReactLenis root>` component
- `clsx` + `tailwind-merge` — className composition
- `tailwindcss` with custom easing token: `transitionTimingFunction: { out: 'cubic-bezier(0.16,1,0.3,1)' }`

### Reach for when
| Need | Tool |
|---|---|
| Complex scroll timelines, SplitText | `gsap` + `@gsap/react` + ScrollTrigger + SplitText (commercial) |
| 3D hero | `three` + `@react-three/fiber` + `@react-three/drei` |
| 3D physics | `@react-three/rapier` |
| Shaders | `paper-design/shaders` or custom GLSL via drei `shaderMaterial` |
| Carousels | `embla-carousel-react` (preferred) or `splide` |
| Drawers / sheets | `vaul` |
| Primitive UI | `@radix-ui/react-*` |
| Accessible composites | `shadcn/ui` |
| Particles | `tsparticles/react`, `canvas-confetti` |
| In-view detection fallback | `react-intersection-observer` |
| Scramble text | `use-scramble` |
| Marquee | `react-fast-marquee` or hand-rolled Tailwind |
| Page transitions (native) | `next-view-transitions` |
| Cursor | Hand-rolled with `useMotionValue` + `useSpring` |
| Icons | `lucide-react` or `@radix-ui/react-icons` |

### Next.js 15+ specifics
- Use App Router, server components by default
- Mark any component using `useScroll`, `useRef`, hooks, or animation as `'use client'`
- Lenis wrapper must be a client component at the root layout
- Use `next/font/google` for IBM Plex Serif + Sans with `display: 'swap'` and CSS variable
- Use `next/image` for all raster images with `priority` on hero, `sizes` attr for responsive
- Route segment `metadata` + `generateMetadata` for SEO
- OG images via `next/og` in `opengraph-image.tsx`

---

## 5. Webflow Handoff Realism Matrix

| Pattern | Native IX2 | Custom embed | Impossible-ish |
|---|:---:|:---:|:---:|
| Oversized serif + eyebrow | ✓ | | |
| Sticky header compression | ✓ | | |
| Parallax depth layers | ✓ | | |
| Bento grid | ✓ | | |
| Dot grid bg | ✓ | | |
| Hover underline wipes | ✓ | | |
| Tilt-on-hover (mouse-move trigger) | ✓ | | |
| Staggered viewport reveal | ✓ | | |
| Background video + overlay | ✓ | | |
| Scroll-pinned hero compression | ✓ | | |
| Split-text word reveal | | ✓ (embed/script) | |
| Blur-reveal on scroll | | ✓ | |
| Infinite marquee | | ✓ | |
| Custom cursor | | ✓ | |
| Magnetic buttons | | ✓ | |
| Horizontal pinned scroll | | ✓ (GSAP embed) | |
| Stacking sticky cards | | ✓ | |
| Clip-path wipe reveals | | ✓ | |
| Scramble text | | ✓ | |
| SVG path draw on scroll | | ✓ | |
| Scroll-velocity marquee | | | ✓ |
| Chromatic aberration | | ✓ | |
| View Transitions API | | | ✓ (browser feature) |
| R3F hero | | ✓ (bundle embed) | |
| GLSL shaders | | ✓ | |
| Physics worlds | | | ✓ |

**Handoff rule:** The agent should default to patterns in the first two columns. Reach for column 3 only when the project explicitly allows custom dev.

---

## 6. Recommendations — Must Support vs Nice to Have

### MUST SUPPORT in the agent's component library (v1)
These map directly to B2B creative landings with a Webflow handoff and the editorial-serif baseline.

1. **`<Hero>`** variant = `pinned-compress` — scroll-pinned serif hero with scale + y transform
2. **`<Hero>`** variant = `editorial-eyebrow` — static oversized serif + small-caps label
3. **`<SplitTextReveal>`** — word-staggered whileInView with blur/translate
4. **`<StickyHeader>`** — scroll-compressed, backdrop blur, bordered
5. **`<Bento>`** — 6-col grid with typed tile slots (`hero`, `wide`, `square`, `tall`)
6. **`<Marquee>`** — infinite horizontal with mask edges + pause-on-hover
7. **`<FeatureStack>`** — stacking sticky cards deck
8. **`<HoverUnderline>` / `<EditorialLink>`** — wipe underline link
9. **`<RevealList>`** — staggered viewport reveal with variants
10. **`<GrainOverlay>`** — fixed SVG noise layer
11. **`<DotGrid>`** — masked radial dot background wrapper
12. **`<MagneticButton>`** — spring-lerped CTA (flag-guarded; skip when handoff is pure Webflow)
13. **`<ParallaxLayer>`** — `useTransform`-based y shift
14. **`<HorizontalScroll>`** — pinned horizontal panel track
15. **`<PageCurtain>`** — AnimatePresence curtain overlay on route change
16. **`<EditorialImage>`** — clip-path reveal + caption slot

### NICE TO HAVE (v2 / feature-flagged)
- `<CustomCursor>` (mix-blend-difference)
- `<TextScramble>` (use-scramble)
- `<TiltCard>` (perspective + sheen)
- `<ScrollPath>` (SVG pathLength)
- `<GradientMesh>` (Paper Shaders)
- `<R3FHero>` (loaded via dynamic import, SSR: false)

### SKIP (too studio-portfolio for B2B creative landings)
- Full scroll-hijack multi-scene storytelling (hurts accessibility, Webflow can't ship it)
- Drivable 3D worlds (bruno-simon territory — wrong context)
- Heavy chromatic aberration (too brutalist for B2B)
- Scroll-velocity marquees (nice but not Webflow-portable)

---

## 7. Component Defaults the Agent Should Enforce

```ts
// tailwind.config.ts additions
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-ibm-plex-serif)', 'Georgia', 'serif'],
      sans:  ['var(--font-ibm-plex-sans)', 'system-ui', 'sans-serif'],
    },
    transitionTimingFunction: {
      out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    transitionDuration: {
      DEFAULT: '600ms',
    },
  },
}

// motion defaults (wrap in a shared file)
export const EASE = [0.16, 1, 0.3, 1] as const
export const D = { fast: 0.4, base: 0.7, slow: 1.1 }
export const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: D.base, ease: EASE },
}
```

**Type scale (golden defaults):**
- Display: `text-[clamp(56px,10vw,160px)] leading-[0.92] tracking-[-0.02em] font-serif`
- H1: `text-[clamp(40px,6vw,88px)] leading-[0.95] font-serif`
- H2: `text-[clamp(32px,4vw,56px)] leading-[1] font-serif`
- Eyebrow: `text-[11px] tracking-[0.14em] uppercase font-sans text-neutral-500`
- Body: `text-[17px] leading-[1.55] font-sans text-neutral-700`
- Caption: `text-[13px] text-neutral-500 font-sans`

**Border tokens:** `border-neutral-200` light / `border-neutral-800` dark. Never use pure black/white for borders.

**Shadow tokens (light only):** `shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]`.

---

## 8. Final Notes for the Agent

- **Respect reduced motion.** Wrap every scroll-linked effect in `useReducedMotion()` check and fall back to `initial={false}` or static.
- **Lenis + Framer Motion integration note:** use the `@studio-freight/react-lenis` (now `lenis/react`) component at the root, then `useScroll` Just Works with `window` as the scroller.
- **Hydration safety:** all hooks-based animations in `'use client'` components, never top-level-rendered in server components.
- **Image priority:** hero images get `priority` + `fetchPriority="high"`; everything else lazy.
- **LCP rule:** hero text must render server-side. Do not gate the headline behind a JS reveal — animate it *from* its final state using `initial` + `animate` keyed by `mounted` state only after hydration.
- **Webflow handoff deliverable:** for each component, emit a short handoff-note comment in the JSX referencing the matrix in section 5 so the Webflow dev knows whether to rebuild natively or paste custom code.

---

Sources & deep-dive references:

- Awwwards SOTY 2025 (Lando Norris / OFF+BRAND) — https://www.awwwards.com/annual-awards-2025/site-of-the-year
- Awwwards SOTY 2024 (Igloo Inc / Abeto) — https://www.awwwards.com/annual-awards-2024/site-of-the-year
- Awwwards Sites of the Month — https://www.awwwards.com/websites/sites_of_the_month/
- Motion / Framer Motion scroll docs — https://motion.dev/docs/react-scroll-animations
- Motion splitText — https://motion.dev/docs/split-text
- Motion inView — https://motion.dev/docs/inview
- Lenis smooth scroll — https://github.com/darkroomengineering/lenis
- Olivier Larose parallax tutorials — https://blog.olivierlarose.com/tutorials/
- Rauno blur-reveal (Codrops) — https://tympanus.net/codrops/2024/04/23/blurry-text-reveal-on-scroll/
- GSAP ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Next.js view transitions — https://nextjs.org/docs/app/guides/view-transitions
- next-view-transitions — https://github.com/shuding/next-view-transitions
- Tailwind Bento grids — https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids
- MagicUI Marquee — https://magicui.design/docs/components/marquee
- CSS grainy gradients — https://css-tricks.com/grainy-gradients/
- R3F examples — https://r3f.docs.pmnd.rs/getting-started/examples
- Webflow IX2 parallax lesson — https://university.webflow.com/lesson/parallax-movement-on-scroll
