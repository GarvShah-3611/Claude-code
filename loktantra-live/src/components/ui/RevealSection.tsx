"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, revealChildren } from "@/lib/motion";

/**
 * Wraps a section and reveals its `.reveal` descendants once on scroll.
 *
 * One ScrollTrigger per section rather than one per element, scoped to the
 * section so it does not re-scan the page.
 */
export function RevealSection({
  children,
  id,
  className = "",
  stagger,
  as: Tag = "section",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  stagger?: number;
  as?: "section" | "div" | "footer";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();
    revealChildren(el, { stagger });
  }, [stagger]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      id={id}
      className={className}
      /* Anchor links land below the sticky navbar rather than under it. */
      style={id ? { scrollMarginTop: "5.5rem" } : undefined}
    >
      {children}
    </Tag>
  );
}
