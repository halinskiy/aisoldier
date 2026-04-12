"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

/**
 * Root-level Lenis smooth-scroll wrapper.
 *
 * Intercepts anchor link clicks (href="#something") and uses Lenis
 * scrollTo() for a smooth animated scroll instead of the browser's
 * instant jump. Works for Nav links, Footer sitemap, and any other
 * anchor on the page.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <AnchorScrollHandler />
      {children}
    </ReactLenis>
  );
}

/**
 * Listens for clicks on anchor links and delegates to Lenis scrollTo().
 * Must be a child of ReactLenis so useLenis() has access to the instance.
 */
function AnchorScrollHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      // Special case: #top scrolls to page top
      if (hash === "#top") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        duration: 1.4,
        offset: -100, // offset for sticky nav height
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [lenis]);

  return null;
}
