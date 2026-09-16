"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { watch } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

type Item = (typeof watch.items)[number];

/**
 * Real video, from other people's channels, credited.
 *
 * Facade pattern: the card shows YouTube's own thumbnail and only swaps in
 * the iframe once someone presses play. That keeps YouTube's player and its
 * cookies off the page for anyone who never watches, and keeps the section
 * from costing half a megabyte on load.
 *
 * `youtube-nocookie.com` for the same reason. The thumbnails come straight
 * from i.ytimg.com, so they are the real frames, not stand-ins.
 */
export function Watch() {
  const [open, setOpen] = useState<Item | null>(null);
  /** Thumbnails that failed to load, so a blocked network never shows a
      broken-image icon — the card falls back to its own gradient. */
  const [broken, setBroken] = useState<Record<string, true>>({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(120%_120%_at_25%_0%,rgba(195,176,223,0.75),rgba(122,30,60,0.18))]"
                    />
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

      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <m.div
              className="w-full max-w-4xl"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-card bg-ink shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0`}
                    title={open.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-6">
                <p className="text-paper">
                  <span className="block">{open.title}</span>
                  <span className="mt-1 block text-sm text-lavender">
                    {open.channel} · {open.views}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="shrink-0 rounded-pill border border-paper/30 px-4 py-2 text-sm text-paper transition-colors hover:border-paper"
                  autoFocus
                >
                  Close
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </RevealSection>
  );
}
