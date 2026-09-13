import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });

// reduced motion: every reveal must resolve to visible without GSAP
const p = await b.newPage({ viewport:{width:1280,height:820}, reducedMotion:'reduce' });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto('http://127.0.0.1:5173/', { waitUntil:'networkidle' });
await p.waitForTimeout(2000);

const hidden = await p.evaluate(() => {
  const out = [];
  const check = (sel) => document.querySelectorAll(sel).forEach((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (parseFloat(cs.opacity) < 0.9 || cs.clipPath.includes('100%') || r.height === 0) {
      out.push(`${sel} :: opacity=${cs.opacity} clip=${cs.clipPath} h=${Math.round(r.height)}`);
    }
  });
  ['.hero-title .line > span','.hero-sub','.statement p','[data-frame]','.plate figcaption','.service-body','.studio-body > *','[data-quote]','.section-head > *'].forEach(check);
  return { out, htmlClass: document.documentElement.className, canvas: !!document.querySelector('[data-hero-canvas]') };
});
console.log('REDUCED MOTION:', JSON.stringify(hidden, null, 1));
console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await p.screenshot({ path: (process.env.SHOT_DIR||'/tmp') + '/reduced.png' });
await b.close();
