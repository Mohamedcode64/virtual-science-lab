'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<{ x: (value: number) => unknown; y: (value: number) => unknown } | null>(null);

  useEffect(() => {
    const section = heroRef.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !section) return;

    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance.fromTo('.hero-grid', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.38 });
      entrance.fromTo('[data-hero-flask]', { autoAlpha: 0, y: 26, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.68 }, '-=0.08');
      entrance.fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.36 }, '-=0.2');
      entrance.fromTo('[data-hero-title]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48 }, '-=0.1');
      entrance.fromTo('[data-hero-subtitle]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38 }, '-=0.14');
      entrance.fromTo('[data-hero-description]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.12');
      entrance.fromTo('[data-hero-cta]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, '-=0.06');
      entrance.fromTo('[data-hero-particle]', { autoAlpha: 0 }, { autoAlpha: 0.88, duration: 0.28, stagger: 0.07 }, '-=0.02');

      const plate = section.querySelector<HTMLElement>('.hero-visual__plate');
      if (plate) {
        gsap.set(plate, { transformPerspective: 900, transformOrigin: 'center center' });
        parallaxRef.current = {
          x: gsap.quickTo(plate, 'rotationX', { duration: 0.48, ease: 'power2.out' }),
          y: gsap.quickTo(plate, 'rotationY', { duration: 0.48, ease: 'power2.out' }),
        };
      }
    }, heroRef);

    return () => {
      parallaxRef.current = null;
      context.revert();
    };
  }, []);

  function moveScienceCard(event: ReactPointerEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || event.pointerType === 'touch' || !parallaxRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
    const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
    const plate = event.currentTarget.querySelector<HTMLElement>('.hero-visual__plate');
    plate?.style.setProperty('--hero-light-x', `${(x + 0.5) * 100}%`);
    plate?.style.setProperty('--hero-light-y', `${(y + 0.5) * 100}%`);
    parallaxRef.current.x(-y * 3.2);
    parallaxRef.current.y(x * 3.8);
  }

  function resetScienceCard() {
    parallaxRef.current?.x(0);
    parallaxRef.current?.y(0);
    const plate = heroRef.current?.querySelector<HTMLElement>('.hero-visual__plate');
    plate?.style.setProperty('--hero-light-x', '50%');
    plate?.style.setProperty('--hero-light-y', '50%');
  }

  return (
    <section ref={heroRef} className="hero-section relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36" dir="rtl" lang="ar" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container relative z-[1] grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <div data-hero-eyebrow className="mb-6 inline-flex items-center gap-2 rounded-full border border-science-200 bg-white/80 px-4 py-2 text-sm font-semibold text-science-800">
            <span className="h-2 w-2 rounded-full bg-science-600" aria-hidden="true" />
            جامعة الوادي الجديد <span className="text-neutral-300" aria-hidden="true">/</span> كلية التربية
          </div>
          <h1 id="hero-title" data-hero-title className="mb-5 max-w-xl text-4xl font-bold leading-[1.2] tracking-tight text-neutral-950 sm:text-5xl lg:text-[3.7rem]">
            العلوم تُفهم حين <span className="text-brand-700">نجرّبها</span>
          </h1>
          <p data-hero-subtitle className="mb-4 max-w-xl text-lg leading-8 text-neutral-700 sm:text-xl">
            معمل العلوم الافتراضي
          </p>
          <p data-hero-description className="mb-8 max-w-xl text-base leading-8 text-neutral-600">
            مساحة تعليمية لطلاب الصفوف الرابع والخامس والسادس، تحوّل المفاهيم العلمية إلى ملاحظة وتجربة تفاعلية.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link data-hero-cta href="/experiments" className="hero-cta hero-cta--primary btn-primary min-h-12 px-6">
              ابدأ التجربة
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0-5 5m5-5H6" /></svg>
            </Link>
            <Link data-hero-cta href="/grades" className="hero-cta hero-cta--secondary btn-secondary min-h-12 px-6">
              استكشف الصفوف الدراسية
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0-5 5m5-5H6" /></svg>
            </Link>
          </div>
          <p className="mt-5 text-xs leading-6 text-neutral-500">
            تسع تجارب تفاعلية لطلاب الصفوف الرابع والخامس والسادس.
          </p>
        </div>

        <div data-hero-flask className="hero-visual relative mx-auto w-full max-w-[510px]" onPointerMove={moveScienceCard} onPointerLeave={resetScienceCard} onPointerUp={resetScienceCard} role="img" aria-label="رسم علمي تفاعلي لكأس مخبري يحتوي على سائل وفقاعات صغيرة ومقياس تجريبي">
          <div className="hero-visual__plate">
            <span data-hero-particle className="hero-particle hero-particle--one" aria-hidden="true" />
            <span data-hero-particle className="hero-particle hero-particle--two" aria-hidden="true" />
            <span data-hero-particle className="hero-particle hero-particle--three" aria-hidden="true" />
            <span data-hero-particle className="hero-particle hero-particle--four" aria-hidden="true" />
            <span data-hero-particle className="hero-particle hero-particle--five" aria-hidden="true" />
            <div className="hero-visual__axis hero-visual__axis--vertical" aria-hidden="true" />
            <div className="hero-visual__axis hero-visual__axis--horizontal" aria-hidden="true" />
            <div className="hero-label hero-label--left"><span>كيمياء</span><strong>01</strong></div>
            <div className="hero-label hero-label--right"><span>المقياس</span><strong>pH</strong></div>
            <svg className="hero-flask" viewBox="0 0 380 340" fill="none" aria-hidden="true">
              <defs>
                <clipPath id="hero-flask-clip">
                  <path d="M151 46h78v95l59 115c8 16-3 35-21 35H113c-18 0-29-19-21-35l59-115V46Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#hero-flask-clip)">
                <path className="hero-liquid" d="M72 207c37-13 60 11 98 1s54-15 91-1 56 7 83-2v103H72V207Z" />
                <path className="hero-liquid-line" d="M82 208c34-12 61 11 92 1s61-14 96 0 52 7 71-1" />
                <circle className="hero-bubble hero-bubble--one" cx="170" cy="242" r="5" />
                <circle className="hero-bubble hero-bubble--two" cx="214" cy="264" r="3.5" />
                <circle className="hero-bubble hero-bubble--three" cx="193" cy="226" r="3" />
              </g>
              <path d="M151 46h78v95l59 115c8 16-3 35-21 35H113c-18 0-29-19-21-35l59-115V46Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
              <path d="M142 46h96M151 141h78" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M125 240h34m-42 16h45m58-16h33m-28 16h37" stroke="currentColor" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
              <circle cx="72" cy="123" r="4" fill="currentColor" />
              <circle cx="306" cy="100" r="3" fill="currentColor" />
              <circle cx="300" cy="235" r="4" fill="currentColor" />
              <path d="M72 123h46M306 100h-42M300 235h-23" stroke="currentColor" strokeOpacity=".32" strokeDasharray="3 6" strokeWidth="1.5" />
            </svg>
            <div className="hero-visual__readout"><span>درجة التعادل</span><strong>7.00</strong><i aria-hidden="true" /></div>
            <div className="hero-visual__caption"><span>ملاحظة</span><strong>مقارنة المحاليل</strong></div>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-500">من النماذج المرئية إلى التجربة التفاعلية</p>
        </div>
      </div>
    </section>
  );
}
