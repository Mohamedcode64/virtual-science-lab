'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ExperimentCanvas } from '@/components/experiments/shared/experience-ui';
import { Html, OrbitControls } from '@react-three/drei';
import { CanvasTexture, SRGBColorSpace, Vector3 } from 'three';
import type { Group, Mesh, MeshBasicMaterial } from 'three';
import type { LiquidAppearance } from './model';

export type MeasurementState = 'idle' | 'measuring' | 'complete';

export interface LabSceneProps {
  pH: number;
  volume: number;
  appearance: LiquidAppearance;
  pourColor: string;
  pourAppearance: LiquidAppearance;
  solutionName: string;
  probeDepth: number;
  pouring: boolean;
  reducedMotion: boolean;
  measurementState: MeasurementState;
  displayedReading: number;
  resetVersion: number;
}

const restingDropperPosition = new Vector3(-1.78, 2.42, 0.06);

function Bubble({ position, phase, reducedMotion }: { position: [number, number, number]; phase: number; reducedMotion: boolean }) {
  const bubbleRef = useRef<Mesh>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (reducedMotion || !bubbleRef.current) return;
    bubbleRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 1.3 + phase) * 0.035;
  });
  return <mesh ref={bubbleRef} position={position}><sphereGeometry args={[0.04, 10, 8]} /><meshPhysicalMaterial color="#efffff" emissive="#8dd8d4" emissiveIntensity={0.1} transparent opacity={0.8} roughness={0.12} /></mesh>;
}

function placeCableSegment(mesh: Mesh | null, start: Vector3, end: Vector3) {
  if (!mesh) return;
  const direction = end.clone().sub(start);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, direction.length(), 1);
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
}

function ResponsiveSceneCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const compact = aspect < 1.3;
    camera.position.set(0, compact ? 2.55 : 2.4, compact ? 9.25 : 8.2);
    camera.lookAt(0, 0.95, 0);
  }, [camera, size.height, size.width]);

  return null;
}

