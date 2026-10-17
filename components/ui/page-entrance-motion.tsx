'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function PageEntranceMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const headings = gsap.utils.toArray<HTMLElement>('[data-page-heading]');
      headings.forEach((heading, index) => {
        gsap.fromTo(heading,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.46,
            ease: 'power2.out',
            scrollTrigger: index === 0 ? undefined : {
              trigger: heading,
              start: 'top 90%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-page-card]').forEach((card, index) => {
        gsap.fromTo(card,
          { autoAlpha: 0, y: 18, scale: 0.988 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            delay: (index % 3) * 0.055,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-page-reveal]').forEach((section) => {
        gsap.fromTo(section,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef} className="page-entrance-motion">{children}</div>;
}
