'use client';

import { useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { ExperimentCanvas } from '@/components/experiments/shared/experience-ui';
import { CatmullRomCurve3, Vector3 } from 'three';
import type { Group, Mesh, MeshStandardMaterial, PointLight } from 'three';

const BATTERY_TO_SWITCH = [
  [-2.48, 0.78, 0.1], [-2.04, 1.12, 0.1], [-0.78, 1.12, 0.1], [-0.38, 0.43, 0.1],
] as const;
const SWITCH_TO_BULB = [
  [0.38, 0.43, 0.1], [0.77, 0.9, 0.1], [1.72, 0.9, 0.1], [2.02, 0.61, 0.1],
] as const;
const BULB_TO_BATTERY = [
  [2.02, 0.43, 0.08], [2.52, 0.16, 0.08], [1.38, 0.02, 0.08], [0, 0.02, 0.08],
  [-1.42, 0.02, 0.08], [-2.02, 0.36, 0.08], [-2.02, 0.84, 0.08],
] as const;
const FLOW_PATH = [...BATTERY_TO_SWITCH, [0.38, 0.43, 0.1], ...SWITCH_TO_BULB.slice(1), ...BULB_TO_BATTERY.slice(1)] as const;

function curveFrom(points: readonly (readonly [number, number, number])[]) {
  return new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, 'centripetal');
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const compact = size.width / Math.max(1, size.height) < 1.25;
    camera.position.set(0, compact ? 3.5 : 3.05, compact ? 10.7 : 9.2);
    camera.lookAt(0, 0.53, 0);
  }, [camera, size.height, size.width]);

  return null;
}

function Wire({ points, color, radius = 0.035 }: { points: readonly (readonly [number, number, number])[]; color: string; radius?: number }) {
  const curve = useMemo(() => curveFrom(points), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 36, radius, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.42} metalness={0.18} />
    </mesh>
  );
}

function Battery() {
  return (
    <group position={[-2.25, 0, 0.08]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.82, 0.96, 0.62]} />
        <meshStandardMaterial color="#236d83" roughness={0.32} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[0.74, 0.12, 0.58]} />
        <meshStandardMaterial color="#dce5e8" metalness={0.66} roughness={0.25} />
      </mesh>
      <mesh position={[-0.23, 0.84, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.11, 16]} />
        <meshStandardMaterial color="#d55344" metalness={0.4} roughness={0.26} />
      </mesh>
      <mesh position={[0.23, 0.84, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.11, 16]} />
        <meshStandardMaterial color="#b8c7cc" metalness={0.72} roughness={0.22} />
      </mesh>
      <mesh position={[-0.23, 0.25, 0.316]}>
        <boxGeometry args={[0.2, 0.035, 0.012]} />
        <meshBasicMaterial color="#fff8e8" />
      </mesh>
      <mesh position={[-0.23, 0.25, 0.324]}>
        <boxGeometry args={[0.035, 0.2, 0.012]} />
        <meshBasicMaterial color="#fff8e8" />
      </mesh>
      <mesh position={[0.23, 0.25, 0.316]}>
        <boxGeometry args={[0.2, 0.035, 0.012]} />
        <meshBasicMaterial color="#fff8e8" />
      </mesh>
    </group>
  );
}

