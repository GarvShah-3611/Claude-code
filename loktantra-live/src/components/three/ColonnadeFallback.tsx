/**
 * Static stand-in for the 3D colonnade — the same composition drawn as SVG.
 *
 * Shipped to mobile, low-power devices, reduced-motion users, and as the
 * loading state for the real scene. It is generated geometry rather than an
 * image file: about a kilobyte, sharp at any size, and it inherits the
 * palette so it cannot drift from the 3D version.
 *
 * Drawn back-to-front: base platform, far pillars, entablature, dome, near
 * pillars, live ring. That order is what makes the ring read as passing
 * behind the columns on one side and in front on the other.
 */

const PILLARS = 26;
const CX = 200;
const TOP = 148; // y of the pillar tops
const BOTTOM = 268; // y of the pillar bases
const RX = 104;
const RY = 30;

export function ColonnadeFallback() {
  const pillars = Array.from({ length: PILLARS }, (_, i) => {
    const angle = (i / PILLARS) * Math.PI * 2;
    // depth: 0 = far side of the ring, 1 = near side.
    const depth = (Math.sin(angle) + 1) / 2;
    return {
      key: i,
      x: CX + Math.cos(angle) * RX,
      yTop: TOP + Math.sin(angle) * RY,
      yBottom: BOTTOM + Math.sin(angle) * RY,
      depth,
    };
  });

  const far = pillars.filter((p) => p.depth <= 0.5);
  const near = pillars.filter((p) => p.depth > 0.5);

  const Pillar = ({
    x,
    yTop,
    yBottom,
    depth,
  }: Omit<(typeof pillars)[number], "key">) => {
    const w = 3 + depth * 2.6;
    return (
      <rect
        x={x - w / 2}
        y={yTop}
        width={w}
        height={yBottom - yTop}
        rx={w / 2}
        fill="url(#lk-pillar)"
        opacity={0.4 + depth * 0.6}
      />
    );
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label="An abstract ring of columns beneath a shallow dome, lit from the left — the mark of Loktantra Live."
    >
      <defs>
        <linearGradient id="lk-dome" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#4a4a5e" />
          <stop offset="48%" stopColor="#272733" />
          <stop offset="100%" stopColor="#15151c" />
        </linearGradient>
        <linearGradient id="lk-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#15151c" />
          <stop offset="40%" stopColor="#3a3a4c" />
          <stop offset="100%" stopColor="#1b1b24" />
        </linearGradient>
        <linearGradient id="lk-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d3d4f" />
          <stop offset="60%" stopColor="#23232e" />
          <stop offset="100%" stopColor="#191921" />
        </linearGradient>
        <radialGradient id="lk-glow">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={206} r={150} fill="url(#lk-glow)" />

      {/* Base platform. */}
      <ellipse cx={CX} cy={BOTTOM} rx={RX + 26} ry={RY + 8} fill="#1a1a23" />

      {far.map(({ key, ...p }) => (
        <Pillar key={key} {...p} />
      ))}

      {/* Entablature: the band the columns carry. */}
      <ellipse cx={CX} cy={TOP} rx={RX + 15} ry={RY + 4} fill="url(#lk-band)" />

      {/* Shallow dome — a wide, low arc, not a hemisphere. */}
      <path
        d={`M ${CX - RX - 15} ${TOP}
            A ${RX + 15} ${(RX + 15) * 0.42} 0 0 1 ${CX + RX + 15} ${TOP} Z`}
        fill="url(#lk-dome)"
      />
      {/* Specular edge, upper left — the light source for the whole scene. */}
      <path
        d={`M ${CX - RX - 11} ${TOP - 4}
            A ${RX + 11} ${(RX + 11) * 0.42} 0 0 1 ${CX - 6} ${TOP - 49}`}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {near.map(({ key, ...p }) => (
        <Pillar key={key} {...p} />
      ))}

      {/* The live ring. */}
      <ellipse
        cx={CX}
        cy={BOTTOM + 10}
        rx={RX + 30}
        ry={RY + 10}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        opacity="0.85"
      />
    </svg>
  );
}
