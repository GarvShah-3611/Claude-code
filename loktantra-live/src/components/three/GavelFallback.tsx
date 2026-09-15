/**
 * Static stand-in for the 3D gavel — the same object drawn as SVG.
 *
 * Shipped to touch devices, low-power machines, reduced-motion visitors,
 * and as the loading state for the real scene. Generated geometry rather
 * than an image file: about a kilobyte, sharp at any size, and it inherits
 * the palette so it cannot drift from the 3D version.
 */

export function GavelFallback() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label="A rosewood gavel resting on its sound block — the mark of Loktantra Live."
    >
      <defs>
        <linearGradient id="lk-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3695a" />
          <stop offset="42%" stopColor="#6b3730" />
          <stop offset="100%" stopColor="#3f2020" />
        </linearGradient>
        <linearGradient id="lk-handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f2020" />
          <stop offset="38%" stopColor="#8a4f43" />
          <stop offset="100%" stopColor="#4b2624" />
        </linearGradient>
        <linearGradient id="lk-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8d2dd" />
          <stop offset="55%" stopColor="#a49dae" />
          <stop offset="100%" stopColor="#77707f" />
        </linearGradient>
        <linearGradient id="lk-block" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4238" />
          <stop offset="100%" stopColor="#4b2624" />
        </linearGradient>
        <radialGradient id="lk-halo">
          <stop offset="0%" stopColor="#c3b0df" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c3b0df" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lk-shadow">
          <stop offset="0%" stopColor="#3a1c2a" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#3a1c2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="190" r="150" fill="url(#lk-halo)" />
      <ellipse cx="200" cy="326" rx="132" ry="26" fill="url(#lk-shadow)" />

      {/* Sound block. */}
      <g>
        <ellipse cx="200" cy="300" rx="104" ry="26" fill="#3f2020" />
        <rect x="96" y="276" width="208" height="24" fill="url(#lk-block)" />
        <ellipse cx="200" cy="276" rx="104" ry="26" fill="#8a4f43" />
        <ellipse cx="200" cy="274" rx="88" ry="21" fill="#6b3730" />
      </g>

      {/* Handle, swung down to the right, drawn before the head so the head
          overlaps its neck. */}
      <g transform="rotate(24 200 150)">
        <rect x="188" y="146" width="24" height="132" rx="11" fill="url(#lk-handle)" />
        <ellipse cx="200" cy="282" rx="17" ry="14" fill="#7a4238" />
        <ellipse cx="200" cy="278" rx="17" ry="12" fill="#a3695a" />
      </g>

      {/* Head, tipped slightly so it reads as a cylinder, not a bar. */}
      <g transform="rotate(-9 200 150)">
        <rect x="88" y="118" width="224" height="64" rx="18" fill="url(#lk-head)" />
        {/* Specular sweep along the top of the barrel. */}
        <rect x="102" y="126" width="196" height="9" rx="4.5" fill="#c79483" opacity="0.5" />
        {/* End caps. */}
        <ellipse cx="90" cy="150" rx="11" ry="32" fill="#4a2624" />
        <ellipse cx="310" cy="150" rx="11" ry="32" fill="#8a4f43" />
        {/* Pewter bands in the incised grooves. */}
        <rect x="124" y="118" width="13" height="64" fill="url(#lk-band)" />
        <rect x="263" y="118" width="13" height="64" fill="url(#lk-band)" />
      </g>
    </svg>
  );
}
