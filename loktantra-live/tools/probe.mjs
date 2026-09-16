import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:520, height:900}, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:3000/', { waitUntil:'networkidle' });
await p.waitForTimeout(3500);
const el = await p.$('svg[role="img"][aria-label*="gavel"]');
if (el) await el.screenshot({ path: 'shots/gavel-fallback.png' }); else console.log('not found');
await b.close();
