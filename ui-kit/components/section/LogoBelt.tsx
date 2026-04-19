/*
 * LogoBelt — plain <img> variant.
 *
 * Decision: use a native <img> rather than `next/image`. Rationale:
 *   1. Logo belts render tiny, already-sized SVGs / PNGs served from the
 *      CDN, so next/image's lazy/blur machinery buys nothing.
 *   2. next/image requires the `src` to satisfy a project-scoped
 *      `images.remotePatterns` config. Logo belts typically pull from
 *      customer brand URLs, which are hard to enumerate in advance.
 *   3. The studio's Vite consumer (`3mpq-studio-export`) already shims
 *      next/image to a plain <img> — keeping it native removes the shim
 *      dependency from this component entirely.
 *
 * Consumers that want next/image can wrap the logos in their own <Image>
 * elements and pass them to LogoBelt as children-like objects — see the
 * `render` prop escape hatch.
 */
import type { ComponentType, ReactNode } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type LogoBeltItem = {
  src: string;
  alt: string;
  href?: string;
  /** Pre-rendered element — takes precedence over `src`. Lets consumers pass a next/image. */
  render?: ReactNode;
};

export type LogoBeltProps = {
  logos: LogoBeltItem[];
  /** Render greyscale until hover. Default true. */
  grayscale?: boolean;
  /** Visual size bucket. sm = 24px, md = 32px. */
  size?: "sm" | "md";
  /** Pixel gap between logos at >=md breakpoint. Default 48. */
  gap?: number;
  /** Horizontal distribution. `between` spreads with equal gaps. */
  align?: "left" | "center" | "between";
  /** Optional logo image component override (e.g. Next.js Image). */
  ImgComponent?: ComponentType<{
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/LogoBelt.tsx";

const heights: Record<"sm" | "md", number> = {
  sm: 24,
  md: 32,
};

const justifyMap: Record<"left" | "center" | "between", string> = {
  left: "justify-start",
  center: "justify-center",
  between: "justify-between",
};

/* -------------------------------------------------------------------------- */
/*  LogoBelt                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Horizontal client-logo row.
 *
 * Default: greyscale at 50% opacity, each logo pops to full colour + full
 * opacity on hover (150ms doctrine easing). Collapses to a 2-column grid
 * at mobile. Uses a plain `<img>` by default — pass `ImgComponent` to
 * inject next/image or any other adapter.
 */
export function LogoBelt({
  logos,
  grayscale = true,
  size = "md",
  gap = 48,
  align = "between",
  ImgComponent,
  className,
  dataSource,
}: LogoBeltProps) {
  const height = heights[size];

  return (
    <div
      data-component="LogoBelt"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,ease-out"
      className={cn("w-full", className)}
    >
      {/* Mobile: 2-col grid */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:hidden">
        {logos.map((logo, i) => (
          <li key={i} className="flex items-center justify-center">
            <LogoItem
              logo={logo}
              height={height}
              grayscale={grayscale}
              ImgComponent={ImgComponent}
            />
          </li>
        ))}
      </ul>

      {/* Desktop/tablet: horizontal row */}
      <ul
        className={cn(
          "hidden flex-wrap items-center md:flex",
          justifyMap[align],
        )}
        style={{ columnGap: `${gap}px`, rowGap: `${Math.min(gap, 24)}px` }}
      >
        {logos.map((logo, i) => (
          <li key={i} className="flex items-center">
            <LogoItem
              logo={logo}
              height={height}
              grayscale={grayscale}
              ImgComponent={ImgComponent}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LogoItem({
  logo,
  height,
  grayscale,
  ImgComponent,
}: {
  logo: LogoBeltItem;
  height: number;
  grayscale: boolean;
  ImgComponent?: LogoBeltProps["ImgComponent"];
}) {
  const wrapperCls = cn(
    "inline-flex items-center transition-[filter,opacity] duration-150",
    "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
    grayscale
      ? "opacity-50 [filter:grayscale(100%)] hover:opacity-100 hover:[filter:grayscale(0%)]"
      : "opacity-70 hover:opacity-100",
  );

  const img = logo.render ? (
    logo.render
  ) : ImgComponent ? (
    <ImgComponent
      src={logo.src}
      alt={logo.alt}
      className="block h-auto max-h-full w-auto object-contain"
      height={height}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt={logo.alt}
      style={{ height: `${height}px`, width: "auto" }}
      className="block max-h-full w-auto object-contain"
    />
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        className={wrapperCls}
        style={{ height: `${height}px` }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {img}
      </a>
    );
  }

  return (
    <span className={wrapperCls} style={{ height: `${height}px` }}>
      {img}
    </span>
  );
}
