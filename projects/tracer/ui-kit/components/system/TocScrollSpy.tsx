"use client";

import { useEffect, useState } from "react";

import { cn } from "../../lib/cn";

/**
 * TocScrollSpy -- right-rail Table of Contents pinned to the viewport.
 *
 * Lists in-page anchors and highlights the section currently in view
 * via IntersectionObserver. Active item is weight 600 in
 * `--color-text`; inactive is weight 400 in `--color-text-muted`.
 *
 * The TOC hides below 1024px (`lg`). On narrower viewports the user
 * still has the SidebarNav drawer for navigation, so we do not show
 * two parallel lists.
 *
 * Rule of thumb from the redesign research: render this only when a
 * section carries more than eight anchors. Below that, vertical rhythm
 * is enough.
 */

export type TocItem = { id: string; label: string };

export type TocScrollSpyProps = {
  items: TocItem[];
  /** Eyebrow caption above the list (default "On this page"). */
  caption?: string;
  /** Class on the outer <nav>. */
  className?: string;
  dataSource?: string;
};

export function TocScrollSpy({
  items,
  caption = "On this page",
  className,
  dataSource = "ui-kit/components/system/TocScrollSpy.tsx",
}: TocScrollSpyProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items.map((i) => i.id).join("|")]);

  if (items.length === 0) return null;

  return (
    <nav
      data-component="TocScrollSpy"
      data-source={dataSource}
      data-tokens="color-text,color-text-muted,color-text-subtle,font-sans"
      aria-label="On this page"
      className={cn("hidden lg:flex lg:flex-col lg:gap-3", className)}
    >
      <span className="pl-3 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {caption}
      </span>
      <ul className="flex flex-col">
        {items.map((it) => {
          const isActive = activeId === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => {
                  const t = document.getElementById(it.id);
                  if (!t) return;
                  e.preventDefault();
                  t.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${it.id}`);
                }}
                className={cn(
                  "flex border-l px-3 py-[6px] text-[13px] leading-[1.4] transition-colors",
                  isActive
                    ? "border-[var(--color-text)] text-[var(--color-text)] font-semibold"
                    : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                )}
                style={{ transitionDuration: "120ms" }}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
