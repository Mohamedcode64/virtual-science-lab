'use client';

import { useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Mesh } from 'three';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, SceneUnavailable, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';

type Inputs = { sunlight: boolean; water: boolean; carbon: boolean };

function PhotosynthesisModel({ inputs, complete, reducedMotion }: { inputs: Inputs; complete: boolean; reducedMotion: boolean }) {
  const { camera, size } = useThree();
  const sunbeams = useRef<Array<Mesh | null>>([]);
  const waterDrops = useRef<Array<Mesh | null>>([]);
  const carbonDots = useRef<Array<Mesh | null>>([]);
  const oxygenDots = useRef<Array<Mesh | null>>([]);
  const glucoseDots = useRef<Array<Mesh | null>>([]);
  useEffect(() => {
    const narrow = size.width / Math.max(1, size.height) < 1.25;
    camera.position.set(0, narrow ? 2.45 : 2.12, narrow ? 11.8 : 9.8);
    camera.lookAt(0, 0.37, 0);
  }, [camera, size.height, size.width]);

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    sunbeams.current.forEach((ray, index) => {
      if (!ray) return;
      ray.visible = inputs.sunlight;
      const progress = reducedMotion ? 0.6 : (time * 0.24 + index * 0.21) % 1;
      ray.position.set(-2.3 + progress * 2.3, 1.35 + (index - 2) * 0.15, 0.08);
    });
    waterDrops.current.forEach((drop, index) => {
      if (!drop) return;
      drop.visible = inputs.water;
      const progress = reducedMotion ? 0.76 : (time * 0.19 + index * 0.23) % 1;
      drop.position.set(0.04 + Math.sin(index * 2) * 0.08, -0.66 + progress * 1.68, 0.16);
    });
    carbonDots.current.forEach((dot, index) => {
      if (!dot) return;
      dot.visible = inputs.carbon;
      const progress = reducedMotion ? 0.62 : (time * 0.22 + index * 0.24) % 1;
      dot.position.set(2.35 - progress * 1.78, 1.08 + Math.sin(index * 2.7) * 0.17, 0.16);
    });
    oxygenDots.current.forEach((dot, index) => {
      if (!dot) return;
      dot.visible = complete;
      const progress = reducedMotion ? 0.5 : (time * 0.13 + index * 0.25) % 1;
      dot.position.set(0.72 + progress * 1.8, 0.98 + Math.sin(progress * Math.PI * 2 + index) * 0.18, 0.16);
    });
    glucoseDots.current.forEach((dot, index) => {
      if (!dot) return;
      dot.visible = complete;
      const progress = reducedMotion ? 0.55 : (time * 0.15 + index * 0.26) % 1;
      dot.position.set(0.55 + progress * 1.62, -0.68 + Math.sin(progress * Math.PI * 2 + index) * 0.14, 0.16);
    });
  });

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[-4, 6, 5]} intensity={1.2} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.22, 0]}><planeGeometry args={[14, 8]} /><meshStandardMaterial color="#e6e9dc" roughness={1} /></mesh>
      <group position={[-2.75, 1.55, 0]}>
        <mesh><sphereGeometry args={[0.46, 22, 16]} /><meshStandardMaterial color="#f0c25c" emissive="#eda843" emissiveIntensity={0.18} /></mesh>
        {Array.from({ length: 8 }, (_, index) => <mesh key={index} position={[Math.cos(index * Math.PI / 4) * 0.69, Math.sin(index * Math.PI / 4) * 0.69, 0]} rotation-z={index * Math.PI / 4}><boxGeometry args={[0.05, 0.18, 0.035]} /><meshStandardMaterial color="#edc873" /></mesh>)}
      </group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.88, 0]}><cylinderGeometry args={[0.68, 0.52, 0.72, 24, 1, true]} /><meshStandardMaterial color="#bd8058" roughness={0.82} side={2} /></mesh>
        <mesh position={[0, -0.54, 0]}><cylinderGeometry args={[0.68, 0.68, 0.1, 24]} /><meshStandardMaterial color="#5a4c3c" /></mesh>
        <mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.09, 0.12, 1.4, 12]} /><meshStandardMaterial color="#6e995f" /></mesh>
        {[-0.62, -0.35, 0.38, 0.67].map((x, index) => (
          <mesh key={x} position={[x * 0.72, 0.1 + index * 0.24, 0]} rotation-z={x * 1.1} scale={[0.58, 0.31, 0.18]}>
            <sphereGeometry args={[1, 18, 12]} />
            <meshStandardMaterial color={complete ? '#72a85d' : '#5e9252'} emissive={complete ? '#3d6a34' : '#000000'} emissiveIntensity={complete ? 0.16 : 0} roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[-0.2, -0.59, 0]} rotation-z={0.42}><cylinderGeometry args={[0.018, 0.09, 0.46, 8]} /><meshStandardMaterial color="#d6bc8e" /></mesh>
        <mesh position={[0.17, -0.59, 0]} rotation-z={-0.48}><cylinderGeometry args={[0.018, 0.09, 0.5, 8]} /><meshStandardMaterial color="#d6bc8e" /></mesh>
        <mesh position={[0, -0.71, 0]} rotation-z={0.02}><cylinderGeometry args={[0.018, 0.1, 0.48, 8]} /><meshStandardMaterial color="#d6bc8e" /></mesh>
      </group>
      <group position={[2.0, -0.72, 0]}>
        <mesh><sphereGeometry args={[0.34, 18, 14]} /><meshStandardMaterial color="#efd078" emissive="#d7ae45" emissiveIntensity={complete ? 0.16 : 0} /></mesh>
      </group>
      {Array.from({ length: 5 }, (_, index) => <mesh key={`sun-${index}`} ref={(node) => { sunbeams.current[index] = node; }} visible={false}><sphereGeometry args={[0.065, 10, 8]} /><meshBasicMaterial color="#f0c867" /></mesh>)}
      {Array.from({ length: 4 }, (_, index) => <mesh key={`water-${index}`} ref={(node) => { waterDrops.current[index] = node; }} visible={false}><sphereGeometry args={[0.072, 10, 8]} /><meshStandardMaterial color="#54a8c6" /></mesh>)}
      {Array.from({ length: 4 }, (_, index) => <mesh key={`carbon-${index}`} ref={(node) => { carbonDots.current[index] = node; }} visible={false}><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color="#87939a" /></mesh>)}
      {Array.from({ length: 4 }, (_, index) => <mesh key={`oxygen-${index}`} ref={(node) => { oxygenDots.current[index] = node; }} visible={false}><sphereGeometry args={[0.062, 10, 8]} /><meshStandardMaterial color="#8cc9d4" /></mesh>)}
      {Array.from({ length: 3 }, (_, index) => <mesh key={`glucose-${index}`} ref={(node) => { glucoseDots.current[index] = node; }} visible={false}><sphereGeometry args={[0.09, 10, 8]} /><meshStandardMaterial color="#e2b955" /></mesh>)}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={7} maxDistance={15} minPolarAngle={0.48} maxPolarAngle={1.86} rotateSpeed={0.52} zoomSpeed={0.72} />
    </>
  );
}

