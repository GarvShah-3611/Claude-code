import { footer } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Icon } from "@/components/ui/Icon";

/**
 * Footer, closing on an oversized wordmark.
 *
 * The wordmark is set to fill the container width and clipped at the
 * baseline, so the page ends on the brand rather than on a row of links.
 * It is `aria-hidden` because the same name is already announced by the
 * navbar and the page title — repeating it here is noise.
 */
export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-hairline pt-20">
      <div className="container-page">
        <div className="grid gap-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-[1.375rem] text-ink" pulse={false} />
            <p className="mt-5 max-w-xs text-[0.9375rem] text-ash">
              {footer.blurb}
            </p>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-sans text-sm font-normal text-ash">
                {col.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[0.9375rem] text-ash transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hairline py-8">
          <ul className="flex flex-wrap gap-3">
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="grow"
                  className="group flex items-center gap-2 rounded-pill border border-hairline-hi px-4 py-2 text-[0.9375rem] text-ink transition-colors hover:border-burgundy hover:text-burgundy"
                >
                  {s.label}
                  <span className="text-ash transition-colors group-hover:text-burgundy">
                    {s.handle}
                  </span>
                  <Icon
                    name="arrow"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-sm text-ash">{footer.colophon}</p>
        </div>
      </div>

      {/* Oversized wordmark, set in SVG rather than as sized text.
          `textLength` + `lengthAdjust` make it span the container exactly at
          any viewport, which a vw-based font-size cannot do — that version
          overflowed and clipped the final letters. */}
      <div aria-hidden className="container-page pt-4">
        <svg
          viewBox="0 0 1000 132"
          className="w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <text
            x="500"
            y="122"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-ink/[0.07] font-display text-[132px] font-extrabold"
          >
            {footer.wordmark}
          </text>
        </svg>
      </div>

      <div className="container-page border-t border-hairline py-7">
        <p className="text-sm text-ash">{footer.legal}</p>
      </div>
    </footer>
  );
}
