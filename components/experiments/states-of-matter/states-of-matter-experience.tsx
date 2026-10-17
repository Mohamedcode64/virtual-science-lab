'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges, OrbitControls } from '@react-three/drei';
import { Color, Vector3 } from 'three';
import type { Mesh } from 'three';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, SceneUnavailable, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';

type MatterState = 'solid' | 'liquid' | 'gas';

const stateDetails: Record<MatterState, { title: string; explanation: string; color: string }> = {
  solid: { title: 'صلب', explanation: 'في الحالة الصلبة تكون الجسيمات متقاربة وتهتز في أماكنها، لذلك يحتفظ الجسم بشكله.', color: '#368b83' },
  liquid: { title: 'سائل', explanation: 'في الحالة السائلة تتحرك الجسيمات بحرية أكبر، لذلك يأخذ السائل شكل الوعاء.', color: '#3d91b2' },
  gas: { title: 'غاز', explanation: 'في الحالة الغازية تكون الجسيمات متباعدة وتتحرك بحرية في جميع الاتجاهات.', color: '#d59b43' },
};

function getState(temperature: number): MatterState {
  if (temperature < 34) return 'solid';
  if (temperature < 68) return 'liquid';
  return 'gas';
}

function getTransition(from: MatterState, to: MatterState) {
  const transitions: Record<string, string> = {
    'solid-liquid': 'الانصهار',
    'liquid-gas': 'التبخر',
    'gas-liquid': 'التكاثف',
    'liquid-solid': 'التجمد',
    'solid-gas': 'تسخين متدرج: انصهار ثم تبخر',
    'gas-solid': 'تبريد متدرج: تكاثف ثم تجمد',
  };
  return transitions[`${from}-${to}`] ?? 'تغير الحالة';
}

function MatterParticle({ index, state, reducedMotion }: { index: number; state: MatterState; reducedMotion: boolean }) {
  const particleRef = useRef<Mesh>(null);
  const target = useRef(new Vector3());
  const color = useRef(new Color(stateDetails[state].color));

  useEffect(() => { color.current.set(stateDetails[state].color); }, [state]);

  useFrame(({ clock }, delta) => {
    const particle = particleRef.current;
    if (!particle) return;
    const time = reducedMotion ? index * 0.37 : clock.elapsedTime;
    const column = index % 4;
    const row = Math.floor(index / 4);
    if (state === 'solid') {
      target.current.set(
        (column - 1.5) * 0.34 + Math.sin(time * 5 + index) * (reducedMotion ? 0 : 0.035),
        0.05 + (row - 1) * 0.34 + Math.cos(time * 5 + index * 0.8) * (reducedMotion ? 0 : 0.035),
        ((index % 3) - 1) * 0.24,
      );
    } else if (state === 'liquid') {
      target.current.set(
        Math.sin(time * 0.7 + index * 1.71) * 0.95,
        -0.82 + (Math.sin(time * 0.9 + index * 2.13) * 0.5 + 0.5) * 0.75,
        Math.cos(time * 0.8 + index * 1.3) * 0.28,
      );
    } else {
      target.current.set(
        Math.sin(time * 1.05 + index * 1.47) * 1.22,
        Math.sin(time * 1.25 + index * 2.29) * 0.94,
        Math.cos(time * 1.1 + index * 1.11) * 0.38,
      );
    }
    particle.position.lerp(target.current, Math.min(1, delta * 3.4));
    const material = particle.material as import('three').MeshStandardMaterial;
    material.color.lerp(color.current, Math.min(1, delta * 3));
  });

  return (
    <mesh ref={particleRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.105, 12, 10]} />
      <meshStandardMaterial color={stateDetails[state].color} roughness={0.42} />
    </mesh>
  );
}

function MatterModel({ state, reducedMotion }: { state: MatterState; reducedMotion: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const narrow = size.width / Math.max(1, size.height) < 1.25;
    camera.position.set(0, 0.12, narrow ? 8.5 : 7.4);
    camera.lookAt(0, 0.02, 0);
  }, [camera, size.height, size.width]);

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[-3, 5, 5]} intensity={1.15} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.25, 3.05, 1.12]} />
        <meshStandardMaterial color="#9ec4c8" transparent opacity={0.075} depthWrite={false} />
        <Edges color="#6f9da2" threshold={15} />
      </mesh>
      <mesh position={[0, -1.28, 0]}>
        <boxGeometry args={[3.12, 0.08, 0.96]} />
        <meshStandardMaterial color="#d5e2e1" roughness={0.45} />
      </mesh>
      {Array.from({ length: 12 }, (_, index) => <MatterParticle key={index} index={index} state={state} reducedMotion={reducedMotion} />)}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4.8} maxDistance={11} minPolarAngle={0.42} maxPolarAngle={1.92} rotateSpeed={0.5} zoomSpeed={0.7} />
    </>
  );
}