function Beaker({ pH, volume, appearance, pourColor, pourAppearance, solutionName, probeDepth, pouring, reducedMotion, measurementState, displayedReading }: LabSceneProps) {
  const fillHeight = volume <= 0 ? 0 : Math.min(1.45, (volume / 150) * 0.82);
  const liquidTop = 0.065 + fillHeight;
  const probeY = 3.02 - (probeDepth / 100) * 1.9;
  const dropperRef = useRef<Group>(null);
  const sourceNozzleRef = useRef<Group>(null);
  const beakerOpeningRef = useRef<Group>(null);
  const pourStreamRef = useRef<Mesh>(null);
  const sourcePosition = useRef(new Vector3());
  const openingPosition = useRef(new Vector3());
  const surfacePosition = useRef(new Vector3());
  const pouringPosition = useRef(new Vector3());
  const surfaceRef = useRef<Mesh>(null);
  const cableARef = useRef<Mesh>(null);
  const cableBRef = useRef<Mesh>(null);
  const cableCRef = useRef<Mesh>(null);
  const meterScreenTextureRef = useRef<CanvasTexture | null>(null);
  const meterScreenMaterialRef = useRef<MeshBasicMaterial>(null);
  useFrame(({ clock }, delta) => {
    if (dropperRef.current) {
      const opening = beakerOpeningRef.current?.getWorldPosition(openingPosition.current);
      if (pouring && opening) {
        pouringPosition.current.set(opening.x - 0.055, opening.y + 0.82, opening.z + 0.04);
        dropperRef.current.position.lerp(pouringPosition.current, Math.min(1, delta * 4.8));
        const angle = 0.1 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 17) * 0.008);
        dropperRef.current.rotation.z += (angle - dropperRef.current.rotation.z) * Math.min(1, delta * 4.8);
      } else {
        dropperRef.current.position.lerp(restingDropperPosition, Math.min(1, delta * 4.8));
        dropperRef.current.rotation.z += (0.34 - dropperRef.current.rotation.z) * Math.min(1, delta * 4.8);
      }

      if (sourceNozzleRef.current && beakerOpeningRef.current && pourStreamRef.current) {
        sourceNozzleRef.current.getWorldPosition(sourcePosition.current);
        beakerOpeningRef.current.getWorldPosition(openingPosition.current);
        surfacePosition.current.copy(openingPosition.current);
        surfacePosition.current.y = Math.max(0.12, liquidTop - 0.035);
        surfacePosition.current.z += 0.02;
        placeCableSegment(pourStreamRef.current, sourcePosition.current, surfacePosition.current);
        const aligned = dropperRef.current.position.distanceTo(pouringPosition.current) < 0.12;
        pourStreamRef.current.visible = pouring && aligned;
      }
    }
    if (surfaceRef.current && !reducedMotion) {
      const pulse = pouring ? 1 + Math.sin(clock.elapsedTime * 18) * 0.035 : 1 + Math.sin(clock.elapsedTime * 1.2) * 0.006;
      surfaceRef.current.scale.set(pulse, pulse, 1);
      surfaceRef.current.position.y = liquidTop + (pouring ? Math.sin(clock.elapsedTime * 18) * 0.012 : 0);
    }

    const meterTop = new Vector3(1.45, 1.91, 0.19);
    const meterBend = new Vector3(1.08, 2.32, 0.23);
    const cableBend = new Vector3(0.55, 2.4, 0.25);
    const probeTop = new Vector3(-0.23, probeY + 0.76, 0.22);
    placeCableSegment(cableARef.current, meterTop, meterBend);
    placeCableSegment(cableBRef.current, meterBend, cableBend);
    placeCableSegment(cableCRef.current, cableBend, probeTop);
  });

  const bubbleCount = Math.round(appearance.bubbleFactor * 6);
  const screenValue = measurementState === 'idle' ? '— —' : measurementState === 'measuring' ? displayedReading.toFixed(1) : displayedReading.toFixed(2);
  const meterActive = measurementState !== 'idle';

  useEffect(() => {
    const texture = meterScreenTextureRef.current ?? (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 340;
      const screenTexture = new CanvasTexture(canvas);
      screenTexture.colorSpace = SRGBColorSpace;
      meterScreenTextureRef.current = screenTexture;
      return screenTexture;
    })();
    const context = texture.image.getContext('2d');
    if (!context) return;

    context.fillStyle = measurementState === 'complete' ? '#d9f0bb' : meterActive ? '#dff2c9' : '#c9e9dc';
    context.fillRect(0, 0, 512, 340);
    context.strokeStyle = 'rgba(21, 62, 54, 0.18)';
    context.lineWidth = 8;
    context.strokeRect(4, 4, 504, 332);
    context.fillStyle = '#153e36';
    context.font = '700 88px Consolas, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`pH ${screenValue}`, 256, 170);

    texture.needsUpdate = true;
    if (meterScreenMaterialRef.current) {
      meterScreenMaterialRef.current.map = texture;
      meterScreenMaterialRef.current.needsUpdate = true;
    }
  }, [measurementState, meterActive, screenValue]);

  useEffect(() => () => meterScreenTextureRef.current?.dispose(), []);

  return (
    <group>
      <mesh position={[-0.42, -0.08, 0]}><boxGeometry args={[5.5, 0.18, 2.8]} /><meshStandardMaterial color="#e6eef1" roughness={0.82} /></mesh>
      <mesh position={[-0.42, -0.19, 0]}><boxGeometry args={[5.8, 0.08, 3]} /><meshStandardMaterial color="#cbd9de" roughness={0.86} /></mesh>

      <group ref={beakerOpeningRef} position={[-0.55, 2.14, 0.04]} />

      <mesh position={[-0.55, 1.08, 0]}>
        <cylinderGeometry args={[0.75, 0.66, 2.12, 40, 1, true]} />
        <meshPhysicalMaterial color="#cde6ec" transparent opacity={0.34} roughness={0.08} metalness={0.02} transmission={0.1} thickness={0.65} clearcoat={1} clearcoatRoughness={0.08} side={2} />
      </mesh>
      <mesh position={[-0.55, 0.025, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.065, 40]} />
        <meshPhysicalMaterial color="#d8edf0" transparent opacity={0.48} roughness={0.13} clearcoat={1} side={2} />
      </mesh>
      {volume > 0 && (
        <>
          <mesh position={[-0.55, 0.065 + fillHeight / 2, 0]}>
            <cylinderGeometry args={[0.615, 0.61, fillHeight, 40]} />
            <meshPhysicalMaterial color={appearance.color} transparent opacity={appearance.opacity} roughness={appearance.roughness} metalness={0.01} clearcoat={0.28} depthWrite={false} />
          </mesh>
          <mesh ref={surfaceRef} position={[-0.55, liquidTop, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.61, 40]} />
            <meshPhysicalMaterial color={appearance.color} transparent opacity={Math.min(1, appearance.opacity + 0.03)} roughness={Math.max(0.1, appearance.roughness - 0.06)} side={2} depthWrite={false} />
          </mesh>
        </>
      )}
      <mesh position={[-0.55, 2.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.038, 10, 40]} />
        <meshPhysicalMaterial color="#e7f5f7" metalness={0.16} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[-0.55, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.025, 8, 40]} />
        <meshPhysicalMaterial color="#c7e1e6" transparent opacity={0.82} roughness={0.18} />
      </mesh>

      <mesh position={[-1.12, 1.08, 0.46]}><boxGeometry args={[0.025, 1.55, 0.018]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.74} /></mesh>
      <mesh position={[0.07, 1.06, 0.47]}><boxGeometry args={[0.018, 1.32, 0.015]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.46} /></mesh>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={`tick-${index}`} position={[-0.02, 0.38 + index * 0.31, 0.49]}>
          <boxGeometry args={[index % 2 === 0 ? 0.19 : 0.11, 0.012, 0.012]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
        </mesh>
      ))}

      {Array.from({ length: bubbleCount }, (_, index) => (
        <Bubble key={`bubble-${index}`} position={[-0.72 + (index % 3) * 0.16, 0.34 + Math.floor(index / 3) * 0.3, 0.12]} phase={index * 0.7} reducedMotion={reducedMotion} />
      ))}
      <mesh ref={pourStreamRef} visible={false}>
        <cylinderGeometry args={[0.035, 0.052, 1, 10]} />
        <meshPhysicalMaterial color={pourColor} transparent opacity={Math.max(0.76, pourAppearance.opacity)} roughness={0.17} depthWrite={false} />
      </mesh>

      <group position={[-0.23, probeY, 0.22]}>
        <mesh><cylinderGeometry args={[0.04, 0.04, 1.52, 12]} /><meshStandardMaterial color="#9aaeb5" metalness={0.78} roughness={0.2} /></mesh>
        <mesh position={[0, -0.77, 0]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#d5a23a" metalness={0.42} roughness={0.24} /></mesh>
        <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.08, 0.08, 0.2, 14]} /><meshStandardMaterial color="#176c99" roughness={0.28} /></mesh>
        <mesh position={[0, 0.36, 0]}><torusGeometry args={[0.075, 0.018, 6, 16]} /><meshStandardMaterial color="#d8a63d" metalness={0.45} roughness={0.28} /></mesh>
      </group>

      <mesh ref={cableARef}>
        <cylinderGeometry args={[0.021, 0.021, 1, 8]} />
        <meshStandardMaterial color="#263d46" roughness={0.44} metalness={0.12} />
      </mesh>
      <mesh ref={cableBRef}>
        <cylinderGeometry args={[0.021, 0.021, 1, 8]} />
        <meshStandardMaterial color="#263d46" roughness={0.44} metalness={0.12} />
      </mesh>
      <mesh ref={cableCRef}>
        <cylinderGeometry args={[0.021, 0.021, 1, 8]} />
        <meshStandardMaterial color="#263d46" roughness={0.44} metalness={0.12} />
      </mesh>

      <group ref={dropperRef} position={[-1.78, 2.42, 0.06]} rotation={[0, 0, 0.34]}>
        <group ref={sourceNozzleRef} position={[0, -0.55, 0]} />
        <mesh><cylinderGeometry args={[0.105, 0.075, 0.68, 12]} /><meshPhysicalMaterial color="#eaf5f5" transparent opacity={0.88} roughness={0.2} transmission={0.12} /></mesh>
        <mesh position={[0, -0.13, 0.025]}>
          <cylinderGeometry args={[0.064, 0.053, 0.34, 12]} />
          <meshPhysicalMaterial color={pourAppearance.color} transparent opacity={pourAppearance.opacity} roughness={pourAppearance.roughness} clearcoat={0.28} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.39, 0]}><cylinderGeometry args={[0.12, 0.12, 0.16, 12]} /><meshStandardMaterial color="#176c99" roughness={0.35} /></mesh>
        <mesh position={[0, -0.43, 0]}><coneGeometry args={[0.075, 0.22, 12]} /><meshStandardMaterial color="#b9cdd3" metalness={0.18} roughness={0.28} /></mesh>
      </group>

      <group position={[1.45, 0.93, 0.05]}>
        <mesh><boxGeometry args={[0.86, 1.92, 0.27]} /><meshStandardMaterial color="#193a45" roughness={0.4} metalness={0.16} /></mesh>
        <mesh position={[0, 0.6, 0.148]}><boxGeometry args={[0.66, 0.44, 0.025]} /><meshBasicMaterial ref={meterScreenMaterialRef} color="#ffffff" toneMapped={false} /></mesh>
        <mesh position={[0, -0.25, 0.15]}><boxGeometry args={[0.08, 1.12, 0.025]} /><meshBasicMaterial color="#e3eef0" /></mesh>
        {Array.from({ length: 15 }, (_, index) => {
          const y = -0.78 + (index / 14) * 1.05;
          const isCurrent = Math.round(pH) === index;
          return (
            <group key={index} position={[0, y, 0.17]}>
              <mesh position={[-0.21, 0, 0]}><boxGeometry args={[0.16, 0.018, 0.025]} /><meshBasicMaterial color={isCurrent ? '#d9a83e' : '#7e9aa1'} /></mesh>
              {(index === 0 || index === 7 || index === 14) && <Html position={[-0.37, 0, 0]} center transform distanceFactor={7}><span className="ph-meter-tick" dir="ltr">{index}</span></Html>}
            </group>
          );
        })}
        <Html position={[0, 1.14, 0.15]} center transform distanceFactor={7}><span className="ph-meter-name">pH</span></Html>
      </group>

      <Html position={[-0.55, 2.48, 0.08]} center distanceFactor={8}>
        <span className="ph-scene-label">{solutionName}</span>
      </Html>
      <Html position={[0.68, -0.02, 0.2]} center distanceFactor={8}>
        <span className="ph-scene-key" dir="ltr">PROBE → LIQUID → METER → pH</span>
      </Html>
    </group>
  );
}

