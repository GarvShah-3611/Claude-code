"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { hrefFor, type Route } from "@/lib/router";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroVisual } from "@/components/three/HeroVisual";
import { gsap, registerGsap, motionDisabled, DUR, EASE } from "@/lib/motion";

/**
 * The one orchestrated moment on the page.
 *
 * The headline runs the full width of the container and the gavel
 * nests into the negative space left by its ragged right edge, rather than
 * sitting in a column beside it — which is what lets the type stay
 * oversized instead of shrinking to share the row.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    registerGsap();

    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    const rest = el.querySelectorAll<HTMLElement>("[data-fade]");

    /* Drop the CSS start-state rule BEFORE GSAP reads these elements.
       Order matters: while the rule still applies, GSAP parses its
       translateY(100%) into the `y` cache and then stacks `yPercent` on
       top of it, so the tween runs 200% -> 100% and the line never
       arrives. Flipping first means GSAP starts from an identity
       transform and owns the whole value. */
    el.setAttribute("data-hero", "run");

    if (motionDisabled()) {
      gsap.set([...lines, ...rest], { yPercent: 0, y: 0, opacity: 1 });
      return;
    }

    gsap.set(lines, { y: 0, yPercent: 100 });
    gsap.set(rest, { y: 16, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: EASE.soft } });
    tl.to(lines, {
      yPercent: 0,
      duration: 0.85,
      stagger: 0.075,
    }).to(
      rest,
      { y: 0, opacity: 1, duration: DUR.slow, stagger: 0.08 },
      "-=0.45",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      data-hero="idle"
      /* The fixed navbar already reserves 4.5rem on <main>, so the old
          pt-32 put 200px of nothing above the badge. In a narrow embed that
          alone pushed the subline and both CTAs under the fold. */
      className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16 lg:pb-32 lg:pt-24"
    >
      {/* Light leaks. Two only, both off-centre, so the background has a
          direction of light rather than an even wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-lavender/55 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-[30rem] w-[30rem] rounded-full bg-lavender/40 blur-[120px]"
      />

      <div className="container-page relative">
        <p
          data-fade
          className="hero-fade mb-6 inline-flex items-center gap-2.5 rounded-pill border border-hairline-hi py-1.5 pl-2.5 pr-4 text-sm text-ash"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          {hero.badge}
        </p>

        <h1 className="relative z-10 text-mega font-extrabold text-ink">
          {hero.headline.map((line) => (
            /* Each line gets its own overflow-hidden mask so the rise reads
               as type emerging from a rule, not a block sliding. The mask
               only works while the line does not wrap — see --text-mega. */
            <span
              key={line}
              className="block overflow-hidden pb-[0.08em] [&:not(:last-child)]:-mb-[0.08em]"
            >
              <span data-line className="hero-line block whitespace-nowrap">
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* The gavel lives here at every width now. The travelling version
            was choreographed against one long scroll; with click-pages
            there is no journey for it to follow.

            Stacked, it is deliberately smaller than it was: the box is
            square, so every pixel of width costs a pixel of height, and at
            22rem it ate the rest of the fold on its own. */}
        <div
          data-fade
          className="hero-fade relative z-0 mx-auto -my-4 w-[58%] max-w-[15rem] sm:max-w-[17rem] lg:absolute lg:bottom-[-1rem] lg:right-[3.5rem] lg:my-0 lg:w-[40%] lg:max-w-[28rem]"
        >
          <HeroVisual />
        </div>

        <div className="relative z-10 mt-6 max-w-xl lg:mt-12">
          <p data-fade className="hero-fade text-lead text-ash">
            {hero.subline}
          </p>

          <div data-fade className="hero-fade mt-7 flex flex-wrap items-center gap-3">
            <MagneticButton href={hrefFor(hero.primaryCta.route as Route)}>
              {hero.primaryCta.label}
            </MagneticButton>
            <MagneticButton href={hrefFor(hero.secondaryCta.route as Route)} variant="ghost">
              {hero.secondaryCta.label}
            </MagneticButton>
          </div>

          <p data-fade className="hero-fade mt-5 text-sm text-ash">
            {hero.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
