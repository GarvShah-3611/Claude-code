"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionDisabled } from "@/lib/motion";

type Variant = "primary" | "ghost";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-[0.9375rem] font-medium transition-colors duration-200 will-change-transform";

const variants: Record<Variant, string> = {
  /* Paper label on burgundy: 9.40:1. The reverse, ink on burgundy, is
     1.73:1, so the light label is the only one that passes. */
  primary: "bg-burgundy on-burgundy hover:bg-burgundy-deep",
  ghost:
    "border border-hairline-hi text-ink hover:border-burgundy hover:text-burgundy",
};

/**
 * Button that leans toward the pointer within a small radius. Pointer-only
 * (`hover: hover`) so it never fires on touch, and skipped entirely under
 * reduced motion — the button still works, it just stops moving.
 */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  strength = 0.28,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  const bind = {
    onPointerMove: (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse" || motionDisabled()) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    onPointerLeave: () => {
      const el = ref.current;
      if (!el) return;
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    },
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        data-cursor="grow"
        {...bind}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classes}
      data-cursor="grow"
      {...bind}
    >
      {children}
    </button>
  );
}
