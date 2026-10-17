'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function FooterSupervisor({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let context: gsap.Context | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || context) return;
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
        timeline.fromTo('[data-footer-supervisor-label]', { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: 0.28 });
        timeline.fromTo('[data-footer-supervisor-name]', { autoAlpha: 0, y: 10, scale: 0.97, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.46 }, '-=0.06');
        timeline.fromTo('[data-footer-supervisor-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: 'right center' }, '-=0.14');
      }, target);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(target);
    return () => {
      observer.disconnect();
      context?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="footer-supervisor mt-5 border-r border-accent-400/70 pr-4">
      <p data-footer-supervisor-label className="text-xs text-neutral-400">تحت إشراف</p>
      <p data-footer-supervisor-name className="mt-1 font-semibold text-white">{name}</p>
      <span data-footer-supervisor-rule className="mt-3 block h-px w-16 bg-accent-400" aria-hidden="true" />
    </div>
  );
}
