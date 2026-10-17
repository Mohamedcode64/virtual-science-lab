'use client';

import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group, Mesh } from 'three';

type FlowerPart = 'anther' | 'stigma';

interface PollinationSceneProps {
  active: boolean;
  runVersion: number;
  resetVersion: number;
  selectedPart: FlowerPart;
  reducedMotion: boolean;
  onSelectPart: (part: FlowerPart) => void;
  onComplete: () => void;
}

function Flower({ position, selectedPart, onSelectPart, recipient }: { position: [number, number, number]; selectedPart: FlowerPart; onSelectPart: (part: FlowerPart) => void; recipient: boolean }) {
  const petalColor = recipient ? '#e7a1a0' : '#d889a0';
  return (
    <group position={position}>
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.09, 1.45, 10]} />
        <meshStandardMaterial color="#4c8769" roughness={0.84} />
      </mesh>
      <mesh position={[-0.27, -0.42, 0]} rotation-z={0.48}>
        <sphereGeometry args={[0.32, 14, 10]} />
        <meshStandardMaterial color="#5c9a73" roughness={0.8} />
      </mesh>
      <mesh position={[0.27, -0.05, 0]} rotation-z={-0.5}>
        <sphereGeometry args={[0.3, 14, 10]} />
        <meshStandardMaterial color="#4f8b6b" roughness={0.8} />
      </mesh>
      <group position={[0, 0.56, 0]}>
        {Array.from({ length: 6 }, (_, index) => {
          const angle = index * Math.PI / 3;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, -0.05]} rotation-z={angle} castShadow>
              <sphereGeometry args={[0.34, 16, 12]} />
              <meshStandardMaterial color={petalColor} roughness={0.62} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.08]} castShadow>
          <sphereGeometry args={[0.24, 16, 12]} />
          <meshStandardMaterial color={recipient ? '#d8ad55' : '#e6b94d'} roughness={0.56} />
        </mesh>
        <group onClick={(event) => { event.stopPropagation(); onSelectPart('anther'); }}>
          {Array.from({ length: 8 }, (_, index) => {
            const angle = index * Math.PI / 4;
            const selected = selectedPart === 'anther';
            return (
              <group key={`anther-${index}`} position={[Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0.22]}>
                <mesh position={[0, 0.12, 0]}>
                  <cylinderGeometry args={[0.022, 0.026, 0.22, 6]} />
                  <meshStandardMaterial color={selected ? '#c98f2c' : '#b38e40'} emissive={selected ? '#825814' : '#000000'} emissiveIntensity={0.22} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                  <sphereGeometry args={[selected ? 0.07 : 0.055, 8, 6]} />
                  <meshStandardMaterial color="#e4b747" emissive={selected ? '#a77525' : '#000000'} emissiveIntensity={0.18} />
                </mesh>
              </group>
            );
          })}
        </group>
        <group onClick={(event) => { event.stopPropagation(); onSelectPart('stigma'); }}>
          <mesh position={[0, 0.19, 0.31]}>
            <cylinderGeometry args={[0.035, 0.06, 0.34, 8]} />
            <meshStandardMaterial color="#6a9270" />
          </mesh>
          <mesh position={[0, 0.4, 0.31]}>
            <sphereGeometry args={[selectedPart === 'stigma' ? 0.11 : 0.09, 12, 8]} />
            <meshStandardMaterial color={selectedPart === 'stigma' ? '#ef7867' : '#d98c78'} emissive={selectedPart === 'stigma' ? '#8c392f' : '#000000'} emissiveIntensity={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Bee({ beeRef }: { beeRef: React.RefObject<Group | null> }) {
  return (
    <group ref={beeRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.29, 16, 12]} />
        <meshStandardMaterial color="#e7b93f" roughness={0.5} />
      </mesh>
      {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0, 0.17]}><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color="#253a39" roughness={0.44} /></mesh>)}
      <mesh position={[0.31, 0.015, 0.02]}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color="#303d38" roughness={0.48} />
      </mesh>
      <mesh position={[-0.05, 0.18, -0.14]} rotation-z={0.18}>
        <sphereGeometry args={[0.2, 14, 10]} />
        <meshPhysicalMaterial color="#ecffff" transparent opacity={0.56} roughness={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[0.12, 0.18, 0.12]} rotation-z={-0.18}>
        <sphereGeometry args={[0.18, 14, 10]} />
        <meshPhysicalMaterial color="#ecffff" transparent opacity={0.48} roughness={0.18} depthWrite={false} />
      </mesh>
      {[-0.08, 0.08].map((x) => <mesh key={`leg-${x}`} position={[x, -0.22, 0.1]} rotation-z={0.4}><cylinderGeometry args={[0.012, 0.012, 0.16, 5]} /><meshStandardMaterial color="#303d38" /></mesh>)}
    </group>
  );
}

