'use client';

import { useEffect } from 'react';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { DoubleSide } from 'three';
import type { CellType, OrganelleId } from './cell-experience';

interface CellSceneProps {
  cellType: CellType;
  selectedOrganelle: OrganelleId;
  resetVersion: number;
  reducedMotion: boolean;
  onSelectOrganelle: (id: OrganelleId) => void;
}

function Selectable({ id, children, onSelect, stopPropagation = true }: { id: OrganelleId; children: React.ReactNode; onSelect: (id: OrganelleId) => void; stopPropagation?: boolean }) {
  return <group onClick={(event) => { if (stopPropagation) event.stopPropagation(); onSelect(id); }}>{children}</group>;
}

function CellShell({ cellType, selectedOrganelle, onSelectOrganelle: onSelect }: Pick<CellSceneProps, 'cellType' | 'selectedOrganelle' | 'onSelectOrganelle'>) {
  const highlighted = selectedOrganelle === 'membrane';
  const cytoplasmHighlighted = selectedOrganelle === 'cytoplasm';
  if (cellType === 'plant') {
    return (
      <>
        <Selectable id="membrane" onSelect={onSelect} stopPropagation={false}>
          <RoundedBox args={[4.15, 2.72, 2.5]} radius={0.25} smoothness={3}>
            <meshPhysicalMaterial color={highlighted ? '#42a9a0' : '#76a984'} transparent opacity={highlighted ? 0.42 : 0.22} roughness={0.24} clearcoat={0.55} side={DoubleSide} depthWrite={false} />
          </RoundedBox>
        </Selectable>
        <Selectable id="membrane" onSelect={onSelect} stopPropagation={false}>
          <RoundedBox args={[3.93, 2.52, 2.3]} radius={0.2} smoothness={3}>
            <meshPhysicalMaterial color={highlighted ? '#51a7b4' : '#b3c67a'} transparent opacity={highlighted ? 0.35 : 0.13} roughness={0.34} side={DoubleSide} depthWrite={false} />
          </RoundedBox>
        </Selectable>
        <Selectable id="cytoplasm" onSelect={onSelect} stopPropagation={false}>
          <RoundedBox args={[3.72, 2.34, 2.12]} radius={0.18} smoothness={3}>
            <meshStandardMaterial color={cytoplasmHighlighted ? '#efc46b' : '#dfd08d'} transparent opacity={cytoplasmHighlighted ? 0.2 : 0.09} side={DoubleSide} depthWrite={false} />
          </RoundedBox>
        </Selectable>
      </>
    );
  }

  return (
    <>
      <Selectable id="membrane" onSelect={onSelect} stopPropagation={false}>
        <mesh scale={[1.9, 1.35, 1.18]}>
          <sphereGeometry args={[1, 36, 28]} />
          <meshPhysicalMaterial color={highlighted ? '#40a8a0' : '#72a8ae'} transparent opacity={highlighted ? 0.35 : 0.19} roughness={0.22} clearcoat={0.6} side={DoubleSide} depthWrite={false} />
        </mesh>
      </Selectable>
      <Selectable id="cytoplasm" onSelect={onSelect} stopPropagation={false}>
        <mesh scale={[1.78, 1.24, 1.08]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={cytoplasmHighlighted ? '#efc46b' : '#e6d69b'} transparent opacity={cytoplasmHighlighted ? 0.22 : 0.1} side={DoubleSide} depthWrite={false} />
        </mesh>
      </Selectable>
    </>
  );
}

function OrganelleModel({ id, selected, cellType }: { id: OrganelleId; selected: boolean; cellType: CellType }) {
  const tint = selected ? '#f4ca69' : undefined;
  const emissive = selected ? '#8a5a15' : '#000000';
  const glow = selected ? 0.24 : 0;

  if (id === 'nucleus') return (
    <group position={[-0.72, 0.12, 0.34]}>
      <mesh castShadow><sphereGeometry args={[0.49, 24, 18]} /><meshStandardMaterial color={tint ?? '#986c9f'} emissive={emissive} emissiveIntensity={glow} roughness={0.44} /></mesh>
      <mesh position={[0.15, 0.08, 0.34]}><sphereGeometry args={[0.14, 16, 12]} /><meshStandardMaterial color="#d5a66b" roughness={0.48} /></mesh>
    </group>
  );
  if (id === 'mitochondria') return (
    <group position={[0.78, -0.44, 0.5]} rotation-z={-0.32}>
      <mesh castShadow><sphereGeometry args={[0.42, 20, 14]} /><meshStandardMaterial color={tint ?? '#c77543'} emissive={emissive} emissiveIntensity={glow} roughness={0.55} /></mesh>
      <mesh scale={[0.76, 0.62, 0.86]}><torusGeometry args={[0.33, 0.025, 5, 18]} /><meshStandardMaterial color="#f0c66f" roughness={0.6} /></mesh>
      <mesh scale={[0.5, 0.4, 0.72]} rotation-z={1.2}><torusGeometry args={[0.32, 0.022, 5, 18]} /><meshStandardMaterial color="#f0c66f" roughness={0.6} /></mesh>
    </group>
  );
  if (id === 'ribosomes') return (
    <group position={[1.2, 0.55, 0.48]}>
      {Array.from({ length: 9 }, (_, index) => <mesh key={index} position={[(index % 3) * 0.12 - 0.12, Math.floor(index / 3) * 0.12 - 0.1, (index % 2) * 0.035]}><sphereGeometry args={[selected ? 0.07 : 0.052, 8, 6]} /><meshStandardMaterial color={tint ?? '#667c8a'} emissive={emissive} emissiveIntensity={glow} roughness={0.6} /></mesh>)}
    </group>
  );
  if (id === 'reticulum') return (
    <group position={[-0.45, 0.04, -0.1]} rotation-z={0.16}>
      {[0, 1, 2].map((index) => <mesh key={index} position={[index * 0.08, index * 0.17, 0]} scale={[1 + index * 0.08, 0.72, 0.5]}><torusGeometry args={[0.48, 0.035, 6, 22, Math.PI * 1.58]} /><meshStandardMaterial color={tint ?? '#518c9c'} emissive={emissive} emissiveIntensity={glow} roughness={0.45} /></mesh>)}
    </group>
  );
  if (id === 'golgi') return (
    <group position={[0.18, -0.66, 0.54]} rotation-z={-0.2}>
      {[0, 1, 2, 3].map((index) => <mesh key={index} position={[0, index * 0.12, 0]} scale={[0.54 - index * 0.035, 0.12, 0.46]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={tint ?? '#b6749e'} emissive={emissive} emissiveIntensity={glow} roughness={0.52} /></mesh>)}
    </group>
  );
  if (id === 'vacuole') return (
    <mesh position={cellType === 'plant' ? [0.86, 0.02, -0.18] : [0.98, -0.56, 0.12]} scale={cellType === 'plant' ? [0.67, 0.78, 0.7] : [0.34, 0.28, 0.3]} castShadow>
      {cellType === 'plant' ? <boxGeometry args={[1.6, 1.6, 1.5]} /> : <sphereGeometry args={[1, 18, 14]} />}
      <meshPhysicalMaterial color={tint ?? '#72b7c7'} emissive={emissive} emissiveIntensity={glow} transparent opacity={selected ? 0.5 : 0.32} roughness={0.22} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
  return null;
}

function SelectableOrganelle({ id, selected, cellType, onSelect }: { id: OrganelleId; selected: boolean; cellType: CellType; onSelect: (id: OrganelleId) => void }) {
  if (id === 'membrane' || id === 'cytoplasm' || id === 'chloroplast') return null;
  return <group onClick={(event) => { event.stopPropagation(); onSelect(id); }}><OrganelleModel id={id} selected={selected} cellType={cellType} /></group>;
}

function PlantOrganelles({ selectedOrganelle, onSelectOrganelle: onSelect }: Pick<CellSceneProps, 'selectedOrganelle' | 'onSelectOrganelle'>) {
  const selected = selectedOrganelle === 'chloroplast';
  return (
    <group>
      {[-1.32, 1.32].map((x) => <group key={x} position={[x, 0.75, 0.48]} onClick={(event) => { event.stopPropagation(); onSelect('chloroplast'); }}>
        <mesh rotation-z={x > 0 ? 0.34 : -0.34} scale={[0.22, 0.45, 0.16]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={selected ? '#b0bf48' : '#729759'} emissive={selected ? '#667326' : '#000000'} emissiveIntensity={selected ? 0.2 : 0} roughness={0.55} /></mesh>
      </group>)}
    </group>
  );
}

export function CellScene(props: CellSceneProps) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.25, props.cellType === 'plant' ? 8.6 : 7.8);
    camera.lookAt(0, 0, 0);
  }, [camera, props.cellType, props.resetVersion]);

  return (
    <>
      <color attach="background" args={['#f2f6f6']} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[-3, 5, 5]} intensity={1.5} />
      <directionalLight position={[4, 1, -3]} intensity={0.55} color="#d2ebdd" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.78, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#e0e9e8" roughness={0.96} />
      </mesh>
      {props.cellType === 'plant' ? <PlantOrganelles selectedOrganelle={props.selectedOrganelle} onSelectOrganelle={props.onSelectOrganelle} /> : null}
      <CellShell cellType={props.cellType} selectedOrganelle={props.selectedOrganelle} onSelectOrganelle={props.onSelectOrganelle} />
      {(['nucleus', 'mitochondria', 'ribosomes', 'reticulum', 'golgi', 'vacuole'] as OrganelleId[]).map((id) => <SelectableOrganelle key={id} id={id} selected={props.selectedOrganelle === id} cellType={props.cellType} onSelect={props.onSelectOrganelle} />)}
      <OrbitControls key={props.resetVersion} makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={5.8} maxDistance={11.2} rotateSpeed={0.55} />
    </>
  );
}
