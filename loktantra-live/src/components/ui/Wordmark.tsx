/**
 * "Loktantra Live", where the tittle on the i is the voter's ink mark and
 * doubles as a live-broadcast indicator.
 *
 * The i is set as a dotless ı (U+0131, needs the latin-ext subset) and the
 * dot is drawn as an element instead, so it can carry its own colour and
 * pulse. `aria-label` restores the real spelling for screen readers, since
 * the visible text is no longer literally "Live".
 */
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
      aria-label="Loktantra Live"
    >
      <span aria-hidden>Loktantra&nbsp;L</span>
      <span aria-hidden className="relative inline-block">
        ı
        <span
          className="absolute left-1/2 top-[0.06em] block h-[0.2em] w-[0.2em] -translate-x-1/2 rounded-full bg-violet"
          style={
            pulse
              ? { animation: "lk-pulse 2.4s var(--ease-out-soft) infinite" }
              : undefined
          }
        />
      </span>
      <span aria-hidden>ve</span>
    </span>
  );
}
