import type { ReactNode } from "react";

/**
 * Section marker + heading.
 *
 * The label is set in sentence case behind a short burgundy rule — a
 * newspaper section slug, not a tracked-out all-caps eyebrow. It tells
 * you which desk you are in, which is information, not decoration.
 */
export function SectionHeading({
  label,
  children,
  blurb,
  align = "left",
  className = "",
}: {
  label: string;
  children: ReactNode;
  blurb?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      <p
        className={`reveal mb-5 flex items-center gap-3 text-sm text-burgundy ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span aria-hidden className="h-px w-8 bg-burgundy" />
        {label}
      </p>
      <h2 className="reveal text-title text-ink md:text-display">
        {children}
      </h2>
      {blurb && (
        <p
          className={`reveal mt-5 text-lead text-ash ${align === "center" ? "mx-auto" : ""} max-w-xl`}
        >
          {blurb}
        </p>
      )}
    </div>
  );
}
