"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { EASE_OUT } from "../../lib/motion";

export type SplitTextProps = {
  /** The text to split. Each word animates independently. */
  text: string;
  /** Stagger between words in seconds. Default 0.04. */
  stagger?: number;
  /** Duration of the per-word transition. Default 0.6. */
  duration?: number;
  /** Initial delay before the first word. Default 0.1. */
  delayStart?: number;
  /** Tailwind class forwarded to the `<p>` wrapper. */
  className?: string;
  /** Render tag — default `<p>`. Pass `"span"` or `"div"` if you need inline behaviour. */
  as?: "p" | "span" | "div";
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/motion/SplitText.tsx";

/**
 * Word-by-word reveal. Each word in the string becomes an inline-block
 * `<motion.span>` and animates `opacity / y / filter(blur)` on stagger.
 *
 * Used for long narrative paragraphs in the About section. The effect
 * is purely visual — the rendered text is still copy-paste-selectable
 * because each word is a real text node inside its own span.
 *
 * Honours `prefers-reduced-motion`.
 */
export function SplitText({
  text,
  stagger = 0.04,
  duration = 0.6,
  delayStart = 0.1,
  className,
  as = "p",
  dataSource,
}: SplitTextProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const words = text.split(/(\s+)/);
  const Tag = as;

  if (prefersReduced) {
    return (
      <Tag
        ref={ref as never}
        className={className}
        data-component="SplitText"
        data-source={dataSource ?? DATA_SOURCE_DEFAULT}
        data-tokens="ease-out"
        data-motion="split-text-reveal"
        data-motion-state="reduced"
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-component="SplitText"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="ease-out"
      data-motion="split-text-reveal"
      style={{ overflow: "visible" }}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : undefined
            }
            transition={{
              duration,
              ease: EASE_OUT,
              delay: delayStart + i * stagger,
            }}
            style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
          >
            {word}
          </motion.span>
        );
      })}
    </Tag>
  );
}
