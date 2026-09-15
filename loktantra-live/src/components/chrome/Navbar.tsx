"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { nav } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Sticky glass navbar.
 *
 * Transparent over the hero and only frosts once the page has moved, so
 * the hero reads full-bleed on arrival. The mobile sheet traps nothing —
 * it is a plain disclosure that closes on Escape, on navigation, and on
 * resize past the breakpoint.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-hairline bg-ink/72 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-[4.5rem] items-center justify-between gap-6"
      >
        <a href="#main" className="shrink-0 text-[1.0625rem] text-newsprint">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-[0.9375rem] text-ash transition-colors duration-200 hover:text-newsprint"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px w-0 bg-violet transition-[width] duration-300 ease-[var(--ease-out-soft)] group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Wrapped rather than given a `hidden` class: the button sets
              its own `inline-flex`, and two display utilities in the same
              layer are resolved by stylesheet order, not class order. */}
          <span className="hidden md:block">
            <MagneticButton href={nav.cta.href} strength={0.2}>
              {nav.cta.label}
            </MagneticButton>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-hairline-hi md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-full bg-newsprint transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-newsprint transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 pb-6 pt-2">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-hairline py-4 font-display text-2xl text-newsprint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-5">
                <a
                  href={nav.cta.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-pill bg-violet px-6 py-3.5 text-center font-medium on-violet"
                >
                  {nav.cta.label}
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
