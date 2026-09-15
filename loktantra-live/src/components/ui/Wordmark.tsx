/**
 * "Loktantra Live", where the tittle on the i is the voter's ink mark and
 * doubles as a live-broadcast indicator.
 *
 * The i is drawn rather than typed. The obvious way to write this is with
 * a dotless ı (U+0131), but that single character lives in Bricolage's
 * latin-ext subset, which put a second font file on the critical path for
 * the wordmark alone — and the hero headline is the LCP element, so it was
 * paying for it. Drawing the stem keeps the page on the `latin` subset.
 *
 * The numbers come from measuring Bricolage Grotesque at weight 800:
 * advance 0.286em, stem ink from 0.06em to 0.23em (so 0.17em wide), height
 * to the x-height at 0.53em, tittle occupying 0.53em–0.76em. If the display
 * face ever changes, re-measure with canvas `measureText` and update these.
 */

const ADVANCE = "0.286em";
const X_HEIGHT = "0.53em";
const STEM_LEFT = "0.06em";
const STEM_WIDTH = "0.17em";
const DOT_SIZE = "0.2em";
const DOT_LEFT = "0.045em"; // centres the dot on the stem
const DOT_BOTTOM = "0.56em";

export function Wordmark({
  className = "",
  pulse = true,
}: {
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold tracking-tight ${className}`}
    >
      {/* The visible mark has no letter "i" in it at all, so the real name
          is carried by hidden text — an aria-label is not a permitted
          attribute on a span with no role. */}
      <span className="sr-only">Loktantra Live</span>

      <span aria-hidden>Loktantra&nbsp;L</span>

      {/* An empty inline-block sits its bottom edge on the baseline, which
          is exactly where the stem should start. */}
      <span
        aria-hidden
        className="relative inline-block align-baseline"
        style={{ width: ADVANCE, height: X_HEIGHT }}
      >
        <span
          className="absolute bottom-0 bg-current"
          style={{ left: STEM_LEFT, width: STEM_WIDTH, height: X_HEIGHT }}
        />
        <span
          className="absolute rounded-full bg-violet"
          style={{
            left: DOT_LEFT,
            bottom: DOT_BOTTOM,
            width: DOT_SIZE,
            height: DOT_SIZE,
            animation: pulse
              ? "lk-pulse 2.4s var(--ease-out-soft) infinite"
              : undefined,
          }}
        />
      </span>

      <span aria-hidden>ve</span>
    </span>
  );
}
