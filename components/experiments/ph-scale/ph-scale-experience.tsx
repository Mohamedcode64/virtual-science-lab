'use client';

import Link from 'next/link';
import { Component, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { SceneVisibilityRegion } from '@/components/experiments/shared/experience-ui';
import { LabScene } from './lab-scene';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { classifyPH, mixLiquidAppearance, netConcentrationToPH, pHToNetConcentration, solutions } from './model';
import type { LiquidAppearance } from './model';
import type { MeasurementState } from './lab-scene';

interface SceneErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep the rest of the lab usable if a graphics driver fails during setup.
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function Icon({ type }: { type: 'reset' | 'book' | 'video' | 'back' | 'water' | 'drop' | 'microscope' | 'sound' | 'probe' }) {
  const paths = {
    reset: 'M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8m0-5v5h5m4-1v5l3 2',
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2ZM8 6h8M8 10h8',
    video: 'm22 8-6 4 6 4V8ZM2 7h14v10H2z',
    back: 'M19 12H5m7 7-7-7 7-7',
    water: 'M12 3s6 6.1 6 11a6 6 0 11-12 0c0-4.9 6-11 6-11Z',
    drop: 'M12 3s6 6.1 6 11a6 6 0 11-12 0c0-4.9 6-11 6-11Z M9 15a3 3 0 003 3',
    microscope: 'm6 3 6 6m-2-8 4 4-7 7-4-4 7-7ZM5 13l6 6m-2-6 2-2m3 5a5 5 0 105 5h-5m-6-2 3 3',
    sound: 'M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 010 6m3-9a9 9 0 010 12',
    probe: 'M7 3v10a4 4 0 108 0V3m-8 4h8m-4 10v4m-4 0h8',
  };
  return <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]} /></svg>;
}

