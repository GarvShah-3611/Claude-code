"use client";

import { useEffect, useRef } from "react";
import { ground } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoryPlate } from "@/components/ui/NewsroomPlate";
import { Icon } from "@/components/ui/Icon";
import {
  gsap,
  registerGsap,
  motionDisabled,
  revealChildren,
  ScrollTrigger,
} from "@/lib/motion";

const VARIANTS = ["placards", "campus", "colonnade", "hands"] as const;

/**
 * Horizontally scrolling rail of ground reports.
 *
 * On desktop the section pins and the rail translates with the scrollbar —
 * the one pinned section on the page, since pinning more than one starts
 * fighting native scroll. Everywhere else it degrades to a normal
 * swipeable overflow rail, which is what touch users expect anyway, and
 * which is also what reduced-motion users get.
 */
export function GroundReports() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const track = rail.current;
    if (!sec || !track) return;
    registerGsap();
    revealChildren(sec, { selector: ".reveal" });

    if (motionDisabled()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - track.clientWidth;
      if (distance() <= 0) return;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          // Pin for exactly as far as the rail has to travel, so the
          // section releases the moment the last card lands.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { x: 0 });
      };
    });

    // Images and fonts settle after mount; re-measure so the pin distance
    // matches the real rail width.
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      id="ground"
      style={{ scrollMarginTop: "5.5rem" }}
      className="overflow-hidden py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading label={ground.eyebrow} blurb={ground.blurb}>
          {ground.heading}
        </SectionHeading>
      </div>

      <div className="mt-14 hide-scrollbar overflow-x-auto lg:overflow-visible">
        <div
          ref={rail}
          className="flex w-max gap-5 px-5 md:gap-6 md:px-10 xl:px-14"
        >
          {ground.items.map((item, i) => (
            <article
              key={item.id}
              className="reveal group w-[78vw] max-w-[26rem] shrink-0 sm:w-[22rem] lg:w-[26rem]"
            >
              <a href={item.href} className="block" data-cursor="grow">
                <div className="overflow-hidden rounded-card">
                  <div className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]">
                    <StoryPlate variant={VARIANTS[i % VARIANTS.length]} alt={item.imageAlt} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 text-sm">
                  <span className="rounded-pill border border-hairline-hi px-3 py-1 text-lavender-ink">
                    {item.kicker}
                  </span>
                  <span className="text-ash">{item.dateline}</span>
                </div>

                <h3 className="mt-4 text-[1.5rem] text-ink">
                  {item.title}
                </h3>
                {/* The dek is the one place the serif appears in this
                    section — it marks the story's own voice. */}
                <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-ash">
                  {item.dek}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4 text-sm">
                  <span className="text-lavender-ink">{item.metric}</span>
                  <span className="flex items-center gap-2 text-ash transition-colors group-hover:text-ink">
                    {item.readingTime}
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
