/**
 * Duotone plates — the site's placeholder imagery.
 *
 * These are drawn, not photographed. A fact-first publication carries real
 * risk in shipping synthetic images that read as reportage, so the
 * placeholders are deliberately abstract: geometry in the brand's violet
 * duotone that reads as a subject without pretending to document one.
 *
 * Every plate is also a photo slot. Drop a file at the path named by
 * `photo` into `public/` and it is used instead of the drawing, at the
 * same aspect ratio and crop; if the file is not there the browser's load
 * error silently reveals the drawing underneath, so a half-finished set of
 * photographs never leaves a hole in the page. See README, "Adding photos".
 */

"use client";

import { useState, type ReactNode } from "react";

/** Shared defs: one violet duotone ramp and a grain wash, defined once. */
function PlateDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor="#e9dded" />
        <stop offset="55%" stopColor="#f6f0f3" />
        <stop offset="100%" stopColor="#e3d6e7" />
      </linearGradient>
      <linearGradient id={`${id}-lit`} x1="0" y1="1" x2="0.3" y2="0">
        <stop offset="0%" stopColor="#7a1e3c" stopOpacity="0" />
        <stop offset="100%" stopColor="#c3b0df" stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id={`${id}-flare`} cx="0.28" cy="0.2">
        <stop offset="0%" stopColor="#fbf7f3" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#fbf7f3" stopOpacity="0" />
      </radialGradient>
      {/* Film grain, so the flat fills do not band on large surfaces. */}
      <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          result="noise"
        />
        <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
        <feComponentTransfer in="mono" result="soft">
          <feFuncA type="linear" slope="0.055" />
        </feComponentTransfer>
        <feComposite in="soft" in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
  );
}

