"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DATA_SOURCE = "projects/booquarium/src/components/Loader.tsx";

/*
 * Intro loader — CSS book animates open, then morphically dissolves into the
 * Hero 3D scene.
 *
 * Timeline (ms):
 *   0       Mount. Lenis paused, scroll locked.
 *   0       Scroll to hero "pages open" state so R3F book starts lerping.
 *   400     CSS cover begins opening (rotateY 0 → -120°, 800ms).
 *   1600    Fade-out begins (600ms).
 *   2200    Overlay gone. Lenis resumed.
 */

// scrollYProgress = 0.42 → pages open. Hero height = 500vh.
const SCROLL_FRACTION = 0.42;

type Phase = "enter" | "open" | "exit" | "done";

export function Loader() {
  const [phase, setPhase] = useState<Phase>("enter");
  const lenis = useLenis();
  const prefersReduced = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (prefersReduced) {
      setPhase("done");
      return;
    }

    // Lock scroll while loader plays (lenis may be null in test envs — that's fine)
    lenis?.stop();

    const heroEl = document.getElementById("book-hero");
    if (heroEl && lenis) {
      const targetY = heroEl.offsetHeight * SCROLL_FRACTION;
      lenis.scrollTo(targetY, { immediate: true, force: true });
    }

    const t1 = setTimeout(() => setPhase("open"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1600);
    const t3 = setTimeout(() => {
      setPhase("done");
      lenis?.start();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      data-component="Loader"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,accent"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "all",
        transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <CSSBook open={phase === "open" || phase === "exit"} />

      <p
        style={{
          fontFamily: "var(--font-plex-serif), Georgia, serif",
          fontStyle: "italic",
          fontSize: "16px",
          color: "var(--color-text-subtle)",
          letterSpacing: "0.01em",
          opacity: phase === "open" || phase === "exit" ? 0 : 1,
          transition: "opacity 400ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        Opening…
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CSS Book                                                                    */
/* -------------------------------------------------------------------------- */

function CSSBook({ open }: { open: boolean }) {
  const BW = 120;    // book width px
  const BH = 162;    // book height px
  const COVER_D = 8; // cover depth (for spine)
  const PAGES_D = 18;
  const SPINE_W = 12;

  return (
    <div
      style={{
        position: "relative",
        width: BW + SPINE_W,
        height: BH,
        perspective: "600px",
      }}
    >
      {/* Spine */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SPINE_W,
          height: BH,
          backgroundColor: "#6e1410",
          borderRadius: "2px 0 0 2px",
        }}
      />

      {/* Pages block */}
      <div
        style={{
          position: "absolute",
          left: SPINE_W,
          top: COVER_D / 2,
          width: BW - 4,
          height: BH - COVER_D,
          backgroundColor: "#f0ebe0",
          borderRight: "1px solid rgba(100,80,50,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Horizontal page lines */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: 16 + i * 10,
              height: 1,
              backgroundColor: "rgba(100,80,50,0.12)",
            }}
          />
        ))}
        {/* Drop cap hint */}
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 14,
            width: 20,
            height: 20,
            fontFamily: "Georgia, serif",
            fontSize: "22px",
            fontWeight: "bold",
            color: "var(--color-accent)",
            lineHeight: 1,
          }}
        >
          T
        </div>
      </div>

      {/* Front cover — pivot at LEFT edge (spine) */}
      <div
        style={{
          position: "absolute",
          left: SPINE_W,
          top: 0,
          width: BW,
          height: BH,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          transform: open
            ? "perspective(600px) rotateY(-118deg)"
            : "perspective(600px) rotateY(0deg)",
          transition: open
            ? "transform 900ms cubic-bezier(0.16,1,0.3,1)"
            : "none",
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0d1b2a 0%, #122438 50%, #0a1520 100%)",
            backfaceVisibility: "hidden",
            borderRadius: "0 3px 3px 0",
            overflow: "hidden",
          }}
        >
          {/* Gold border */}
          <div
            style={{
              position: "absolute",
              inset: "5px",
              border: "1px solid rgba(201,168,76,0.6)",
              borderRadius: "2px",
              pointerEvents: "none",
            }}
          />
          {/* Cover ornament */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "38%",
              transform: "translate(-50%,-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(201,168,76,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.5)",
                backgroundColor: "rgba(201,168,76,0.15)",
              }}
            />
          </div>
          {/* Title lines */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              left: "10px",
              right: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "80%",
                backgroundColor: "rgba(201,168,76,0.4)",
              }}
            />
            <div
              style={{
                height: "6px",
                width: "60%",
                backgroundColor: "rgba(248,243,233,0.7)",
                borderRadius: "1px",
              }}
            />
            <div
              style={{
                height: "4px",
                width: "40%",
                backgroundColor: "rgba(248,243,233,0.4)",
                borderRadius: "1px",
              }}
            />
            <div
              style={{
                height: "1px",
                width: "80%",
                backgroundColor: "rgba(201,168,76,0.4)",
              }}
            />
          </div>
        </div>

        {/* Back face (inside cover — bookplate, cream) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ede8de",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "0 3px 3px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid rgba(100,80,50,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "rgba(100,80,50,0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
