"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, motionDisabled, ScrollTrigger } from "@/lib/motion";

/**
 * Counts up once when scrolled into view.
 *
 * The final value is rendered server-side and only replaced after the
 * animation starts, so the real number is in the HTML for crawlers and
 * for anyone whose JS never runs. Under reduced motion it never animates.
 */
export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motionDisabled()) return;
    registerGsap();

    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.4,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = Math.round(counter.n).toLocaleString("en-IN") + suffix;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [value, suffix]);

  return (
    <div className="reveal">
      <span
        ref={ref}
        className="block font-display text-[clamp(2.75rem,6vw,4rem)] font-extrabold leading-none tracking-tight text-burgundy tabular-nums"
      >
        {value.toLocaleString("en-IN")}
        {suffix}
      </span>
      <span className="mt-3 block text-sm text-ash">{label}</span>
    </div>
  );
}
