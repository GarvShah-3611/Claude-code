"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { GavelFallback } from "./GavelFallback";

const GavelScene = dynamic(() => import("./GavelScene"), {
  ssr: false,
  loading: () => <GavelFallback />,
});

/**
 * Decides whether this device gets the 3D scene at all.
 *
 * The gate is about the machine, not the window. It used to require
 * min-width 768px as a proxy for "not a phone", but `hover: hover` and
 * `pointer: fine` already say that far more directly — and the width test
 * was excluding a case that matters: the site framed in a narrow panel on
 * a perfectly capable desktop, which got the flat fallback and therefore
 * never showed the 3D gavel to anyone viewing it that way.
 *
 * What is left is a real capability test: a fine pointer, enough cores,
 * motion not reduced, a box big enough to be worth a canvas, and the hero
 * actually on screen. Everything else keeps the static fallback, which
 * occupies the identical box so the layout never shifts between them.
 */
export function HeroVisual() {
  const [show3d, setShow3d] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const capable =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (navigator.hardwareConcurrency ?? 2) >= 4 &&
      // Below this the gavel is too small to read as an object and the
      // canvas is not worth the GPU.
      el.getBoundingClientRect().width >= 200;

    if (!capable) return;

    // Only pay for WebGL once the hero is actually in view, and drop it
    // again when it scrolls away so the GPU is idle down the page.
    const io = new IntersectionObserver(
      ([entry]) => setShow3d(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-square w-full max-w-[34rem] lg:max-w-none"
    >
      {/* Glow sits behind both states so the composition is identical. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender/60 blur-[90px]"
      />
      <div className="absolute inset-0">
        {show3d ? <GavelScene /> : <GavelFallback />}
      </div>
    </div>
  );
}
