import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = process.env.SHOT_DIR || '/tmp/shots';
const URL = process.env.URL || 'http://127.0.0.1:5173/';
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 900);

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/00-hero.png` });

  // section anchors, captured where they actually sit
  const marks = await page.evaluate(() => {
    const pick = (sel) => document.querySelector(sel)?.getBoundingClientRect().top + window.scrollY;
    return {
      statement: pick('.statement'),
      work: pick('.work'),
      workMid: pick('.plate[data-span="full"]'),
      workEnd: pick('.plate:last-of-type'),
      services: pick('.services'),
      servicesLast: pick('.service:last-of-type'),
      studio: pick('.studio'),
      voices: pick('.voices'),
      contact: pick('.contact'),
    };
  });

  let i = 1;
  for (const [name, top] of Object.entries(marks)) {
    if (top == null) continue;
    await page.evaluate((y) => window.scrollTo({ top: y - 40, behavior: 'auto' }), top);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}-${name}.png` });
    i += 1;
  }

  // hover lens on a gallery plate
  await page.evaluate((y) => window.scrollTo({ top: y - 40, behavior: 'auto' }), marks.work);
  await page.waitForTimeout(1400);
  const plate = page.locator('.plate [data-frame]').first();
  const box = await plate.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.45);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}-hover.png` });
  }

  console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no page errors');
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