function Plate({
  id,
  alt,
  ratio,
  viewBox,
  width,
  height,
  children,
  photo,
  className = "",
}: {
  id: string;
  alt: string;
  ratio: string;
  viewBox: string;
  width: number;
  height: number;
  children: ReactNode;
  photo?: string;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);
  const showPhoto = Boolean(photo) && !missing;

  return (
    <div
      className={`relative overflow-hidden rounded-card border border-hairline ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        /* When a photograph is on top, the drawing is decoration behind it
           and must not announce itself to a screen reader as a second
           image of the same thing. */
        role={showPhoto ? "presentation" : "img"}
        aria-label={showPhoto ? undefined : alt}
        aria-hidden={showPhoto || undefined}
        className="h-full w-full"
      >
        <PlateDefs id={id} />
        <rect width={width} height={height} fill={`url(#${id}-sky)`} />
        <g filter={`url(#${id}-grain)`}>{children}</g>
        <rect width={width} height={height} fill={`url(#${id}-flare)`} />
      </svg>

      {photo && (
        /* Plain <img>, not next/image: this is a static export, so there is
           no optimiser at runtime to resize through. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            missing ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}

/** A newsroom: desks, screens, and figures bent over them. */
export function NewsroomPlate({ alt, photo }: { alt: string; photo?: string }) {
  const id = "nr";
  return (
    <Plate
      id={id}
      alt={alt}
      ratio="4 / 5"
      viewBox="0 0 400 500"
      width={400}
      height={500}
      photo={photo}
    >
      {/* Back wall: a whiteboard catching the light from the left. */}
      <rect x="46" y="86" width="196" height="132" rx="5" fill="#dccfe4" />
      <path
        d="M70 124h140M70 150h92M70 176h116"
        stroke="#9a80bc"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="292" y="104" width="70" height="98" rx="5" fill="#d3c3dd" />

      {/* Shared table, edge-lit. */}
      <rect x="0" y="408" width="400" height="92" fill="#8e2e4b" />
      <rect x="0" y="402" width="400" height="7" fill={`url(#${id}-lit)`} />

      {/* Three figures, each behind a laptop. */}
      {[78, 200, 322].map((x, i) => {
        const lift = i === 1 ? 0 : 8;
        return (
          <g key={x}>
            {/* Torso. */}
            <path
              d={`M${x - 42} 408 q4 -70 42 -70 q38 0 42 70 Z`}
              fill="#5c1229"
            />
            {/* Head, tipped toward the screen. */}
            <circle cx={x} cy={300 + lift} r="24" fill="#7a1e3c" />
            {/* Screen light catching one side of the face. */}
            <path
              d={`M${x - 21} ${292 + lift} a24 24 0 0 1 17 -14`}
              stroke="#c3b0df"
              strokeWidth="3"
              fill="none"
              opacity="0.75"
            />
            {/* Laptop. */}
            <path d={`M${x - 34} 408 l9 -40 h50 l9 40 Z`} fill="#8e2e4b" />
            <rect
              x={x - 25}
              y={374}
              width="50"
              height="26"
              rx="3"
              fill="#c3b0df"
              opacity="0.5"
            />
          </g>
        );
      })}

      {/* Pool of lamp light on the table. */}
      <ellipse cx="200" cy="378" rx="150" ry="16" fill="#7a1e3c" opacity="0.14" />
    </Plate>
  );
}

type StoryVariant = "placards" | "campus" | "colonnade" | "hands";

/** Ground-report plates, one per story. */
export function StoryPlate({
  variant,
  alt,
  photo,
  className,
}: {
  variant: StoryVariant;
  alt: string;
  photo?: string;
  className?: string;
}) {
  const id = `st-${variant}`;

  const art: Record<StoryVariant, ReactNode> = {
    /* Raised blank placards over a crowd. Deliberately wordless. */
    placards: (
      <>
        {[
          { x: 48, y: 96, r: -9 },
          { x: 140, y: 68, r: 5 },
          { x: 236, y: 84, r: -4 },
          { x: 318, y: 60, r: 11 },
        ].map((p) => (
          <g key={p.x} transform={`rotate(${p.r} ${p.x + 32} ${p.y + 28})`}>
            <rect x={p.x + 28} y={p.y + 48} width="6" height="96" fill="#5c1229" />
            <rect
              x={p.x}
              y={p.y}
              width="64"
              height="52"
              rx="3"
              fill="#efe7f2"
              stroke="#c3b0df"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
          </g>
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            cx={12 + i * 26}
            cy={244 + (i % 3) * 9}
            r={15 + (i % 4) * 2}
            fill="#7a1e3c"
          />
        ))}
        <rect x="0" y="236" width="400" height="4" fill={`url(#${id}-lit)`} />
      </>
    ),

    /* Students in a circle on campus steps at dusk. */
    campus: (
      <>
        <path d="M0 300 L0 246 H400 V300 Z" fill="#c9b6d6" />
        <path d="M0 246 L0 212 H400 V246 Z" fill="#d6c6e0" />
        <path d="M0 212 L0 182 H400 V212 Z" fill="#e3d6e9" />
        <rect x="0" y="180" width="400" height="3" fill={`url(#${id}-lit)`} />
        {/* Seated figures along the steps. */}
        {[
          [52, 232],
          [104, 236],
          [166, 230],
          [246, 236],
          [306, 230],
          [356, 234],
        ].map(([x, y]) => (
          <g key={x}>
            <ellipse cx={x} cy={y + 18} rx="18" ry="20" fill="#5c1229" />
            <circle cx={x} cy={y - 6} r="11" fill="#7a1e3c" />
          </g>
        ))}
        {/* One figure standing, speaking — the focal point. */}
        <ellipse cx="200" cy="176" rx="17" ry="40" fill="#5c1229" />
        <circle cx="200" cy="126" r="13" fill="#7a1e3c" />
        <path
          d="M189 120a13 13 0 0 1 10-8"
          stroke="#c3b0df"
          strokeWidth="2.5"
          fill="none"
        />
      </>
    ),

    /* A colonnade from below — the policy desk's plate. */
    colonnade: (
      <>
        <path d="M0 64 H400 V96 H0 Z" fill="#e3d6e9" />
        <path d="M0 58 H400 V66 H0 Z" fill={`url(#${id}-lit)`} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 14 + i * 45;
          const lit = i < 4 ? 1 - i * 0.18 : 0.18;
          return (
            <g key={i}>
              <rect x={x} y="96" width="26" height="204" fill="#7a1e3c" />
              <rect x={x} y="96" width="5" height="204" fill="#c3b0df" opacity={lit} />
            </g>
          );
        })}
        <rect x="0" y="286" width="400" height="14" fill="#5c1229" />
      </>
    ),

    /* Raised hands, index fingers marked with ink. */
    hands: (
      <>
        {[
          { x: 44, h: 150 },
          { x: 116, h: 190 },
          { x: 196, h: 160 },
          { x: 268, h: 204 },
          { x: 338, h: 146 },
        ].map((h) => (
          <g key={h.x}>
            {/* Palm. */}
            <rect
              x={h.x}
              y={300 - h.h}
              width="46"
              height={h.h}
              rx="22"
              fill="#7a1e3c"
            />
            {/* Index finger, standing proud of the fist. */}
            <rect
              x={h.x + 12}
              y={300 - h.h - 44}
              width="17"
              height="56"
              rx="8"
              fill="#8e2e4b"
            />
            {/* The indelible ink mark. */}
            <rect
              x={h.x + 12}
              y={300 - h.h - 44}
              width="17"
              height="15"
              rx="7"
              fill="#241520"
            />
          </g>
        ))}
      </>
    ),
  };

  return (
    <Plate
      id={id}
      alt={alt}
      ratio="16 / 10"
      viewBox="0 0 400 300"
      width={400}
      height={300}
      photo={photo}
      className={className}
    >
      {art[variant]}
    </Plate>
  );
}
