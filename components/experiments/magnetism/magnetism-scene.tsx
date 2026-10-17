'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Line, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Group } from 'three';

type TestObject = 'iron' | 'plastic' | 'magnet';

interface MagnetismSceneProps {
  testObject: TestObject;
  magnetActive: boolean;
  distance: number;
  samePoles: boolean;
  reducedMotion: boolean;
  resetVersion: number;
  onObjectSelect: (value: TestObject) => void;
  onPolarityToggle: () => void;
}

function ResponsiveCamera({ resetVersion }: { resetVersion: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const compact = size.width / Math.max(1, size.height) < 1.15;
    camera.position.set(0, compact ? 1.05 : 0.92, compact ? 9.5 : 8.15);
    camera.lookAt(0, 0.05, 0);
  }, [camera, resetVersion, size.height, size.width]);
  return null;
}

function BarMagnet({ position, northAtRight, onClick }: { position: [number, number, number]; northAtRight: boolean; onClick?: () => void }) {
  const leftColor = northAtRight ? '#366c9e' : '#c45b4a';
  const rightColor = northAtRight ? '#c45b4a' : '#366c9e';
  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onClick?.(); }}>
      <mesh position={[-0.39, 0, 0]} castShadow>
        <boxGeometry args={[0.78, 0.42, 0.58]} />
        <meshStandardMaterial color={leftColor} metalness={0.28} roughness={0.38} />
      </mesh>
      <mesh position={[0.39, 0, 0]} castShadow>
        <boxGeometry args={[0.78, 0.42, 0.58]} />
        <meshStandardMaterial color={rightColor} metalness={0.28} roughness={0.38} />
      </mesh>
      <mesh position={[-0.79, 0, 0]}>
        <boxGeometry args={[0.04, 0.32, 0.42]} />
        <meshStandardMaterial color="#d5e3e8" metalness={0.46} roughness={0.3} />
      </mesh>
      <mesh position={[0.79, 0, 0]}>
        <boxGeometry args={[0.04, 0.32, 0.42]} />
        <meshStandardMaterial color="#d5e3e8" metalness={0.46} roughness={0.3} />
      </mesh>
    </group>
  );
}

function MagneticField({ targetX, connected, samePoles }: { targetX: number; connected: boolean; samePoles: boolean }) {
  const lines = useMemo(() => {
    const startX = -0.46;
    const endX = connected ? targetX - 0.82 : 0.18;
    return Array.from({ length: 6 }, (_, lineIndex) => {
      const side = lineIndex % 2 === 0 ? 1 : -1;
      const lane = Math.floor(lineIndex / 2);
      const height = 0.28 + lane * 0.16;
      return Array.from({ length: 25 }, (_, pointIndex) => {
        const t = pointIndex / 24;
        const x = startX + (endX - startX) * t;
        const arch = Math.sin(Math.PI * t) * (connected && samePoles ? 0.58 + lane * 0.12 : 0.35 + lane * 0.12);
        const y = side * (height + arch);
        return new Vector3(x, y, 0.33 + lane * 0.018);
      });
    });
  }, [connected, samePoles, targetX]);

  return <>{lines.map((points, index) => <Line key={index} points={points} color={index < 2 ? '#4aaba6' : '#76bcb5'} lineWidth={1.25} transparent opacity={0.58} />)}</>;
}

function TestObjectModel({ testObject, magnetActive, distance, samePoles, reducedMotion, onObjectSelect, onPolarityToggle }: Omit<MagnetismSceneProps, 'resetVersion'>) {
  const targetRef = useRef<Group>(null);
  const baseX = 0.55 + distance * 0.11;
  const attraction = testObject === 'iron' || (testObject === 'magnet' && !samePoles);
  const repulsion = testObject === 'magnet' && samePoles;
  const strength = Math.max(0.08, 0.24 - distance * 0.006);
  const targetX = testObject === 'iron' && magnetActive
    ? -0.05
    : testObject === 'magnet'
      ? baseX + (attraction ? -Math.max(strength, 0.38) : repulsion ? Math.max(strength, 0.42) : 0)
      : baseX;

  useFrame((_, delta) => {
    if (!targetRef.current) return;
    const currentX = targetRef.current.position.x;
    targetRef.current.position.x = reducedMotion ? targetX : currentX + (targetX - currentX) * Math.min(1, delta * 3.8);
  });

  return (
    <group ref={targetRef} position={[baseX, 0, 0]} onClick={(event) => { event.stopPropagation(); onObjectSelect(testObject); }}>
      {testObject === 'iron' ? (
        <mesh castShadow>
          <dodecahedronGeometry args={[0.31, 1]} />
          <meshStandardMaterial color="#8e9fa4" metalness={0.82} roughness={0.24} />
        </mesh>
      ) : testObject === 'plastic' ? (
        <mesh castShadow>
          <icosahedronGeometry args={[0.33, 1]} />
          <meshStandardMaterial color="#d0a250" roughness={0.47} />
        </mesh>
      ) : (
        <BarMagnet position={[0, 0, 0]} northAtRight={!samePoles} onClick={onPolarityToggle} />
      )}
      <mesh position={[0, -0.58, 0]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshBasicMaterial color={testObject === 'iron' ? '#8e9fa4' : testObject === 'plastic' ? '#d0a250' : '#c45b4a'} />
      </mesh>
    </group>
  );
}

export function MagnetismScene(props: MagnetismSceneProps) {
  const objectBaseX = 0.55 + props.distance * 0.11;
  const connected = props.testObject === 'magnet' || props.magnetActive;
  const fieldTargetX = props.magnetActive && props.testObject === 'iron'
    ? -0.05
    : objectBaseX + (props.testObject === 'magnet' && props.samePoles ? 0.18 : props.testObject === 'magnet' ? -0.18 : 0);

  return (
    <>
      <color attach="background" args={['#f3f7f7']} />
      <ResponsiveCamera resetVersion={props.resetVersion} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[-3, 6, 5]} intensity={1.65} />
      <directionalLight position={[4, 2, -3]} intensity={0.45} color="#b6e1dc" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.72, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#e6eeea" roughness={0.92} />
      </mesh>
      <mesh position={[-0.3, -0.48, -0.06]}>
        <boxGeometry args={[6.3, 0.12, 1.45]} />
        <meshStandardMaterial color="#d4e0df" roughness={0.72} />
      </mesh>
      <MagneticField targetX={fieldTargetX} connected={connected} samePoles={props.samePoles} />
      <BarMagnet position={[-1.25, 0, 0.08]} northAtRight onClick={props.onPolarityToggle} />
      <TestObjectModel {...props} />
      <OrbitControls key={props.resetVersion} makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={6.6} maxDistance={11} rotateSpeed={0.55} />
    </>
  );
}
