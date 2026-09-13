import {
  Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
  TextureLoader, Vector2, WebGLRenderer, LinearSRGBColorSpace, LinearFilter,
} from 'three';

const VERT = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// A restrained lens effect: the plate swells very slightly toward the pointer,
// with a hair of colour separation at the edges. Refinement, not spectacle.
const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTex;
  uniform sampler2D uDisp;
  uniform vec2  uPointer;
  uniform float uStrength;
  uniform float uTime;

  void main(){
    vec2 uv = (vUv - 0.5) / 1.035 + 0.5;   // slight inset so edges stay covered

    float d = texture2D(uDisp, uv * 0.8 + vec2(uTime * 0.004, 0.0)).r - 0.5;

    vec2 toPointer = uv - uPointer;
    float fall = smoothstep(0.65, 0.0, length(toPointer));
    vec2 push = normalize(toPointer + 1e-5) * fall * uStrength * 0.035;
    vec2 warp = push + d * uStrength * 0.030;

    float sep = uStrength * fall * 0.004;
    float r = texture2D(uTex, uv - warp * (1.0 + sep)).r;
    float g = texture2D(uTex, uv - warp).g;
    float b = texture2D(uTex, uv - warp * (1.0 - sep)).b;

    // the light lifts a touch where the pointer rests
    float lift = fall * uStrength * 0.05;
    gl_FragColor = vec4(vec3(r, g, b) + lift, 1.0);
  }
`;

export function initHoverLens({ displacement }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hover-gl';
  canvas.setAttribute('aria-hidden', 'true');

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  document.body.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  // raw ShaderMaterial does no colour-space conversion; keep the plate pass-through
  renderer.outputColorSpace = LinearSRGBColorSpace;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const loader = new TextureLoader();
  const cache = new Map();

  const load = (src) => {
    if (cache.has(src)) return cache.get(src);
    const p = new Promise((res, rej) => {
      loader.load(src, (t) => {
        t.minFilter = LinearFilter;
        t.generateMipmaps = false;
        res(t);
      }, undefined, rej);
    });
    cache.set(src, p);
    return p;
  };

  const uniforms = {
    uTex: { value: null },
    uDisp: { value: null },
    uPointer: { value: new Vector2(0.5, 0.5) },
    uStrength: { value: 0 },
    uTime: { value: 0 },
  };

  scene.add(new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
  })));

  load(displacement).then((t) => { uniforms.uDisp.value = t; });

  let active = null;         // the element under the pointer
  let target = 0;            // where strength is heading
  let raf = 0;

  const place = () => {
    if (!active) return;
    const r = active.getBoundingClientRect();
    canvas.style.transform = `translate(${r.left}px, ${r.top}px)`;
    if (canvas.width !== Math.round(r.width * dpr) || canvas.height !== Math.round(r.height * dpr)) {
      renderer.setSize(r.width, r.height, false);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    }
  };

  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    uniforms.uTime.value = now / 1000;
    uniforms.uStrength.value += (target - uniforms.uStrength.value) * 0.09;

    if (uniforms.uStrength.value < 0.002 && target === 0) {
      canvas.classList.remove('is-active');
      active = null;
      cancelAnimationFrame(raf);
      raf = 0;
      return;
    }

    place();
    renderer.render(scene, camera);
  };

  const ensureLoop = () => { if (!raf) raf = requestAnimationFrame(loop); };

  const attach = (frame) => {
    const img = frame.querySelector('img');
    if (!img) return;

    frame.addEventListener('pointerenter', async (e) => {
      if (e.pointerType === 'touch') return;
      const tex = await load(img.currentSrc || img.src);
      uniforms.uTex.value = tex;
      active = frame;
      target = 1;
      place();
      canvas.classList.add('is-active');
      ensureLoop();
    });

    frame.addEventListener('pointermove', (e) => {
      if (active !== frame) return;
      const r = frame.getBoundingClientRect();
      uniforms.uPointer.value.set(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      );
    });

    frame.addEventListener('pointerleave', () => {
      if (active === frame) target = 0;
    });
  };

  return { attach };
}
