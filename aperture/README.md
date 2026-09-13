# Aperture — photography studio landing page

An image-forward, editorial one-page site for a photography studio. Light warm-neutral
palette, Bodoni Moda display type, GSAP scroll choreography, Lenis momentum scrolling,
and Three.js for the hero dissolve and the gallery hover lens.

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # static output in dist/
npm run preview
```

Deploy `dist/` to any static host. There is no backend.

## Replacing the placeholder photography

**The images in `public/images/` are not photographs.** They are light studies rendered
with WebGL (`npm run gen:images`) because the build environment had no licensed
photography available. They are there to hold the design together — swap them for the
studio's real work.

Drop real files into `public/images/` using the same names and aspect ratios, and
nothing else needs to change:

| File | Ratio | Used by |
| --- | --- | --- |
| `hero-01/02/03.jpg` | 16:10 | hero dissolve sequence |
| `work-01,03,04,06,08.jpg` | 4:5 | portrait plates in the gallery |
| `work-02,05,07.jpg` | 3:2 | landscape plates in the gallery |
| `about.jpg` | 4:5 | studio section |
| `service-weddings/portraits/editorial.jpg` | 3:4 | services |
| `displacement.png` | 1:1 grey | drives the dissolve and hover warp — keep this one |

Then update the `alt` text and `figcaption` in `index.html`, since both currently
describe the placeholders.

The copy — studio name, photographer, prices, testimonials, Lisbon address — is written
placeholder content. Replace it with the studio's own.

## Structure

```
index.html              markup and copy
src/css/style.css       tokens, layout, reveal start states
src/js/main.js          Lenis, GSAP ScrollTrigger, form
src/js/hero-gl.js       hero plate dissolve
src/js/hover-gl.js      gallery hover lens
tools/gen.html          the WebGL renderer behind the placeholder plates
tools/generate-images.mjs
tools/shoot.mjs         screenshots the running site at each section
```

## Notes

- Fonts are self-hosted via `@fontsource-variable`, so there is no Google Fonts request.
- `prefers-reduced-motion` removes the `has-motion` class, drops the hero canvas, and
  skips every GSAP timeline; all content renders statically.
- The enquiry form validates client-side and does not send anything. Point it at a form
  service or the studio inbox in `wireForm()`.
- Reveal start states live in CSS under `.has-motion` and are animated out by GSAP. When
  animating one with GSAP, set both `yPercent` and `y` — GSAP parses a CSS
  `translateY(%)` into a pixel offset that otherwise survives the tween.
