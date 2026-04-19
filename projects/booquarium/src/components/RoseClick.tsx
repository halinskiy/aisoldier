"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ROSES = [
  `${BASE}/roses/rose1.png`,
  `${BASE}/roses/rose2.png`,
  `${BASE}/roses/rose3.png`,
  `${BASE}/roses/rose4.png`,
];

type Rose = {
  id: number;
  src: string;
  /** css left/top as % relative to the book container */
  x: number;
  y: number;
  rotate: number;
  /** which edge the rose bursts from */
  edge: "left" | "right" | "top" | "bottom";
};

let counter = 0;

type Props = {
  /** Attach this ref to the book container div */
  containerRef: React.RefObject<HTMLElement | null>;
};

export function useRoseClick(containerRef: Props["containerRef"]) {
  const [roses, setRoses] = useState<Rose[]>([]);
  const lastRoseIdx = useRef(0);

  const spawnRose = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      const relX = (e.clientX - rect.left) / rect.width;   // 0–1
      const relY = (e.clientY - rect.top) / rect.height;   // 0–1

      // Determine closest edge
      const distLeft   = relX;
      const distRight  = 1 - relX;
      const distTop    = relY;
      const distBottom = 1 - relY;
      const min = Math.min(distLeft, distRight, distTop, distBottom);

      let edge: Rose["edge"];
      let x: number;
      let y: number;

      if (min === distLeft) {
        edge = "left"; x = -8; y = relY * 100;
      } else if (min === distRight) {
        edge = "right"; x = 108; y = relY * 100;
      } else if (min === distTop) {
        edge = "top"; x = relX * 100; y = -8;
      } else {
        edge = "bottom"; x = relX * 100; y = 108;
      }

      // Pick next rose in sequence (avoids same twice in a row)
      const idx = lastRoseIdx.current % ROSES.length;
      lastRoseIdx.current += 1;

      const rose: Rose = {
        id: counter++,
        src: ROSES[idx]!,
        x,
        y,
        rotate: (Math.random() - 0.5) * 40,
        edge,
      };

      setRoses((prev) => [...prev.slice(-5), rose]); // keep max 6 alive
      setTimeout(() => {
        setRoses((prev) => prev.filter((r) => r.id !== rose.id));
      }, 2400);
    },
    [containerRef],
  );

  return { roses, spawnRose };
}

/* -------------------------------------------------------------------------- */

const DRIFT: Record<Rose["edge"], { x: number; y: number }> = {
  left:   { x: -30, y: -60 },
  right:  { x:  30, y: -60 },
  top:    { x:   0, y: -70 },
  bottom: { x:   0, y:  50 },
};

export function RoseLayer({ roses }: { roses: Rose[] }) {
  return (
    <AnimatePresence>
      {roses.map((rose) => {
        const drift = DRIFT[rose.edge];
        return (
          <motion.img
            key={rose.id}
            src={rose.src}
            alt=""
            aria-hidden
            draggable={false}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: rose.rotate - 15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: rose.rotate, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
            exit={{
              opacity: 0,
              scale: 0.7,
              x: drift.x,
              y: drift.y,
              rotate: rose.rotate + (rose.id % 2 === 0 ? 20 : -20),
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{
              position: "absolute",
              left: `${rose.x}%`,
              top: `${rose.y}%`,
              width: "200px",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 5,
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
            }}
          />
        );
      })}
    </AnimatePresence>
  );
}
