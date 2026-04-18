import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Books } from "@/components/sections/Books";
import { Features } from "@/components/sections/Features";
import { Praise } from "@/components/sections/Praise";
import { Newsletter } from "@/components/sections/Newsletter";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Books />
      <Features />
      <Praise />
      <Newsletter />
      <FAQ />
      <Footer />
    </main>
  );
}
