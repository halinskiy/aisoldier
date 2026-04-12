import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/ServicesList.tsx";

/**
 * Section 5 — Services list ("Explore our service offerings").
 *
 * Geometry (FIGMA_SPEC §5):
 *   - py-[120px] symmetric padding
 *   - SectionHeader on top (split) — eyebrow "Services" (🟠 duplicate of §4
 *     kept verbatim, see HANDOFF.md)
 *   - 4 full-width rows stacked vertically, 149 tall in Figma, ~16px gap
 *
 * Content reframed vs §4:
 *   §4 Services showcase = WHAT we do (Wealth Planning / Tax / Estate…)
 *   §5 Services list     = HOW we engage (Discretionary / Advisory /
 *                          Family CFO / Project-based)
 *   This keeps real content variety so §5 doesn't duplicate §4 in a different
 *   layout. Studio-authored engagement types, flagged in HANDOFF.md for
 *   client confirmation.
 *
 * `ServiceListRow` stays LOCAL — single use, not a kit candidate.
 */
export function ServicesList() {
  const { servicesList } = copy;

  return (
    <section
      id="service-offerings"
      data-component="ServicesList"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={servicesList.eyebrow}
          headline={servicesList.headline}
          body={servicesList.body}
          cta={servicesList.cta}
          dataSource={DATA_SOURCE}
        />

        <ul
          data-component="ServiceListRows"
          data-source={DATA_SOURCE}
          data-tokens="color-border,color-surface"
          className="mt-16 flex flex-col border-b border-[var(--color-border)] lg:mt-20"
        >
          {servicesList.rows.map((row) => (
            <ServiceListRow
              key={row.number}
              number={row.number}
              title={row.title}
              description={row.description}
              href={row.href}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type ServiceListRowProps = {
  number: string;
  title: string;
  description: string;
  href?: string;
};

function ServiceListRow({ number, title, description, href }: ServiceListRowProps) {
  const Tag = href ? "a" : "div";
  return (
    <li
      data-motion="blur-reveal"
      className="group block border-t border-[var(--color-border)]"
    >
      <Tag
        {...(href ? { href } : {})}
        data-component="ServiceListRow"
        data-source={DATA_SOURCE}
        data-tokens="color-border,color-surface,color-text,color-text-muted,color-accent,font-serif"
        className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-6 transition-colors duration-200 hover:bg-[var(--color-surface)] md:gap-10 md:py-8 lg:grid-cols-[120px_1fr_auto] lg:gap-12 lg:py-10"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Left — big serif number */}
        <span
          aria-hidden
          className="font-serif font-normal text-[var(--color-text-muted)] transition-colors duration-200 group-hover:text-[var(--color-accent)]"
          style={{
            fontSize: "clamp(32px, 4.5vw, 48px)",
            lineHeight: "1",
            letterSpacing: "-0.042em",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {number}
        </span>

        {/* Middle — title + description */}
        <div className="flex min-w-0 flex-col gap-2">
          <h3
            className="font-serif font-normal text-[var(--color-text)]"
            style={{
              fontSize: "clamp(22px, 2.3vw, 28px)",
              lineHeight: "1.2",
              letterSpacing: "-0.018em",
            }}
          >
            {title}
          </h3>
          <p className="max-w-[640px] text-[16px] leading-[1.5] text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>

        {/* Right — chevron in ghost circle button */}
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] transition-[transform,border-color,background-color,color] duration-200 group-hover:translate-x-1 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M3 8 L13 8 M8 3 L13 8 L8 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      </Tag>
    </li>
  );
}
