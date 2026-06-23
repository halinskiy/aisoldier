import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";

import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";

// Type pairing verified by scout (research/TRENDS.md): Geist (display) +
// Hanken Grotesk (body), with Geist Mono for link/path strings only. One type
// system, two families.
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tracer. Screen recordings you actually own.",
  description:
    "A free, open-source macOS screen recorder. Hit record, the video lands in your own Dropbox, and you get a shareable link in seconds. No watermarks, no account for viewers, no renting your footage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${hanken.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-hydration motion bootstrap: resolve the ?motion=0 QA flag onto
            html[data-motion="off"] BEFORE first paint, so useEnhancementEnabled
            and the CSS scroll-timeline reveals see the static mode immediately
            (no flash of motion, no CLS). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(new URLSearchParams(location.search).get('motion')==='0'){document.documentElement.dataset.motion='off'}}catch(e){}",
          }}
        />
      </head>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
