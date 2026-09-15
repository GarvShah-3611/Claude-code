import { ticker } from "@/content/site";

/**
 * Infinite marquee of recent headlines — a wire feed rather than a row of
 * borrowed client logos, which a publication of this size would not have.
 *
 * The list is rendered twice and translated by exactly -50%, so the loop
 * is seamless. CSS animation rather than JS: it costs nothing, runs off
 * the main thread, and the global reduced-motion rule already stops it.
 *
 * The duplicate is `aria-hidden` so screen readers hear each headline once.
 */
export function WireTicker() {
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {ticker.items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-sm text-ash">{item}</span>
          <span
            aria-hidden
            className="h-1 w-1 shrink-0 rounded-full bg-burgundy"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      id="ticker"
      aria-label={ticker.label}
      className="relative border-y border-hairline bg-paper-raised py-4"
    >
      {/* Edges fade into the page so headlines enter and leave rather than
          being chopped off at the viewport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper-raised to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper-raised to-transparent"
      />

      <div className="flex overflow-hidden">
        <div
          className="flex min-w-max"
          style={{ animation: "lk-marquee 46s linear infinite" }}
        >
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
