import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";

import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Booquarium — Author Website Template",
  description:
    "A stunning, fully editable website template for book authors. Launch your book with a site that looks as good as it reads.",
  openGraph: {
    title: "Booquarium — Author Website Template",
    description:
      "A stunning, fully editable website template for book authors. Launch your book with a site that looks as good as it reads.",
    type: "website",
    locale: "en_US",
    siteName: "Booquarium",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable}`}>
      <body>
        <LenisProvider>
          <MotionProvider>{children}</MotionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
