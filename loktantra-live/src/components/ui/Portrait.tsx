"use client";

import { useState } from "react";

/**
 * A round portrait that degrades to initials.
 *
 * Contributor photographs arrive one at a time and some never arrive at
 * all, so the missing state has to be a designed state rather than a
 * broken-image icon: initials on the lavender wash, same diameter, same
 * ring. Nothing in the layout moves when a photograph lands.
 */
export function Portrait({
  name,
  photo,
  className = "h-12 w-12",
}: {
  name: string;
  photo?: string;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline-hi bg-paper-raised text-sm text-burgundy ${className}`}
    >
      {/* The initials sit underneath rather than in a branch, so a photo
          that fails after paint reveals them without a reflow. */}
      <span aria-hidden>{initials}</span>
      {photo && !missing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={`${name}, contributor`}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}
