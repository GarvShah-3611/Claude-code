import { about } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCounter } from "@/components/ui/StatCounter";
import { NewsroomPlate } from "@/components/ui/NewsroomPlate";

/**
 * Origin story plus the three numbers that make it credible.
 *
 * The narrative is set at a readable measure beside the image rather than
 * running the full width — this is the one place on the page anyone reads
 * more than two sentences.
 */
export function About() {
  return (
    <RevealSection id="about" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading label={about.eyebrow}>{about.heading}</SectionHeading>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div className="reveal">
            <NewsroomPlate alt={about.imageAlt} />
          </div>

          <div>
            {about.body.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="reveal mb-5 max-w-[62ch] text-ash last:mb-0"
              >
                {para}
              </p>
            ))}

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-hairline pt-10">
              {about.stats.map((stat) => (
                <div key={stat.label}>
                  {/* dt/dd so the number and its label are associated, not
                      just visually adjacent. */}
                  <dd>
                    <StatCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                    />
                  </dd>
                  <dt className="sr-only">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
