import { FooterEditorial } from "@kit/components/section/FooterEditorial";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Footer.tsx";

/**
 * Section 6 — Footer.
 *
 * Thin project wrapper around the kit's `FooterEditorial`. Uses the site
 * copy's brand name as the oversized wordmark (not the nav logo, which is
 * the same string here but conceptually decoupled).
 */
export function Footer() {
  const { footer, nav } = copy;

  return (
    <FooterEditorial
      wordmark={nav.logo}
      tagline={footer.tagline}
      links={footer.links}
      legal={footer.legal}
      builtWith={
        <span>
          Built with{" "}
          <a
            href="#top"
            className="underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors duration-150 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Booquarium
          </a>
        </span>
      }
      topHref="#top"
      dataSource={DATA_SOURCE}
    />
  );
}
