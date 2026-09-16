/**
 * Static stand-in for the 3D gavel — the same object, same pose, drawn as SVG.
 *
 * Shipped to narrow viewports, touch devices, low-power machines,
 * reduced-motion visitors, and as the loading state for the real scene. A
 * claude.ai artifact panel at ~520px gets this and never the canvas, so it
 * is not a rare path: when the 3D model was re-posed and this was left
 * alone, anyone on a narrow window kept seeing the previous design and had
 * every reason to think nothing had shipped.
 *
 * It must therefore match GavelScene's pose, not just its palette: the
 * gavel lying across its sound block, head up and to the right, handle
 * running down to the left, seen three-quarters on.
 */

/* Geometry shared with the transforms below so the parts stay joined. */
const HEAD_ANGLE = -27; // deg, barrel tilted down to the right
const HEAD_PIVOT = { x: 196, y: 168 };
const HANDLE_ANGLE = 52; // deg clockwise from straight down
const HANDLE_PIVOT = { x: 212, y: 202 };

export function GavelFallback() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label="A rosewood gavel resting across its sound block — the mark of Loktantra Live."
    >
      <defs>
        {/* Barrel: lit along the top edge, falling away underneath. */}
        <linearGradient id="lkg-head" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#b0776590" stopOpacity="1" />
          <stop offset="14%" stopColor="#a3695a" />
          <stop offset="52%" stopColor="#7c4038" />
          <stop offset="100%" stopColor="#40201d" />
        </linearGradient>
        <linearGradient id="lkg-handle" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#40201d" />
          <stop offset="40%" stopColor="#8f5044" />
          <stop offset="100%" stopColor="#4d2723" />
        </linearGradient>
        <linearGradient id="lkg-band" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#e2dde8" />
          <stop offset="45%" stopColor="#a49dae" />
          <stop offset="100%" stopColor="#6f6878" />
        </linearGradient>
        {/* Block top is end grain, so it reads lighter than the rim. */}
        <radialGradient id="lkg-blocktop" cx="0.38" cy="0.32">
          <stop offset="0%" stopColor="#95584a" />
          <stop offset="70%" stopColor="#7a4238" />
          <stop offset="100%" stopColor="#5d3029" />
        </radialGradient>
        <linearGradient id="lkg-blockrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b382f" />
          <stop offset="100%" stopColor="#3d1f1c" />
        </linearGradient>
        <radialGradient id="lkg-halo">
          <stop offset="0%" stopColor="#c3b0df" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c3b0df" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lkg-shadow">
          <stop offset="0%" stopColor="#3a1c2a" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#3a1c2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="185" r="152" fill="url(#lkg-halo)" />
      <ellipse cx="196" cy="300" rx="150" ry="34" fill="url(#lkg-shadow)" />

      {/* Sound block, drawn first so everything rests on it. */}
      <g>
        <path
          d="M82 252 A118 44 0 0 0 318 252 L318 264 A118 44 0 0 1 82 264 Z"
          fill="url(#lkg-blockrim)"
        />
        <ellipse cx="200" cy="252" rx="118" ry="44" fill="url(#lkg-blocktop)" />
        {/* Growth rings on the end grain. */}
        <ellipse cx="196" cy="250" rx="86" ry="31" fill="none" stroke="#5d3029" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="194" cy="249" rx="56" ry="20" fill="none" stroke="#5d3029" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="193" cy="248" rx="28" ry="10" fill="none" stroke="#5d3029" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Handle, running down to the left from under the head. */}
      <g transform={`rotate(${HANDLE_ANGLE} ${HANDLE_PIVOT.x} ${HANDLE_PIVOT.y})`}>
        <rect x="198" y="198" width="28" height="150" rx="13" fill="url(#lkg-handle)" />
        {/* Turned end knob. */}
        <ellipse cx="212" cy="351" rx="22" ry="19" fill="#7a4238" />
        <ellipse cx="212" cy="347" rx="22" ry="17" fill="#a3695a" />
        <ellipse cx="206" cy="342" rx="9" ry="5" fill="#c79483" opacity="0.5" />
      </g>

      {/* Head last, so it covers the neck the handle disappears into. */}
      <g transform={`rotate(${HEAD_ANGLE} ${HEAD_PIVOT.x} ${HEAD_PIVOT.y})`}>
        <rect x="78" y="128" width="236" height="80" rx="38" fill="url(#lkg-head)" />
        {/* Specular sweep along the top of the barrel. */}
        <rect x="100" y="138" width="196" height="11" rx="5.5" fill="#c79483" opacity="0.45" />
        {/* Near end cap, crowned rather than flat. */}
        <ellipse cx="308" cy="168" rx="14" ry="40" fill="#8f5044" />
        <ellipse cx="311" cy="168" rx="8" ry="34" fill="#a3695a" opacity="0.65" />
        {/* Far end, in shade — just enough to round the barrel off. */}
        <ellipse cx="88" cy="168" rx="9" ry="38" fill="#4d2723" opacity="0.9" />
        {/* Pewter bands seated in the incised grooves. */}
        <rect x="120" y="128" width="14" height="80" fill="url(#lkg-band)" />
        <rect x="258" y="128" width="14" height="80" fill="url(#lkg-band)" />
      </g>
    </svg>
  );
}