function FallbackScene({ pH, appearance, solutionName, volume, probeDepth }: { pH: number; appearance: LiquidAppearance; solutionName: string; volume: number; probeDepth: number }) {
  const liquidHeight = Math.min(70, 25 + volume * 0.065);
  return (
    <div className="ph-fallback-scene" role="img" aria-label={`رسم مبسط لكأس يحتوي على ${solutionName}، وقراءة الرقم الهيدروجيني ${pH.toFixed(2)}`}>
      <div className="ph-fallback-scene__measure" dir="ltr"><span>14</span><span>7</span><span>0</span><i aria-hidden="true" /></div>
      <div className="ph-fallback-beaker">
        <div className="ph-fallback-beaker__liquid" style={{ height: `${liquidHeight}%`, backgroundColor: appearance.color, opacity: appearance.opacity }} />
        <span className="ph-fallback-beaker__probe" style={{ bottom: `${68 - probeDepth * 0.5}%` }} aria-hidden="true" />
        {appearance.bubbleFactor > 0.25 && <><span className="ph-fallback-beaker__bubble ph-fallback-beaker__bubble--one" aria-hidden="true" /><span className="ph-fallback-beaker__bubble ph-fallback-beaker__bubble--two" aria-hidden="true" /></>}
        <span className="ph-fallback-beaker__label">{solutionName}</span>
      </div>
      <span className="ph-fallback-scene__volume">{volume} مل</span>
    </div>
  );
}
function PHScale({ pH, classification, reducedMotion }: { pH: number; classification: ReturnType<typeof classifyPH>; reducedMotion: boolean }) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current) return;
    gsap.to(markerRef.current, {
      left: `${(pH / 14) * 100}%`,
      duration: reducedMotion ? 0 : 0.72,
      ease: 'power2.out',
    });
  }, [pH, reducedMotion]);

  return (
    <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-orange-800">حمضي</span>
        <span className="font-bold text-science-800">متعادل</span>
        <span className="font-bold text-brand-800">قاعدي</span>
      </div>
      <div className="ph-scale-track" role="meter" aria-label="مؤشر الرقم الهيدروجيني من صفر إلى أربعة عشر" aria-valuemin={0} aria-valuemax={14} aria-valuenow={Number(pH.toFixed(2))} aria-valuetext={`${pH.toFixed(2)}، ${classification.label}`}>
        <div ref={markerRef} className="ph-scale-marker"><span>{pH.toFixed(1)}</span><i aria-hidden="true" /></div>
      </div>
      <div className="mt-2 grid grid-cols-[repeat(15,minmax(0,1fr))] text-center font-mono text-[10px] text-neutral-500 sm:text-xs" dir="ltr" aria-hidden="true">
        {Array.from({ length: 15 }, (_, value) => <span key={value}>{value}</span>)}
      </div>
      <p className="mt-3 text-center text-xs leading-6 text-neutral-600">كلما ابتعدت القراءة عن 7 زادت حمضية المحلول أو قاعديته.</p>
    </div>
  );
}
function MicroView({ pH, reducedMotion }: { pH: number; reducedMotion: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const hydroniumCount = pH < 6.8 ? 3 : pH > 7.2 ? 1 : 2;
  const ions = Array.from({ length: 4 }, (_, index) => index < hydroniumCount ? 'hydronium' : 'hydroxide');

  useEffect(() => {
    if (!rootRef.current || reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.fromTo('[data-micro-particle]', { autoAlpha: 0, scale: 0.72, y: 7 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.34, stagger: 0.055, ease: 'back.out(1.6)' });
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="mt-4 rounded-xl border border-brand-100 bg-brand-50/55 p-4" aria-labelledby="micro-title">
      <div className="mb-3">
        <h3 id="micro-title" className="font-bold text-neutral-900">المستوى المجهري</h3>
        <p className="mt-1 text-xs text-neutral-600">تصوّر مبسّط للأيونات في العينة</p>
      </div>
      <ul className="flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-lg bg-white/85 p-3" aria-label="تمثيل توضيحي لجسيمات المحلول">
        {Array.from({ length: 8 }, (_, index) => <li key={`water-${index}`} data-micro-particle className="ph-ion ph-ion--water" aria-label="جزيء ماء">H₂O</li>)}
        {ions.map((type, index) => (
          <li key={`ion-${index}`} data-micro-particle className={`ph-ion ph-ion--${type}`} aria-label={type === 'hydronium' ? 'أيون هيدرونيوم' : 'أيون هيدروكسيد'}>
            {type === 'hydronium' ? 'H₃O⁺' : 'OH⁻'}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-700">
        <span className="inline-flex items-center gap-2"><i className="ph-ion-dot ph-ion-dot--hydronium" aria-hidden="true" />H₃O⁺</span>
        <span className="inline-flex items-center gap-2"><i className="ph-ion-dot ph-ion-dot--hydroxide" aria-hidden="true" />OH⁻</span>
        <span className="inline-flex items-center gap-2"><i className="ph-ion-dot ph-ion-dot--water" aria-hidden="true" />H₂O</span>
      </div>
      <p className="mt-3 border-t border-brand-100 pt-2 text-[11px] leading-5 text-neutral-600">تمثيل مبسط للجسيمات للمساعدة على فهم العلاقة بين الحموضة والقاعدية.</p>
    </section>
  );
}
export function PhScaleExperience() {
  const [selectedSolutionId, setSelectedSolutionId] = useState('');
  const [pourSourceId, setPourSourceId] = useState('water');
  const [volume, setVolume] = useState(0);
  const [composition, setComposition] = useState<Record<string, number>>({});
  const [netConcentration, setNetConcentration] = useState(0);
  const [probeDepth, setProbeDepth] = useState(0);
  const [showMicroView, setShowMicroView] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [isPreparingPour, setIsPreparingPour] = useState(false);
  const [isPreparingMeasure, setIsPreparingMeasure] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [lastReading, setLastReading] = useState<number | null>(null);
  const [displayedReading, setDisplayedReading] = useState(7);
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle');
  const [resetVersion, setResetVersion] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pourTimer = useRef<number | null>(null);
  const pourCommitTimer = useRef<number | null>(null);
  const pourStepTimer = useRef<number | null>(null);
  const additionRequest = useRef(0);
  const experienceRef = useRef<HTMLDivElement>(null);
  const measurementTimeline = useRef<gsap.core.Timeline | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const openingCuePending = useRef(true);
  const pH = useMemo(() => netConcentrationToPH(netConcentration), [netConcentration]);
  const classification = classifyPH(pH);
  const appearance = useMemo(() => mixLiquidAppearance(composition), [composition]);
  const selectedSolution = solutions.find((solution) => solution.id === selectedSolutionId) ?? solutions[0];
  const pourAppearance = solutions.find((solution) => solution.id === pourSourceId)?.appearance ?? solutions[0].appearance;
  const pourColor = pourAppearance.color;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setWebglAvailable(hasWebGLSupport()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (reducedMotion || !experienceRef.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
      timeline.fromTo('[data-ph-title]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35 });
      timeline.fromTo('[data-ph-panel]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38 }, '-=0.06');
      timeline.fromTo('[data-ph-scene]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.04');
      timeline.fromTo('[data-ph-controls]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.08');
    }, experienceRef);
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => () => {
    if (pourTimer.current !== null) window.clearTimeout(pourTimer.current);
    if (pourCommitTimer.current !== null) window.clearTimeout(pourCommitTimer.current);
    if (pourStepTimer.current !== null) window.clearInterval(pourStepTimer.current);
    measurementTimeline.current?.kill();
    if (audioContext.current && audioContext.current.state !== 'closed') void audioContext.current.close();
  }, []);

  function playCue(cue: 'button' | 'selection' | 'liquid' | 'probe' | 'start' | 'complete' | 'success' | 'reset' | 'open') {
    if (!window.AudioContext) return;
    const context = audioContext.current ?? new AudioContext();
    audioContext.current = context;
    if (context.state === 'suspended') void context.resume();
    const frequencies: Record<typeof cue, number[]> = {
      button: [440], selection: [520, 660], liquid: [390, 520], probe: [440, 590],
      start: [530, 680], complete: [690, 820], success: [620, 780, 930], reset: [440, 350], open: [510, 640, 760],
    };
    frequencies[cue].forEach((frequency, index) => {
      const startAt = context.currentTime + index * 0.065;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.035, startAt + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.13);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.14);
    });
  }

  function playSound(cue: 'button' | 'selection' | 'liquid' | 'probe' | 'start' | 'complete' | 'success' | 'reset' | 'open') {
    if (!soundEnabled) return;
    if (openingCuePending.current) {
      openingCuePending.current = false;
      playCue('open');
    }
    playCue(cue);
  }

  function toggleSound() {
    const nextEnabled = !soundEnabled;
    setSoundEnabled(nextEnabled);
    if (nextEnabled) {
      openingCuePending.current = false;
      playCue('open');
    }
  }

  function pulsePour(commitAddition: (progress: number) => void) {
    playSound('liquid');
    setIsPouring(true);
    if (pourCommitTimer.current !== null) window.clearTimeout(pourCommitTimer.current);
    if (pourStepTimer.current !== null) window.clearInterval(pourStepTimer.current);
    if (pourTimer.current !== null) window.clearTimeout(pourTimer.current);
    pourCommitTimer.current = window.setTimeout(() => {
      pourCommitTimer.current = null;
      if (reducedMotion) {
        commitAddition(1);
        return;
      }
      let step = 0;
      pourStepTimer.current = window.setInterval(() => {
        step += 1;
        commitAddition(step / 6);
        if (step >= 6 && pourStepTimer.current !== null) {
          window.clearInterval(pourStepTimer.current);
          pourStepTimer.current = null;
        }
      }, 125);
    }, reducedMotion ? 80 : 520);
    pourTimer.current = window.setTimeout(() => {
      setIsPouring(false);
      pourTimer.current = null;
    }, reducedMotion ? 280 : 1420);
  }

  async function revealBeaker(requestId: number) {
    const scene = document.querySelector<HTMLElement>('[data-ph-scene]');
    if (!scene) return;
    const motionReduced = reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scene.scrollIntoView({ behavior: motionReduced ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });

    await new Promise<void>((resolve) => {
      const startedAt = performance.now();
      let fallbackScrollUsed = false;
      const waitForVisibility = () => {
        if (additionRequest.current !== requestId) {
          resolve();
          return;
        }
        const rect = scene.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - 24;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight - 12) - Math.max(rect.top, 12));
        const clearlyVisible = rect.height <= availableHeight
          ? rect.top >= 12 && rect.bottom <= viewportHeight - 12
          : visibleHeight >= availableHeight * 0.84;
        if (clearlyVisible || performance.now() - startedAt > 5200) {
          resolve();
          return;
        }
        if (!fallbackScrollUsed && performance.now() - startedAt > 2600) {
          fallbackScrollUsed = true;
          scene.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
        }
        window.requestAnimationFrame(waitForVisibility);
      };
      window.requestAnimationFrame(waitForVisibility);
    });

    if (additionRequest.current !== requestId) return;
    await new Promise((resolve) => window.setTimeout(resolve, motionReduced ? 70 : 220));
  }

  async function chooseSolution(solutionId: string) {
    if (isPreparingPour || isPouring || isPreparingMeasure) return;
    const requestId = ++additionRequest.current;
    const solution = solutions.find((item) => item.id === solutionId) ?? solutions[0];
    measurementTimeline.current?.kill();
    setSelectedSolutionId(solution.id);
    setPourSourceId(solution.id);
    setProbeDepth(0);
    setMeasurementState('idle');
    setLastReading(null);
    setDisplayedReading(7);
    playSound('selection');
    const preview = document.getElementById('selected-solution-preview');
    if (preview && !reducedMotion) gsap.fromTo(preview, { scale: 0.975, autoAlpha: 0.75 }, { scale: 1, autoAlpha: 1, duration: 0.34, ease: 'back.out(1.6)' });
    scrollTo('experiment-stage', false);
    setIsPreparingPour(true);
    await revealBeaker(requestId);
    if (additionRequest.current !== requestId) return;
    const startingVolume = 0;
    const startingConcentration = 0;
    const amount = 150;
    setComposition({});
    setNetConcentration(0);
    setVolume(0);
    setIsPreparingPour(false);
    let previousAmount = 0;
    pulsePour((progress) => {
      const stagedAmount = Math.round(amount * progress);
      const increment = stagedAmount - previousAmount;
      previousAmount = stagedAmount;
      const nextVolume = startingVolume + stagedAmount;
      const mixedNet = nextVolume > 0
        ? (startingConcentration * startingVolume + pHToNetConcentration(solution.pH) * stagedAmount) / nextVolume
        : 0;
      setComposition((current) => increment > 0 ? { ...current, [solution.id]: (current[solution.id] ?? 0) + increment } : current);
      setNetConcentration(mixedNet);
      setVolume(nextVolume);
    });
  }

  async function addSolution() {
    if (volume <= 0 || selectedSolutionId === '' || volume >= 700 || isPreparingPour || isPouring || isPreparingMeasure) return;
    const requestId = ++additionRequest.current;
    const solution = selectedSolution;
    const startingVolume = volume;
    const startingConcentration = netConcentration;
    setIsPreparingPour(true);
    await revealBeaker(requestId);
    if (additionRequest.current !== requestId) return;
    setIsPreparingPour(false);
    setPourSourceId(solution.id);
    const amount = Math.min(25, 700 - startingVolume);
    let previousAmount = 0;
    pulsePour((progress) => {
      const stagedAmount = Math.round(amount * progress);
      const increment = stagedAmount - previousAmount;
      previousAmount = stagedAmount;
      const nextVolume = startingVolume + stagedAmount;
      const mixedNet = (startingConcentration * startingVolume + pHToNetConcentration(solution.pH) * stagedAmount) / nextVolume;
      setNetConcentration(mixedNet);
      setComposition((current) => ({ ...current, [solution.id]: (current[solution.id] ?? 0) + increment }));
      setVolume(nextVolume);
      setMeasurementState('idle');
    });
  }

  async function addWater(amount = 100) {
    if (volume <= 0 || volume >= 700 || isPreparingPour || isPouring || isPreparingMeasure) return;
    const requestId = ++additionRequest.current;
    const startingVolume = volume;
    const startingConcentration = netConcentration;
    setIsPreparingPour(true);
    await revealBeaker(requestId);
    if (additionRequest.current !== requestId) return;
    setIsPreparingPour(false);
    setPourSourceId('water');
    const added = Math.min(amount, 700 - startingVolume);
    let previousAmount = 0;
    pulsePour((progress) => {
      const stagedAmount = Math.round(added * progress);
      const increment = stagedAmount - previousAmount;
      previousAmount = stagedAmount;
      const nextVolume = startingVolume + stagedAmount;
      const dilutedNet = (startingConcentration * startingVolume) / nextVolume;
      setNetConcentration(dilutedNet);
      setComposition((current) => ({ ...current, water: (current.water ?? 0) + increment }));
      setVolume(nextVolume);
      setMeasurementState('idle');
    });
  }

  async function measurePH() {
    if (volume <= 0 || isPreparingPour || isPouring || isPreparingMeasure || measurementState === 'measuring') return;
    const requestId = ++additionRequest.current;
    setIsPreparingMeasure(true);
    await revealBeaker(requestId);
    if (additionRequest.current !== requestId) return;
    setIsPreparingMeasure(false);
    measurementTimeline.current?.kill();
    playSound('probe');
    if (reducedMotion) {
      setProbeDepth(75);
      setMeasurementState('complete');
      setDisplayedReading(pH);
      setLastReading(pH);
      playSound('start');
      playSound('complete');
      return;
    }

    setMeasurementState('idle');
    const probe = { value: probeDepth };
    const reading = { value: lastReading ?? 7 };
    const target = pH;
    const timeline = gsap.timeline({
      onComplete: () => {
        setDisplayedReading(target);
        setLastReading(target);
        setMeasurementState('complete');
        playSound('complete');
        playSound('success');
      },
    });
    timeline.to(probe, {
      value: 75,
      duration: 0.78,
      ease: 'power2.inOut',
      onUpdate: () => setProbeDepth(Math.round(probe.value)),
    });
    timeline.call(() => {
      setMeasurementState('measuring');
      playSound('start');
    });
    timeline.to(reading, {
      value: (reading.value + target) / 2,
      duration: 0.38,
      ease: 'power1.out',
      onUpdate: () => setDisplayedReading(Number(reading.value.toFixed(1))),
    });
    timeline.to(reading, {
      value: target,
      duration: 0.62,
      ease: 'power2.out',
      onUpdate: () => setDisplayedReading(reading.value),
    });
    measurementTimeline.current = timeline;
  }

  function resetExperiment() {
    additionRequest.current += 1;
    setIsPreparingPour(false);
    setIsPreparingMeasure(false);
    playSound('reset');
    if (pourTimer.current !== null) window.clearTimeout(pourTimer.current);
    if (pourCommitTimer.current !== null) window.clearTimeout(pourCommitTimer.current);
    if (pourStepTimer.current !== null) window.clearInterval(pourStepTimer.current);
    pourTimer.current = null;
    pourCommitTimer.current = null;
    measurementTimeline.current?.kill();
    setSelectedSolutionId('');
    setPourSourceId('water');
    setComposition({});
    setVolume(0);
    setNetConcentration(0);
    setProbeDepth(0);
    setShowMicroView(false);
    setIsPouring(false);
    setLastReading(null);
    setDisplayedReading(7);
    setMeasurementState('idle');
    setResetVersion((version) => version + 1);
  }

  function scrollTo(id: string, playCue = true) {
    if (playCue) playSound('button');
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  function renderFallback() {
    return (
      <div>
        <FallbackScene pH={pH} appearance={appearance} solutionName={selectedSolution.nameAr} volume={volume} probeDepth={probeDepth} />
        <p className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-6 text-neutral-600" role="status">
          يبدو أن جهازك لا يدعم العرض ثلاثي الأبعاد بشكل كامل. يمكنك متابعة التجربة باستخدام الرسم المبسط والأدوات نفسها.
        </p>
      </div>
    );
  }
  return (
    <div ref={experienceRef} className="space-y-5" id="ph-lab-top" dir="rtl" lang="ar">
      <div data-ph-title className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-science-50 text-science-800"><Icon type="drop" /></span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-neutral-900">مقياس الرقم الهيدروجيني</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">مختبر الكيمياء · محاكاة تعليمية</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'} className="ph-toolbar-button"><Icon type="sound" /><span>{soundEnabled ? 'الصوت يعمل' : 'الصوت متوقف'}</span></button>
          <button id="reset-experiment-toolbar" type="button" onClick={resetExperiment} className="ph-toolbar-button" aria-label="إعادة التجربة"><Icon type="reset" /><span>إعادة التجربة</span></button>
          <button type="button" onClick={() => scrollTo('ph-guide')} className="ph-toolbar-button"><Icon type="book" /><span>الشرح</span></button>
          <button type="button" onClick={() => scrollTo('ph-video')} className="ph-toolbar-button"><Icon type="video" /><span>الفيديو</span></button>
          <Link href="/experiments" className="ph-toolbar-button"><Icon type="back" /><span>العودة للتجارب</span></Link>
        </div>
      </div>

      <div className="ph-lab-grid grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.78fr)]">
        <section id="experiment-stage" data-ph-scene className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-labelledby="ph-scene-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 sm:px-5">
            <div>
              <h2 id="ph-scene-title" className="text-sm font-bold text-neutral-900">منضدة التجربة</h2>
              <p className="mt-1 text-[11px] text-neutral-500">أضف المحلول وحرّك المسبار لقراءة القياس</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${webglAvailable ? 'bg-science-50 text-science-800' : 'bg-neutral-100 text-neutral-600'}`}>
              {webglAvailable === null ? 'جارٍ تجهيز المشهد' : webglAvailable ? 'عرض ثلاثي الأبعاد' : 'وضع العرض المبسط'}
            </span>
          </div>
          <SceneVisibilityRegion className="ph-scene-canvas">
            {webglAvailable === null ? (
              <div className="flex min-h-[20rem] items-center justify-center text-sm text-neutral-600" role="status">جارٍ تهيئة أدوات المختبر...</div>
            ) : webglAvailable ? (
              <SceneErrorBoundary fallback={renderFallback()}>
                <LabScene pH={pH} volume={volume} appearance={appearance} pourColor={pourColor} pourAppearance={pourAppearance} solutionName={selectedSolution.nameAr} probeDepth={probeDepth} pouring={isPouring} reducedMotion={reducedMotion} measurementState={measurementState} displayedReading={displayedReading} resetVersion={resetVersion} />
              </SceneErrorBoundary>
            ) : renderFallback()}
          </SceneVisibilityRegion>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 sm:px-5">
            <p className="text-xs text-neutral-600">قراءة المسبار: <strong className="font-mono text-neutral-900" dir="ltr">{measurementState === 'complete' && lastReading !== null ? lastReading.toFixed(2) : '— —'}</strong></p>
          <button id="toggle-micro-view" type="button" className="ph-toolbar-button" aria-pressed={showMicroView} onClick={() => setShowMicroView((shown) => !shown)}>
              <Icon type="microscope" />{showMicroView ? 'إخفاء المستوى المجهري' : 'المستوى المجهري'}
            </button>
          </div>
          {showMicroView && <div className="px-4 pb-4 sm:px-5"><MicroView pH={pH} reducedMotion={reducedMotion} /></div>}
          <div className="px-4 pb-4 sm:px-5"><PHScale pH={pH} classification={classification} reducedMotion={reducedMotion} /></div>
        </section>

        <aside data-ph-panel className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-labelledby="ph-reading-title">
            <div className="border-b border-neutral-100 px-5 py-4">
              <p className="text-xs font-semibold text-brand-700">التجربة</p>
              <h2 id="ph-reading-title" className="mt-1 text-lg font-bold text-neutral-950">قياس الرقم الهيدروجيني</h2>
            </div>
            <div className="p-5">
              <p className="mb-3 text-xs leading-6 text-neutral-600">التعرف على الرقم الهيدروجيني وتمييز المحاليل الحمضية والقاعدية والمتعادلة.</p>
              <div className="flex items-end justify-between gap-3 rounded-xl bg-neutral-50 p-4">
                <div>
                  <p className="text-xs text-neutral-500">الرقم الهيدروجيني الحالي</p>
                  <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-neutral-950" dir="ltr">{measurementState === 'idle' ? '— —' : measurementState === 'measuring' ? displayedReading.toFixed(1) : (lastReading ?? pH).toFixed(2)}</p>
                </div>
                <span className={`mb-1 rounded-full px-3 py-1.5 text-sm font-bold ${classification.soft} ${classification.color}`}>
                  {classification.label}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-neutral-500">حجم العينة في الكأس</span>
                <span className="font-semibold text-neutral-800" dir="ltr">{volume} mL</span>
              </div>
              <button id="reset-experiment-panel" type="button" onClick={resetExperiment} className="btn-secondary mt-4 min-h-10 w-full gap-2 px-4 py-2 text-sm"><Icon type="reset" />إعادة التجربة</button>
            </div>
          </section>

          <section data-ph-controls className="rounded-2xl border border-neutral-200 bg-white p-5" aria-labelledby="solution-controls-title">
            <div className="mb-4">
              <p className="text-xs font-semibold text-science-800">أدوات المختبر</p>
              <h2 id="solution-controls-title" className="mt-1 font-bold text-neutral-900">تحكّم في العينة</h2>
            </div>
            <label htmlFor="solution-select" className="mb-2 block text-xs font-medium text-neutral-700">اختر المحلول</label>
            <select id="solution-select" className="input min-h-11 text-sm" value={selectedSolutionId} disabled={isPreparingPour || isPouring || isPreparingMeasure} onChange={(event) => chooseSolution(event.target.value)}>
              <option value="" disabled>اختر محلولاً للبدء</option>
              {solutions.map((solution) => <option key={solution.id} value={solution.id}>{solution.nameAr}{solution.id === 'water' ? '' : ` · pH تقريبي ${solution.pH}`}</option>)}
            </select>
            <div id="selected-solution-preview" className="mt-3 flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3" aria-live="polite">
              <span className="h-10 w-10 shrink-0 rounded-lg border border-white shadow-sm" style={{ backgroundColor: appearance.color, opacity: appearance.opacity }} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-neutral-900">{selectedSolution.nameAr}</p>
                <p className="mt-0.5 text-[11px] text-neutral-600">pH تقديري {selectedSolution.pH} · {classification.label}</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-neutral-500">قيم المحاليل المألوفة تقريبية وتتغير حسب التركيب.</p>
            <button id="add-solution" type="button" onClick={addSolution} disabled={volume <= 0 || selectedSolutionId === '' || volume >= 700 || isPreparingPour || isPouring || isPreparingMeasure} className="btn-primary mt-4 min-h-11 w-full justify-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              <Icon type="drop" />{isPreparingPour ? 'جارٍ إظهار الكأس...' : selectedSolution.id === 'water' ? 'إضافة ٢٥ مل من الماء' : 'إضافة ٢٥ مل من المحلول'}
            </button>
            <button id="add-water" type="button" onClick={() => addWater(100)} disabled={volume <= 0 || volume >= 700 || isPreparingPour || isPouring || isPreparingMeasure} className="btn-secondary mt-2 min-h-11 w-full justify-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              <Icon type="water" />إضافة ١٠٠ مل ماء للتخفيف
            </button>

                        <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
              <button id="start-ph-measurement" type="button" onClick={measurePH} disabled={volume <= 0 || isPreparingMeasure || isPreparingPour || isPouring || measurementState === 'measuring'} className="btn-primary min-h-11 w-full justify-center gap-2 px-4 py-2 text-sm disabled:opacity-60">
                <Icon type="probe" />{isPreparingMeasure ? 'جارٍ إظهار جهاز القياس...' : measurementState === 'measuring' ? 'جارٍ القياس...' : 'قياس الرقم الهيدروجيني'}
              </button>
              <p className="mt-2 text-center text-xs leading-5 text-neutral-700" role="status" aria-live="polite">
                {measurementState === 'measuring' ? 'يدخل المسبار إلى السائل، ثم تظهر القراءة.' : measurementState === 'complete' ? 'النتيجة: pH ' + (lastReading ?? pH).toFixed(2) + ' — ' + classification.label : 'حرّك المسبار أو ابدأ القياس لعرض النتيجة.'}
              </p>
            </div><div className="mt-5 border-t border-neutral-100 pt-4">
              <label htmlFor="probe-depth" className="flex items-center justify-between gap-3 text-xs font-medium text-neutral-700">
                <span>موضع مسبار القياس</span>
                <span className="text-neutral-500">{probeDepth < 68 ? 'خارج المحلول' : 'داخل المحلول'}</span>
              </label>
              <input id="probe-depth" type="range" min="0" max="100" value={probeDepth} disabled={measurementState === 'measuring'} onChange={(event) => {
                const nextDepth = Number(event.target.value);
                setProbeDepth(nextDepth);
                setMeasurementState('idle');
              }} className="ph-range mt-3 w-full" aria-valuetext={probeDepth < 68 ? 'المسبار خارج المحلول' : `عمق المسبار ${probeDepth} بالمئة`} />
              <div className="mt-1 flex justify-between text-[10px] text-neutral-500"><span>مرفوع</span><span>مغمور</span></div>
            </div>
          </section>

          <p className="rounded-xl border border-accent-100 bg-accent-50/70 px-4 py-3 text-xs leading-6 text-neutral-700">
            هذه محاكاة تعليمية مبسطة. القيم المعروضة تقريبية ولا تغني عن القياس المخبري.
          </p>
        </aside>
      </div>

      <section id="ph-guide" className="grid scroll-mt-24 gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 lg:grid-cols-[0.75fr_1.25fr]" aria-labelledby="ph-guide-title">
        <div>
          <p className="text-xs font-semibold text-brand-700">الشرح</p>
          <h2 id="ph-guide-title" className="mt-1 text-xl font-bold text-neutral-950">كيف نقرأ المقياس؟</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">يقارن المقياس بين المحاليل وفق درجة الحموضة أو القاعدية. تحرّك بين المواد، ثم لاحظ أثر التخفيف بالماء.</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ['01', 'اختر محلولاً', 'حدد مادة من القائمة وأضفها إلى الكأس.'],
            ['02', 'قِس القراءة', 'حرّك المسبار إلى داخل السائل ولاحظ قيمة pH.'],
            ['03', 'جرّب التخفيف', 'أضف الماء وراقب اقتراب القراءة من 7.'],
          ].map(([number, title, detail]) => (
            <li key={number} className="border-r-2 border-science-300 pr-3">
              <span className="font-mono text-[10px] font-semibold text-science-800">{number}</span>
              <h3 className="mt-1 text-sm font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-xs leading-6 text-neutral-600">{detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <ExperimentVideo youtubeUrl="https://www.youtube.com/watch?v=OfliVeS9zK0" />
      <p className="px-1 text-xs leading-6 text-neutral-500">قراءة أخيرة للمسبار: <span className="font-mono" dir="ltr">{lastReading === null ? 'لم يجر القياس بعد' : lastReading.toFixed(2)}</span>. أعد التجربة للعودة إلى الماء المتعادل.</p>
    </div>
  );
}