export function LabScene(props: LabSceneProps) {
  const screenLabel = props.measurementState === 'complete'
    ? `الرقم الهيدروجيني المقاس ${props.displayedReading.toFixed(2)}`
    : props.measurementState === 'measuring' ? 'جارٍ قياس الرقم الهيدروجيني' : 'لم يجر القياس بعد';

  return (
    <ExperimentCanvas
      key={props.resetVersion}
      camera={{ position: [0, 2.4, 8.2], fov: 35 }}
      dpr={[1, 1.35]}
      gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
      fallback={<p className="p-6 text-center text-sm text-neutral-700">يبدو أن جهازك لا يدعم العرض ثلاثي الأبعاد بشكل كامل.</p>}
      aria-label={`مشهد ثلاثي الأبعاد لكأس يحتوي على ${props.solutionName} ومسبار قياس الرقم الهيدروجيني. ${screenLabel}`}
    >
      <color attach="background" args={['#f5f8fa']} />
      <ResponsiveSceneCamera />
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 6, 5]} intensity={1.65} />
      <directionalLight position={[-4, 3, -2]} intensity={0.55} color="#b8e7e3" />
      <pointLight position={[-1.7, 2.7, 2.2]} intensity={0.5} color="#ffffff" />
      <Beaker {...props} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.05} maxPolarAngle={1.6} rotateSpeed={0.48} />
    </ExperimentCanvas>
  );
}
