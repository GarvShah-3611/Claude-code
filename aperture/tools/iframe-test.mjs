import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('file:///tmp/claude-0/-home-user-Claude-code/8ed2729f-7d6a-59a7-9cc0-d6f339caea50/scratchpad/frame.html');
await p.waitForTimeout(4000);
const out = process.env.SHOT_DIR;
await p.screenshot({ path: `${out}/iframe-top.png` });
// scroll the PARENT, the way an embedded host does
for (const y of [1400, 2600, 4200]) { await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(1600); }
await p.screenshot({ path: `${out}/iframe-scrolled.png` });
const state = await p.frames()[1].evaluate(() => {
  const f = document.querySelector('.plate [data-frame]');
  return { clip: getComputedStyle(f).clipPath, h: Math.round(f.getBoundingClientRect().height),
           scrollY: window.scrollY, innerH: window.innerHeight, scrollH: document.documentElement.scrollHeight };
});
console.log(JSON.stringify(state));
await b.close();
