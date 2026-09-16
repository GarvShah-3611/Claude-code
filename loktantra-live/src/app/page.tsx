import { Navbar } from "@/components/chrome/Navbar";
import { TravellingGavel } from "@/components/three/TravellingGavel";
import { Hero } from "@/components/sections/Hero";
import { WireTicker } from "@/components/sections/WireTicker";
import { About } from "@/components/sections/About";
import { Desks } from "@/components/sections/Desks";
import { GroundReports } from "@/components/sections/GroundReports";
import { Feed } from "@/components/sections/Feed";
import { Watch } from "@/components/sections/Watch";
import { Voices } from "@/components/sections/Voices";
import { Brief } from "@/components/sections/Brief";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <TravellingGavel />
      <Navbar />
      {/* Everything sits above the travelling object's fixed layer. */}
      <main className="relative z-10">
        <Hero />
        <WireTicker />
        <About />
        <Desks />
        <GroundReports />
        <Feed />
        <Watch />
        <Voices />
        <Brief />
        <Work />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