function Switch({ closed, onToggle }: { closed: boolean; onToggle: () => void }) {
  const leverRef = useRef<Group>(null);
  const hitAreaRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!leverRef.current) return;
    const targetAngle = closed ? 0 : 0.62;
    leverRef.current.rotation.z += (targetAngle - leverRef.current.rotation.z) * 0.16;
  });

  function setPointer(isOver: boolean) {
    document.body.style.cursor = isOver ? 'pointer' : '';
  }

  return (
    <group position={[0, 0.08, 0.09]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.12, 0.18, 0.66]} />
        <meshStandardMaterial color="#e7edf0" roughness={0.35} metalness={0.16} />
      </mesh>
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.08]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 14]} />
          <meshStandardMaterial color="#d4a83f" metalness={0.64} roughness={0.24} />
        </mesh>
      ))}
      <group ref={leverRef} position={[-0.18, 0.25, 0.1]} rotation-z={0.62}>
        <mesh
          ref={hitAreaRef}
          position={[0.32, 0, 0]}
          onClick={(event) => { event.stopPropagation(); onToggle(); }}
          onPointerOver={(event) => { event.stopPropagation(); setPointer(true); }}
          onPointerOut={() => setPointer(false)}
          castShadow
        >
          <boxGeometry args={[0.82, 0.18, 0.2]} />
          <meshStandardMaterial color="#cf7045" metalness={0.3} roughness={0.28} />
        </mesh>
        <mesh position={[0.32, 0.1, 0]}>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color="#f4be73" metalness={0.45} roughness={0.25} />
        </mesh>
      </group>
      <mesh
        position={[0, 0.26, -0.02]}
        onClick={(event) => { event.stopPropagation(); onToggle(); }}
        onPointerOver={(event) => { event.stopPropagation(); setPointer(true); }}
        onPointerOut={() => setPointer(false)}
      >
        <boxGeometry args={[1.08, 0.5, 0.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Bulb({ lit, reducedMotion }: { lit: boolean; reducedMotion: boolean }) {
  const glassRef = useRef<MeshStandardMaterial>(null);
  const haloRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame(() => {
    const amount = reducedMotion ? 1 : 0.09;
    const intensity = lit ? 2.35 : 0.02;
    if (glassRef.current) glassRef.current.emissiveIntensity += (intensity - glassRef.current.emissiveIntensity) * amount;
    if (haloRef.current) {
      haloRef.current.scale.setScalar(lit ? 1.28 : 0.92);
      const material = haloRef.current.material as MeshStandardMaterial;
      material.opacity += ((lit ? 0.2 : 0) - material.opacity) * amount;
    }
    if (lightRef.current) lightRef.current.intensity += ((lit ? 1.25 : 0) - lightRef.current.intensity) * amount;
  });

  return (
    <group position={[2.02, 0.02, 0.1]}>
      <pointLight ref={lightRef} position={[0, 1.02, 0.1]} color="#ffd36e" intensity={0} distance={3.4} decay={2} />
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.36, 20]} />
        <meshStandardMaterial color="#9aabb0" metalness={0.68} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#d0a347" metalness={0.72} roughness={0.23} />
      </mesh>
      <mesh position={[0, 0.83, 0]} castShadow>
        <sphereGeometry args={[0.43, 24, 18]} />
        <meshStandardMaterial ref={glassRef} color="#fff2c4" emissive="#ffb42e" emissiveIntensity={0.02} transparent opacity={0.9} roughness={0.16} metalness={0.02} />
      </mesh>
      <mesh ref={haloRef} position={[0, 0.83, -0.08]} scale={0.92}>
        <sphereGeometry args={[0.53, 18, 14]} />
        <meshStandardMaterial color="#ffd36e" emissive="#ffc04a" emissiveIntensity={0.4} transparent opacity={0} depthWrite={false} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.83, 0.42]}>
        <boxGeometry args={[0.055, 0.3, 0.035]} />
        <meshStandardMaterial color="#f3a629" emissive="#ffae2b" emissiveIntensity={lit ? 0.8 : 0.05} metalness={0.25} roughness={0.3} />
      </mesh>
    </group>
  );
}

function CurrentParticle({ index, active, reducedMotion, curve }: { index: number; active: boolean; reducedMotion: boolean; curve: CatmullRomCurve3 }) {
  const particleRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!particleRef.current) return;
    particleRef.current.visible = active;
    if (!active) return;
    const progress = reducedMotion ? 0.1 + index * 0.19 : (clock.elapsedTime * 0.18 + index * 0.2) % 1;
    particleRef.current.position.copy(curve.getPointAt(progress));
  });

  return (
    <mesh ref={particleRef} visible={false}>
      <sphereGeometry args={[0.07, 10, 8]} />
      <meshBasicMaterial color="#f8d36b" toneMapped={false} />
    </mesh>
  );
}

function CircuitModel({ closed, onToggle, reducedMotion }: { closed: boolean; onToggle: () => void; reducedMotion: boolean }) {
  const flowCurve = useMemo(() => curveFrom(FLOW_PATH), []);

  return (
    <>
      <color attach="background" args={['#f5f8f8']} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[-3, 6, 5]} intensity={2.1} />
      <ResponsiveCamera />
      <mesh position={[0, -0.27, 0]} receiveShadow>
        <boxGeometry args={[7.1, 0.28, 3.2]} />
        <meshStandardMaterial color="#dbe8e9" roughness={0.76} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[6.8, 0.04, 2.92]} />
        <meshStandardMaterial color="#f7fbfb" roughness={0.88} />
      </mesh>
      <Wire points={BATTERY_TO_SWITCH} color="#c24f43" radius={0.046} />
      <Wire points={SWITCH_TO_BULB} color="#c24f43" radius={0.046} />
      <Wire points={BULB_TO_BATTERY} color="#34545f" radius={0.046} />
      <Battery />
      <Switch closed={closed} onToggle={onToggle} />
      <Bulb lit={closed} reducedMotion={reducedMotion} />
      {Array.from({ length: 5 }, (_, index) => (
        <CurrentParticle key={index} index={index} active={closed} reducedMotion={reducedMotion} curve={flowCurve} />
      ))}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={6.5} maxDistance={13.5} minPolarAngle={0.48} maxPolarAngle={1.86} rotateSpeed={0.55} zoomSpeed={0.72} />
    </>
  );
}

export function ElectricCircuitScene({ closed, onToggle, reducedMotion }: { closed: boolean; onToggle: () => void; reducedMotion: boolean }) {
  return (
    <ExperimentCanvas
      camera={{ position: [0, 3.1, 9.2], fov: 34 }}
      dpr={[1, 1.35]}
      gl={{ antialias: true, powerPreference: 'low-power', alpha: false }}
      aria-label="نموذج ثلاثي الأبعاد لبطارية وأسلاك ومفتاح ولمبة كهربائية"
    >
      <CircuitModel closed={closed} onToggle={onToggle} reducedMotion={reducedMotion} />
    </ExperimentCanvas>
  );
}
