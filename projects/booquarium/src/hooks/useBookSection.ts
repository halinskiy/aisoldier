"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useBookContext, type BookState } from "@/contexts/BookContext";

/**
 * Attach to a section element — when that section enters the viewport's
 * middle band the book state updates and the 3D book lerps to the new target.
 */
export function useBookSection(sectionState: BookState): RefObject<HTMLElement> {
  const { setBookState } = useBookContext();
  const ref = useRef<HTMLElement>(null);
  const stateRef = useRef(sectionState);
  stateRef.current = sectionState;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setBookState(stateRef.current);
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setBookState]);

  return ref as RefObject<HTMLElement>;
}
