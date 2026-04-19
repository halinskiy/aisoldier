"use client";

import { useState, type FormEvent } from "react";

import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { BlurReveal } from "@kit/components/motion/BlurReveal";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Newsletter.tsx";

/**
 * Section 5 — Newsletter CTA.
 *
 * Full-width dot-grid surface, centred composition, single-purpose form.
 * On submit: preventDefault, flip state to show an inline "Thank you"
 * confirmation — no backend required.
 */
export function Newsletter() {
  const { newsletter } = copy;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      data-component="Newsletter"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent,font-serif,radius-button"
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: "clamp(112px,16vh,220px)",
        paddingBottom: "clamp(112px,16vh,220px)",
        backgroundColor: "var(--color-bg)",
        backgroundImage:
          "radial-gradient(circle, rgba(33,33,33,0.12) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center gap-8 px-6 text-center md:px-8">
        <BlurReveal delay={0.05}>
          <EyebrowLabel>{newsletter.eyebrow}</EyebrowLabel>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h2
            className="font-serif font-medium text-[var(--color-text)]"
            style={{
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            {newsletter.headline}
          </h2>
        </BlurReveal>

        <BlurReveal delay={0.16}>
          <p className="max-w-[520px] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
            {newsletter.body}
          </p>
        </BlurReveal>

        <BlurReveal delay={0.22}>
          <div className="w-full max-w-[480px]">
            {submitted ? (
              <Confirmation />
            ) : (
              <form
                onSubmit={handleSubmit}
                data-component="NewsletterForm"
                data-source={DATA_SOURCE}
                className="flex w-full flex-col gap-2 sm:flex-row sm:gap-2"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder={newsletter.placeholder}
                  className="h-12 flex-1 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-sans text-[16px] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none transition-[border-color] duration-150"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <button
                  type="submit"
                  data-component="Button"
                  data-source={DATA_SOURCE}
                  data-tokens="color-text,color-bg,color-accent,radius-button,ease-out"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[var(--color-text)] px-6 font-sans text-[16px] font-medium text-[var(--color-bg)] transition-[background-color,transform] duration-150 hover:bg-[#0f0f0f] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <span>{newsletter.cta}</span>
                  <span
                    aria-hidden
                    className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]"
                  />
                </button>
              </form>
            )}

            <p
              className="mt-3 text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]"
            >
              No spam. One email per release.
            </p>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Confirmation() {
  return (
    <div
      role="status"
      aria-live="polite"
      data-component="NewsletterConfirmation"
      data-source={DATA_SOURCE}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-[8px] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-6 text-[16px] font-medium text-[var(--color-text)]"
    >
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-bg)]"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6.5L5 9.5L10.5 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>Thank you. You’re on the list.</span>
    </div>
  );
}
