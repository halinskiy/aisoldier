"use client";

import dynamic from "next/dynamic";
import { useBookContext } from "@/contexts/BookContext";

const BookScene = dynamic(
  () => import("@/components/3d/BookScene").then((m) => m.BookScene),
  { ssr: false },
);

/**
 * Fixed full-viewport R3F canvas — sits above sections (z-10, pointer-events:none).
 * Hidden on mobile; on desktop the book floats as a persistent presence.
 */
export function BookCanvas() {
  const { stateRef } = useBookContext();
  return (
    <div
      aria-hidden
      data-component="BookCanvas"
      data-source="projects/booquarium/src/components/BookCanvas.tsx"
      className="pointer-events-none fixed inset-0 z-10 hidden lg:block"
    >
      <BookScene bookStateRef={stateRef} />
    </div>
  );
}
