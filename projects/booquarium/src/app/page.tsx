import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { PullQuote } from "@/components/sections/PullQuote";
import { About } from "@/components/sections/About";
import { Conversations } from "@/components/sections/Conversations";
import { Praise } from "@/components/sections/Praise";
import { Appearances } from "@/components/sections/Appearances";
import { Newsletter } from "@/components/sections/Newsletter";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee />
      <PullQuote />
      <About />
      <Conversations />
      <Praise />
      <Appearances />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
}
