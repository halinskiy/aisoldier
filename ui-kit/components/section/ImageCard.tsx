import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export type ImageCardImage = {
  src: string;
  alt: string;
};

export type ImageCardProps = {
  image: ImageCardImage;
  title: string;
  eyebrow?: string;
  description?: string;
  /** Optional link — if present the whole card becomes an `<a>`. */
  href?: string;
  /** CSS aspect-ratio expression (e.g. `"676/456"`). Defaults to the Figma hero card ratio. */
  aspectRatio?: string;
  /** Pass a custom badge or icon to render in the top-right corner of the card. */
  topRight?: ReactNode;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/ImageCard.tsx";

/**
 * Full-bleed image card with editorial gradient overlay and bottom-anchored content.
 *
 * Token contract: color-border, color-bg, radius-window, ease-out
 * Gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)`
 *
 * Hover behaviour (see HANDOFF.md Section 4):
 *   - `<Image>` scales to 1.03 over 600ms `ease-out` — the doctrine easing
 *   - The gradient overlay deepens (opacity 1 → 1.1 via brightness) over 200ms
 *
 * Content is absolutely positioned at the bottom of the card: optional eyebrow
 * label + H5 serif title + optional one-line description.
 */
export function ImageCard({
  image,
  title,
  eyebrow,
  description,
  href,
  aspectRatio = "676/456",
  topRight,
  className,
  dataSource,
}: ImageCardProps) {
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      data-component="ImageCard"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,radius-window,ease-out,font-serif,text-h5"
      className={cn(
        "group relative block overflow-hidden rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        href &&
          "transition-[transform,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className,
      )}
      style={{
        aspectRatio,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Image layer */}
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 676px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      {/* Bottom-up gradient for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.35)_35%,transparent_65%)] transition-opacity duration-200 group-hover:opacity-90"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      />

      {/* Top-right slot */}
      {topRight && (
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2 text-white">
          {topRight}
        </div>
      )}

      {/* Bottom-anchored content */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-6 text-white lg:p-8">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-white/80">
            <span
              aria-hidden
              className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]"
            />
            {eyebrow}
          </span>
        )}
        <h3
          className="font-serif font-normal text-white"
          style={{
            fontSize: "clamp(22px, 2.5vw, 28px)",
            lineHeight: "1.15",
            letterSpacing: "-0.018em",
          }}
        >
          {title}
        </h3>
        {description && (
          <p className="max-w-[480px] text-[14px] leading-[1.5] text-white/75">
            {description}
          </p>
        )}
      </div>
    </Tag>
  );
}
