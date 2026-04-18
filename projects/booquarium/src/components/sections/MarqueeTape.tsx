"use client";

import { motion } from "framer-motion";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/MarqueeTape.tsx";
const SEP = "◆";

export function MarqueeTape() {
  const { items } = copy.marquee;

  return (
    <div
      data-component="MarqueeTape"
      data-source={DATA_SOURCE}
      style={{
        position: "relative",
        height: "96px",
        overflow: "hidden",
        margin: "clamp(32px, 5vw, 56px) 0",
      }}
    >
      {/* Absolute strip — centred, rotated, bleeds past horizontal edges */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-6%",
          right: "-6%",
          transform: "translateY(-50%) rotate(-1.8deg)",
          backgroundColor: "#111",
          padding: "14px 0",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {items.map((item, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="font-sans font-medium uppercase text-white"
                    style={{ fontSize: "13px", letterSpacing: "0.12em", padding: "0 28px" }}
                  >
                    {item}
                  </span>
                  <span style={{ color: "#B8322C", fontSize: "7px", flexShrink: 0 }} aria-hidden>
                    {SEP}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
