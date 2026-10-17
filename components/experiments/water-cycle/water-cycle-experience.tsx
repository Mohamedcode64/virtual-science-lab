'use client';

import { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { useRef } from 'react';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, SceneUnavailable, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';

const stages = [
  { id: 'evaporation', name: 'التبخر', explanation: 'عندما تسخن الشمس الماء، يتحول جزء منه إلى بخار ماء ويصعد إلى الهواء.' },
  { id: 'condensation', name: 'التكاثف', explanation: 'عندما يبرد بخار الماء يتحول إلى قطرات صغيرة تتجمع لتكوين السحب.' },
  { id: 'precipitation', name: 'الهطول', explanation: 'عندما تتجمع قطرات الماء في السحب وتصبح ثقيلة، تسقط على الأرض على هيئة أمطار.' },
  { id: 'collection', name: 'التجمع', explanation: 'تعود مياه الأمطار إلى الأنهار والبحيرات والتربة، ثم تبدأ رحلة الماء من جديد.' },
] as const;

type StageIndex = 0 | 1 | 2 | 3;

function WaterCycleModel({ stage, reducedMotion }: { stage: StageIndex; reducedMotion: boolean }) {
  const { camera, size } = useThree();
  const cloudRef = useRef<Group>(null);
  const lakeRef = useRef<Group>(null);
  const sunRef = useRef<Mesh>(null);
  const vaporRefs = useRef<Array<Mesh | null>>([]);
  const rainRefs = useRef<Array<Mesh | null>>([]);

  useEffect(() => {
    const narrow = size.width / Math.max(1, size.height) < 1.25;
    camera.position.set(0, narrow ? 2.7 : 2.45, narrow ? 12.6 : 10.7);
    camera.lookAt(0, 0.32, 0);
  }, [camera, size.height, size.width]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.elapsedTime;
    const flow = reducedMotion ? 0 : elapsed;
    if (cloudRef.current) {
      const cloudTarget = stage === 1 || stage === 2 ? 1.1 : 0.86;
      const nextScale = cloudRef.current.scale.x + (cloudTarget - cloudRef.current.scale.x) * Math.min(1, delta * 2);
      cloudRef.current.scale.setScalar(nextScale);
    }
    if (lakeRef.current) {
      const targetY = stage === 0 ? -0.72 : stage === 3 ? -0.6 : -0.66;
      const targetScaleY = stage === 0 ? 0.84 : stage === 3 ? 1 : 0.92;
      lakeRef.current.position.y += (targetY - lakeRef.current.position.y) * Math.min(1, delta * 2);
      lakeRef.current.scale.y += (targetScaleY - lakeRef.current.scale.y) * Math.min(1, delta * 2);
    }
    if (sunRef.current) {
      const material = sunRef.current.material as import('three').MeshStandardMaterial;
      material.emissiveIntensity += ((stage === 0 ? 0.65 : 0.12) - material.emissiveIntensity) * Math.min(1, delta * 3);
    }

    vaporRefs.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = stage === 0 || stage === 1;
      if (!particle.visible) return;
      const travel = reducedMotion ? 0.45 : (flow * 0.2 + index * 0.19) % 1;
      const x = stage === 1 ? 1.12 + ((index % 3) - 1) * 0.13 : -0.55 + (index % 3) * 0.35;
      particle.position.set(x, stage === 1 ? 1.38 + (Math.floor(index / 3) - 0.5) * 0.1 : -0.38 + travel * 1.8, 0.1 + (index % 2) * 0.15);
      const sizeFactor = stage === 1 ? 0.72 : 1;
      particle.scale.setScalar(sizeFactor);
    });

    rainRefs.current.forEach((drop, index) => {
      if (!drop) return;
      drop.visible = stage === 2;
      if (!drop.visible) return;
      const fall = reducedMotion ? 0.55 : (flow * 0.48 + index * 0.14) % 1;
      drop.position.set(1.45 + Math.sin(index * 2.3) * 0.72, 1.1 - fall * 1.65, 0.08 + (index % 2) * 0.12);
    });
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-4, 7, 6]} intensity={1.35} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.28, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#dce9df" roughness={1} />
      </mesh>
      <mesh position={[-3.25, 0.05, -0.5]} rotation-z={0.42}>
        <coneGeometry args={[1.65, 2.7, 5]} />
        <meshStandardMaterial color="#819c8c" roughness={1} />
      </mesh>
      <mesh position={[3.25, 0.1, -0.6]} rotation-z={-0.36}>
        <coneGeometry args={[1.75, 2.95, 5]} />
        <meshStandardMaterial color="#97ad99" roughness={1} />
      </mesh>
      <group position={[-2.75, 1.65, -0.25]}>
        <mesh ref={sunRef}>
          <sphereGeometry args={[0.57, 24, 18]} />
          <meshStandardMaterial color="#f2bd55" emissive="#f2a93b" emissiveIntensity={0.12} roughness={0.7} />
        </mesh>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh key={index} rotation-z={(index / 8) * Math.PI * 2} position={[Math.cos(index * Math.PI / 4) * 0.83, Math.sin(index * Math.PI / 4) * 0.83, 0]}>
            <boxGeometry args={[0.06, 0.25, 0.045]} />
            <meshStandardMaterial color="#efc66f" />
          </mesh>
        ))}
      </group>
      <group ref={cloudRef} position={[1.5, 1.5, -0.1]}>
        {[[-0.38, 0, 0], [0.16, 0.16, 0], [0.62, -0.04, 0]].map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[0.57, 18, 14]} />
            <meshStandardMaterial color={stage === 2 ? '#87969a' : '#f4f7f5'} roughness={0.95} />
          </mesh>
        ))}
      </group>
      <group ref={lakeRef} position={[0, -0.64, 0.12]}>
        <mesh position={[0, 0, 0]} scale={[1.92, 0.4, 0.72]}>
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial color="#3f99a8" roughness={0.3} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[1.57, 0.05, 0.54]}>
          <sphereGeometry args={[1, 28, 16]} />
          <meshStandardMaterial color="#65b8c1" roughness={0.25} />
        </mesh>
      </group>
      <group position={[3.5, -0.15, 0.2]}>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.075, 0.12, 0.86, 10]} />
          <meshStandardMaterial color="#78614c" />
        </mesh>
        {[-0.28, 0.25].map((x, index) => (
          <mesh key={x} position={[x, 0.72 + index * 0.12, 0]} rotation-z={x * 1.5} scale={[0.58, 0.32, 0.17]}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color="#628a68" />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh key={`vapor-${index}`} ref={(node) => { vaporRefs.current[index] = node; }}>
          <sphereGeometry args={[0.075, 10, 8]} />
          <meshStandardMaterial color="#e9fbff" emissive="#bce9ed" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`rain-${index}`} ref={(node) => { rainRefs.current[index] = node; }} visible={false}>
          <capsuleGeometry args={[0.035, 0.14, 3, 6]} />
          <meshStandardMaterial color="#4e9ec0" />
        </mesh>
      ))}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={7.5} maxDistance={16} minPolarAngle={0.48} maxPolarAngle={1.86} rotateSpeed={0.52} zoomSpeed={0.72} />
    </>
  );
}

