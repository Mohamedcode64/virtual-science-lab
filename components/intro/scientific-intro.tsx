'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { projectMetadata } from '@/data/project-metadata';

const introParticles = [
  [11, 19], [22, 33], [82, 18], [91, 43], [16, 76], [31, 86], [77, 78], [88, 68], [54, 15], [62, 89],
] as const;

interface ScientificIntroProps {
  onComplete: () => void;
}

export function ScientificIntro({ onComplete }: ScientificIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const { universityAr, facultyAr, projectTitleAr, supervisorAr, students, developerAr } = projectMetadata;
  const finishIntro = useCallback(() => {
    setIsVisible(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!isVisible || !root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      const content = '[data-intro-university], [data-intro-faculty], [data-intro-welcome], [data-intro-title], [data-intro-caption], [data-intro-cohort], [data-intro-supervisor], [data-intro-students], [data-intro-developer]';

      if (reducedMotion) {
        gsap.set(content, { autoAlpha: 1, filter: 'blur(0px)' });
        gsap.to(root, { autoAlpha: 0, duration: 0.2, delay: 0.18, onComplete: finishIntro });
        return;
      }

      gsap.to('[data-intro-particle]', {
        y: (index) => index % 2 === 0 ? -10 : 10,
        autoAlpha: (index) => index % 2 === 0 ? 0.5 : 0.82,
        duration: (index) => 1.35 + (index % 3) * 0.22,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.1,
      });

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finishIntro,
      });
      timeline
        .fromTo('[data-intro-university]', { autoAlpha: 0, y: 14, scale: 0.94, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.34 })
        .fromTo('[data-intro-faculty]', { autoAlpha: 0, y: 12, scale: 0.95, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.3 }, '-=0.04')
        .fromTo('[data-intro-welcome]', { autoAlpha: 0, y: 10, filter: 'blur(5px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.24 }, '+=0.06')
        .fromTo('[data-intro-title]', { autoAlpha: 0, y: 18, scale: 0.96, filter: 'blur(7px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.38 }, '-=0.03')
        .fromTo('[data-intro-caption], [data-intro-cohort]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.06 }, '-=0.08')
        .fromTo('[data-intro-supervisor]', { autoAlpha: 0, y: 19, scale: 0.9, filter: 'blur(9px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.48, ease: 'back.out(1.35)' }, '+=0.04')
        .to('[data-intro-supervisor-name]', { scale: 1.035, textShadow: '0 0 22px rgba(110, 220, 214, 0.28)', duration: 0.24, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.05')
        .fromTo('[data-intro-students], [data-intro-developer]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.045, ease: 'power2.out' }, '-=0.05')
        .fromTo('[data-intro-rule]', { scaleX: 0.12, autoAlpha: 0.35, transformOrigin: 'right center' }, { scaleX: 1, autoAlpha: 1, duration: 0.34, ease: 'power2.out' }, '-=0.1')
        .to(root, { autoAlpha: 0, duration: 0.3, delay: 0.1, ease: 'power2.in' });
    }, root);

    return () => context.revert();
  }, [finishIntro, isVisible]);

  if (!isVisible) return null;

  return (
    <div ref={rootRef} className="scientific-intro" data-intro-root role="status" aria-live="polite" aria-label={`${projectTitleAr}، ${universityAr}، ${facultyAr}`}>
      <div className="scientific-intro__grid" aria-hidden="true" />
      <svg className="scientific-intro__network" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <path d="M100 105 210 198 320 110M740 115 850 205 930 128M120 450 245 390 340 500M685 485 790 400 900 470" />
        {introParticles.map(([x, y], index) => (
          <circle key={index} data-intro-particle cx={x * 10} cy={y * 6} r={index % 3 === 0 ? 3 : 2} />
        ))}
      </svg>

      <div className="scientific-intro__content" dir="rtl" lang="ar">
        <div className="scientific-intro__logo-stage">
          <span className="scientific-intro__orbit" aria-hidden="true" />
          <div className="scientific-intro__identity scientific-intro__identity--university" data-intro-university>
            <Image src="/logos/logo1.jpeg" alt="شعار جامعة الوادي الجديد" width={64} height={64} priority unoptimized />
            <div><span>جامعة</span><strong>{universityAr.replace('جامعة ', '')}</strong></div>
          </div>
          <span className="scientific-intro__connector" aria-hidden="true" />
          <div className="scientific-intro__identity scientific-intro__identity--faculty" data-intro-faculty>
            <Image src="/logos/logo2.jpeg" alt="شعار كلية التربية" width={64} height={64} priority unoptimized />
            <div><span>كلية</span><strong>{facultyAr.replace('كلية ', '')}</strong></div>
          </div>
        </div>
        <p className="scientific-intro__welcome" data-intro-welcome>أهلاً بكم في معمل العلوم الافتراضي</p>
        <h1 className="scientific-intro__title" data-intro-title>{projectTitleAr}</h1>
        <p className="scientific-intro__caption" data-intro-caption>معمل افتراضي لمادة العلوم للصف الرابع والخامس والسادس الابتدائي</p>
        <p className="scientific-intro__cohort" data-intro-cohort>إعداد طلاب الفرقة الرابعة تربية أساسي علوم</p>
        <div className="scientific-intro__supervisor" data-intro-supervisor>
          <span>تحت إشراف</span>
          <strong data-intro-supervisor-name>{supervisorAr}</strong>
        </div>
        <div className="scientific-intro__credits" data-intro-students>
          <span className="scientific-intro__credits-label">إعداد الطلاب</span>
          <ul aria-label="أسماء الطلاب">
            {students.map((student) => <li key={student.id}>{student.nameAr}</li>)}
          </ul>
        </div>
        <p className="scientific-intro__developer" data-intro-developer>تطوير: {developerAr}</p>
        <div className="scientific-intro__rule" data-intro-rule aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
