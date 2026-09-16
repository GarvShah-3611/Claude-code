# Loktantra Live

Site for a youth-led digital publication covering protest, policy and Indian
democracy. Seven click-to-open pages rather than one long scroll.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger ·
Motion · Lenis · React Three Fiber + drei.

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

## Pages

The site is seven pages that open on click. A home page that indexes the desks,
and six desks behind it:

| Route | Page | Section component |
|---|---|---|
| `#/` | Hero, wire ticker, desk index, weekly brief | `Hero`, `WireTicker`, `DeskIndex`, `Brief` |
| `#/ground` | Ground reports | `GroundReports` |
| `#/watch` | Watchlist | `Watch` |
| `#/feed` | On the feed | `Feed` |
| `#/voices` | Youth Voices | `Voices` |
| `#/about` | Why we exist | `About` |
| `#/write` | Write for us | `Work` |

[`PageShell.tsx`](src/components/chrome/PageShell.tsx) owns the switch: one
`AnimatePresence` crossfade, a jump to the top through Lenis, and a
`ScrollTrigger.refresh()` once the new page has settled — every scroll-driven
measurement taken against the previous page's height is wrong the moment the
route changes.

Routing is a **hash** router ([`src/lib/router.ts`](src/lib/router.ts)), not
Next's file routing. The site is exported statically and served from a
subdirectory, so a hard refresh on a real `/ground` path would ask a server that
is not there. A hash keeps every page bookmarkable, linkable and
back-button-able with no server at all. To add a page: add its name to `ROUTES`,
add a `case` to `Page`, and add a nav entry in `site.ts` with that `route`.

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

| Token | Value | Measured on `--color-paper` |
|---|---|---|
| `--color-paper` | `#faf6f2` | page ground — warm ivory, not white |
| `--color-surface` | `#ffffff` | cards |
| `--color-ink` | `#241520` | **16.23:1** — AAA |
| `--color-ash` | `#6a5560` | **6.34:1** — AA |
| `--color-ash-dim` | `#9a8a93` | **3.04:1 — fails AA, never use for text** |
| `--color-burgundy` | `#7a1e3c` | **9.40:1** — AAA as text *and* as a fill |
| `--color-burgundy-deep` | `#5c1229` | **12.41:1** — hover and pressed |
| `--color-lavender` | `#c3b0df` | **1.84:1 — never text.** Washes, glows, chips |
| `--color-lavender-ink` | `#5e4795` | **6.95:1** — the text-safe lavender |
| `--color-signal` | `#b4291f` | **5.96:1** — form errors only |

The accent is split on purpose. **Burgundy** is the brand's voice: CTAs,
section rules, every hover and focus state. **Lavender-ink** is the quieter
second accent — story kickers, feed formats, result metrics — so lavender
lives in the type and not only in background washes.

Three traps before you swap anything:

- **Lavender fails as text on every surface here (1.84:1).** It is for fills
  and washes. A *filled* lavender chip is fine — ink on lavender is 8.81:1.
- **Labels on the burgundy fill must be light.** Paper on burgundy is 9.40:1;
  ink on burgundy is 1.73:1. The `on-burgundy` utility handles this.
- **A colour map multiplies with the material colour in three.js.** The gavel's
  wood carries its colour in the texture and its materials sit at white. Tint
  both and you darken twice — the first pass rendered near-black.

After changing any colour, re-run the audit — it checks contrast for real:

```bash
npm run build && npx next start &
node tools/a11y.mjs
```

---

## Adding photos

Every illustrated plate is also a photo slot, and **no code changes are needed
to fill one**. Save a file at the path the slot expects and it replaces the
drawing on the next build; leave the slot empty and the drawing stays.

| Path (under `public/`) | Slot | Aspect | Suggested size |
|---|---|---|---|
| `media/ground/gr-1.jpg` … `gr-4.jpg` | Ground-report cards | 16:10 | 1600 × 1000 |
| `media/about/newsroom.jpg` | "Why we exist" portrait | 4:5 | 1200 × 1500 |
| `media/feed/f1.jpg` … `f6.jpg` | On-the-feed tiles | 1:1 | 1200 × 1200 |
| `media/voices/v1.jpg` … `v4.jpg` | Youth Voices portraits | 1:1 | 600 × 600 |

