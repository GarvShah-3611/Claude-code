"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { GavelFallback } from "./GavelFallback";
import { gsap, registerGsap, motionDisabled, ScrollTrigger } from "@/lib/motion";

const GavelScene = dynamic(() => import("./GavelScene"), {
  ssr: false,
  loading: () => <GavelFallback />,
});

/**
 * The gavel, as a fixed layer that travels the page.
 *
 * Instead of sitting in the hero and scrolling away, the object stays on
 * screen and moves to a new station as each section arrives: right of the
 * headline, left of the origin story, tucked under the desks, away entirely
 * while the ground-report rail needs the width, then back for the Brief.
 *
 * Discrete eased hops rather than a scrubbed timeline. A scrub ties the
 * object to the scrollbar and it jitters with every small wheel movement;
 * hopping on section entry reads as the object *reacting* to where you are.
 *
 * Desktop only, and only when motion is allowed. Narrow screens have no
 * margin to park an object in, so there the gavel stays inline in the hero.
 */

type Station = {
  /** Section that puts the object here. */
  id: string;
  x: number; // vw from centre
  y: number; // vh from centre
  scale: number;
  rotate: number; // deg, the whole canvas
  opacity: number;
};

const STATIONS: Station[] = [
  { id: "main", x: 27, y: 8, scale: 1, rotate: 0, opacity: 1 },
  { id: "ticker", x: 27, y: 8, scale: 1, rotate: 0, opacity: 1 },
  { id: "about", x: -32, y: -4, scale: 0.58, rotate: -14, opacity: 0.95 },
  { id: "desks", x: 30, y: 24, scale: 0.46, rotate: 12, opacity: 0.9 },
  // The rail uses the full width; the object would fight it.
  { id: "ground", x: 44, y: 30, scale: 0.3, rotate: 24, opacity: 0 },
  { id: "feed", x: -34, y: 22, scale: 0.42, rotate: -20, opacity: 0.9 },
  { id: "watch", x: 34, y: -18, scale: 0.4, rotate: 16, opacity: 0.85 },
  { id: "voices", x: -30, y: 18, scale: 0.44, rotate: -10, opacity: 0.9 },
  { id: "brief", x: 0, y: 30, scale: 0.52, rotate: 0, opacity: 1 },
  { id: "work", x: 33, y: 16, scale: 0.42, rotate: 18, opacity: 0.85 },
  { id: "site-footer", x: 0, y: 34, scale: 0.36, rotate: 0, opacity: 0.6 },
];

export function TravellingGavel() {
  const [active, setActive] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [mounted3d, setMounted3d] = useState(false);

  useEffect(() => {
    const capable =
      window.matchMedia("(min-width: 1024px) and (hover: hover)").matches &&
      !motionDisabled();
    if (!capable) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = box.current;
    if (!el) return;
    registerGsap();

    // WebGL only once the layer is really on screen and the browser is idle,
    // so it never competes with the hero's own load animation.
    const idle = window.setTimeout(() => setMounted3d(true), 600);

    const first = STATIONS[0];
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: `${first.x}vw`,
      y: `${first.y}vh`,
      scale: first.scale,
      rotate: first.rotate,
      opacity: first.opacity,
    });

    const go = (s: Station) =>
      gsap.to(el, {
        x: `${s.x}vw`,
        y: `${s.y}vh`,
        scale: s.scale,
        rotate: s.rotate,
        opacity: s.opacity,
        duration: 1.05,
        ease: "power3.inOut",
        overwrite: "auto",
      });

    const triggers = STATIONS.map((s) => {
      const target = document.getElementById(s.id);
      if (!target) return null;
      return ScrollTrigger.create({
        trigger: target,
        start: "top 62%",
        end: "bottom 38%",
        onEnter: () => go(s),
        onEnterBack: () => go(s),
      });
    }).filter(Boolean) as ScrollTrigger[];

    return () => {
      window.clearTimeout(idle);
      triggers.forEach((t) => t.kill());
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
    >
      <div
        ref={box}
        className="absolute left-1/2 top-1/2 h-[min(46vh,26rem)] w-[min(46vh,26rem)]"
      >
        {/* Only the object itself takes the pointer, so the page stays
            clickable everywhere the gavel happens to be passing. */}
        <div className="pointer-events-auto h-full w-full">
          {mounted3d ? <GavelScene /> : <GavelFallback />}
        </div>
      </div>
    </div>
  );
}
