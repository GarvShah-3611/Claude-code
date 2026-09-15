# Loktantra Live

Single-page site for a youth-led digital publication covering protest, policy and
Indian democracy.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger ·
Motion · Lenis · React Three Fiber.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npx next start
```

> **Dev-server note:** in a sandboxed environment where the HMR websocket is
> blocked, `next dev` serves HTML but never hydrates, so nothing is interactive
> and no animation runs. If the page looks inert, check the console for a failed
> `_next/hmr` websocket and verify against `npm run build && npx next start`
> instead. This is not a bug in the site.

---

## Editing the content

**Every string on the page lives in [`src/content/site.ts`](src/content/site.ts).**
Nothing else needs touching to change copy.

| Export | Controls |
|---|---|
| `site` | Name, tagline, description, canonical URL — feeds `<title>`, OG tags and the JSON-LD |
| `nav` | Navbar links and the pill CTA |
| `hero` | Badge, the three headline lines, subline, both CTAs, the footnote |
| `ticker` | The wire-feed marquee items |
| `about` | Origin story paragraphs and the three stat counters |
| `desks` | The six bento cards, including their grid spans |
| `ground` | The four ground reports on the horizontal rail |
| `feed` | The six Instagram tiles |
| `voices` | The testimonial carousel |
| `brief` | Newsletter headline, placeholder, consent line, success state |
| `work` | Form labels, inquiry types, validation messages, success state |
| `footer` | Columns, socials, colophon, legal line |

### Headline lines are deliberate

`hero.headline` is an **array of lines**, not one string. Each line animates up
from inside its own clipping mask, and the mask only works while the line does
not wrap — a wrapped line disappears entirely. If you lengthen a line, check it
at 1440px, 768px and 375px, and lower `--text-mega` in
[`globals.css`](src/app/globals.css) if it wraps.

### The story content is placeholder

Headlines, bylines, quotes and figures are written to be plausible, not true.
Replace them with real published work before launch — especially the stat
counters (`about.stats`) and the reader quotes (`voices.items`), which make
claims a reader will take at face value.

---

## Changing the colours

All tokens are in the `@theme` block at the top of
[`src/app/globals.css`](src/app/globals.css). Change a hex there and it
propagates everywhere; no component hardcodes a colour.

| Token | Value | Measured on `--color-ink` |
|---|---|---|
| `--color-ink` | `#0e0e12` | page ground |
| `--color-surface` | `#1a1a22` | cards |
| `--color-newsprint` | `#f4f1ea` | **17.08:1** — AAA |
| `--color-ash` | `#9a97a3` | **6.72:1** — AA |
| `--color-ash-dim` | `#6f6c79` | **3.75:1 — fails AA, never use for text** |
| `--color-violet` | `#8b5cf6` | **4.55:1** — AA, fills and large type only |
| `--color-violet-light` | `#a78bfa` | **7.08:1** — the text-safe accent |
| `--color-signal` | `#e63946` | **4.62:1** — LIVE badge and errors only |

Two traps worth knowing before you swap anything:

- **`#8b5cf6` on a card is 4.08:1 and fails AA for small text.** Small violet
  text uses `--color-violet-light`. Keep that split if you change the accent.
- **Newsprint on a violet fill is 3.75:1 and fails.** Filled CTAs put *ink* text
  on violet (4.55:1) via the `on-violet` utility. If you pick a lighter accent,
  re-check which direction passes.

After changing any colour, re-run the audit — it checks contrast for real:

```bash
npm run build && npx next start &
node tools/a11y.mjs
```

---

## Swapping the imagery

The plates in [`NewsroomPlate.tsx`](src/components/ui/NewsroomPlate.tsx) are
drawn SVG, not photographs. That was a deliberate call: synthetic images that
read as protest reportage are a credibility risk for a publication whose whole
pitch is being fact-first. They are abstract on purpose.

To use real photographs, replace the component call with `next/image` at the
same aspect ratio so nothing shifts:

```tsx
// Ground report cards — 16/10
<Image src="/assets/union-election.jpg" alt="…" width={1280} height={800}
       className="rounded-card border border-hairline" />

// About card — 4/5
<Image src="/assets/newsroom.jpg" alt="…" width={1000} height={1250}
       className="rounded-card border border-hairline" />
```

Put files in `public/assets/`. Write real alt text describing what the photo
shows — the current `imageAlt` strings describe illustrations and will be wrong
for a photo.

### The 3D hero

[`ColonnadeScene.tsx`](src/components/three/ColonnadeScene.tsx) is a ring of 28
instanced columns under a shallow dome — Parliament's circular colonnade, drawn
so it also reads as a broadcast record ring. It is generated from primitives, so
there is no model file to download.

