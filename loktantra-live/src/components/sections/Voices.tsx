"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { voices } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { registerGsap, revealChildren } from "@/lib/motion";

/**
 * Quote carousel.
 *
 * Built as a labelled group of slides with live-region announcements and
 * real prev/next buttons, so it is operable from the keyboard and audible
 * to a screen reader. It does not auto-advance: a quote that moves on its
 * own steals reading time from the person reading it.
 */
export function Voices() {
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    registerGsap();
    revealChildren(el);
  }, []);

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + voices.items.length) % voices.items.length);
  };

  const current = voices.items[index];

  return (
    <section
      ref={section}
      id="voices"
      style={{ scrollMarginTop: "5.5rem" }}
      className="py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading label={voices.eyebrow}>{voices.heading}</SectionHeading>

        <div
          className="reveal relative mt-14"
          role="group"
          aria-roledescription="carousel"
          aria-label={voices.heading}
        >
          <div className="glass relative overflow-hidden rounded-card p-8 md:p-14">
            <Icon
              name="quote"
              className="h-9 w-9 text-violet opacity-70 md:h-11 md:w-11"
            />

            {/* aria-live so the quote is announced when it changes, and a
                fixed min-height so the card does not jump between lengths. */}
            <div className="mt-7 min-h-[11rem] md:min-h-[9rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <m.blockquote
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-serif text-[1.375rem] leading-snug text-newsprint md:text-[1.875rem]">
                    {current.quote}
                  </p>
                  <footer className="mt-7 text-[0.9375rem]">
                    <span className="text-newsprint">{current.name}</span>
                    <span className="text-ash"> — {current.role}</span>
                  </footer>
                </m.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-hairline pt-6">
              {/* Dots double as position indicator and direct navigation. */}
              <ul className="flex items-center gap-2.5">
                {voices.items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show quote ${i + 1} of ${voices.items.length}`}
                      aria-current={i === index || undefined}
                      className={`block h-2 rounded-pill transition-all duration-300 ${
                        i === index
                          ? "w-7 bg-violet"
                          : "w-2 bg-ash-dim hover:bg-ash"
                      }`}
                    />
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous quote"
                  className="flex h-11 w-11 items-center justify-center rounded-pill border border-hairline-hi text-newsprint transition-colors hover:border-violet-light hover:text-violet-light"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next quote"
                  className="flex h-11 w-11 items-center justify-center rounded-pill border border-hairline-hi text-newsprint transition-colors hover:border-violet-light hover:text-violet-light"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
