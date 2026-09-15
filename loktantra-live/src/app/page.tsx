import { Navbar } from "@/components/chrome/Navbar";
import { Hero } from "@/components/sections/Hero";
import { WireTicker } from "@/components/sections/WireTicker";
import { About } from "@/components/sections/About";
import { Desks } from "@/components/sections/Desks";
import { GroundReports } from "@/components/sections/GroundReports";
import { Feed } from "@/components/sections/Feed";
import { Voices } from "@/components/sections/Voices";
import { Brief } from "@/components/sections/Brief";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WireTicker />
        <About />
        <Desks />
        <GroundReports />
        <Feed />
        <Voices />
        <Brief />
        <Work />
      </main>
      <Footer />
    </>
  );
}
