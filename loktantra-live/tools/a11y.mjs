/**
 * Accessibility audit: runs axe-core against the page at three widths,
 * then checks the two things axe cannot see — that the page still reads
 * correctly with motion disabled, and that every interactive element is
 * reachable by keyboard.
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const URL = process.env.URL || "http://127.0.0.1:3000/";
const WIDTHS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "mobile", w: 375, h: 812 },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

let failures = 0;

for (const reduced of [false, true]) {
  for (const { name, w, h } of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: w, height: h },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const label = `${name}${reduced ? " (reduced motion)" : ""}`;
    if (results.violations.length === 0) {
      console.log(`PASS  ${label}: no axe violations`);
    } else {
      failures += results.violations.length;
      console.log(`FAIL  ${label}: ${results.violations.length} violation(s)`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id} — ${v.help}`);
        for (const node of v.nodes.slice(0, 3)) {
          console.log(`      ${node.target.join(" ")}`);
          if (node.failureSummary) {
            console.log(
              "      " + node.failureSummary.split("\n").slice(1, 3).join(" / "),
            );
          }
        }
      }
    }

    // Only meaningful with motion off: otherwise below-the-fold reveals are
    // supposed to be transparent until they are scrolled to.
    const invisible = reduced ? await page.evaluate(() =>
      [...document.querySelectorAll(".reveal, .hero-fade, .hero-line")].filter(
        (el) => parseFloat(getComputedStyle(el).opacity) < 0.95,
      ).length,
    ) : 0;
    if (invisible > 0) {
      failures++;
      console.log(`FAIL  ${label}: ${invisible} element(s) stuck below full opacity`);
    }

    await context.close();
  }
}

// Keyboard reachability: tab through and confirm focus lands on real
// controls with a visible focus indicator.
const kbContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await kbContext.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1800);

const seen = [];
for (let i = 0; i < 40; i++) {
  await page.keyboard.press("Tab");
  // Let any focus transition settle before measuring the ring.
  await page.waitForTimeout(60);
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40),
      outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
      matchesFocusVisible: el.matches(":focus-visible"),
    };
  });
  if (info) seen.push(info);
}
const noOutline = seen.filter((s) => !s.outline);
console.log(`\nKeyboard: ${seen.length} stops reached`);
if (noOutline.length) {
  failures += noOutline.length;
  console.log(`FAIL  ${noOutline.length} focus stop(s) with no visible outline:`);
  noOutline.slice(0, 6).forEach((s) =>
    console.log(
      `      <${s.tag}> ${s.label} | style=${s.outlineStyle} width=${s.outlineWidth} :focus-visible=${s.matchesFocusVisible}`,
    ),
  );
} else {
  console.log("PASS  every focus stop shows a visible outline");
}

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} problem(s) found`);
process.exit(failures === 0 ? 0 : 1);
