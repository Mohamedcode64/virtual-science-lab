'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneVisibilityRegion } from '@/components/experiments/shared/experience-ui';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ElectricCircuitScene } from './electric-circuit-scene';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function CircuitFallback({ closed }: { closed: boolean }) {
  return (
    <div className="flex h-full min-h-72 items-center justify-center bg-[#f5f8f8] p-3 sm:p-6" role="img" aria-label={`رسم مبسط لدائرة كهربائية، المفتاح ${closed ? 'مغلق' : 'مفتوح'} والمصباح ${closed ? 'مضيء' : 'منطفئ'}`}>
      <svg className="h-auto max-h-full w-full max-w-3xl" viewBox="0 0 720 300" aria-hidden="true">
        <path d="M180 92H326M394 92H536V221H180V92" fill="none" stroke="#42616c" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M180 92H326" fill="none" stroke="#c24f43" strokeWidth="7" strokeLinecap="round" />
        <path d="M394 92H536V221H180V92" fill="none" stroke="#c24f43" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="97" y="103" width="86" height="112" rx="13" fill="#236d83" />
        <rect x="108" y="90" width="24" height="17" rx="4" fill="#d55344" />
        <rect x="149" y="90" width="24" height="17" rx="4" fill="#b8c7cc" />
        <path d="M115 158h26m-13-13v26m28-13h26" stroke="#fff8e8" strokeWidth="5" strokeLinecap="round" />
        <rect x="302" y="111" width="118" height="20" rx="8" fill="#dbe4e7" />
        <circle cx="326" cy="121" r="9" fill="#d4a83f" />
        <circle cx="394" cy="121" r="9" fill="#d4a83f" />
        <line x1="326" y1="121" x2={closed ? '394' : '382'} y2={closed ? '121' : '63'} stroke="#cf7045" strokeWidth="11" strokeLinecap="round" />
        <rect x="506" y="214" width="58" height="21" rx="8" fill="#9aabb0" />
        <circle cx="536" cy="171" r="38" fill={closed ? '#ffe49b' : '#dce5e5'} stroke={closed ? '#f5b942' : '#aebdc1'} strokeWidth="6" />
        <path d="M536 196v-24m-12 10 12-10 12 10" fill="none" stroke={closed ? '#e29a20' : '#89999e'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {closed && <circle cx="265" cy="92" r="9" fill="#f1c654" />}
      </svg>
    </div>
  );
}

const learningCards = [
  { title: 'ما الدائرة الكهربائية؟', text: 'مسار متصل تتحرك فيه الكهرباء من البطارية عبر أجزاء الدائرة ثم تعود إليها.' },
  { title: 'ما دور البطارية؟', text: 'توفر الطاقة التي تساعد على تشغيل المصباح في النموذج.' },
  { title: 'ما دور الأسلاك؟', text: 'تصل أجزاء الدائرة وتكوّن المسار الذي يمر فيه التيار.' },
  { title: 'ما دور المفتاح؟', text: 'يفتح المسار أو يغلقه للتحكم في مرور التيار.' },
  { title: 'ما دور اللمبة؟', text: 'تحول الطاقة الكهربائية إلى ضوء عندما تكتمل الدائرة.' },
  { title: 'ماذا يحدث عند فتح الدائرة؟', text: 'ينقطع المسار، فيتوقف التيار التوضيحي وتنطفئ اللمبة.' },
];

