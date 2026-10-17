'use client';

import { useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Mesh } from 'three';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, SceneUnavailable, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';

const chainNodes = [
  { id: 'plant', label: 'النبات', role: 'منتج' },
  { id: 'grasshopper', label: 'الجرادة', role: 'مستهلك أولي' },
  { id: 'frog', label: 'الضفدع', role: 'مستهلك ثانوي' },
  { id: 'snake', label: 'الثعبان', role: 'مستهلك ثالثي' },
  { id: 'eagle', label: 'النسر', role: 'مفترس' },
] as const;

const chainPositions = [-3.2, -1.6, 0, 1.6, 3.2];

function setPointer(active: boolean) {
  document.body.style.cursor = active ? 'pointer' : '';
}

function EnergyFlow({ reducedMotion }: { reducedMotion: boolean }) {
  const particles = useRef<Array<Mesh | null>>([]);
  useFrame(({ clock }) => {
    particles.current.forEach((particle, index) => {
      if (!particle) return;
      const progress = reducedMotion ? 0.14 + index * 0.19 : (clock.elapsedTime * 0.16 + index * 0.22) % 1;
      particle.position.set(chainPositions[0] + 0.16 + progress * 5.28, 1.3 + Math.sin(progress * Math.PI * 4) * 0.05, 0.4);
    });
  });
  return <>{Array.from({ length: 4 }, (_, index) => <mesh key={index} ref={(node) => { particles.current[index] = node; }}><sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color="#e6b74b" /></mesh>)}</>;
}

