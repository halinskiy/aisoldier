"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { cn } from "../../lib/cn";
import { EASE_OUT } from "../../lib/motion";
import { LogoWave } from "../brand/LogoWave";

export type NavLink = { label: string; href: string };
export type NavCta = { label: string; href: string };

export type NavStickyProps = {
  logo: string;
  logoNode?: React.ReactNode;
  links: NavLink[];
  cta: NavCta;
  /**
   * Override the data-source attribute when this component is wrapped by a
   * project-level section file. Optional — defaults to the kit path.
   */
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/nav/NavSticky.tsx";
const SCROLL_THRESHOLD = 40;

/**
 * Sticky header with logo, horizontal nav, pill CTA, and mobile burger.
 *
 * Scroll behaviour (doctrine rule, not bouncy):
 *   - top:      transparent, no border
 *   - after 40: rgba(248,247,241,0.85) + backdrop-blur + hairline border + subtle shadow
 *
 * Token contract:
 *   accent, color-bg, color-border, color-text, radius-pill, ease-out, font-serif
 */
export function NavSticky({ logo, logoNode, links, cta, dataSource }: NavStickyProps) {
  const [bgOpacity, setBgOpacity] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setBgOpacity(Math.min(1, y / 100));
  });

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header
      data-component="NavSticky"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-bg,color-border,color-text,radius-pill,ease-out,font-serif"
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backgroundColor: `rgba(250,249,247,${bgOpacity * 0.72})`,
        backdropFilter: bgOpacity > 0.05 ? `blur(${bgOpacity * 16}px) saturate(${1 + bgOpacity * 0.8})` : "none",
        WebkitBackdropFilter: bgOpacity > 0.05 ? `blur(${bgOpacity * 16}px) saturate(${1 + bgOpacity * 0.8})` : "none",
      }}
    >
      <div className="mx-auto flex h-[89px] w-full max-w-[1600px] items-center justify-between px-6 md:px-8 lg:px-10">
        {logoNode ? (
          <a href="#top" className="transition-opacity duration-150 hover:opacity-75" style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {logoNode}
          </a>
        ) : logo.includes("~") ? (
          <LogoWave logo={logo} size={18} href="#top" />
        ) : (
          <a
            href="#top"
            className="font-serif font-medium tracking-[-0.01em] text-[var(--color-text)] transition-opacity duration-150 hover:opacity-75"
            style={{ fontSize: "18px", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {logo}
          </a>
        )}

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-[16px] font-medium text-[var(--color-text)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ScheduleCta href={cta.href} label={cta.label} />
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-overlay"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)]/60 backdrop-blur md:hidden"
        >
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <MobileOverlay
            key="overlay"
            links={links}
            cta={cta}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function ScheduleCta({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-[#212121] px-5 py-2.5 font-sans text-[16px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#0f0f0f] active:scale-[0.98]"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {label}
    </a>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path
        d="M3 4.5 L6 7.5 L9 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  const lineBase = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    transformOrigin: "9px 7px",
  };

  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      aria-hidden
      className="text-[var(--color-text)]"
    >
      <line
        x1="1"
        y1="2"
        x2="17"
        y2="2"
        style={{ ...lineBase, transform: open ? "translateY(5px) rotate(45deg)" : "none" }}
      />
      <line
        x1="1"
        y1="7"
        x2="17"
        y2="7"
        style={{ ...lineBase, opacity: open ? 0 : 1 }}
      />
      <line
        x1="1"
        y1="12"
        x2="17"
        y2="12"
        style={{ ...lineBase, transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }}
      />
    </svg>
  );
}

function MobileOverlay({
  links,
  cta,
  onClose,
}: {
  links: NavLink[];
  cta: NavCta;
  onClose: () => void;
}) {
  return (
    <motion.div
      id="nav-mobile-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="fixed inset-0 top-[89px] z-40 flex flex-col bg-[var(--color-bg)] px-6 pb-10 pt-8 md:hidden"
      data-component="NavMobileOverlay"
      data-source="ui-kit/components/nav/NavSticky.tsx"
      data-tokens="color-bg,color-text,ease-out,font-serif"
    >
      <ul className="flex flex-col gap-5">
        {links.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 + i * 0.04,
              duration: 0.35,
              ease: EASE_OUT,
            }}
          >
            <a
              href={link.href}
              onClick={onClose}
              className="block font-serif text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--color-text)]"
            >
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 + links.length * 0.04, duration: 0.35, ease: EASE_OUT }}
        className="mt-auto pt-8"
      >
        <a
          href={cta.href}
          onClick={onClose}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#212121] px-6 py-4 font-sans text-[16px] font-medium text-white"
        >
          {cta.label}
          <ChevronDown />
        </a>
      </motion.div>
    </motion.div>
  );
}

