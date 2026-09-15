"use client";

import { useRef, useState } from "react";
import { work } from "@/content/site";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { validateWork, type WorkErrors, type WorkForm } from "@/lib/validate";

const EMPTY: WorkForm = { name: "", email: "", type: "story", message: "" };

/**
 * Pitch / tip / collaboration form.
 *
 * No backend: a valid submission is logged and the success state replaces
 * the form. Every field has a visible label (not a placeholder standing in
 * for one), errors appear beside the field that caused them, and the first
 * invalid field takes focus on a failed submit.
 */
export function Work() {
  const [values, setValues] = useState<WorkForm>(EMPTY);
  const [errors, setErrors] = useState<WorkErrors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof WorkForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateWork(values, work.errors);
    setErrors(found);

    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstBad}"]`)
        ?.focus();
      return;
    }

    // Replace with a real submit call.
    console.info("[Work with us] submission:", values);
    setSent(true);
  };

  const field =
    "w-full rounded-tile border bg-paper/60 px-4 py-3.5 text-ink placeholder:text-ash-dim transition-colors";
  const ok = "border-hairline-hi focus:border-burgundy";
  const bad = "border-signal";

  return (
    <RevealSection id="work" className="py-24 md:py-32">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading label={work.eyebrow} blurb={work.body}>
              {work.heading}
            </SectionHeading>
          </div>

          <div className="glass rounded-card p-6 md:p-10">
            {sent ? (
              <div className="reveal flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-burgundy on-burgundy">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[1.5rem] text-ink">
                    {work.success.heading}
                  </h3>
                  <p className="mt-2 text-ash">{work.success.body}</p>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="reveal">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="w-name" className="mb-2 block text-sm text-ash">
                      {work.fields.name.label}
                    </label>
                    <input
                      id="w-name"
                      name="name"
                      value={values.name}
                      onChange={set("name")}
                      placeholder={work.fields.name.placeholder}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "w-name-err" : undefined}
                      className={`${field} ${errors.name ? bad : ok}`}
                    />
                    {errors.name && (
                      <p id="w-name-err" role="alert" className="mt-2 text-sm text-signal">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="w-email" className="mb-2 block text-sm text-ash">
                      {work.fields.email.label}
                    </label>
                    <input
                      id="w-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      value={values.email}
                      onChange={set("email")}
                      placeholder={work.fields.email.placeholder}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "w-email-err" : undefined}
                      className={`${field} ${errors.email ? bad : ok}`}
                    />
                    {errors.email && (
                      <p id="w-email-err" role="alert" className="mt-2 text-sm text-signal">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="w-type" className="mb-2 block text-sm text-ash">
                    {work.fields.type.label}
                  </label>
                  <div className="relative">
                    <select
                      id="w-type"
                      name="type"
                      value={values.type}
                      onChange={set("type")}
                      className={`${field} ${ok} appearance-none pr-12`}
                    >
                      {work.inquiryTypes.map((t) => (
                        <option key={t.value} value={t.value} className="bg-surface">
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="arrow"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-ash"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="w-message" className="mb-2 block text-sm text-ash">
                    {work.fields.message.label}
                  </label>
                  <textarea
                    id="w-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={set("message")}
                    placeholder={work.fields.message.placeholder}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "w-message-err" : undefined}
                    className={`${field} resize-y ${errors.message ? bad : ok}`}
                  />
                  {errors.message && (
                    <p id="w-message-err" role="alert" className="mt-2 text-sm text-signal">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <MagneticButton type="submit" strength={0.18}>
                    {work.submit}
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
