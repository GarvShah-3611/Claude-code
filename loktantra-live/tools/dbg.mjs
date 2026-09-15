import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
for (const [label, w, h] of [['desktop',1440,900],['mobile',390,844]]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  const errs=[];
  p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await p.goto('file:///home/user/Claude-code/loktantra-live/out/index.html', { waitUntil:'load' });
  await p.waitForTimeout(4500);
  const info = await p.evaluate(async () => {
    await document.fonts.ready;
    const c = document.createElement('canvas').getContext('2d');
    c.font='800 100px "Bricolage Grotesque"'; const a=c.measureText('Where').width;
    c.font='800 100px sans-serif'; const f=c.measureText('Where').width;
    return {
      heroState: document.querySelector('#main')?.getAttribute('data-hero'),
      lineTransform: getComputedStyle(document.querySelector('[data-line]')).transform,
      fadeOpacity: getComputedStyle(document.querySelector('[data-fade]')).opacity,
      realFont: Math.abs(a-f) > 1,
      height: document.documentElement.scrollHeight,
    };
  });
  console.log(label, JSON.stringify(info), errs.length?errs:'');
  await p.screenshot({ path:`shots/probe-offline-${label}.png`, clip:{x:0,y:0,width:w,height:h} });
  await p.close();
}
await b.close();
