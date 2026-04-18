import { NavSticky } from "@kit/components/nav/NavSticky";
import { Logo } from "@/components/Logo";
import copy from "@content/copy.json";

export function Nav() {
  return (
    <NavSticky
      logo={copy.nav.logo}
      logoNode={<Logo />}
      links={copy.nav.links}
      cta={copy.nav.cta}
      dataSource="projects/booquarium/src/components/sections/Nav.tsx"
    />
  );
}
