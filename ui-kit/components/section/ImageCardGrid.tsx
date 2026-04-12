import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { ImageCard, type ImageCardProps } from "./ImageCard";

export type ImageCardGridCard = Omit<ImageCardProps, "dataSource">;

export type ImageCardGridProps = {
  cards: ImageCardGridCard[];
  /** Columns at the `lg` breakpoint. 2 matches Section 4/6 Figma. 3 for denser grids. */
  cols?: 2 | 3;
  /** Gap between cards in px. Figma default 24. */
  gap?: number;
  className?: string;
  dataSource?: string;
  /** Rendered above the grid (e.g. a `<SectionHeader />`). */
  children?: ReactNode;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/ImageCardGrid.tsx";

/**
 * Grid of `ImageCard`s.
 *
 * Responsive matrix (matches Section 4 and Section 6 plans):
 *   - `<640`: 1 col
 *   - `640-1023`: 2 cols
 *   - `≥1024`: `cols` (2 or 3)
 *
 * Each card inherits `data-motion="blur-reveal"` + `data-motion-index`
 * so the motion pass can compute a stagger offset without hardcoded delays.
 */
export function ImageCardGrid({
  cards,
  cols = 2,
  gap = 24,
  className,
  dataSource,
  children,
}: ImageCardGridProps) {
  const lgColsClass = cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div
      data-component="ImageCardGrid"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,radius-window"
      className={cn("flex flex-col", className)}
    >
      {children}
      <ul
        className={cn("mt-0 grid grid-cols-1 sm:grid-cols-2", lgColsClass)}
        style={{ gap: `${gap}px` }}
      >
        {cards.map((card, i) => (
          <li
            key={`${card.title}-${i}`}
            data-motion="blur-reveal"
            data-motion-index={i}
            className="list-none"
          >
            <ImageCard {...card} dataSource={dataSource ?? DATA_SOURCE_DEFAULT} />
          </li>
        ))}
      </ul>
    </div>
  );
}
