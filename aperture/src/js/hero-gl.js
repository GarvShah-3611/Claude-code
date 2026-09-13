import {
  Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
  TextureLoader, Vector2, WebGLRenderer, LinearSRGBColorSpace, LinearFilter,
} from 'three';

const VERT = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform sampler2D uDisp;
  uniform vec2  uRes;
  uniform vec2  uFromSize;
  uniform vec2  uToSize;
  uniform float uProgress;
  uniform float uTime;
  uniform float uScroll;

  // sample the plate the way object-fit: cover would
  vec2 cover(vec2 uv, vec2 res, vec2 img){
    float rs = res.x / res.y;
    float ri = img.x / img.y;
    vec2 o = uv;
    if (ri > rs) o.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    else         o.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    return o;
  }

  void main(){
    // a very slow drift so the frame is never quite still
    float breathe = 1.0 + 0.030 * sin(uTime * 0.08);
    vec2 uv = (vUv - 0.5) / breathe + 0.5;
    uv.y += uScroll * 0.10;

    float d = texture2D(uDisp, vUv * 0.9).r;
    float p = uProgress;

    vec2 uvA = cover(uv, uRes, uFromSize);
    vec2 uvB = cover(uv, uRes, uToSize);
    uvA += (d - 0.5) * 0.055 * p;
    uvB -= (d - 0.5) * 0.055 * (1.0 - p);

    vec3 a = texture2D(uFrom, uvA).rgb;
    vec3 b = texture2D(uTo, uvB).rgb;

    // the dissolve edge rides the displacement field rather than fading flatly
    float edge = smoothstep(p * 1.45 - 0.22, p * 1.45 + 0.22, d);
    vec3 col = mix(b, a, edge);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initHero({ canvas, plates, displacement, onReady }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // raw ShaderMaterial does no colour-space conversion; keep the plate pass-through
  renderer.outputColorSpace = LinearSRGBColorSpace;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const loader = new TextureLoader();

  const load = (src) => new Promise((res, rej) => {
    loader.load(src, (t) => {
      t.minFilter = LinearFilter;
      t.generateMipmaps = false;
      res(t);
    }, undefined, rej);
  });

  const uniforms = {
    uFrom: { value: null },
    uTo: { value: null },
    uDisp: { value: null },
    uRes: { value: new Vector2(1, 1) },
    uFromSize: { value: new Vector2(1, 1) },
    uToSize: { value: new Vector2(1, 1) },
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uScroll: { value: 0 },
  };

  const mesh = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
  }));
  scene.add(mesh);

  const size = (t) => new Vector2(t.image.width, t.image.height);

  let textures = [];
  let index = 0;
  let raf = 0;
  let running = false;
  let transition = null;
  let nextAt = 0;

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  };

  const HOLD = 5200;
  const FADE = 2000;

  const frame = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    uniforms.uTime.value = now / 1000;

    if (transition) {
      const t = Math.min((now - transition.start) / FADE, 1);
      // ease-in-out so the dissolve settles rather than stops
      uniforms.uProgress.value = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (t >= 1) {
        index = transition.to;
        uniforms.uFrom.value = textures[index];
        uniforms.uFromSize.value.copy(size(textures[index]));
        uniforms.uProgress.value = 0;
        transition = null;
        nextAt = now + HOLD;
      }
    } else if (now >= nextAt && textures.length > 1) {
      const to = (index + 1) % textures.length;
      uniforms.uTo.value = textures[to];
      uniforms.uToSize.value.copy(size(textures[to]));
      transition = { start: now, to };
    }

    renderer.render(scene, camera);
  };

  const start = async () => {
    const [disp, ...rest] = await Promise.all([load(displacement), ...plates.map(load)]);
    textures = rest;
    uniforms.uDisp.value = disp;
    uniforms.uFrom.value = textures[0];
    uniforms.uTo.value = textures[0];
    uniforms.uFromSize.value.copy(size(textures[0]));
    uniforms.uToSize.value.copy(size(textures[0]));
    resize();
    running = true;
    nextAt = performance.now() + HOLD;
    raf = requestAnimationFrame(frame);
    onReady?.();
  };

  start().catch(() => { running = false; });

  window.addEventListener('resize', resize);

  return {
    setScroll(v) { uniforms.uScroll.value = v; },
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() {
      if (running || !textures.length) return;
      running = true;
      nextAt = performance.now() + 600;
      raf = requestAnimationFrame(frame);
    },
  };
}
