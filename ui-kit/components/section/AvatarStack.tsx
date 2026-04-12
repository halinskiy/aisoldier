import Image from "next/image";

import { cn } from "../../lib/cn";

export type AvatarStackItem = {
  src: string;
  alt: string;
};

export type AvatarStackProps = {
  avatars: AvatarStackItem[];
  /** Avatar diameter in px. Figma default is 48. */
  size?: number;
  /** Horizontal overlap in px. Figma default is 16 (48 avatar, 32 step → overlap 16). */
  overlap?: number;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/AvatarStack.tsx";

/**
 * Overlapping avatar strip.
 *
 * Z-order gotcha (🔴 gap #4 in FIGMA_SPEC.md): when you lay circles left-to-right
 * with DOM order, the LATER element paints on top — so the rightmost avatar
 * would cover the leftmost. The Figma reads leftmost-on-top, which is the
 * standard "trust bar" pattern. Fix: reverse the array AND use
 * `flex-direction: row-reverse`. Visually the order stays the same, but now
 * the leftmost avatar is last in DOM → paints on top.
 *
 * An alternative would be explicit `z-index` per avatar. `row-reverse` is
 * cleaner because it keeps the DOM semantic order obvious.
 */
export function AvatarStack({
  avatars,
  size = 48,
  overlap = 16,
  className,
  dataSource,
}: AvatarStackProps) {
  return (
    <ul
      data-component="AvatarStack"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,radius-pill"
      className={cn("flex flex-row-reverse justify-end", className)}
      style={{ paddingLeft: overlap }}
    >
      {[...avatars].reverse().map((a, i, arr) => {
        const isLast = i === arr.length - 1;
        return (
          <li
            key={`${a.src}-${i}`}
            className="relative block overflow-hidden rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-surface)]"
            style={{
              width: size,
              height: size,
              marginLeft: isLast ? 0 : -overlap,
            }}
          >
            <Image
              src={a.src}
              alt={a.alt}
              width={size}
              height={size}
              className="h-full w-full object-cover"
              sizes={`${size}px`}
            />
          </li>
        );
      })}
    </ul>
  );
}
