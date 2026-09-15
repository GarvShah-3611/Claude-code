"use client";

import { useState } from "react";
import { brief } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { isEmail } from "@/lib/validate";

/**
 * The primary conversion moment: the Weekly Brief signup.
 *
 * Validated client-side only — there is no backend, so a submission is
 * logged and the success state shown. Wire `onSubmit` to a real endpoint
 * before launch; see README.
 */
export function Brief() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter an email we can send the brief to.");
      return;
    }
    setError(null);
    // Replace with a real subscribe call.
    console.info("[Weekly Brief] subscribe:", email);
    setDone(true);
  };

  return (
    <RevealSection id="brief" className="py-24 md:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-card border border-burgundy/20 px-6 py-16 md:px-16 md:py-24">
          {/* The one full-bleed accent moment on the page. Kept to a wash
              rather than a flat fill so the text stays at full contrast. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_130%_at_12%_0%,rgba(195,176,223,0.55),rgba(122,30,60,0.10)_48%,transparent_78%)]"
          />
          <span
            aria-hidden
            className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-lavender/55 blur-[110px]"
          />

          <div className="relative max-w-2xl">
            <p className="reveal flex items-center gap-3 text-sm text-burgundy">
              <span aria-hidden className="h-px w-8 bg-burgundy" />
              {brief.eyebrow}
            </p>

            <h2 className="reveal mt-5 text-display text-ink">
              {brief.heading}
            </h2>
            <p className="reveal mt-6 max-w-lg text-lead text-ash">
              {brief.body}
            </p>

            {done ? (
              <div className="reveal mt-10 flex items-start gap-4 rounded-card border border-burgundy/40 bg-paper/50 p-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-burgundy on-burgundy">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-ink">{brief.success.heading}</p>
                  <p className="mt-1.5 text-[0.9375rem] text-ash">
                    {brief.success.body}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="reveal mt-10">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="brief-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="brief-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={brief.placeholder}
                      aria-invalid={!!error}
                      aria-describedby={error ? "brief-error" : undefined}
                      className={`h-[3.25rem] w-full rounded-pill border bg-paper/60 px-6 text-ink placeholder:text-ash-dim ${
                        error ? "border-signal" : "border-hairline-hi"
                      }`}
                    />
                  </div>
                  <MagneticButton type="submit" className="h-[3.25rem] shrink-0" strength={0.18}>
                    {brief.cta}
                  </MagneticButton>
                </div>

                {/* Error sits next to the field it belongs to, not in a
                    summary at the top of the form. */}
                {error && (
                  <p id="brief-error" role="alert" className="mt-3 pl-6 text-sm text-signal">
                    {error}
                  </p>
                )}
                <p className="mt-4 pl-6 text-sm text-ash">{brief.consent}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
