import { NavSticky } from "@kit/components/nav/NavSticky";
import copy from "@content/copy.json";

export function Nav() {
  return (
    <NavSticky
      logo={copy.nav.logo}
      links={copy.nav.links}
      cta={copy.nav.cta}
      dataSource="projects/booquarium/src/components/sections/Nav.tsx"
    />
  );
}
