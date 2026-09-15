import * as THREE from "three";

/**
 * Procedural rosewood, drawn to a canvas at runtime.
 *
 * A convincing wood needs three things a flat colour cannot give: growth
 * rings, fine grain, and the roughness variation that makes light break up
 * across the surface. All three come out of one canvas here — no texture
 * files, which matters because this page ships no binary assets and the
 * asset CDNs are unreachable from the build environment anyway.
 *
 * Rosewood rather than walnut on purpose: it is the wood gavels are
 * actually turned from, and its red-brown sits inside the brand's burgundy
 * instead of fighting it.
 *
 * The map carries the full colour and the materials that use it stay white.
 * three multiplies `color` into `map`, so tinting both is a double darken —
 * which is how the first pass came out near-black.
 */

const SIZE = 512;

/** Cheap deterministic noise — same texture every reload, no dependency. */
function noise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.7) * 43758.5453;
  return n - Math.floor(n);
}

function drawGrain(ctx: CanvasRenderingContext2D, mode: "color" | "rough") {
  // Base tone. The colour map gets rosewood; the roughness map gets a
  // mid grey it can modulate around.
  if (mode === "color") {
    const base = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    base.addColorStop(0, "#8a4f43");
    base.addColorStop(0.5, "#6b3730");
    base.addColorStop(1, "#552a29");
    ctx.fillStyle = base;
  } else {
    ctx.fillStyle = "#6e6e6e";
  }
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Growth rings: low-frequency waves running along the grain direction,
  // warped so they never read as straight stripes.
  for (let y = 0; y < SIZE; y++) {
    const warp =
      Math.sin(y * 0.018) * 14 +
      Math.sin(y * 0.047 + 1.7) * 6 +
      noise(0, y, 3) * 4;
    const ring = Math.sin((y + warp) * 0.42);
    const strength = Math.pow(Math.abs(ring), 3);

    if (mode === "color") {
      // Darker latewood bands, with an occasional lighter earlywood streak.
      const dark = strength * 0.46;
      ctx.fillStyle = `rgba(38, 17, 18, ${dark.toFixed(3)})`;
      ctx.fillRect(0, y, SIZE, 1);
      if (noise(1, y, 9) > 0.93) {
        ctx.fillStyle = "rgba(190, 132, 108, 0.18)";
        ctx.fillRect(0, y, SIZE, 1);
      }
    } else {
      // Latewood is denser, so it reads slightly glossier than earlywood.
      const v = 0.38 + strength * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${(1 - v) * 0.5})`;
      ctx.fillRect(0, y, SIZE, 1);
    }
  }

  // Fine pore lines, the detail that stops it looking like a gradient.
  for (let i = 0; i < 1400; i++) {
    const y = noise(i, 0, 17) * SIZE;
    const x = noise(0, i, 23) * SIZE;
    const len = 12 + noise(i, i, 31) * 90;
    const a = mode === "color" ? 0.1 : 0.16;
    ctx.strokeStyle =
      mode === "color"
        ? `rgba(40, 18, 18, ${a})`
        : `rgba(0,0,0,${a})`;
    ctx.lineWidth = 0.6 + noise(i, 2, 41) * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (noise(i, 3, 53) - 0.5) * 2.5);
    ctx.stroke();
  }
}

function build(mode: "color" | "rough") {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  drawGrain(ctx, mode);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  if (mode === "color") tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type WoodMaps = {
  map: THREE.Texture | null;
  roughnessMap: THREE.Texture | null;
};

export function makeWood(
  repeat: [number, number] = [1, 1],
  /** Quarter-turn the map so the grain runs along the turned axis. */
  alongAxis = false,
): WoodMaps {
  const map = build("color");
  const roughnessMap = build("rough");
  for (const t of [map, roughnessMap]) {
    if (!t) continue;
    t.repeat.set(repeat[0], repeat[1]);
    if (alongAxis) {
      t.center.set(0.5, 0.5);
      t.rotation = Math.PI / 2;
    }
  }
  return { map, roughnessMap };
}
