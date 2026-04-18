import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../lib/cn";

export type BrowserFrameProps = {
  /** Title rendered in the chrome bar — usually the URL or an app label. */
  title?: ReactNode;
  /** Optional aspect ratio for the inner content area. Default 16/10. */
  aspect?: string;
  /** Children — iframe, screenshot, or any product mock. */
  children: ReactNode;
  /** Extra classes applied to the outer frame wrapper. */
  className?: string;
  /** Extra classes applied to the inner content area. */
  contentClassName?: string;
  style?: CSSProperties;
  /** Override `data-source` when wrapped by a project section. */
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/BrowserFrame.tsx";

/**
 * Generic browser-chrome frame.
 *
 * Used for: live demo embeds in hero, dashboard screenshots in product tour
 * sections, any product mock that benefits from the framing affordance.
 *
 * Token contract:
 *   color-bg, color-bg-secondary, color-border, color-text-subtle,
 *   radius-window, font-mono
 *
 * Three traffic-light dots are sized 10px x 10px with a 1px border, no fill,
 * no emoji (CORRECTIONS §D.1 ban). Title bar height 36px. Inner content area
 * defaults to a 16/10 aspect for hero usage; override via `aspect` prop for
 * dashboard screenshots that need a different ratio.
 *
 * Promoted to ui-kit during vendo-ai session 1 (2026-04-13). First consumer
 * is vendo-ai Hero; planned reuse in vendo-ai "Inside the Platform" section.
 */
export function BrowserFrame({
  title,
  aspect = "16 / 10",
  children,
  className,
  contentClassName,
  style,
  dataSource,
}: BrowserFrameProps) {
  return (
    <div
      data-component="BrowserFrame"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-bg,color-bg-secondary,color-border,color-text-subtle,radius-window,font-mono"
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.06)]",
        className,
      )}
      style={style}
    >
      {/* Chrome bar — 36px tall, light surface, three border-only dots */}
      <div className="flex h-9 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary,#FAFAFA)] px-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="block h-[10px] w-[10px] rounded-full border border-[var(--color-border-strong)]" />
          <span className="block h-[10px] w-[10px] rounded-full border border-[var(--color-border-strong)]" />
          <span className="block h-[10px] w-[10px] rounded-full border border-[var(--color-border-strong)]" />
        </div>
        {title ? (
          <div
            className="flex-1 text-center text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--color-text-subtle)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {title}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        {/* Right-side spacer keeps the title visually centered */}
        <div className="w-[60px]" aria-hidden />
      </div>

      {/* Content area */}
      <div
        className={cn(
          "relative w-full bg-[var(--color-bg-secondary,#FAFAFA)]",
          contentClassName,
        )}
        style={{ aspectRatio: aspect }}
      >
        {children}
      </div>
    </div>
  );
}
