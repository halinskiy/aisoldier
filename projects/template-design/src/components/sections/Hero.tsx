import Image from "next/image";

import { AvatarStack } from "@kit/components/section/AvatarStack";
import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Hero.tsx";

/**
 * Section 1 — Hero.
 *
 * Geometry (Figma 1440 baseline, FIGMA_SPEC §1):
 *   - Container: 1376 × 460 content row + 172 journey row + 120 card row
 *   - Left col: 501 × 460 (eyebrow + H0 + body + CTAs + avatar stack)
 *   - Right col: 676 × 460 (hero photo)
 *   - Gap: 199px (gutter picked as 200)
 *
 * Gap fixes applied here (from the 17):
 *   🟠 #12 eyebrow copy — "Wealth Advisory" (came from content/copy.json)
 *   🟠 #13 primary CTA — "Schedule call"
 *   🟠 #14 typo — "your capital" (came from content/copy.json)
 *   🔴 #4  avatar z-order — handled inside <AvatarStack> (row-reverse)
 *   🔴 #5  1-card carousel has next arrow — arrow dropped
 *   🟠 journey marker 2 label shifted via `translate-x-[-100%]` + `right-0`,
 *      label uppercase per screenshot (not via negative px offset)
 *
 * Responsive plan (from FIGMA_SPEC §1):
 *   ≥1280: pixel-perfect 2-col
 *   768-1279: text full-width, image below full-bleed
 *   <768: H0 stacks vertically naturally, avatars 36px
 */
export function Hero() {
  const { hero } = copy;
  const [headlineLine1, headlineLine2] = hero.headline;

  return (
    <section
      id="top"
      data-component="Hero"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-bg,color-text,color-text-muted,text-h0,lh-h0,font-serif,ease-out"
      className="relative w-full pt-[120px] lg:pt-[121px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        {/* Main content row: left text col + right image col */}
        <div className="grid grid-cols-1 items-start gap-y-12 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0">
          <div data-motion="blur-reveal" data-motion-index={0}>
            <HeroLeft
              eyebrow={hero.eyebrow}
              line1={headlineLine1}
              line2={headlineLine2}
              body={hero.body}
              primaryCta={hero.primaryCta}
              secondaryCta={hero.secondaryCta}
              socialProof={hero.socialProof}
              avatars={hero.avatars}
            />
          </div>
          {/* Spacer column for exact 199px gap on desktop — grid handles it */}
          <div aria-hidden className="hidden lg:block" />
          <div data-motion="blur-reveal" data-motion-index={1}>
            <HeroImage src={hero.image.src} alt={hero.image.alt} />
          </div>
        </div>

        {/* Journey indicator row */}
        <div data-motion="blur-reveal" data-motion-index={2}>
          <JourneyIndicator
            fromLabel={hero.journeyIndicator.from}
            toLabel={hero.journeyIndicator.to}
          />
        </div>

        {/* Single carousel card — "next arrow" intentionally dropped (🔴 gap #5) */}
        <div data-motion="blur-reveal" data-motion-index={3}>
          <CarouselCard
            label={hero.carouselCard.label}
            href={hero.carouselCard.href}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function HeroLeft({
  eyebrow,
  line1,
  line2,
  body,
  primaryCta,
  secondaryCta,
  socialProof,
  avatars,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  socialProof: string;
  avatars: { src: string; alt: string }[];
}) {
  return (
    <div className="flex max-w-[501px] flex-col gap-10">
      <EyebrowLabel className="w-fit self-start">{eyebrow}</EyebrowLabel>

      {/* H0 — wraps to 2 lines via explicit <br/>, matches Figma intent.
          max-w-[501px] guarantees wrap on ≥1280 even without the break. */}
      <div className="flex flex-col gap-6">
        <h1
          className="font-serif font-medium text-[var(--color-text)]"
          style={{
            fontSize: "var(--text-h0)",
            lineHeight: "var(--lh-h0)",
            letterSpacing: "var(--ls-h0)",
          }}
        >
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </h1>
        <p className="max-w-[480px] text-[18px] leading-[1.55] text-[var(--color-text-muted)]">
          {body}
        </p>
      </div>

      {/* CTA row */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          href={primaryCta.href}
          variant="primary"
          size="md"
          magnetic
        >
          {primaryCta.label}
        </Button>
        <Button href={secondaryCta.href} variant="secondary" size="md" trailingDot={false}>
          {secondaryCta.label}
        </Button>
      </div>

      {/* Social proof */}
      <div className="flex flex-col gap-4">
        <AvatarStack avatars={avatars} />
        <p className="text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
          {socialProof}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      data-component="HeroImage"
      data-source={DATA_SOURCE}
      data-tokens="radius-window,color-border"
      className="relative aspect-[676/460] w-full overflow-hidden rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1280px) 676px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Journey indicator — a horizontal line with 2 accent markers.
 *
 * Layout is a 3-column CSS grid: [line → marker → line → marker → nothing].
 * Marker 1 sits at ~51% (Figma x=700 / 1376), marker 2 sits at ~97% (x=1340).
 * Marker 1 label anchors at its LEFT edge; marker 2 label anchors at its
 * RIGHT edge (uppercase, per screenshot) — no negative-x hacks.
 */
function JourneyIndicator({ fromLabel, toLabel }: { fromLabel: string; toLabel: string }) {
  return (
    <div
      data-component="JourneyIndicator"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-border-strong,color-text-muted,text-label-lg"
      className="relative mt-20 hidden lg:block"
    >
      {/* The divider + markers row */}
      <div className="relative h-[36px] w-full">
        {/* Continuous line across the full container */}
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-[var(--color-border-strong)]"
        />

        {/* Marker 1 — positioned at ~51% */}
        <Marker positionPercent={700 / 1376} align="left" label={fromLabel} uppercase />

        {/* Marker 2 — anchored to the right edge */}
        <Marker positionPercent={1340 / 1376} align="right" label={toLabel} uppercase />
      </div>
    </div>
  );
}

function Marker({
  positionPercent,
  align,
  label,
  uppercase = false,
}: {
  positionPercent: number;
  align: "left" | "right";
  label: string;
  uppercase?: boolean;
}) {
  return (
    <div
      className="absolute top-0 flex h-[36px] w-[36px] items-center justify-center"
      style={{
        left: `calc(${positionPercent * 100}% - 18px)`,
      }}
    >
      {/* 24x24 outer ring filled with bg, 12x12 accent dot */}
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)]">
        <span className="block h-3 w-3 rounded-full bg-[var(--color-accent)]" />
      </span>

      {/* Label — positioned below the marker, aligned per side */}
      <span
        className={`absolute top-[44px] whitespace-nowrap text-[12px] font-semibold leading-[1.2] tracking-[0.062em] text-[var(--color-text)] ${
          uppercase ? "uppercase" : ""
        } ${align === "right" ? "right-0" : "left-0"}`}
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CarouselCard({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      data-component="HeroCarouselCard"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-surface,radius-window,color-text,accent"
      className="group mt-24 flex w-full max-w-[361px] items-center justify-between gap-5 rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-[border-color,background-color] duration-150 hover:border-[var(--color-text)] hover:bg-[var(--color-bg)] lg:mt-14"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <span className="text-[16px] leading-[1.4] text-[var(--color-text)]">{label}</span>
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] transition-[transform,background-color,color] duration-150 group-hover:bg-[var(--color-accent)] group-hover:text-white"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8 L13 8 M8 3 L13 8 L8 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
