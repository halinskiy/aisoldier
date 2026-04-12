import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Inspector } from "@kit/components/devtools/Inspector";

import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  // 400 Regular → H2-H5 narrative headings (including Section 3 H3)
  // 500 Medium  → H0, H1, H6 display headings
  // Doctrine drops 700 — nothing in the Figma uses bold serif.
  weight: ["400", "500"],
  variable: "--font-plex-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fee-Only Fiduciary Wealth Management | Template Design",
  description:
    "Template Design manages $3.2B+ for 400+ families. Fee-only, fiduciary-first. Tax strategy, estate planning, and portfolio management. Book a review today.",
  openGraph: {
    title: "Fee-Only Fiduciary Wealth Management | Template Design",
    description:
      "Template Design manages $3.2B+ for 400+ families. Fee-only, fiduciary-first. Tax strategy, estate planning, and portfolio management. Book a review today.",
    type: "website",
    locale: "en_US",
    siteName: "Template Design",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable}`}>
      <body>
        <LenisProvider>
          <MotionProvider>{children}</MotionProvider>
        </LenisProvider>
        {process.env.NODE_ENV === "development" && <Inspector />}
      </body>
    </html>
  );
}
