"use client";

import { useState } from "react";
import { feed } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";

const typeIcon: Record<string, IconName> = {
  carousel: "layers",
  chart: "chart",
  video: "play",
};

/**
 * The Instagram-first work: short explainers, carousels and clips.
 *
 * Tiles are square and typed, because on the feed the format is the first
 * thing a reader judges. The type badge is a real label with an icon, not
 * an icon alone — an icon-only control would leave the format unnamed.
 */
export function Feed() {
  return (
    <RevealSection id="feed" className="py-24 md:py-32" stagger={0.05}>
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading label={feed.eyebrow} blurb={feed.blurb}>
            {feed.heading}
          </SectionHeading>

          <a
            href={feed.handleHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="grow"
            className="reveal group flex shrink-0 items-center gap-2 rounded-pill border border-hairline-hi px-5 py-2.5 text-[0.9375rem] text-ink transition-colors hover:border-burgundy hover:text-burgundy"
          >
            {feed.handle}
            <Icon
              name="arrow"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {feed.items.map((item) => (
            <li key={item.id} className="reveal">
              <FeedTile item={item} href={feed.handleHref} />
            </li>
          ))}
        </ul>
      </div>
    </RevealSection>
  );
}

/**
 * One square tile.
 *
 * It carries its own loaded/missing state because the whole tile changes
 * when a photograph lands: the copy moves from ink-on-white to white-on-
 * scrim. Doing that with a CSS sibling selector would leave the text
 * unreadable for the moment between paint and load error, so the tile owns
 * the switch and only flips once the image has actually decoded.
 */
function FeedTile({
  item,
  href,
}: {
  item: (typeof feed.items)[number];
  href: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="grow"
      className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-card border border-hairline bg-surface p-5 transition-colors duration-300 hover:border-hairline-hi"
    >
      {/* Lavender wash — the whole tile until a photograph is dropped in. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgba(195,176,223,0.42),transparent_62%)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110"
      />

      {item.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.photo}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Legibility scrim, only once there is a photograph to sit on. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5 transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        className={`relative flex items-center gap-2 text-xs ${
          loaded ? "text-paper" : "text-lavender-ink"
        }`}
      >
        <Icon name={typeIcon[item.type] ?? "layers"} className="h-4 w-4" />
        {item.type}
      </span>

      <h3
        className={`relative mt-3 text-[1.0625rem] leading-snug md:text-[1.1875rem] ${
          loaded ? "text-paper" : "text-ink"
        }`}
      >
        {item.title}
      </h3>

      <span
        className={`relative mt-3 text-sm ${loaded ? "text-paper/80" : "text-ash"}`}
      >
        {item.stat} views
      </span>
    </a>
  );
}
