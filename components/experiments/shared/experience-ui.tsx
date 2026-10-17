'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SceneVisibilityContext = createContext(false);

export function SceneVisibilityRegion({ className, children }: { className: string; children: ReactNode }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setNearViewport(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      setNearViewport(entry.isIntersecting);
    }, { rootMargin: '180px 0px', threshold: 0.01 });
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  return (
    <SceneVisibilityContext.Provider value={nearViewport}>
      <div ref={regionRef} className={className}>{children}</div>
    </SceneVisibilityContext.Provider>
  );
}

export function ExperimentCanvas(props: ComponentProps<typeof Canvas>) {
  const nearViewport = useContext(SceneVisibilityContext);
  return nearViewport ? <Canvas {...props} /> : null;
}

export function useSectionEntrance<T extends HTMLElement>() {
  const sectionRef = useRef<T>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(section,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.46,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 90%', once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return sectionRef;
}

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
      } catch {
        setSupported(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return supported;
}

export function useExperimentSound() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    const context = contextRef.current;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  function playSound(success = false) {
    if (!soundEnabled || !window.AudioContext) return;
    try {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      if (context.state === 'suspended') void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const startAt = context.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(success ? 680 : 440, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(success ? 880 : 520, startAt + 0.1);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.018, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.17);
    } catch {
      // The visual experiment remains usable when browser audio is unavailable.
    }
  }

  return { soundEnabled, setSoundEnabled, playSound };
}

export function ExperimentWorkspace({
  category,
  stageTitle,
  status,
  statusText,
  caption,
  controls,
  onReset,
  soundEnabled,
  onSoundToggle,
  children,
}: {
  category: string;
  stageTitle: string;
  status: string;
  statusText: string;
  caption: string;
  controls: React.ReactNode;
  onReset: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  children: React.ReactNode;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const controlsPanel = controlsRef.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      [scene, controlsPanel].forEach((element) => {
        if (!element) return;
        gsap.fromTo(element,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.46,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          },
        );
      });
    });

    return () => context.revert();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.72fr)]">
        <section id="experiment-stage" ref={sceneRef} className="min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm" aria-label={stageTitle}>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold text-science-800">مختبر {category}</p>
              <h2 className="mt-1 text-lg font-bold text-neutral-950">{stageTitle}</h2>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800" role="status" aria-live="polite">{status}</span>
          </header>
          <SceneVisibilityRegion className="h-[clamp(18rem,62vw,28rem)] min-h-72 max-h-[28rem] w-full overflow-hidden bg-[#f5f8f8]">
            {children}
          </SceneVisibilityRegion>
          <p className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-center text-xs leading-6 text-neutral-600 sm:px-6">{caption}</p>
        </section>

        <aside className="space-y-4">
          <section ref={controlsRef} className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6" aria-label="حالة التجربة وأدوات التحكم">
            <h2 className="text-lg font-bold text-neutral-950">حالة التجربة</h2>
            <p className="mt-3 min-h-20 text-sm leading-7 text-neutral-700" aria-live="polite">{statusText}</p>
            <div className="mt-4 grid gap-2">{controls}</div>
            <div className="mt-3 grid gap-2">
              <button type="button" onClick={onReset} className="btn-secondary min-h-11 w-full justify-center px-4 py-2.5 text-sm">إعادة التجربة</button>
              <button type="button" onClick={onSoundToggle} aria-pressed={soundEnabled} className="btn-secondary min-h-11 w-full justify-center gap-2 px-4 py-2.5 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 010 6m3-9a9 9 0 010 12" /></svg>
                {soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] leading-5 text-neutral-500">الصوت اختياري ويعمل عند التفاعل فقط.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function LearningPanel({
  title,
  introduction,
  items,
  note = 'هذا النموذج تمثيل تعليمي مبسط، وليس محاكاة علمية دقيقة.',
}: {
  title: string;
  introduction: string;
  items: Array<{ title: string; text: string }>;
  note?: string;
}) {
  const sectionRef = useSectionEntrance<HTMLElement>();

  return (
    <section ref={sectionRef} className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7" aria-labelledby="learning-title">
      <header className="mb-5 max-w-3xl">
        <p className="text-xs font-semibold text-brand-700">نتعلّم بالملاحظة</p>
        <h2 id="learning-title" className="mt-1 text-xl font-bold text-neutral-950 sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-neutral-600">{introduction}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.title} className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
            <span className="font-mono text-[11px] font-bold text-science-800" aria-hidden="true">0{index + 1}</span>
            <h3 className="mt-2 font-bold text-neutral-900">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{item.text}</p>
          </article>
        ))}
      </div>
      <p className="mt-5 rounded-xl border border-accent-100 bg-accent-50/70 px-4 py-3 text-xs leading-6 text-neutral-700">{note}</p>
    </section>
  );
}

export function SceneLoading({ label }: { label: string }) {
  return <div className="flex h-full min-h-72 items-center justify-center px-5 text-center text-sm text-neutral-600" role="status" aria-live="polite">جاري تجهيز التجربة: {label}</div>;
}

export function SceneUnavailable({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-72 items-center justify-center p-5" role="img" aria-label={`تمثيل تعليمي مبسط: ${label}`}>
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {label.split('،').map((item) => <div key={item} className="flex min-h-20 items-center justify-center rounded-2xl border border-brand-100 bg-white px-3 text-sm font-semibold text-brand-800">{item}</div>)}
      </div>
    </div>
  );
}
