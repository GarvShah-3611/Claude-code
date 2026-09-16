/**
 * Screenshots every click-page at the three design widths.
 *
 * Usage:  URL=http://127.0.0.1:3000 SHOT_DIR=./shots node tools/shoot-pages.mjs [route]
 *
 * The site is a hash router, so each page is one goto plus a hash change;
 * the tool waits for the page transition to settle before capturing. Pages
 * are captured as viewport bands rather than one fullPage image — Chromium's
 * capture-beyond-viewport restitches tall documents and repeats sections.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = process.env.SHOT_DIR || "./shots";
const BASE = process.env.URL || "http://127.0.0.1:3000";
const ROUTES = ["home", "ground", "watch", "feed", "voices", "about", "write"];
const WIDTHS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "tablet", w: 768, h: 1024 },
  { name: "mobile", w: 375, h: 812 },
];

const only = process.argv[2];
const routes = only ? ROUTES.filter((r) => r === only) : ROUTES;

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--disable-gpu-sandbox",
    ],
  });

  const problems = [];

  for (const { name, w, h } of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => problems.push(`[${name}] pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`[${name}] console: ${m.text()}`);
    });

    for (const route of routes) {
      const hash = route === "home" ? "#/" : `#/${route}`;
      // Full navigation per route, not a hash poke: it proves a cold entry
      // on a deep link works, which is the thing a hash router can get wrong.
      await page.goto(`${BASE}/?static=1${hash}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2400);

      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let i = 0, y = 0; y < total && i < 8; i++, y += h) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(280);
        await page.screenshot({
          path: `${OUT}/${name}-${route}-${String(i).padStart(2, "0")}.png`,
        });
      }
      console.log(`  ${name}/${route}: ${total}px`);
    }

    await page.close();
  }

  await browser.close();

  if (problems.length) {
    console.log("\nPROBLEMS:");
    for (const p of [...new Set(problems)]) console.log("  " + p);
  } else {
    console.log("\nNo console or page errors.");
  }
  console.log(`\nShots written to ${OUT}`);
};

run();
