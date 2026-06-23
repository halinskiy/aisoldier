"use client";

import { useScroll, type MotionValue } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  useGlobalProgress - the ONE page-level scroll source                       */
/* -------------------------------------------------------------------------- */
/**
 * The single `useScroll()` with NO target on the page (global page progress,
 * 0..1 top-to-bottom). The ScrollDot spine and the ambient parallax bgY BOTH
 * read this one value (SECTION_CONTRACT_V3 S3b + S5/A7). There must be exactly
 * one no-target useScroll() in the whole codebase (J: `grep -c "useScroll()"`
 * returns 1) - so this hook owns it and everything else passes it the raw
 * `scrollYProgress` MotionValue.
 *
 * Deliberately NOT spring-smoothed here: the dot must track the page honestly
 * (a slow spring on the global value makes it lag behind the wheel). Consumers
 * that want glide apply a LIGHT spring to their own derived transform, not to
 * this source.
 *
 * Project-local; promote to ui-kit/hooks alongside ScrollDot after review.
 */
export function useGlobalProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}
