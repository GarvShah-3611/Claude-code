import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared motion vocabulary. Durations stay under the 700ms ceiling and
 * scroll reveals keep a small y-offset (12–24px) so they read as a fade
 * rather than a slide — a long slide is the tell of a generated page.
 */
export const DUR = {
  quick: 0.25,
  base: 0.45,
  slow: 0.65,
} as const;

export const EASE = {
  out: "power2.out",
  soft: "expo.out",
  inOut: "power2.inOut",
} as const;

let registered = false;

/** Registers GSAP plugins exactly once, client-side only. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveals `.reveal` descendants of `scope` once, on scroll.
 *
 * Reveals run once and never reverse: `toggleActions` is left at its
 * default so scrolling back up does not replay them. Under reduced
 * motion the elements are cleared instantly instead, so content is
 * never gated behind an animation that will not play.
 */
export function revealChildren(
  scope: HTMLElement,
  options: { stagger?: number; y?: number; selector?: string } = {},
) {
  const { stagger = 0.07, y = 18, selector = ".reveal" } = options;
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: "willChange" });
    return;
  }

  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: DUR.slow,
    ease: EASE.out,
    stagger: Math.min(stagger, 0.08),
    clearProps: "willChange,transform",
    scrollTrigger: {
      trigger: scope,
      start: "top 85%",
    },
  });
}

export { gsap, ScrollTrigger };
