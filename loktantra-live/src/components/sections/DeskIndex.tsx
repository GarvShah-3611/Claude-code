"use client";

import { home } from "@/content/site";
import { hrefFor, type Route } from "@/lib/router";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The home page's index: six cards, each opening a page.
 *
 * This is what replaced the endless single-page scroll. A reader who came
 * for the ground reports gets there in one click instead of six screens of
 * someone else's section order.
 *
 * Plain anchors, not buttons: a card that opens a page should be
 * middle-clickable, copyable and keyboard-navigable like any other link.
 */
export function DeskIndex() {
  return (
    <RevealSection id="desks" className="py-20 md:py-28" stagger={0.06}>
      <div className="container-page">
        <SectionHeading label={home.eyebrow} blurb={home.blurb}>
          {home.heading}
        </SectionHeading>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {home.cards.map((card) => (
            <li key={card.route} className="reveal">
              <a
                href={hrefFor(card.route as Route)}
                data-cursor="grow"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card border border-hairline bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-burgundy/30 hover:shadow-[0_22px_48px_-24px_rgba(36,21,32,0.3)]"
              >
                {/* Lavender wash that lifts on hover — the card's own light. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-lavender/0 blur-3xl transition-colors duration-500 group-hover:bg-lavender/70"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-tile border border-hairline-hi text-burgundy transition-colors duration-300 group-hover:border-burgundy">
                    <Icon name={card.icon as IconName} className="h-5 w-5" />
                  </span>
                  <span className="rounded-pill bg-paper-raised px-3 py-1 text-xs text-ash">
                    {card.count}
                  </span>
                </div>

                <div className="relative mt-10">
                  <h3 className="text-[1.5rem] text-ink">{card.title}</h3>
                  <p className="mt-3 text-[0.9375rem] text-ash">{card.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] text-burgundy">
                    Open
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </RevealSection>
  );
}