The paths are listed as `photo:` fields in
[`site.ts`](src/content/site.ts); change the extension there if you want `.webp`
or `.png` instead of `.jpg`.

A missing file is a designed state, not a broken one. The drawing sits
underneath the `<img>`, so a load error reveals it with no reflow and no
broken-image icon — which means you can add photographs one at a time without
ever leaving a hole in the page. Feed tiles go further and restyle themselves:
copy is ink-on-lavender with no photo and white-on-scrim once one loads, so
contrast holds either way.

Two things to check before committing a photograph:

- **Licence.** Own work, a Creative Commons licence that permits the use, or a
  stock licence. Record it in [`public/media/CREDITS.md`](public/media/CREDITS.md).
- **Weight.** Under ~300KB each. There is no image optimiser at runtime — this
  is a static export, so the file you commit is the file that ships.

Finally, **update the alt text**. The `imageAlt` strings in `site.ts` currently
describe the illustrations ("Duotone illustration of …") and are wrong for a
photograph.

### Why the placeholders are drawn, not generated

Synthetic images that read as protest reportage are a credibility risk for a
publication whose whole pitch is being fact-first, so the placeholders in
[`NewsroomPlate.tsx`](src/components/ui/NewsroomPlate.tsx) are abstract on
purpose: geometry in the brand duotone that reads as a subject without
pretending to document one. Real photographs are the intended end state; that
is what the slots above are for.

### The 3D hero

[`GavelScene.tsx`](src/components/three/GavelScene.tsx) is a rosewood gavel
and sound block. Everything is generated at runtime — there is no model file
and no texture file:

- **Shapes** are `latheGeometry` profiles, because a gavel is a turned object
  in real life. Chamfers and the incised band grooves cost only extra points.
- **Wood** comes from [`wood.ts`](src/components/three/wood.ts), which draws
  growth rings, pore lines and a matching roughness map to a canvas.
- **Reflections** come from an `<Environment>` built out of `<Lightformer>`s.
  drei's HDR presets fetch from a CDN this project cannot reach, and a glossy
  surface with nothing to reflect renders flat. The env scene sets its own
  background colour: leave it black and every gloss reflects a hard light/dark
  edge that reads as a seam across the object.
- **The 360** is `<OrbitControls>` — drag to turn it, and it auto-rotates when
  left alone. Zoom and pan are off so it cannot be lost off-frame.

It loads only when the viewport is ≥768px with a fine pointer, the device
reports ≥4 cores, motion is not reduced, and the hero is on screen; it
unmounts when scrolled away. Everything else gets
[`GavelFallback.tsx`](src/components/three/GavelFallback.tsx), an SVG twin in
the same box, so the layout never shifts between them. Keep the two in the
same hue — they swap places on one page, and a colour difference reads as a
bug.

Because the gavel is draggable it keeps its pointer events, unlike a purely
decorative visual. It sits at `z-0` so the headline and CTAs stay clickable
over it.

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

node tools/shoot-pages.mjs        # every page at 1440 / 768 / 375 → ./shots
node tools/shoot-pages.mjs feed   # just one page
node tools/shoot.mjs              # section-by-section framing
node tools/a11y.mjs               # axe-core + keyboard + reduced motion
```

`shoot-pages.mjs` does a full navigation per route rather than poking the hash,
which is the thing a hash router can get wrong: it proves a cold entry on a deep
link renders the right page.

Both shooters capture scrolled viewport bands rather than one full-page image,
on purpose — Chromium's capture-beyond-viewport repeats whole sections on a tall
document, which looks exactly like a page bug and is not one. Both report
console errors too; a clean render with a red console is not a pass.

`a11y.mjs` takes one URL, so run it per page:

```bash
for r in "/" "/#/ground" "/#/watch" "/#/feed" "/#/voices" "/#/about" "/#/write"; do
  URL="http://127.0.0.1:3000$r" node tools/a11y.mjs
done
```

### Where things stand

Lighthouse, median of three runs (it varies by a few points per run):

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 90 | 100 | 100 | 100 |

axe-core reports zero WCAG 2.1 AA violations on all seven pages, at both widths,
with and without reduced motion, and every keyboard stop shows a visible focus
ring.

Mobile LCP sits at ~3.5s and is the hero headline waiting on the display font —
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
