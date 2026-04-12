import { NavSticky } from "@kit/components/nav/NavSticky";
import copy from "@content/copy.json";

/**
 * Section 0 — Nav / Header.
 * Thin wrapper around the kit's NavSticky, injecting project-specific copy.
 */
export function Nav() {
  return (
    <NavSticky
      logo={copy.nav.logo}
      links={copy.nav.links}
      cta={copy.nav.cta}
      dataSource="projects/template-design/src/components/sections/Nav.tsx"
    />
  );
}
