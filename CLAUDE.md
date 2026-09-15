# Claude-code

A workspace holding vendored design skills and the sites built with them.

```
.claude/skills/   installed skills (what Claude loads)
skills/           the upstream downloads these were installed from
aperture/         Aperture photography studio landing page
```

## Building websites and UI in this repo

When the request is to build, redesign, or improve a website, landing page, or any
UI, load these before writing code — do not design from defaults:

1. **`ui-ux-pro-max`** — query its database first for the style, palette, typography,
   and UX guidance that fit the brief. It is a real dataset, not prose:

   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain ux
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack nextjs
   ```

   Say so explicitly if a query returns nothing and you fall back to your own judgement.

2. **`frontend-design`** — aesthetic direction: commit to a palette and type pairing
   that suit this subject, and avoid the templated looks it lists.

3. **`impeccable`** — craft and verification passes: layout, motion, accessibility,
   and the audit/polish playbooks in its `reference/` directory.

Also available: `ui-styling` (shadcn/Tailwind), `design-system` (tokens), `brand`,
`uiux-design`, `banner-design`, `slides`.

`uiux-design` is the ui-ux-pro-max package's own `design` skill, renamed so it does
not collide with Claude's built-in `design` canvas skill.

## Verifying UI work

Never report a UI change as done on the strength of the code alone. Start the dev
server, drive it with Playwright, and look at a screenshot. Chromium is
preinstalled — launch with `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`
rather than running `playwright install`. `aperture/tools/` has working examples:
`shoot.mjs` (section screenshots), `iframe-test.mjs` (embedded rendering), `a11y.mjs`
(reduced motion).

Check the page standalone *and* embedded in a frame. A host that owns the scroll
breaks anything gated on scroll position.

## MCP servers

`.mcp.json` registers `shadcn` (with the React Bits registry from `components.json`)
and `magicuidesign-mcp`. Prefer pulling a component from those over hand-rolling one.