function FoodChainModel({ connected, onSelect, reducedMotion }: { connected: number; onSelect: (index: number) => void; reducedMotion: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const narrow = size.width / Math.max(1, size.height) < 1.25;
    camera.position.set(0, narrow ? 2.55 : 2.05, narrow ? 14.5 : 10.8);
    camera.lookAt(0, 0.45, 0);
  }, [camera, size.height, size.width]);
  const clickable = (index: number) => ({ onClick: (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect(index); }, onPointerOver: () => setPointer(true), onPointerOut: () => setPointer(false) });

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[-3, 6, 5]} intensity={1.25} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.65, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#e4ecdf" roughness={1} />
      </mesh>
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, -0.52, -0.8]} scale={[0.9, 0.27, 0.32]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color="#b8c9b0" roughness={1} />
        </mesh>
      ))}
      <group position={[-3.7, 1.72, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.46, 22, 16]} />
          <meshStandardMaterial color="#f0c463" emissive="#e6a947" emissiveIntensity={0.18} />
        </mesh>
        {Array.from({ length: 8 }, (_, index) => <mesh key={index} position={[Math.cos(index * Math.PI / 4) * 0.72, Math.sin(index * Math.PI / 4) * 0.72, 0]} rotation-z={index * Math.PI / 4}><boxGeometry args={[0.055, 0.2, 0.04]} /><meshStandardMaterial color="#edc975" /></mesh>)}
      </group>
      <group {...clickable(0)} position={[chainPositions[0], -0.34, 0]}>
        <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.07, 0.09, 0.78, 8]} /><meshStandardMaterial color="#637f4d" /></mesh>
        {[-0.32, -0.05, 0.28].map((x, index) => <mesh key={x} position={[x, 0.63 + index * 0.13, 0]} rotation-z={x * 1.5} scale={[0.43, 0.23, 0.14]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color={connected > 0 ? '#72a65e' : '#638b53'} /></mesh>)}
        <mesh position={[0, -0.08, 0]} scale={[0.48, 0.12, 0.25]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color="#bd9568" /></mesh>
      </group>
      <group {...clickable(1)} position={[chainPositions[1], 0.02, 0]}>
        <mesh position={[-0.04, 0.24, 0]} scale={[0.46, 0.15, 0.16]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#78a94e" /></mesh>
        <mesh position={[0.31, 0.29, 0]} scale={[0.16, 0.15, 0.14]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#86b75a" /></mesh>
        <mesh position={[-0.05, 0.32, 0.035]} rotation-z={0.35} scale={[0.34, 0.075, 0.1]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#a4bd67" transparent opacity={0.84} /></mesh>
        {[-0.28, 0.02, 0.28].map((x, index) => <mesh key={x} position={[x, 0.02, 0]} rotation-z={index === 0 ? -0.8 : index === 2 ? 0.72 : 0.2}><capsuleGeometry args={[0.035, 0.35, 3, 6]} /><meshStandardMaterial color="#5c843e" /></mesh>)}
        {[-0.08, 0.03].map((x) => <mesh key={x} position={[0.39, 0.47 + x, 0]} rotation-z={-0.18}><capsuleGeometry args={[0.018, 0.23, 3, 5]} /><meshStandardMaterial color="#5c843e" /></mesh>)}
      </group>
      <group {...clickable(2)} position={[chainPositions[2], -0.14, 0]}>
        <mesh position={[-0.02, 0.3, 0]} scale={[0.46, 0.3, 0.28]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#6b9b55" /></mesh>
        <mesh position={[0.34, 0.46, 0]} scale={[0.35, 0.28, 0.25]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#7eac62" /></mesh>
        {[-0.42, 0.31].map((x) => <group key={x} position={[x, 0.67, 0.17]}><mesh><sphereGeometry args={[0.105, 12, 10]} /><meshStandardMaterial color="#fffdf4" /></mesh><mesh position={[0, 0, 0.09]}><sphereGeometry args={[0.044, 10, 8]} /><meshStandardMaterial color="#233b3a" /></mesh></group>)}
        {[-0.32, 0.3].map((x, index) => <mesh key={x} position={[x, 0.02, 0]} rotation-z={index === 0 ? -0.7 : 0.7}><capsuleGeometry args={[0.09, 0.35, 4, 7]} /><meshStandardMaterial color="#618a4d" /></mesh>)}
      </group>
      <group {...clickable(3)} position={[chainPositions[3], -0.2, 0]}>
        {[-0.4, -0.16, 0.08, 0.31].map((x, index) => <mesh key={x} position={[x, 0.28 + Math.sin(index * 1.35) * 0.12, 0]} scale={[0.25, 0.18, 0.17]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#547f49" /></mesh>)}
        <mesh position={[0.47, 0.47, 0]} scale={[0.23, 0.19, 0.16]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#648f4f" /></mesh>
        <mesh position={[0.63, 0.45, 0.12]} rotation-z={-Math.PI / 2}><coneGeometry args={[0.075, 0.2, 7]} /><meshStandardMaterial color="#d7b743" /></mesh>
        <mesh position={[0.49, 0.55, 0.16]}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color="#18332e" /></mesh>
      </group>
      <group {...clickable(4)} position={[chainPositions[4], -0.08, 0]}>
        <mesh position={[-0.03, 0.35, 0]} scale={[0.45, 0.28, 0.25]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#8a6544" /></mesh>
        <mesh position={[0.34, 0.54, 0]} scale={[0.26, 0.23, 0.2]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#f4f0e5" /></mesh>
        {[-0.31, 0.04].map((x, index) => <mesh key={x} position={[x, 0.44, 0]} rotation-z={index === 0 ? 0.26 : -0.3} scale={[0.46, 0.12, 0.17]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#916b46" /></mesh>)}
        <mesh position={[0.57, 0.49, 0.1]} rotation-z={-Math.PI / 2}><coneGeometry args={[0.1, 0.23, 6]} /><meshStandardMaterial color="#d3a83d" /></mesh>
        <mesh position={[0.39, 0.59, 0.16]}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color="#213a3a" /></mesh>
        <mesh position={[-0.51, 0.24, 0]} rotation-z={-0.6}><coneGeometry args={[0.12, 0.38, 5]} /><meshStandardMaterial color="#8a6544" /></mesh>
      </group>
      {Array.from({ length: chainNodes.length - 1 }, (_, index) => index < connected - 1 && (
        <group key={`arrow-${index}`} position={[(chainPositions[index] + chainPositions[index + 1]) / 2, 0.82, 0.2]}>
          <mesh><boxGeometry args={[1.05, 0.025, 0.035]} /><meshStandardMaterial color="#bd8a36" /></mesh>
          <mesh position={[0.52, 0, 0]} rotation-z={-Math.PI / 2}><coneGeometry args={[0.075, 0.16, 8]} /><meshStandardMaterial color="#bd8a36" /></mesh>
        </group>
      ))}
      {connected === chainNodes.length && <EnergyFlow reducedMotion={reducedMotion} />}
      {connected > 0 && <mesh position={[chainPositions[connected - 1], 1.75, 0.2]}><sphereGeometry args={[0.12, 12, 10]} /><meshBasicMaterial color="#fff0be" /></mesh>}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={8} maxDistance={18} minPolarAngle={0.48} maxPolarAngle={1.86} rotateSpeed={0.52} zoomSpeed={0.72} />
    </>
  );
}

export function FoodChainExperience({ videoUrl }: { videoUrl: string }) {
  const [chain, setChain] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('ابدأ بالنبات المنتج، ثم اختر الكائن الذي يتغذى عليه.');
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();
  const complete = chain.length === chainNodes.length;

  function chooseNode(index: number) {
    if (complete || chain.includes(index)) return;
    if (index !== chain.length) {
      setFeedback(chain.length === 0
        ? 'جرّب مرة أخرى: أي كائن يبدأ السلسلة الغذائية؟ اختر النبات المنتج.'
        : `حاول مرة أخرى: ${chainNodes[chain.length].label} يأتي بعد ${chainNodes[chain.length - 1].label}.`);
      playSound(false);
      return;
    }
    const next = [...chain, index];
    setChain(next);
    if (next.length === chainNodes.length) {
      setFeedback('أحسنت! تنتقل الطاقة من النبات إلى الجرادة، ثم إلى الضفدع والثعبان والنسر.');
      playSound(true);
    } else {
      setFeedback(`صحيح. ${chainNodes[index].label} هو ${chainNodes[index].role}. اختر الخطوة التالية.`);
      playSound();
    }
  }

  function reset() {
    setChain([]);
    setFeedback('ابدأ بالنبات المنتج، ثم اختر الكائن الذي يتغذى عليه.');
  }

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الأحياء"
        stageTitle="رتب انتقال الطاقة"
        status={complete ? 'اكتملت السلسلة' : `${chain.length} من 5 خطوات`}
        statusText={feedback}
        caption="اضغط على عناصر المشهد أو استخدم الأزرار لترتيب السلسلة. حركة النقاط تمثيل تعليمي لانتقال الطاقة."
        controls={(
          <>
            <p className="text-sm font-semibold text-neutral-800">رتّب من المنتج إلى المفترس:</p>
            <div className="grid gap-2">
              {chainNodes.map((node, index) => (
                <button key={node.id} type="button" onClick={() => chooseNode(index)} aria-pressed={chain.includes(index)} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-right text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${chain.includes(index) ? 'border-science-300 bg-science-50 text-science-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                  <span>{node.label}</span>
                  <span className="text-[11px] font-normal text-neutral-500">{node.role}</span>
                </button>
              ))}
            </div>
            {complete && <p className="rounded-xl bg-science-50 px-3 py-2 text-sm font-bold text-science-800" role="status" dir="ltr">انتقال الطاقة: النبات → الجرادة → الضفدع → الثعبان → النسر.</p>}
          </>
        )}
        onReset={reset}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
      >
        {webgl === null ? <SceneLoading label="السلسلة الغذائية" /> : webgl ? <ExperimentCanvas camera={{ position: [0, 2.1, 10.8], fov: 38 }} dpr={[1, 1.2]} aria-label="مشهد تفاعلي للشمس والنبات والجرادة والضفدع والثعبان والنسر"><FoodChainModel connected={chain.length} onSelect={chooseNode} reducedMotion={reducedMotion} /></ExperimentCanvas> : <SceneUnavailable label="النبات، الجرادة، الضفدع، الثعبان، النسر" />}
      </ExperimentWorkspace>
      <LearningPanel
        title="ما السلسلة الغذائية؟"
        introduction="توضح السلسلة الغذائية كيف تنتقل الطاقة بين كائنات حية في النظام البيئي."
        items={[
          { title: 'المنتج', text: 'النبات منتج؛ فهو يصنع غذاءه مستخدماً ضوء الشمس.' },
          { title: 'المستهلك', text: 'الحيوان يحصل على الطاقة بتناوله نباتاً أو حيواناً آخر.' },
          { title: 'من يأكل مَن؟', text: 'تتغذى الجرادة على النبات، والضفدع على الجرادة، ثم يتغذى الثعبان على الضفدع والنسر على الثعبان.' },
        ]}
        note="توضح الأسهم اتجاه انتقال الطاقة في هذا المثال التعليمي، ولا تمثل جسيمات طاقة حقيقية."
      />
      <ExperimentVideo
        id="food-chain-video"
        title="السلاسل الغذائية | شرح مبسط للأطفال"
        description="درس عربي بصري يعرّف الطفل بالمنتِج والمستهلك والعلاقة بين الكائنات في السلسلة الغذائية."
        youtubeUrl={videoUrl}
      />
    </div>
  );
}