export function ElectricCircuitExperience() {
  const experienceRef = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const statusText = closed
    ? 'عند غلق المفتاح تكتمل الدائرة، فيمر التيار الكهربائي وتضيء اللمبة.'
    : 'الدائرة مفتوحة، لذلك لا يمر التيار الكهربائي ولا تضيء اللمبة.';

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setWebglAvailable(supportsWebGL()));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(preference.matches);
    updateMotionPreference();
    preference.addEventListener('change', updateMotionPreference);
    return () => {
      window.cancelAnimationFrame(frame);
      preference.removeEventListener('change', updateMotionPreference);
      if (audioContext.current && audioContext.current.state !== 'closed') void audioContext.current.close();
    };
  }, []);

  useEffect(() => {
    const root = experienceRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo('[data-electric-heading]',
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-electric-heading]', start: 'top 90%', once: true },
        },
      );
    }, root);
    return () => context.revert();
  }, []);

  function playSwitchSound(isClosing: boolean) {
    if (!soundEnabled || !window.AudioContext) return;
    try {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      if (context.state === 'suspended') void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const startAt = context.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(isClosing ? 640 : 470, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(isClosing ? 820 : 360, startAt + 0.12);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.026, startAt + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.19);
    } catch {
      // The visual experiment remains usable if browser audio is unavailable.
    }
  }

  function toggleSwitch() {
    const nextClosed = !closed;
    setClosed(nextClosed);
    playSwitchSound(nextClosed);
  }

  function resetExperiment() {
    setClosed(false);
  }

  return (
    <div ref={experienceRef} className="space-y-6" dir="rtl" lang="ar">
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.72fr)]">
        <section id="experiment-stage" className="min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm" aria-labelledby="circuit-stage-title">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold text-science-800">مختبر الفيزياء</p>
              <h2 id="circuit-stage-title" className="mt-1 text-lg font-bold text-neutral-950">ابنِ دائرة كهربائية بسيطة</h2>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${closed ? 'bg-amber-50 text-amber-800' : 'bg-neutral-100 text-neutral-700'}`}>
              {closed ? 'اللمبة مضيئة' : 'اللمبة منطفئة'}
            </span>
          </header>
          <SceneVisibilityRegion className="h-[clamp(18rem,62vw,28rem)] min-h-72 max-h-[28rem] w-full overflow-hidden">
            {webglAvailable === null ? (
              <div className="flex h-full items-center justify-center bg-neutral-50 text-sm text-neutral-500" role="status">جارٍ تجهيز نموذج الدائرة...</div>
            ) : webglAvailable ? (
              <ElectricCircuitScene closed={closed} onToggle={toggleSwitch} reducedMotion={reducedMotion} />
            ) : (
              <CircuitFallback closed={closed} />
            )}
          </SceneVisibilityRegion>
          <p className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-center text-xs leading-6 text-neutral-600 sm:px-6">
            اضغط على المفتاح في النموذج لإكمال المسار أو فتحه. حركة النقاط تمثيل تعليمي مبسط للتيار.
          </p>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6" aria-labelledby="circuit-status-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="circuit-status-title" className="text-lg font-bold text-neutral-950">حالة الدائرة</h2>
              <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${closed ? 'bg-science-50 text-science-800' : 'bg-orange-50 text-orange-800'}`} role="status" aria-live="polite">
                {closed ? 'الدائرة مغلقة' : 'الدائرة مفتوحة'}
              </span>
            </div>
            <p className="mt-4 min-h-20 text-sm leading-7 text-neutral-700" aria-live="polite">{statusText}</p>
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={toggleSwitch} aria-pressed={closed} className="btn-primary min-h-12 w-full justify-center gap-2 px-4 py-3 text-sm">
                {closed ? 'فتح المفتاح' : 'غلق المفتاح'}
              </button>
              <button type="button" onClick={resetExperiment} className="btn-secondary min-h-11 w-full justify-center gap-2 px-4 py-2.5 text-sm">
                إعادة التجربة
              </button>
              <button type="button" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-pressed={soundEnabled} className="btn-secondary min-h-11 w-full justify-center gap-2 px-4 py-2.5 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 010 6m3-9a9 9 0 010 12" /></svg>
                {soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] leading-5 text-neutral-500">الصوت اختياري ولا يعمل إلا عند التفاعل مع المفتاح.</p>
          </section>

          <section className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5" aria-labelledby="circuit-goal-title">
            <h2 id="circuit-goal-title" className="font-bold text-neutral-900">هدف التجربة</h2>
            <p className="mt-2 text-sm leading-7 text-neutral-700">لاحظ كيف يؤثر فتح المفتاح وغلقه في اكتمال الدائرة وإضاءة المصباح.</p>
          </section>
        </aside>
      </div>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7" aria-labelledby="circuit-learning-title">
        <header className="mb-5 max-w-2xl">
          <p className="text-xs font-semibold text-brand-700">نتعلّم بالملاحظة</p>
          <h2 id="circuit-learning-title" data-page-heading data-electric-heading className="mt-1 text-xl font-bold text-neutral-950 sm:text-2xl">كيف تعمل الدائرة الكهربائية؟</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">جرّب فتح المفتاح وغلقه، ثم اربط ما تراه بدور كل جزء.</p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {learningCards.map((card, index) => (
            <article key={card.title} className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
              <span className="font-mono text-[11px] font-bold text-science-800" aria-hidden="true">0{index + 1}</span>
              <h3 className="mt-2 font-bold text-neutral-900">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{card.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 rounded-xl border border-accent-100 bg-accent-50/70 px-4 py-3 text-xs leading-6 text-neutral-700">
          حركة النقاط في النموذج وسيلة توضيحية مبسطة، وليست محاكاة دقيقة لحركة الإلكترونات.
        </p>
      </section>

      <ExperimentVideo
        id="electric-video"
        title="Setting Up a Simple Circuit — Next Generation Science"
        youtubeUrl="https://www.youtube.com/watch?v=x4pdzG-DHnY"
      />
    </div>
  );
}