It loads only when the viewport is ≥768px with a fine pointer, the device
reports ≥4 cores, motion is not reduced, and the hero is on screen; it unmounts
when scrolled away. Everything else gets
[`ColonnadeFallback.tsx`](src/components/three/ColonnadeFallback.tsx), an SVG
twin in the same box, so the layout never shifts between them.

There is no environment map — drei's presets fetch from a CDN. That is why the
materials are low-metalness: a metal surface with nothing to reflect renders
black. If you add an environment, raise `metalness` and drop the light
intensities.

---

## Wiring up the forms

Both forms validate client-side and then `console.info` the payload. There is no
backend. Replace the two marked calls:

- `src/components/sections/Brief.tsx` → `// Replace with a real subscribe call.`
- `src/components/sections/Work.tsx` → `// Replace with a real submit call.`

Keep the existing success states and error handling; only the network call needs
to change.

---

## Motion

One switch governs everything: `motionDisabled()` in
[`src/lib/motion.ts`](src/lib/motion.ts), which is true when the visitor prefers
reduced motion **or** the page is loaded with `?static=1`.

`?static=1` renders every reveal in its final state and turns off Lenis. Use it
for screenshots and audits — otherwise the page height keeps changing and
captures are unreliable.

Two Tailwind/GSAP interactions worth knowing before you touch the animations:

- **Tailwind v4 compiles `translate-y-*` to the standalone `translate`
  property**, which composes on top of `transform` rather than being overridden
  by it. A GSAP tween on `y` can never clear it. Animated start states use
  `transform` directly.
- **GSAP parses an existing CSS transform into its `y` cache and stacks
  `yPercent` on top of it.** The hero flips `data-hero="idle"` → `"run"` to drop
  the CSS start-state rule *before* GSAP reads the element. Reverse that order
  and the headline animates 200%→100% and never arrives.

---

## Verifying changes

```bash
npm run build && npx next start &

node tools/shoot.mjs            # screenshots → ./shots
node tools/shoot.mjs desks      # just one section
node tools/a11y.mjs             # axe-core + keyboard + reduced motion
```

`shoot.mjs` captures each section at 1440 / 768 / 375 plus scrolled viewport
bands, and reports any console errors — a clean render with a red console is not
a pass. It takes bands rather than one full-page image on purpose: Chromium's
capture-beyond-viewport repeats whole sections on a document this tall, which
looks exactly like a page bug and is not one.

### Where things stand

Lighthouse, median of three runs (it varies by a few points per run):

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 91 | 100 | 100 | 100 |

axe-core reports zero WCAG 2.1 AA violations at both widths, with and without
reduced motion, and every keyboard stop shows a visible focus ring.

Mobile LCP sits at ~3.4s and is the hero headline waiting on the display font —
that is the remaining lever if you want to push performance higher. Self-hosting
a subset of Bricolage containing only the characters the hero uses would be the
next step.

---

## A self-contained copy

```bash
npm run build:offline      # -> out/
```

Produces a static bundle that opens by double-clicking `out/index.html`,
with no server and no install. Useful for sending the site to someone who
just wants to look at it.

Two things `tools/make-offline.mjs` does after the export, and why:

- **Inlines the fonts as data URIs.** Relative asset paths get the HTML, CSS
  and JS loading over `file://`, but browsers apply CORS to fonts even for a
  file sitting next to the page, so every `@font-face` fetch fails and the
  design falls back to system type. Embedding them is the only way to keep
  the real typography offline. The deployed site keeps the fonts as separate
  files — base64 costs about a third in overhead and lands in critical CSS.
- **Makes the generated icon and OG image paths relative.** `assetPrefix`
  does not rewrite metadata routes, so they would resolve against the
  filesystem root.

The bundle still logs CORS errors for the font *preloads*. They are
cosmetic — the CSS already carries the fonts. React replays those hints
from its streamed payload, and editing them out with a regex corrupts the
payload and silently breaks hydration, so they are left alone.

`OFFLINE_EXPORT=1` is what switches `next.config.ts` into export mode; the
normal build and every Vercel deploy are unaffected.

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Or import the repo at [vercel.com/new](https://vercel.com/new) — the project
root is `loktantra-live/`. No environment variables are needed as it stands; add
them when you wire up the forms.

**Before going live**, set the real domain in `site.url` in
[`src/content/site.ts`](src/content/site.ts). It feeds `metadataBase`, the
canonical URL, the OG tags and `sitemap.xml`, so link previews and search
results will point at the placeholder domain until you do.

`next.config.ts` pins `turbopack.root` to this directory because the app sits
inside a repo that has its own lockfile. Keep that if the folder stays nested;
drop it if you extract the app to its own repo.
