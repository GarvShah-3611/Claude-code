"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { registerGsap, motionDisabled, ScrollTrigger, gsap } from "@/lib/motion";

/**
 * Owns page-level motion setup:
 *  - Lenis smooth scroll, driven by GSAP's ticker so the two never fight
 *    over rAF and ScrollTrigger stays in sync with Lenis' virtual scroll.
 *  - Motion's LazyMotion with `domAnimation`, which keeps the Motion
 *    runtime at roughly 5KB instead of the full ~34KB bundle.
 *
 * Under reduced motion Lenis is not started at all — native scrolling is
 * what that preference asks for.
 */
/**
 * The running instance, so a page change can jump the scroll without
 * fighting Lenis' virtual position. Nothing else should reach for it.
 */
let active: Lenis | null = null;

/** Put the viewport at the top the way a real page load would. */
export function jumpToTop() {
  if (active) active.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    if (motionDisabled()) {
      // Still refresh once so any ScrollTrigger measurements are correct.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    active = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // GSAP's ticker is the single rAF loop; Lenis reads from it.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images change layout height; re-measure once settled.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(onLoad);
    window.addEventListener("load", onLoad);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
      lenisRef.current = null;
      active = null;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
