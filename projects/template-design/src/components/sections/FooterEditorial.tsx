import type { ReactElement } from "react";

import { LogoWave } from "@kit/components/brand/LogoWave";

import { DARK_SCOPE } from "@/lib/darkScope";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/FooterEditorial.tsx";

/**
 * Section 12 — Footer.
 *
 * Dark block continuing the Contact theme scope. Three visual rows:
 *
 *   Row 1: [logo + tagline] / [sitemap]
 *   Row 2: decorative 8-dot row (one accent) + hairline divider
 *   Row 3: [socials] / [legal + copyright]
 *
 * Reuses the canonical `DARK_SCOPE` from `src/lib/darkScope.ts`. Kit
 * primitives (`LogoWave`) inherit their colors through CSS variables.
 *
 * 🔴 Must-fix gaps closed via `copy.json`:
 *   - footer.legal reads "...prioritize your interests..." (NOT "our")
 *   - footer.copyright reads "...Made by 3mpq studio." (NOT "Webflow")
 * Both are consumed verbatim from JSON — CDP assertion in the shoot
 * script verifies the runtime DOM text at render time.
 */
export function FooterEditorial() {
  const { footer } = copy;

  return (
    <footer
      data-component="FooterEditorial"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-text-subtle,color-border,color-accent,font-serif"
      className="relative w-full"
      style={DARK_SCOPE}
    >
      <div
        className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8"
        style={{ paddingTop: "clamp(64px,10vh,96px)", paddingBottom: "clamp(48px,6vh,72px)" }}
      >
        {/* Row 1: logo + tagline / sitemap */}
        <div data-motion="blur-reveal" data-motion-index={0} className="grid grid-cols-1 gap-y-12 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0">
          <div className="flex max-w-[501px] flex-col gap-6">
            <LogoWave
              logo={footer.logo}
              size={22}
              href="#top"
              dataSource={DATA_SOURCE}
            />
            <p className="max-w-[420px] text-[16px] leading-[1.55] text-[var(--color-text-muted)]">
              {footer.tagline}
            </p>
          </div>

          <div aria-hidden className="hidden lg:block" />

          <nav
            aria-label="Footer"
            data-component="FooterSitemap"
            data-source={DATA_SOURCE}
            data-tokens="color-text,color-accent"
            className="flex flex-col gap-3 lg:items-end lg:text-right"
          >
            {footer.sitemap.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-block text-[16px] font-medium text-[var(--color-text)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Row 2: hairline divider */}
        <div data-motion="blur-reveal" data-motion-index={1} className="mt-16">
          <span
            aria-hidden
            className="block h-px w-full bg-[var(--color-border)]"
          />
        </div>

        {/* Row 3: socials / legal + copyright */}
        <div data-motion="blur-reveal" data-motion-index={2} className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <SocialRow />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-10">
            <p
              data-component="FooterLegal"
              data-source={DATA_SOURCE}
              className="max-w-[520px] text-[14px] leading-[1.55] text-[var(--color-text-subtle)]"
            >
              {footer.legal}
            </p>
            <p
              data-component="FooterCopyright"
              data-source={DATA_SOURCE}
              className="text-[14px] leading-[1.55] text-[var(--color-text-subtle)] lg:text-right"
            >
              {footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

function DotRow() {
  // 8 dots, index 2 (third from left) is the accent one.
  const dots = Array.from({ length: 8 });
  return (
    <ul
      data-component="FooterDotRow"
      data-source={DATA_SOURCE}
      data-tokens="color-accent,color-text-subtle"
      className="flex items-center gap-3"
    >
      {dots.map((_, i) => (
        <li
          key={i}
          aria-hidden
          className="block h-[10px] w-[10px] rounded-full"
          style={{
            backgroundColor:
              i === 2 ? "var(--color-accent)" : "rgba(244, 244, 244, 0.22)",
          }}
        />
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */

type SocialName = "LinkedIn" | "WhatsApp" | "Instagram" | "Facebook";

function SocialRow() {
  const socials: Array<{ name: SocialName; href: string }> = [
    { name: "LinkedIn", href: "#" },
    { name: "WhatsApp", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
  ];

  return (
    <ul
      data-component="FooterSocials"
      data-source={DATA_SOURCE}
      data-tokens="color-text-muted,color-accent"
      className="flex items-center gap-5"
    >
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            aria-label={s.name}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-[color,border-color,background-color] duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <SocialIcon name={s.name} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialIcon({ name }: { name: SocialName }) {
  const paths: Record<SocialName, ReactElement> = {
    LinkedIn: (
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5 2.5 2.5 0 0 1 4.98 3.5ZM3 10h4v11H3V10Zm7 0h3.8v1.5h.05A4.17 4.17 0 0 1 17.6 9.5c4.1 0 4.85 2.7 4.85 6.2V21H18.5v-4.6c0-1.1-.02-2.5-1.52-2.5-1.52 0-1.75 1.19-1.75 2.42V21H10V10Z"
      />
    ),
    WhatsApp: (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.69 14.96L2 22l5.18-1.36A10 10 0 1 0 12 2Zm5.39 14.3c-.23.66-1.32 1.25-1.87 1.3-.5.05-1.14.07-1.84-.12a16.64 16.64 0 0 1-1.67-.62c-2.94-1.27-4.86-4.23-5-4.42-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.16 1.02-2.46.27-.3.58-.37.78-.37h.55c.18 0 .42-.07.66.5.25.6.83 2.06.9 2.2.07.15.12.32.02.52-.1.2-.14.32-.28.5-.13.17-.28.38-.4.5-.13.14-.27.28-.12.55.16.27.71 1.17 1.52 1.9 1.05.93 1.94 1.22 2.21 1.36.27.13.43.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.24.08 1.53.72 1.8.85.26.14.43.2.5.32.07.12.07.72-.16 1.38Z"
      />
    ),
    Instagram: (
      <>
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </>
    ),
    Facebook: (
      <path
        fill="currentColor"
        d="M13.5 22v-8h2.7l.4-3.13H13.5V8.9c0-.9.25-1.52 1.55-1.52h1.66V4.57a22.1 22.1 0 0 0-2.42-.12c-2.4 0-4.05 1.47-4.05 4.16v2.33H7.5V14h2.73v8h3.27Z"
      />
    ),
  };

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      {paths[name]}
    </svg>
  );
}