export function StatesOfMatterExperience({ videoUrl }: { videoUrl: string }) {
  const [temperature, setTemperature] = useState(20);
  const [transition, setTransition] = useState('ابدأ من الحالة الصلبة');
  const state = getState(temperature);
  const detail = stateDetails[state];
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();

  function changeTemperature(nextTemperature: number) {
    const nextState = getState(nextTemperature);
    if (nextState !== state) {
      setTransition(getTransition(state, nextState));
      playSound(nextState === 'gas');
    }
    setTemperature(nextTemperature);
  }

  function reset() {
    setTemperature(20);
    setTransition('ابدأ من الحالة الصلبة');
  }

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الفيزياء"
        stageTitle="حالات المادة في الوعاء"
        status={detail.title}
        statusText={detail.explanation}
        caption="الجسيمات هنا تمثيل تعليمي مبسط يساعد على مقارنة الحركة والمسافات، وليست تصويراً دقيقاً للجزيئات."
        controls={(
          <>
            <label htmlFor="matter-temperature" className="text-sm font-bold text-neutral-800">درجة الحرارة <span className="font-normal text-neutral-500">(تمثيل تقريبي)</span></label>
            <input id="matter-temperature" type="range" min="0" max="100" step="1" value={temperature} onChange={(event) => changeTemperature(Number(event.target.value))} aria-valuetext={`${temperature} من 100، ${detail.title}`} className="min-h-10 w-full accent-brand-700" />
            <div className="flex items-center justify-between text-xs text-neutral-500"><span>أقل</span><span>{temperature} / 100</span><span>أعلى</span></div>
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800" aria-live="polite">التغير الحالي: {transition}</p>
            <div className="grid grid-cols-3 gap-2" aria-label="اختيار حالة المادة">
              {(['solid', 'liquid', 'gas'] as const).map((matterState) => (
                <button key={matterState} type="button" onClick={() => changeTemperature(matterState === 'solid' ? 20 : matterState === 'liquid' ? 50 : 85)} aria-pressed={state === matterState} className={`min-h-11 rounded-xl border px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${state === matterState ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                  {stateDetails[matterState].title}
                </button>
              ))}
            </div>
          </>
        )}
        onReset={reset}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
      >
        {webgl === null ? <SceneLoading label="حالات المادة" /> : webgl ? <ExperimentCanvas camera={{ position: [0, 0.12, 7.4], fov: 38 }} dpr={[1, 1.2]} aria-label={`جسيمات تمثيلية في الحالة ${detail.title}`}><MatterModel state={state} reducedMotion={reducedMotion} /></ExperimentCanvas> : <SceneUnavailable label="جسيمات متقاربة، جسيمات متحركة، جسيمات متباعدة" />}
      </ExperimentWorkspace>
      <LearningPanel
        title="ما الذي يتغير عندما نسخّن المادة؟"
        introduction="في هذا النموذج نغيّر مستوى الحرارة لنلاحظ حركة الجسيمات وشكل المادة. الانتقالات تقريبية ومخصصة للتعلم."
        items={[
          { title: 'صلب', text: 'الجسيمات متقاربة وتهتز في مواضعها، لذلك يبقى الشكل ثابتاً.' },
          { title: 'سائل', text: 'تتحرك الجسيمات حول بعضها، فيأخذ السائل شكل الوعاء.' },
          { title: 'غاز', text: 'تنتشر الجسيمات لتملأ الحيز المتاح وتتحرك بحرية أكبر.' },
        ]}
      />
      <ExperimentVideo
        id="states-of-matter-video"
        title="حالات المادة.. فيديو تعليمي للأطفال"
        description="شاهد كيف يختلف ترتيب الجسيمات وحركتها في المواد الصلبة والسائلة والغازية."
        youtubeUrl={videoUrl}
      />
    </div>
  );
}
