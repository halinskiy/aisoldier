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
      tagline={footer.legal}
      links={footer.links}
      hideBottomBar
      dataSource={DATA_SOURCE}
    />
  );
}
