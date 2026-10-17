'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { projectMetadata } from '@/data/project-metadata';

function CreditIcon({ type }: { type: 'graduation' | 'users' | 'code' | 'external' }) {
  const paths = {
    graduation: 'm2 10 10-5 10 5-10 5-10-5Zm4 2.2v5c3.8 2.5 8.2 2.5 12 0v-5M22 10v6',
    users: 'M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m6-10a4 4 0 110-8 4 4 0 010 8Zm12 10v-2a4 4 0 00-3-3.87m-1-12a4 4 0 010 7.75',
    code: 'm8 17-5-5 5-5m8 10 5-5-5-5m-3-7-2 14',
    external: 'M14 3h7v7m0-7L10 14m11-3v7a1 1 0 01-1 1h-7',
  };
  return <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]} /></svg>;
}

export function AcademicCredits() {
  const sectionRef = useRef<HTMLElement>(null);
  const { supervisorAr, students, universityAr, facultyAr, developer } = projectMetadata;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animationContext: gsap.Context | undefined;
    let orbitTween: gsap.core.Tween | undefined;
    let counterTween: gsap.core.Tween | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animationContext) return;
      const mobile = window.matchMedia('(max-width: 640px)').matches;
      animationContext = gsap.context(() => {
        const timeline = gsap.timeline();
        timeline.fromTo('[data-credit-heading]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' });
        timeline.fromTo('[data-credit-student-heading]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.08');
        timeline.fromTo('[data-credit-supervisor]', { autoAlpha: 0, y: 12, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' }, '-=0.04');
        timeline.fromTo('[data-credit-student]', { autoAlpha: 0, y: 10, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, '-=0.02');
        timeline.fromTo('[data-credit-developer]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.08');

        timeline.call(() => {
          const orbit = section.querySelector<HTMLElement>('[data-credit-orbit]');
          const names = section.querySelectorAll<HTMLElement>('[data-credit-counter]');
          if (!orbit) return;
          const duration = mobile ? 132 : 88;
          const orbitItems = orbit.querySelectorAll<HTMLElement>('.credit-orbit-student');
          const updateDepth = () => {
            const rotation = (Number(gsap.getProperty(orbit, 'rotation')) * Math.PI) / 180;
            orbitItems.forEach((item, index) => {
              const angle = (index / orbitItems.length) * Math.PI * 2 - Math.PI / 2 + rotation;
              const depth = (Math.sin(angle) + 1) / 2;
              item.style.scale = (0.94 + depth * 0.06).toFixed(3);
              item.style.opacity = (0.84 + depth * 0.16).toFixed(3);
              item.style.zIndex = String(1 + Math.round(depth * 3));
            });
          };
          orbitTween = gsap.to(orbit, { rotation: 360, duration, repeat: -1, ease: 'none', transformOrigin: '50% 50%', onUpdate: updateDepth });
          counterTween = gsap.to(names, { rotation: -360, duration, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        });
      }, section);
      observer.disconnect();
    }, { threshold: 0.14 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      orbitTween?.kill();
      counterTween?.kill();
      animationContext?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="credits-title" className="section academic-credits border-t border-neutral-200 bg-white" dir="rtl" lang="ar" aria-labelledby="credits-heading">
      <div className="container">
        <header data-credit-heading className="section-header">
          <span className="section-eyebrow">الإشراف والمشاركة</span>
          <h2 id="credits-heading" className="section-title">فريق المشروع</h2>
          <p className="section-subtitle">مشروع تخرج من {facultyAr} — {universityAr}</p>
        </header>

        <div className="mx-auto max-w-4xl">
          <div className="academic-credits__team">
            <div data-credit-student-heading className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-science-50 text-science-800"><CreditIcon type="users" /></span>
              <div>
                <h3 className="font-bold text-neutral-900">إعداد طلاب الفرقة الرابعة</h3>
                <p className="mt-1 text-sm text-neutral-600">تربية أساسي علوم</p>
              </div>
            </div>

            <article data-credit-supervisor className="credit-supervisor-card">
              <span className="credit-supervisor-card__icon"><CreditIcon type="graduation" /></span>
              <div className="credit-supervisor-card__copy">
                <span>تحت إشراف</span>
                <strong>{supervisorAr}</strong>
              </div>
            </article>

            <div className="credit-orbit-stage" aria-label="أسماء فريق المشروع في مدار علمي">
              <div className="credit-orbit-ring credit-orbit-ring--outer" aria-hidden="true" />
              <div className="credit-orbit-ring credit-orbit-ring--inner" aria-hidden="true" />
              <div className="credit-orbit-center"><span>المشرفة</span><strong>{supervisorAr}</strong></div>
              <ul data-credit-orbit className="credit-orbit-track" aria-label="أسماء الطلاب المشاركين">
                {students.map((student, index) => {
                  const angle = (index / students.length) * Math.PI * 2 - Math.PI / 2;
                  const left = 50 + Math.cos(angle) * 35;
                  const top = 50 + Math.sin(angle) * 42.5;
                  return (
                    <li key={student.id} data-credit-student className="credit-orbit-student" style={{ left: `${left}%`, top: `${top}%` }}>
                      <span data-credit-counter className="credit-orbit-student__name"><span>{String(index + 1).padStart(2, '0')}</span>{student.nameAr}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div data-credit-developer className="mt-5 flex items-center gap-3 border-t border-neutral-200 pt-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700"><CreditIcon type="code" /></span>
              <div>
                <p className="text-xs text-neutral-500">التصميم والتطوير</p>
                <p className="text-sm font-semibold text-neutral-800" dir="ltr">{developer}</p>
                <a
                  className="portfolio-credit-link mt-2"
                  href="https://mohamed-ahmed-eight.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  aria-label="Portfolio — opens in a new tab"
                >
                  <span>Portfolio</span>
                  <CreditIcon type="external" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