function PollenTransfer({ active, runVersion, resetVersion, reducedMotion, onComplete }: Pick<PollinationSceneProps, 'active' | 'runVersion' | 'resetVersion' | 'reducedMotion' | 'onComplete'>) {
  const beeRef = useRef<Group>(null);
  const pollenRefs = useRef<Array<Mesh | null>>([]);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    progressRef.current = 0;
    completedRef.current = false;
    beeRef.current?.position.set(-2.05, 1.15, 0.56);
    pollenRefs.current.forEach((pollen, index) => pollen?.position.set(-2.04 + Math.cos(index * 2.4) * 0.22, 1.14 + Math.sin(index * 2.4) * 0.16, 0.36));
  }, [resetVersion, runVersion]);

  useFrame((_, delta) => {
    if (!beeRef.current) return;
    if (active) progressRef.current = Math.min(1, progressRef.current + delta / (reducedMotion ? 0.08 : 4.4));
    const progress = progressRef.current;
    const eased = progress * progress * (3 - 2 * progress);
    const x = -2.05 + eased * 4.1;
    const y = 1.14 + Math.sin(progress * Math.PI) * 0.55;
    beeRef.current.position.set(x, y, 0.56);
    beeRef.current.rotation.z = active && !reducedMotion ? Math.sin(progress * Math.PI * 12) * 0.045 : 0;

    pollenRefs.current.forEach((pollen, index) => {
      if (!pollen) return;
      const phase = index / Math.max(1, pollenRefs.current.length - 1) * 0.08;
      const transfer = Math.min(1, Math.max(0, (progress - 0.12 - phase) / 0.78));
      const grainX = -2.03 + transfer * 4.03 + Math.sin(index * 1.7) * 0.035;
      const grainY = 1.11 + Math.sin(transfer * Math.PI) * 0.5 + Math.cos(index * 2.1) * 0.075;
      pollen.position.set(grainX, grainY, 0.4 + (index % 2) * 0.08);
      pollen.visible = progress < 0.92 || transfer > 0.88;
      pollen.scale.setScalar(progress >= 0.92 ? 1.18 : 1);
    });

    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <>
      <Bee beeRef={beeRef} />
      {Array.from({ length: 7 }, (_, index) => <mesh key={`pollen-${index}`} ref={(mesh) => { pollenRefs.current[index] = mesh; }} position={[-2, 1.1, 0.4]}><sphereGeometry args={[0.055, 8, 6]} /><meshStandardMaterial color="#e4a53b" emissive="#9c5d19" emissiveIntensity={0.18} roughness={0.45} /></mesh>)}
    </>
  );
}

export function PollinationScene(props: PollinationSceneProps) {
  const { camera, size } = useThree();
  useEffect(() => {
    const compact = size.width / Math.max(size.height, 1) < 1.2;
    camera.position.set(0, compact ? 1.1 : 0.95, compact ? 10.8 : 9.2);
    camera.lookAt(0, 0.16, 0);
  }, [camera, props.resetVersion, size.height, size.width]);

  return (
    <>
      <color attach="background" args={['#f5f8f4']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[-4, 6, 5]} intensity={1.55} />
      <directionalLight position={[4, 3, -2]} intensity={0.48} color="#d9ebdc" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#e4ede4" roughness={0.96} />
      </mesh>
      <Flower position={[-2.05, 0, 0]} recipient={false} selectedPart={props.selectedPart} onSelectPart={props.onSelectPart} />
      <Flower position={[2.05, 0, 0]} recipient selectedPart={props.selectedPart} onSelectPart={props.onSelectPart} />
      <PollenTransfer active={props.active} runVersion={props.runVersion} resetVersion={props.resetVersion} reducedMotion={props.reducedMotion} onComplete={props.onComplete} />
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={7} maxDistance={12} rotateSpeed={0.5} />
    </>
  );
}