const inputItems: Array<{ key: keyof Inputs; label: string; hint: string }> = [
  { key: 'sunlight', label: 'ضوء الشمس', hint: 'مصدر الطاقة' },
  { key: 'water', label: 'الماء', hint: 'يمتصه النبات عبر الجذور' },
  { key: 'carbon', label: 'ثاني أكسيد الكربون', hint: 'يدخل إلى الأوراق من الهواء' },
];

export function PhotosynthesisExperience({ videoUrl }: { videoUrl: string }) {
  const [inputs, setInputs] = useState<Inputs>({ sunlight: false, water: false, carbon: false });
  const complete = inputs.sunlight && inputs.water && inputs.carbon;
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();

  function activateInput(key: keyof Inputs) {
    const next = { ...inputs, [key]: !inputs[key] };
    setInputs(next);
    playSound(next.sunlight && next.water && next.carbon);
  }

  function reset() {
    setInputs({ sunlight: false, water: false, carbon: false });
  }

  const status = complete ? 'حدثت عملية البناء الضوئي' : `${Object.values(inputs).filter(Boolean).length} من 3 مدخلات`;
  const statusText = complete
    ? 'استخدم النبات الضوء والماء وثاني أكسيد الكربون لصنع الغذاء، وأطلق الأكسجين من أوراقه.'
    : 'فعّل ضوء الشمس والماء وثاني أكسيد الكربون. عندما تكتمل المدخلات، شاهد الغذاء والأكسجين في النموذج.';

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الأحياء"
        stageTitle="ماذا تحتاج النبتة لتصنع غذاءها؟"
        status={status}
        statusText={statusText}
        caption="المسارات المتحركة تبين اتجاه انتقال المواد في نموذج تعليمي مبسط، وليست حسابات كيميائية."
        controls={(
          <>
            <p className="text-sm font-semibold text-neutral-800">فعّل مدخلات عملية البناء الضوئي:</p>
            {inputItems.map((item) => (
              <button key={item.key} type="button" onClick={() => activateInput(item.key)} aria-pressed={inputs[item.key]} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-right transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${inputs[item.key] ? 'border-science-300 bg-science-50 text-science-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-[11px] text-neutral-500">{inputs[item.key] ? 'مفعّل · اضغط للإيقاف' : item.hint}</span>
              </button>
            ))}
            {complete && <p className="rounded-xl bg-science-50 px-3 py-2 text-sm font-bold text-science-800" role="status">غذاء + أكسجين</p>}
          </>
        )}
        onReset={reset}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
      >
        {webgl === null ? <SceneLoading label="البناء الضوئي" /> : webgl ? <ExperimentCanvas camera={{ position: [0, 2.15, 9.8], fov: 39 }} dpr={[1, 1.2]} aria-label="نموذج ثلاثي الأبعاد لنبات ومدخلات البناء الضوئي"><PhotosynthesisModel inputs={inputs} complete={complete} reducedMotion={reducedMotion} /></ExperimentCanvas> : <SceneUnavailable label="ضوء الشمس، الماء، ثاني أكسيد الكربون، أوراق النبات" />}
      </ExperimentWorkspace>
      <LearningPanel
        title="كيف يصنع النبات غذاءه؟"
        introduction="تستخدم النباتات ضوء الشمس والماء وثاني أكسيد الكربون لصنع غذائها. تحدث العملية بشكل رئيسي في الأوراق."
        items={[
          { title: 'المدخلات', text: 'ضوء الشمس والماء وثاني أكسيد الكربون تساعد النبات على صنع غذائه.' },
          { title: 'مكان العملية', text: 'تحدث عملية البناء الضوئي بشكل رئيسي في أوراق النبات.' },
          { title: 'النواتج', text: 'يصنع النبات غذاءً ويطلق الأكسجين إلى الهواء.' },
        ]}
        note="المشهد يوضح المواد الداخلة والناتجة بصورة تعليمية مبسطة."
      />
      <ExperimentVideo
        id="photosynthesis-video"
        title="كيف يصنع النبات غذاءه؟ البناء الضوئي للأطفال"
        description="تعرّف بصرياً على دور الماء وضوء الشمس وثاني أكسيد الكربون في إنتاج غذاء النبات والأكسجين."
        youtubeUrl={videoUrl}
      />
    </div>
  );
}
