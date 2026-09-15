"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, motionDisabled } from "@/lib/motion";

/**
 * Desktop-only cursor: a small violet ink dot that grows into a ring over
 * anything marked `data-cursor="grow"` or natively interactive.
 *
 * Mounted only when the device has a real pointer, so touch users get the
 * native cursor and no extra listeners. `aria-hidden` throughout — this is
 * decoration and must never reach the accessibility tree.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || motionDisabled()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    // quickTo gives an interpolated follow without a rAF loop of our own.
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3.out" });

    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        // Jump to the real position before revealing, so the cursor never
        // flies in from the top-left corner on the first move.
        seen = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to(d, { autoAlpha: 1, duration: 0.2 });
        gsap.to(r, { autoAlpha: 0.6, duration: 0.2 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      !!t.closest('a, button, input, select, textarea, [data-cursor="grow"]');

    const over = (e: PointerEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(r, { scale: 2.1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(d, { scale: 0, duration: 0.3, ease: "power2.out" });
    };

    const out = (e: PointerEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(r, { scale: 1, opacity: 0.6, duration: 0.3, ease: "power2.out" });
      gsap.to(d, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ring}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-violet-light opacity-0"
      />
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-violet-light opacity-0"
      />
    </div>
  );
}
