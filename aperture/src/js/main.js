import '@fontsource-variable/bodoni-moda/standard.css';
import '@fontsource-variable/archivo/index.css';
import '../css/style.css';

import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initHero } from './hero-gl.js';
import { initHoverLens } from './hover-gl.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DISPLACEMENT = 'images/displacement.png';
const HERO_PLATES = ['images/hero-02.jpg', 'images/hero-01.jpg', 'images/hero-03.jpg'];

/* ── Enquiry form ─────────────────────────────────────────────────────── */

const wireForm = () => {
  const form = document.querySelector('[data-enquiry]');
  const note = document.querySelector('[data-form-note]');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const missing = ['name', 'email', 'brief'].filter((k) => !String(data.get(k) || '').trim());

    if (missing.length) {
      note.textContent = 'Add your name, email, and what we are photographing.';
      form.querySelector(`[name="${missing[0]}"]`)?.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email')))) {
      note.textContent = 'That email address looks incomplete.';
      form.querySelector('[name="email"]')?.focus();
      return;
    }

    // No backend here — wire this to the studio's inbox or form service.
    note.textContent = 'Thank you. We will reply within two working days.';
    form.reset();
  });
};

/* ── Reduced motion: show everything, skip the choreography ───────────── */

if (reduced) {
  root.classList.remove('has-motion');
  document.querySelector('[data-hero-canvas]')?.remove();
  wireForm();
} else {
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    });
  });

  /* Hero — ambient plate sequence behind the headline */
  const canvas = document.querySelector('[data-hero-canvas]');
  let hero = null;
  if (canvas) {
    hero = initHero({
      canvas,
      plates: HERO_PLATES,
      displacement: DISPLACEMENT,
      onReady: () => canvas.classList.add('is-live'),
    });
    if (!hero) canvas.remove();
  }

  /* Hover lens over the gallery plates */
  const lens = initHoverLens({ displacement: DISPLACEMENT });
  if (lens) {
    document.querySelectorAll('.plate [data-frame]').forEach((f) => lens.attach(f));
  }

  /* Opening sequence */
  const intro = gsap.timeline({ delay: 0.2 });
  intro
    // y is pinned to 0 on both ends: GSAP reads the CSS translateY(%) start state
    // as a pixel offset, which would otherwise survive the yPercent tween.
    .fromTo('.hero-title .line > span',
      { yPercent: 102, y: 0 },
      { yPercent: 0, y: 0, duration: 1.35, stagger: 0.11, ease: 'power4.out' })
    .fromTo('.hero-sub', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.85')
    .fromTo('.hero-foot', { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' }, '-=0.95');

  /* Hero parallax — the copy drifts up and out, the plate follows the scroll */
  gsap.to('.hero-copy', {
    yPercent: -22,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => hero?.setScroll(self.progress),
    onLeave: () => hero?.pause(),
    onEnterBack: () => hero?.resume(),
  });

  /* Image-mask reveals, with the plate settling out of an oversize crop */
  document.querySelectorAll('[data-frame]').forEach((frame) => {
    const img = frame.querySelector('img');

    gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 86%' } })
      .fromTo(frame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'power3.inOut' })
      .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.7, ease: 'power3.out' }, 0);

    gsap.fromTo(img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      });
  });

  /* Quiet text reveals */
  const rise = (targets, opts = {}) => {
    document.querySelectorAll(targets).forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: opts.y ?? 22 },
        {
          opacity: 1,
          y: 0,
          duration: opts.duration ?? 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%' },
        });
    });
  };

  rise('.section-head > *', { y: 18 });
  rise('.plate figcaption', { y: 14, duration: 0.9 });
  rise('.service-body');
  rise('.studio-body > *', { y: 20 });
  rise('[data-quote]', { y: 26, duration: 1.3 });

  gsap.fromTo('.statement p',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.statement', start: 'top 78%' },
    });

  /* The masthead flips to light while it sits over the dark band */
  ScrollTrigger.create({
    trigger: '.voices',
    start: 'top top',
    end: 'bottom top',
    onToggle: (self) => {
      document.querySelector('[data-masthead]')?.classList.toggle('is-inverted', self.isActive);
    },
  });

  wireForm();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
