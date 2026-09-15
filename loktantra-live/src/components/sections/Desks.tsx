import { desks } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Bento grid of the six desks.
 *
 * Card sizes encode editorial weight rather than decorating the grid:
 * Ground Reports is the masthead desk and takes a double-height cell; the
 * rest share a row each. One card is featured, so the eye has a single
 * entry point instead of six equal ones.
 */
export function Desks() {
  return (
    <RevealSection id="desks" className="py-24 md:py-32" stagger={0.06}>
      <div className="container-page">
        <SectionHeading label={desks.eyebrow}>{desks.heading}</SectionHeading>

        <div className="mt-14 grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {desks.items.map((item) => {
            const Tag = "href" in item && item.href ? "a" : "div";
            return (
              <Tag
                key={item.id}
                {...("href" in item && item.href ? { href: item.href } : {})}
                data-cursor={"href" in item && item.href ? "grow" : undefined}
                className={`group glass relative flex flex-col justify-between overflow-hidden rounded-card p-6 transition-[transform,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-hairline-hi md:p-7 ${item.span} ${
                  item.featured ? "md:row-span-2" : ""
                }`}
              >
                {/* Inner glow, revealed on hover. Sits under the content and
                    never intercepts the pointer. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet/0 blur-3xl transition-colors duration-500 group-hover:bg-violet/25"
                />

                <span className="relative flex h-11 w-11 items-center justify-center rounded-tile border border-hairline-hi text-violet-light transition-colors duration-300 group-hover:border-violet-light">
                  <Icon name={item.icon as IconName} />
                </span>

                <div className="relative mt-8">
                  <h3
                    className={`text-newsprint ${
                      item.featured
                        ? "text-[1.75rem] md:text-[2.25rem]"
                        : "text-[1.375rem]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 text-[0.9375rem] text-ash ${
                      item.featured ? "max-w-sm" : ""
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