export function WaterCycleExperience({ videoUrl }: { videoUrl: string }) {
  const [stage, setStage] = useState<StageIndex>(0);
  const [running, setRunning] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const webgl = useWebGLSupport();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();
  const activeStage = stages[stage];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setStage((current) => ((current + 1) % stages.length) as StageIndex), reducedMotion ? 5000 : 2600);
    return () => window.clearInterval(timer);
  }, [reducedMotion, running]);

  function selectStage(index: StageIndex) {
    setRunning(false);
    setStage(index);
    playSound(index === 3);
  }

  function reset() {
    setRunning(false);
    setStage(0);
  }

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="علوم الأرض"
        stageTitle="رحلة قطرة الماء"
        status={activeStage.name}
        statusText={activeStage.explanation}
        caption="تمثيل تعليمي مبسط لدورة الماء. راقب كيف تنتقل المياه بين البحيرة والهواء والسحب."
        controls={(
          <>
            <button type="button" onClick={() => { setRunning((value) => !value); playSound(); }} aria-pressed={running} className="btn-primary min-h-12 w-full justify-center px-4 py-3 text-sm">{running ? 'إيقاف الدورة' : 'تشغيل الدورة'}</button>
            <div className="grid grid-cols-2 gap-2" aria-label="مراحل دورة الماء">
              {stages.map((item, index) => (
                <button key={item.id} type="button" onClick={() => selectStage(index as StageIndex)} aria-pressed={stage === index} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${stage === index ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                  {item.name}
                </button>
              ))}
            </div>
          </>
        )}
        onReset={reset}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
      >
        {webgl === null ? <SceneLoading label="دورة الماء" /> : webgl ? <ExperimentCanvas camera={{ position: [0, 2.5, 10.7], fov: 39 }} dpr={[1, 1.2]} aria-label="مشهد ثلاثي الأبعاد لدورة الماء"><WaterCycleModel stage={stage} reducedMotion={reducedMotion} /></ExperimentCanvas> : <SceneUnavailable label="الشمس، الماء، السحب، المطر" />}
      </ExperimentWorkspace>
      <LearningPanel
        title="كيف تعود المياه إلى البحيرة؟"
        introduction="تتغير حالة الماء وتنتقل من سطح الأرض إلى الهواء ثم تعود إليه، لذلك تستمر الدورة في الطبيعة."
        items={[
          { title: 'التبخر', text: 'تسخن الشمس ماء البحيرات والأنهار، فيصعد بعضه إلى الهواء على هيئة بخار.' },
          { title: 'التكاثف', text: 'يبرد بخار الماء في الأعلى، فتتكون قطرات صغيرة تتجمع في السحب.' },
          { title: 'الهطول والتجمع', text: 'تسقط المياه من السحب ثم تتجمع في المسطحات المائية والتربة.' },
        ]}
      />
      <ExperimentVideo
        id="water-cycle-video"
        title="دورة الماء في الطبيعة | شرح دورة المياه في الطبيعة للأطفال"
        description="تابع التبخر وتكوّن السحب وهطول المطر في شرح مرئي بسيط يدعم المحاكاة."
        youtubeUrl={videoUrl}
      />
    </div>
  );
}
