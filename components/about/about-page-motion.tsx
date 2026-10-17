'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function AboutPageMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo('[data-about-title]',
        { autoAlpha: 0, y: 14, filter: 'blur(5px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.48, ease: 'power2.out' },
      );

      gsap.utils.toArray<HTMLElement>('[data-about-reveal]').forEach((section) => {
        gsap.fromTo(section,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      const studentList = root.querySelector('[data-about-students]');
      const studentNames = root.querySelectorAll<HTMLElement>('[data-about-student]');
      if (studentList && studentNames.length > 0) {
        gsap.fromTo(studentNames,
          { autoAlpha: 0, y: 10, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            stagger: 0.055,
            ease: 'power2.out',
            scrollTrigger: { trigger: studentList, start: 'top 88%', once: true },
          },
        );
      }
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={rootRef} className="about-motion-root">{children}</div>;
}
