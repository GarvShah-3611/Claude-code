"use client";

import { useState } from "react";
import { watch } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

/**
 * Real video, from other people's channels, credited.
 *
 * Every card is a link out to YouTube rather than an embedded player. An
 * in-page lightbox was the nicer design and it cannot work here: the site
 * is served inside a sandboxed frame whose policy refuses a third-party
 * embed, so the player would have failed silently wherever it was actually
 * being read. A link that opens the video is worse in theory and works.
 *
 * Thumbnails come from i.ytimg.com — the real frames, not stand-ins — but
 * that same policy can refuse a remote image too, and a reader on a network
 * that blocks YouTube is in the same position. So the missing state is a
 * designed plate rather than a blank box; see ThumbPlate below.
 */
export function Watch() {
  /** Thumbnails that failed to load. */
  const [broken, setBroken] = useState<Record<string, true>>({});

  return (
    <RevealSection id="watch" className="py-24 md:py-32" stagger={0.05}>
      <div className="container-page">
        <SectionHeading label={watch.eyebrow} blurb={watch.blurb}>
          {watch.heading}
        </SectionHeading>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {watch.items.map((item) => (
            <li key={item.id} className="reveal">
              <a
                href={`https://www.youtube.com/watch?v=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="grow"
                className="group w-full overflow-hidden rounded-card border border-hairline bg-surface text-left transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(36,21,32,0.28)]"
              >
                <span className="relative block aspect-video overflow-hidden bg-paper-raised">
                  {/* Plain img, not next/image: these are remote thumbnails on
                      a statically exported site, and the intrinsic size is
                      known so there is no layout shift either way. */}
                  {broken[item.id] ? (
                    <ThumbPlate channel={item.channel} />
                  ) : (
                    <img
                      src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                      alt=""
                      width={480}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setBroken((b) => ({ ...b, [item.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-paper/92 text-burgundy shadow-lg transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-110"
                  >
                    <Icon name="play" className="ml-0.5 h-6 w-6" />
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-pill bg-ink/75 px-2.5 py-1 text-xs text-paper">
                    {item.length}
                  </span>
                </span>

                <span className="block p-5">
                  <span className="block text-[1.0625rem] leading-snug text-ink">
                    {item.title}
                  </span>
                  <span className="mt-2.5 flex items-center gap-2 text-sm text-ash">
                    <span className="text-lavender-ink">{item.channel}</span>
                    <span aria-hidden>·</span>
                    {item.views}
                  </span>
                </span>
                <span className="sr-only">Watch on YouTube, opens in a new tab</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="reveal mt-8 text-sm text-ash">{watch.note}</p>
      </div>

    </RevealSection>
  );
}

/**
 * What a card shows when YouTube's thumbnail cannot be fetched.
 *
 * A bare gradient reads as a failure — six grey boxes look like a broken
 * page, not a design. This borrows the concentric rings the site already
 * uses for end grain on the gavel's sound block and on the ground-report
 * plates, so a card with no thumbnail still looks like it belongs here, and
 * names the channel it is crediting instead of showing nothing.
 */
function ThumbPlate({ channel }: { channel: string }) {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 480 270"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="lkw-plate" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#e3d6e7" />
            <stop offset="58%" stopColor="#c9b6de" />
            <stop offset="100%" stopColor="#8e5f86" />
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#lkw-plate)" />
        {[188, 142, 96, 50].map((r, i) => (
          <circle
            key={r}
            cx="150"
            cy="135"
            r={r}
            fill="none"
            stroke="#7a1e3c"
            strokeWidth="1.5"
            opacity={0.1 + i * 0.045}
          />
        ))}
      </svg>
      {/* Bottom-left, clear of the centred play button and the duration
          chip in the opposite corner. */}
      <span className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.12em] text-burgundy-deep/75">
        {channel}
      </span>
    </span>
  );
}
