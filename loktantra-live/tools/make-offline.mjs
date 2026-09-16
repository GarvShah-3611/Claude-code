/**
 * Turns `out/` (from `next build` with output:"export") into a bundle that
 * works by double-clicking index.html, with no server.
 *
 * Relative asset paths get the HTML, CSS and JS loading over file://, but
 * browsers apply CORS to fonts even for a file next to the page, so every
 * @font-face request fails and the site falls back to system type. Inlining
 * the woff2 files as data URIs is the only way to keep the real typography
 * offline.
 *
 * This is for the downloadable copy only. The deployed site should serve
 * the fonts as separate files so they cache independently — inlining adds
 * roughly a third in base64 overhead and puts it all in the critical CSS.
 *
 *   node tools/make-offline.mjs [dir=out]
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.argv[2] || "out";
const cssDir = path.join(root, "_next/static/chunks");
const mediaDir = path.join(root, "_next/static/media");

const files = await readdir(cssDir);
const sheets = files.filter((f) => f.endsWith(".css"));
if (!sheets.length) {
  console.error(`No CSS found in ${cssDir} — did the export run?`);
  process.exit(1);
}

let inlined = 0;
let bytes = 0;

for (const sheet of sheets) {
  const file = path.join(cssDir, sheet);
  let css = await readFile(file, "utf8");

  const urls = [...new Set([...css.matchAll(/url\(\.\.\/media\/([^)]+)\)/g)].map((m) => m[1]))];

  for (const name of urls) {
    if (!name.endsWith(".woff2")) continue;
    const buf = await readFile(path.join(mediaDir, name));
    const uri = `data:font/woff2;base64,${buf.toString("base64")}`;
    css = css.replaceAll(`url(../media/${name})`, `url(${uri})`);
    inlined++;
    bytes += buf.length;
  }

  await writeFile(file, css);
}

/* The pages also preload the original font files, which fail under file://
   with a CORS error. That noise is cosmetic — the CSS carries the fonts
   now — so only the plain <link rel="preload" as="font"> tags are removed.
   React replays the same hints from `:HL[...]` rows in its streamed
   payload, so the errors come back; editing those rows out with a regex
   corrupts the payload and silently breaks hydration, which is far worse
   than a red console. Leave them alone. */
let stripped = 0;
/* Metadata routes (the generated icon and OG image) are emitted with
   root-absolute hrefs that assetPrefix does not rewrite, so under file://
   they resolve against the filesystem root. Make them relative too. */
const relativiseMetadata = (text) =>
  text
    .replace(/(href=\\?")\/(icon|opengraph-image|apple-icon)/g, "$1./$2")
    .replace(/("\/)(icon|opengraph-image|apple-icon)(\?)/g, '"./$2$3');

const dropFontHints = (text) =>
  relativiseMetadata(text)
    .replace(/<link[^>]+as="font"[^>]*>/g, () => (stripped++, ""))
    ;

for (const name of await readdir(root)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(root, name);
  const text = await readFile(file, "utf8");
  const cleaned = dropFontHints(text);
  if (cleaned !== text) await writeFile(file, cleaned);
}

console.log(
  `Inlined ${inlined} font file(s), ${(bytes / 1024).toFixed(0)}KB, into ${sheets.length} stylesheet(s).`,
);
console.log(`Removed ${stripped} font preload link(s) from the HTML.`);
console.log(`${root}/index.html can now be opened directly in a browser.`);

/* ---------------------------------------------------------------------- *
 * Escape U+FFFD in the emitted JavaScript.
 *
 * core-js' URLSearchParams decoder emits the replacement character for a
 * malformed percent-escape, and the minifier leaves it in the chunk as a
 * literal byte. That is correct JavaScript, but publishing pipelines that
 * check for U+FFFD read it as evidence that a file was mis-decoded on the
 * way in and reject the upload — so the chunk has to carry the escape
 * instead of the character.
 *
 * Every replacement lands inside a string literal, where "\uFFFD" is
 * exactly equivalent. Rather than trust that, each rewritten file is parsed
 * before it is written: a substitution that landed somewhere else (a regex
 * literal, say) fails the check and aborts the build instead of shipping a
 * chunk that throws on load.
 * ---------------------------------------------------------------------- */
async function escapeReplacementChars(dir) {
  let files = 0;
  let hits = 0;

  const walk = async (d) => {
    for (const entry of await readdir(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.name.endsWith(".js")) continue;

      const text = await readFile(full, "utf8");
      if (!text.includes("\uFFFD")) continue;

      const count = text.split("\uFFFD").length - 1;
      const fixed = text.replaceAll("\uFFFD", "\\uFFFD");
      await writeFile(full, fixed);

      try {
        execFileSync(process.execPath, ["--check", full], { stdio: "pipe" });
      } catch (err) {
        await writeFile(full, text); // put the original back
        throw new Error(
          `${full}: escaping U+FFFD produced JavaScript that no longer ` +
            `parses, so at least one occurrence is not inside a string ` +
            `literal. Fix it by hand.\n${err.stderr?.toString() ?? err}`,
        );
      }

      files++;
      hits += count;
    }
  };

  await walk(dir);
  return { files, hits };
}

const { files: fixedFiles, hits: fixedHits } = await escapeReplacementChars(root);
if (fixedHits) {
  console.log(
    `Escaped ${fixedHits} literal U+FFFD in ${fixedFiles} chunk(s); each file re-parsed clean.`,
  );
}
