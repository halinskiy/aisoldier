import { BookProvider } from "@/contexts/BookContext";
import { BookCanvas } from "@/components/BookCanvas";
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
    <BookProvider>
      {/* Fixed 3D book canvas — desktop only, z-10, pointer-events:none */}
      <BookCanvas />

      <Nav />
      <main>
        <Hero />
        <About />
        <Books />
        <Features />
        <Praise />
        <Newsletter />
        <FAQ />
        <Footer />
      </main>
    </BookProvider>
  );
}
