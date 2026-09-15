import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:3000/?static=1', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(() => {
  const cs = el => getComputedStyle(el);
  const v = n => cs(document.documentElement).getPropertyValue(n).trim();
  const leaks = [...document.querySelectorAll('#main > div[aria-hidden]')].map(d => cs(d).backgroundColor);
  return {
    tokens: { paper: v('--color-paper'), ink: v('--color-ink'), burgundy: v('--color-burgundy'), lavender: v('--color-lavender') },
    htmlBg: cs(document.documentElement).backgroundColor,
    bodyBg: cs(document.body).backgroundColor,
    bodyColor: cs(document.body).color,
    heroLeaks: leaks,
    h1Color: cs(document.querySelector('h1')).color,
  };
}), null, 1));
await b.close();
