"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ColonnadeFallback } from "./ColonnadeFallback";

const ColonnadeScene = dynamic(() => import("./ColonnadeScene"), {
  ssr: false,
  loading: () => <ColonnadeFallback />,
});

/**
 * Decides whether this device gets the 3D scene at all.
 *
 * The scene loads only when the viewport is wide, the device reports
 * enough cores, the pointer is fine, motion is not reduced, and the hero
 * is actually on screen. Everything else keeps the static fallback, which
 * occupies the identical box so the layout never shifts between them.
 */
export function HeroVisual() {
  const [show3d, setShow3d] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const capable =
      window.matchMedia("(min-width: 768px) and (hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (navigator.hardwareConcurrency ?? 2) >= 4;

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
        className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[90px]"
      />
      <div className="absolute inset-0">
        {show3d ? <ColonnadeScene /> : <ColonnadeFallback />}
      </div>
    </div>
  );
}
