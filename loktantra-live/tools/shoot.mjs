/**
 * Screenshots the site at the widths it was designed for.
 *
 * Usage:  node tools/shoot.mjs [section]
 *   SHOT_DIR=./shots  URL=http://127.0.0.1:3000  node tools/shoot.mjs
 *
 * Captures a full-page image plus one framed shot per section at desktop
 * (1440), tablet (768) and mobile (375), and reports any console or page
 * errors it saw — a clean render with a red console is not a pass.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = process.env.SHOT_DIR || "./shots";
const URL = process.env.URL || "http://127.0.0.1:3000/";
const WIDTHS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "tablet", w: 768, h: 1024 },
  { name: "mobile", w: 375, h: 812 },
];

/** Sections to frame individually, in page order. */
const SECTIONS = [
  "main",
  "ticker",
  "about",
  "desks",
  "ground",
  "feed",
  "voices",
  "brief",
  "work",
  "site-footer",
];

const only = process.argv[2];

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

    await page.goto(URL, { waitUntil: "networkidle" });
    // Let fonts settle and the hero timeline finish before capturing.
    await page.waitForTimeout(2200);

    // Scroll the whole page once so every scroll-triggered reveal has fired,
    // then return to the top. Otherwise sections below the fold shoot blank.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });

    for (const id of SECTIONS) {
      if (only && id !== only) continue;
      const el = await page.$(`#${id}`);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      await el.screenshot({ path: `${OUT}/${name}-${id}.png` }).catch(() => {});
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
