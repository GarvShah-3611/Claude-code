"use client";

import { useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { useRoute, type Route } from "@/lib/router";
import { registerGsap, ScrollTrigger } from "@/lib/motion";
import { jumpToTop } from "@/components/providers/SmoothScroll";

import { Navbar } from "@/components/chrome/Navbar";
import { Hero } from "@/components/sections/Hero";
import { WireTicker } from "@/components/sections/WireTicker";
import { DeskIndex } from "@/components/sections/DeskIndex";
import { About } from "@/components/sections/About";
import { GroundReports } from "@/components/sections/GroundReports";
import { Feed } from "@/components/sections/Feed";
import { Watch } from "@/components/sections/Watch";
import { Voices } from "@/components/sections/Voices";
import { Brief } from "@/components/sections/Brief";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";

/**
 * Click-to-open pages instead of one long scroll.
 *
 * Each nav item swaps the whole body rather than scrolling to an anchor, so
 * a reader who came for one desk lands on it. Transitions are short — a
 * page change should feel like arriving, not like waiting.
 *
 * Kept as one route with a hash rather than separate Next routes on
 * purpose: this is exported statically and served from a subdirectory, so a
 * hard refresh on a real /ground path would ask a server that is not there.
 */

function Page({ route }: { route: Route }) {
  switch (route) {
    case "about":
      return <About />;
    case "ground":
      return <GroundReports />;
    case "watch":
      return <Watch />;
    case "feed":
      return <Feed />;
    case "voices":
      return <Voices />;
    case "write":
      return <Work />;
    default:
      return (
        <>
          <Hero />
          <WireTicker />
          <DeskIndex />
          <Brief />
        </>
      );
  }
}

export function PageShell() {
  const [route] = useRoute();

  useEffect(() => {
    registerGsap();
    // A new page starts at its top, and any scroll-driven measurement taken
    // against the previous page's height is now wrong. The jump is instant
    // on purpose: smooth-scrolling up through the page you just left is a
    // delay, not a transition — the crossfade is the transition.
    jumpToTop();
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 420);
    return () => window.clearTimeout(t);
  }, [route]);

  return (
    <>
      <Navbar />
      <main id="main" className="relative z-10 pt-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={route}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <Page route={route} />
          </m.div>
        </AnimatePresence>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
