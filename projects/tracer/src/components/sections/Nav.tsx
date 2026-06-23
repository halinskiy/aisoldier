"use client";

import { useEffect, useRef, useState } from "react";

import { NoCornyMark } from "../NoCornyMark";
import copy from "@content/copy.json";

/**
 * S1 - Nav. Sticky, transparent then a blurred surface on scroll. NoCorny squiggle
 * mark + "NoCorny Tracer" wordmark left, anchor links center, Sign in (ghost
 * text) + Download for macOS (solid accent) right. The red Download button is
 * the only saturated element.
 *
 * Bespoke shell (not NavSticky): NavSticky's wordmark/CTA composition assumes a
 * single pill CTA and a LogoWave `~` split; Tracer needs its own squiggle mark,
 * a ghost Sign-in plus a solid-accent Download, and a light-on-dark-friendly
 * transparent rest state. Noted in DECISIONS.md.
 */
/** Anchor links that map to an on-page section we can scroll-spy. */
const SECTION_IDS = ["how", "features", "ownership", "faq"];

export function Nav() {
  const { nav } = copy;
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Active-section sliding dot marker: a single accent dot that translates
  // between the active nav link as sections scroll into view (V2 dot thread).
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [dot, setDot] = useState<{ left: number; visible: boolean }>({
    left: 0,
    visible: false,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Position the sliding dot under the active link's center.
  useEffect(() => {
    const href = `#${activeId}`;
    const link = linkRefs.current[href];
    const container = navRef.current;
    if (!link || !container) {
      setDot((d) => ({ ...d, visible: false }));
      return;
    }
    const lr = link.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    setDot({ left: lr.left - cr.left + lr.width / 2, visible: true });
  }, [activeId, scrolled]);

  // Active-link scroll-spy: mark the nav link whose section owns the viewport
  // middle. Drives aria-current + a font-weight + accent-underline state.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      id="top"
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 [transition-timing-function:var(--ease-out)]"
      style={{
        backgroundColor: scrolled ? "var(--color-nav-scrim)" : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid transparent",
      }}
    >
      {/* Theme-aware: at rest the nav floats over the DARK hero (light text);
          once scrolled onto the light page it inverts to ink. The single
          inline color drives a smooth transition with the surface change. */}
      <div
        className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-8 transition-colors duration-300 [transition-timing-function:var(--ease-out)]"
        style={{ color: scrolled ? "var(--color-text)" : "var(--color-on-dark)" }}
      >
        {/* wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 transition-opacity duration-150 [transition-timing-function:var(--ease-out)] hover:opacity-70"
        >
          <NoCornyMark size={18} pulse className="text-current" />
          <span className="font-[family-name:var(--font-display)] text-[18px] font-semibold tracking-[-0.01em] text-current">
            {nav.logo}
          </span>
        </a>

        {/* links + the single sliding active-section dot marker */}
        <nav ref={navRef} aria-label="Primary" className="relative flex items-center gap-8">
          {nav.links.map((link) => {
            const isExternal = "external" in link && link.external;
            const active = !isExternal && link.href === `#${activeId}`;
            return (
              <a
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                aria-current={active ? "true" : undefined}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`relative font-[family-name:var(--font-sans)] text-[16px] text-current transition-[opacity,font-weight] duration-150 [transition-timing-function:var(--ease-out)] hover:opacity-100 ${
                  active ? "font-semibold opacity-100" : "font-medium opacity-70"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          {/* one accent dot that slides between the active links */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] transition-[left,opacity] duration-200 [transition-timing-function:var(--ease-out)]"
            style={{ left: dot.left, opacity: dot.visible ? 1 : 0 }}
          />
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <a
            href="/dashboard"
            className="rounded-[var(--radius-button)] px-3 py-2 font-[family-name:var(--font-sans)] text-[16px] font-medium text-current opacity-70 transition-opacity duration-150 [transition-timing-function:var(--ease-out)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {nav.cta_secondary}
          </a>
          <a
            href="/download"
            className="inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-4 py-2 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {nav.cta_primary}
          </a>
        </div>
      </div>
    </header>
  );
}
