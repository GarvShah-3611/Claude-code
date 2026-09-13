import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/images');

// The studio's plates. Looks are art-directed per slot so the body of work reads
// as one photographer: high-key light studies, warm-neutral, shallow depth.
const PLATES = [
  { name: 'hero-01', w: 2400, h: 1500, look: 'folds',  seed: 12.4, scale: 1.7, contrast: 1.04, exposure: 1.08, light: [-0.62, 0.55], key: 0.34 },
  { name: 'hero-02', w: 2400, h: 1500, look: 'window', seed: 41.9, contrast: 1.02, exposure: 1.08, key: 0.38 },
  { name: 'hero-03', w: 2400, h: 1500, look: 'folds',  seed: 77.2, scale: 1.6, contrast: 1.08, exposure: 1.02, light: [-0.74, 0.42], key: 0.30 },

  { name: 'work-01', w: 1400, h: 1750, look: 'folds',  seed: 3.7,  scale: 1.9, contrast: 1.06, exposure: 1.04, light: [-0.58, 0.60], key: 0.32 },
  { name: 'work-02', w: 1800, h: 1200, look: 'folds',  seed: 58.1, scale: 1.6, contrast: 1.10, exposure: 1.01, light: [-0.80, 0.36], key: 0.28 },
  { name: 'work-03', w: 1400, h: 1750, look: 'bokeh',  seed: 22.5, contrast: 0.98, exposure: 1.10, grain: 0.040, key: 0.40 },
  { name: 'work-04', w: 1400, h: 1750, look: 'window', seed: 91.3, contrast: 1.04, exposure: 1.07, key: 0.38 },
  { name: 'work-05', w: 1800, h: 1200, look: 'window', seed: 64.8, contrast: 1.04, exposure: 1.04, key: 0.34 },
  { name: 'work-06', w: 1400, h: 1750, look: 'folds',  seed: 15.6, scale: 2.0, contrast: 1.10, exposure: 1.00, light: [0.52, 0.62], key: 0.26 },
  { name: 'work-07', w: 1800, h: 1200, look: 'bokeh',  seed: 86.4, contrast: 0.96, exposure: 1.16, grain: 0.038, key: 0.42 },
  { name: 'work-08', w: 1400, h: 1750, look: 'folds',  seed: 49.2, scale: 1.8, contrast: 1.04, exposure: 1.06, light: [-0.30, 0.76], key: 0.36 },

  { name: 'about', w: 1300, h: 1625, look: 'window', seed: 33.8, contrast: 1.04, exposure: 1.06, key: 0.37 },

  { name: 'service-weddings',  w: 1200, h: 1600, look: 'folds',  seed: 7.1,  scale: 1.6, contrast: 1.04, exposure: 1.08, key: 0.42 },
  { name: 'service-portraits', w: 1200, h: 1600, look: 'bokeh',  seed: 70.6, contrast: 1.00, exposure: 1.08, grain: 0.038, key: 0.38 },
  { name: 'service-editorial', w: 1200, h: 1600, look: 'window', seed: 95.7, contrast: 1.06, exposure: 1.02, key: 0.30 },

  // grayscale field driving the WebGL hover distortion
  { name: 'displacement', w: 1024, h: 1024, look: 'displacement', seed: 5.5, scale: 3.0, format: 'png' },
];

const PREVIEW = process.argv.includes('--preview');

const run = async () => {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    // the preinstalled Chromium, not the build this playwright version pins
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: [
      '--no-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox',
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', (e) => { throw e; });

  await page.goto('file://' + resolve(here, 'gen.html'));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

  for (const base of PLATES) {
    const plate = PREVIEW
      ? { ...base, w: Math.round(base.w / 4), h: Math.round(base.h / 4) }
      : base;

    const dataUrl = await page.evaluate((spec) => {
      window.renderImage(spec);
      return document.getElementById('c').toDataURL('image/png');
    }, plate);

    const raw = Buffer.from(dataUrl.split(',')[1], 'base64');

    if (plate.format === 'png') {
      await writeFile(resolve(outDir, `${plate.name}.png`), await sharp(raw).png({ quality: 90 }).toBuffer());
    } else {
      await writeFile(
        resolve(outDir, `${plate.name}.jpg`),
        await sharp(raw).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer()
      );
    }
    console.log(`rendered ${plate.name} (${plate.w}x${plate.h}, ${plate.look})`);
  }

  await browser.close();
  console.log(`\n${PLATES.length} plates written to public/images`);
};

run().catch((err) => { console.error(err); process.exit(1); });
