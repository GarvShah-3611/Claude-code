/**
 * Static stand-in for the 3D gavel — the same object, same pose, drawn as SVG.
 *
 * Shipped to touch devices, low-power machines, reduced-motion visitors, and
 * as the loading state for the real scene. It is not a rare path, so it has
 * to match GavelScene's pose rather than merely its palette: barrel tilted
 * down to the right, handle dropping from the barrel's underside and leaning
 * slightly left, both resting across the sound block, seen three-quarters on.
 *
 * The parts are built around one shared origin — the centre of the barrel —
 * and every rotation turns about it. An earlier version rotated the head and
 * the handle about two different pivots that had to agree by hand; they
 * drifted, and the handle came out as a stick lying across the block with a
 * knob floating clear of it, which is exactly what it looked like.
 */

const ORIGIN = { x: 200, y: 172 }; // centre of the barrel; everything hangs off it
const HEAD_ANGLE = 28; // deg clockwise — barrel falls away to the right
const HANDLE_ANGLE = 11; // deg clockwise — handle drops, leaning slightly left

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
        <linearGradient id="lkg-head" x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0%" stopColor="#c08a77" />
          <stop offset="16%" stopColor="#a3695a" />
          <stop offset="55%" stopColor="#7c4038" />
          <stop offset="100%" stopColor="#3b1c1a" />
        </linearGradient>
        {/* Handle is a narrower cylinder, so its falloff is tighter. */}
        <linearGradient id="lkg-handle" x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0%" stopColor="#4a2522" />
          <stop offset="34%" stopColor="#95584a" />
          <stop offset="62%" stopColor="#a3695a" />
          <stop offset="100%" stopColor="#452220" />
        </linearGradient>
        <linearGradient id="lkg-band" x1="0" y1="0" x2="0.18" y2="1">
          <stop offset="0%" stopColor="#e6e1ec" />
          <stop offset="42%" stopColor="#a49dae" />
          <stop offset="100%" stopColor="#6b6474" />
        </linearGradient>
        {/* Block top is end grain, so it reads lighter than the rim. */}
        <radialGradient id="lkg-blocktop" cx="0.38" cy="0.3">
          <stop offset="0%" stopColor="#995c4d" />
          <stop offset="68%" stopColor="#7a4238" />
          <stop offset="100%" stopColor="#5a2e28" />
        </radialGradient>
        <linearGradient id="lkg-blockrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b382f" />
          <stop offset="100%" stopColor="#3a1d1a" />
        </linearGradient>
        <radialGradient id="lkg-halo">
          <stop offset="0%" stopColor="#c3b0df" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c3b0df" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lkg-shadow">
          <stop offset="0%" stopColor="#3a1c2a" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#3a1c2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="190" r="150" fill="url(#lkg-halo)" />
      <ellipse cx="198" cy="312" rx="146" ry="32" fill="url(#lkg-shadow)" />

      {/* Sound block, drawn first so everything rests on it. */}
      <g>
        <path
          d="M92 272 A108 40 0 0 0 308 272 L308 286 A108 40 0 0 1 92 286 Z"
          fill="url(#lkg-blockrim)"
        />
        <ellipse cx="200" cy="272" rx="108" ry="40" fill="url(#lkg-blocktop)" />
        {/* Growth rings on the end grain. */}
        <ellipse cx="196" cy="270" rx="78" ry="28" fill="none" stroke="#5a2e28" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="194" cy="269" rx="50" ry="18" fill="none" stroke="#5a2e28" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="193" cy="268" rx="25" ry="9" fill="none" stroke="#5a2e28" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Handle. Drawn between block and head: it must sit in front of the
          block it crosses, and behind the head that swallows its neck. */}
      <g transform={`rotate(${HANDLE_ANGLE} ${ORIGIN.x} ${ORIGIN.y})`}>
        <rect
          x={ORIGIN.x - 13}
          y={ORIGIN.y - 6}
          width="26"
          height="132"
          rx="13"
          fill="url(#lkg-handle)"
        />
        {/* Turned end knob, seated on the shaft rather than beside it. */}
        <ellipse cx={ORIGIN.x} cy={ORIGIN.y + 128} rx="21" ry="18" fill="#6d3a31" />
        <ellipse cx={ORIGIN.x} cy={ORIGIN.y + 124} rx="21" ry="16" fill="#98594b" />
        <ellipse cx={ORIGIN.x - 6} cy={ORIGIN.y + 119} rx="8" ry="4.5" fill="#c79483" opacity="0.5" />
      </g>

      {/* Head last, so it covers the neck the handle disappears into. */}
      <g transform={`rotate(${HEAD_ANGLE} ${ORIGIN.x} ${ORIGIN.y})`}>
        <rect
          x={ORIGIN.x - 113}
          y={ORIGIN.y - 39}
          width="226"
          height="78"
          rx="37"
          fill="url(#lkg-head)"
        />
        {/* Specular sweep along the top of the barrel. */}
        <rect
          x={ORIGIN.x - 92}
          y={ORIGIN.y - 30}
          width="184"
          height="10"
          rx="5"
          fill="#d0a08d"
          opacity="0.45"
        />
        {/* Near end cap, crowned rather than flat. */}
        <ellipse cx={ORIGIN.x + 108} cy={ORIGIN.y} rx="13" ry="39" fill="#8f5044" />
        <ellipse cx={ORIGIN.x + 111} cy={ORIGIN.y} rx="7" ry="33" fill="#a3695a" opacity="0.6" />
        {/* Far end, in shade — just enough to round the barrel off. */}
        <ellipse cx={ORIGIN.x - 106} cy={ORIGIN.y} rx="9" ry="36" fill="#4a2522" opacity="0.9" />
        {/* Pewter bands seated in the incised grooves. */}
        <rect x={ORIGIN.x - 76} y={ORIGIN.y - 39} width="13" height="78" fill="url(#lkg-band)" />
        <rect x={ORIGIN.x + 57} y={ORIGIN.y - 39} width="13" height="78" fill="url(#lkg-band)" />
      </g>
    </svg>
  );
}
