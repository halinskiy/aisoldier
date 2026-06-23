"use client";

import { useEffect, useState } from "react";

import { cn } from "../../lib/cn";

/**
 * SidebarNav -- left-rail navigation for doc pages.
 *
 * Two levels: group label (12px small-caps) plus item label (14px sans).
 * Active item carries a 2px left border in `--color-text`. No accent.
 *
 * Items are anchor links -- clicking scrolls smoothly to the section.
 * Scroll-spy is wired via IntersectionObserver: the most-visible target
 * id is marked active. The sidebar is sticky from the top by default
 * (lighter implementation than an independent scroll column) -- that
 * matches the v1 plan agreed for /system.
 *
 * Below 1024px the rail collapses behind a menu button rendered above
 * the main column. The drawer slides over content from the left.
 */

export type SidebarItem = { id: string; label: string };
export type SidebarGroup = { id: string; caption: string; items: SidebarItem[] };

export type SidebarNavProps = {
  groups: SidebarGroup[];
  /** Top label rendered above all groups, eg. the page name "/ system". */
  title?: string;
  /** Optional small label rendered under the title, eg. a version tag. */
  subtitle?: string;
  /** Class applied to the outer <aside>. */
  className?: string;
  /** Open-drawer aria label for the mobile menu trigger. */
  menuLabel?: string;
  dataSource?: string;
};

export function SidebarNav({
  groups,
  title = "/ system",
  subtitle,
  className,
  menuLabel = "Open navigation",
  dataSource = "ui-kit/components/system/SidebarNav.tsx",
}: SidebarNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allItemIds = groups.flatMap((g) => g.items.map((it) => it.id));

  useEffect(() => {
    if (allItemIds.length === 0) return;
    const targets = allItemIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [allItemIds.join("|")]);

  const handleClick =
    (id: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setDrawerOpen(false);
    };

  const renderList = (closeOnClick?: boolean) => (
    <nav
      data-component="SidebarNav"
      data-source={dataSource}
      data-tokens="color-text,color-text-muted,color-text-subtle,color-border,font-sans"
      aria-label="Page sections"
      className="flex flex-col gap-7"
    >
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-2">
          <span className="pl-3 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
            {group.caption}
          </span>
          <ul className="flex flex-col">
            {group.items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      handleClick(item.id)(e);
                      if (closeOnClick) setDrawerOpen(false);
                    }}
                    className={cn(
                      "flex items-center border-l-2 px-3 py-[7px] text-[14px] leading-[1.4] transition-colors",
                      isActive
                        ? "border-[var(--color-text)] text-[var(--color-text)] font-medium"
                        : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]",
                    )}
                    style={{ transitionDuration: "120ms" }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar -- sticky from top */}
      <aside
        className={cn(
          "hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto",
          className,
        )}
      >
        {renderList(false)}
      </aside>

      {/* Mobile trigger + drawer */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={menuLabel}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Contents
        </button>
        {drawerOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.32)]" aria-hidden />
            <div
              className="relative ml-0 mr-auto h-full w-[80%] max-w-[320px] overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg)] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                  Contents
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--color-border-strong)] text-[var(--color-text)]"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {renderList(true)}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
